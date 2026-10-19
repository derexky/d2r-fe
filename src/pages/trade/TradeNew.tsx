// d2r-fe/src/pages/trade/TradeNew.tsx
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createWorker, PSM, OEM, type Page, type Worker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { signIn, useUser } from '../../auth';
import { TRADE_CATEGORIES } from '../items/itemCategories';
import BackButton from '../../components/ui/BackButton';
import { findTextLines, inkMask, makeLineCorrector, matchLine, mergeDigits, padLines } from './ocrText';
import { itemLabel, loadTradeItems, type TradeItem } from './tradeItems';

const CATEGORIES = [{ label: '請選擇', value: '' }, ...TRADE_CATEGORIES];

interface FormState {
  item_name: string;
  item_stats_raw: string;
  price: string;
  contact: string;
  category: string;
  item_ref: string;
}

const inputStyle: React.CSSProperties = {
  background: '#191714',
  border: '1px solid #302c26',
  color: '#aaa',
  padding: '4px 8px',
  width: '100%',
  borderRadius: '2px',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '11px',
  display: 'block',
  marginBottom: '2px',
};

const jsonCache = new Map<string, Promise<string[]>>();

function loadList(path: string): Promise<string[]> {
  if (!jsonCache.has(path)) jsonCache.set(path, fetch(path).then((r) => r.json()));
  return jsonCache.get(path)!;
}

function fixOcrText(raw: string): string {
  return raw
    .replace(/[|{}[\]“”]/g, '')                                       // strip junk chars
    .replace(/¥/g, '+')                                               // ¥ → + (D2R font)
    .replace(/(\d+)(?:96|[Zz])(?=\s|$)/gm, '$1%')                    // N96 / NZ → N% (D2R % font)
    .replace(/(\d+)\s*有\s*%/g, '$1%')                               // N 有 % → N% (same glyph)
    .replace(/(?<=[一-鿿])[^\S\n]+(?=[一-鿿])/g, '') // collapse inter-CJK spaces, keep line breaks
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
}

// base types missing from base-item-names.json (it lists equipment only); without them the
// fuzzy match turns 大型咒符 into 大型盾
const MISC_BASES = ['小型咒符', '大型咒符', '特大咒符', '珠寶', '戒指', '護身符'];

// mouse hints D2R prints under every tooltip (Shift + 左鍵點擊以裝備, 按住 Shift 鍵進行比較)
const UI_HINT = /左鍵點擊|鍵進行比較/;

// D2R tooltips are light text (gold/blue/white/grey/red) on a near-black panel. Brightness is
// the strongest RGB channel, so blue and red stats stand out as much as white; the dimmest
// text (grey) lands around 100, the panel well below. Only used to find the text lines;
// recognition runs on the inverted image, whose anti-aliasing keeps thin CJK strokes.
// Tune if dim lines go missing.
const OCR_THRESHOLD = 80;
// Text-line height (px) the image is rescaled to; Tesseract reads CJK glyphs best around here.
const OCR_LINE_HEIGHT = 36;
const OCR_MAX_WIDTH = 4000;
// Lines chi_tra scores below this are item icons, inventory grid or scenery read as text.
const OCR_MIN_LINE_CONFIDENCE = 30;

// Workers live for the page lifetime: loading the WASM core and the language models is
// the slow part, so later uploads reuse them. chi_tra reads the Chinese, eng the numbers
// (see mergeDigits). Not 'chi_tra+eng': per word it may pick the English model and turn
// Chinese into Latin junk (行走速度 → TERE); chi_tra still reads the Latin abbreviations.
let workersPromise: Promise<Worker[]> | null = null;

function getWorkers() {
  if (!workersPromise) {
    workersPromise = Promise.all(
      ['chi_tra', 'eng'].map(async (lang) => {
        const w = await createWorker(lang, OEM.LSTM_ONLY);
        await w.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE });
        return w;
      }),
    );
    workersPromise.catch(() => { workersPromise = null; });
  }
  return workersPromise;
}

const ocrWords = (page: Page) =>
  page.blocks?.flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words))) ?? [];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

function invertedGray(img: HTMLImageElement, scale: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    // invert: Tesseract reads dark text on a light page best
    data[i] = data[i + 1] = data[i + 2] = 255 - Math.max(data[i], data[i + 1], data[i + 2]);
  }
  ctx.putImageData(imageData, 0, 0);
  return { canvas, data };
}

/** One inverted-grayscale canvas per tooltip line, scaled to OCR_LINE_HEIGHT. */
async function preprocessForOCR(file: File) {
  const img = await loadImage(file);
  const inkBelow = 255 - OCR_THRESHOLD;
  const probe = invertedGray(img, 1);
  // line height is unknown yet: strokes taller than 8% of the image cannot be text
  const probeMask = inkMask(probe.data, img.width, img.height, inkBelow, Math.max(24, img.height * 0.08));
  const heights = findTextLines(probeMask, img.width, img.height, 4)
    .map((l) => l.bottom - l.top)
    .sort((a, b) => a - b);
  if (!heights.length) throw new Error('no text found');
  const median = heights[heights.length >> 1];
  const scale = Math.min(4, OCR_LINE_HEIGHT / median, OCR_MAX_WIDTH / img.width);
  const { canvas, data } = Math.abs(scale - 1) < 0.05 ? probe : invertedGray(img, scale);
  const mask = inkMask(data, canvas.width, canvas.height, inkBelow, OCR_LINE_HEIGHT * 1.5);
  // paint the dropped grid lines white so Tesseract does not read them as | or 1
  for (let i = 0; i < mask.length; i++) if (!mask[i] && data[i * 4] < inkBelow) data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255;
  canvas.getContext('2d')!.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
  const lines = findTextLines(mask, canvas.width, canvas.height, Math.round(OCR_LINE_HEIGHT * 0.4));
  // real crops: Tesseract's `rectangle` option returned garbage for line-sized regions
  return padLines(lines, canvas.height).map(({ top, bottom }) => {
    const crop = document.createElement('canvas');
    crop.width = canvas.width;
    crop.height = bottom - top;
    crop.getContext('2d')!.drawImage(canvas, 0, top, crop.width, crop.height, 0, 0, crop.width, crop.height);
    return crop;
  });
}

export default function TradeNew() {
  const navigate = useNavigate();
  const user = useUser();
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrRaw, setOcrRaw] = useState('');
  const [form, setForm] = useState<FormState>({
    item_name: '',
    item_stats_raw: '',
    price: '',
    contact: '',
    category: '',
    item_ref: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const { data: tradeItems = [] } = useQuery({
    queryKey: ['trade-items'],
    queryFn: loadTradeItems,
    staleTime: Infinity,
  });
  const byLabel = useMemo(() => new Map(tradeItems.map((t) => [itemLabel(t), t])), [tradeItems]);
  // what the name box shows: an option label once an item is picked, otherwise free text
  const [itemText, setItemText] = useState('');

  const pickItem = (text: string, hit?: TradeItem) => {
    setItemText(text);
    setForm((f) => ({
      ...f,
      item_name: hit ? hit.name : text,
      item_ref: hit?.ref ?? '',
      category: hit?.category ?? f.category,
    }));
  };

  const latestFile = useRef<File | null>(null);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const handleImage = useCallback(async (file: File) => {
    latestFile.current = file;
    setImageUrl(URL.createObjectURL(file));
    setOcrProgress(0);
    setOcrRaw('');

    try {
      const [bands, [chi, eng]] = await Promise.all([preprocessForOCR(file), getWorkers()]);
      const parts: string[] = [];
      for (const [i, band] of bands.entries()) {
        const [c, e] = await Promise.all([chi, eng].map((w) => w.recognize(band, {}, { blocks: true })));
        if (latestFile.current !== file) return; // a newer upload superseded this one
        if (c.data.confidence >= OCR_MIN_LINE_CONFIDENCE) parts.push(mergeDigits(ocrWords(c.data), ocrWords(e.data)));
        setOcrProgress(Math.round(((i + 1) / bands.length) * 100));
      }

      const text = fixOcrText(parts.join('\n'));
      if (!text) throw new Error('no text recognised');
      setOcrRaw(text);
      const lines = text.split('\n').filter((l) => !UI_HINT.test(l));

      const [catalog, baseItemNames, terms] = await Promise.all([
        loadTradeItems(),
        loadList('/data/base-item-names.json'),
        loadList('/data/ocr-terms.json'),
      ]);

      // the name is usually the first line, but stray UI text can sit above it
      const nameHit = matchLine(lines.slice(0, 3), [...new Set(catalog.map((t) => t.name))]);
      const hit =
        nameHit &&
        (catalog.find((t) => t.name === nameHit.name && t.kind === 'item') ??
          catalog.find((t) => t.name === nameHit.name));
      const rest = lines.slice((nameHit?.index ?? 0) + 1);
      const correct = makeLineCorrector(terms);
      const base = matchLine(rest.slice(0, 1), [...MISC_BASES, ...baseItemNames])?.name ?? (rest[0] && correct(rest[0]));

      setItemText(hit ? itemLabel(hit) : (lines[0] ?? ''));
      setForm((f) => ({
        ...f,
        item_name: hit ? hit.name : (lines[0] ?? ''),
        item_ref: hit?.ref ?? '',
        category: hit?.category ?? f.category,
        item_stats_raw: [base, ...rest.slice(1).map(correct)].filter(Boolean).join('\n'),
      }));
    } catch {
      if (latestFile.current === file) setOcrRaw('⚠ OCR 辨識失敗，請手動填入屬性');
    } finally {
      if (latestFile.current === file) setOcrProgress(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) handleImage(file);
    },
    [handleImage],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImage(file);
    },
    [handleImage],
  );

  const handleField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.item_name.trim()) errs.item_name = '必填';
    if (!form.price.trim()) errs.price = '必填';
    if (!form.contact.trim()) errs.contact = '必填';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.createTrade({
        item_name: form.item_name.trim(),
        item_stats_raw: form.item_stats_raw.trim() || undefined,
        price: form.price.trim(),
        contact: form.contact.trim(),
        category: form.category || undefined,
        item_ref: form.item_ref || undefined,
      });
      navigate('/trade');
    } catch (err) {
      window.alert(isAxiosError(err) && err.response?.status === 401 ? '請重新登入' : '發布失敗');
    } finally {
      setSubmitting(false);
    }
  };

  if (user === undefined) return null;
  if (user === null) {
    return (
      <div>
        <BackButton fallback="/trade" />
        <p className="mb-3 text-[13px] text-[#aaa398]">發布掛單需要先登入。</p>
        <button onClick={signIn} className="text-[13px] hover:text-white">
          Google 登入
        </button>
      </div>
    );
  }

  return (
    <div>
      <BackButton fallback="/trade" />
      <h1 className="text-xl font-bold mb-4">
        建立交易掛單
      </h1>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left: upload + OCR output */}
        <div style={{ flex: 1 }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('ocr-file-input')?.click()}
            style={{
              border: '2px dashed #423c33',
              background: '#141210',
              padding: '32px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '2px',
              marginBottom: '12px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="截圖"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            ) : (
              <>
                <div style={{ fontSize: '24px' }}>📷</div>
                <div style={{ color: '#555', fontSize: '12px' }}>拖曳或點選 D2R 截圖</div>
                <div style={{ color: '#423c33', fontSize: '11px' }}>裁切到只剩物品說明框，辨識會準很多</div>
              </>
            )}
          </div>
          <input
            id="ocr-file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          {ocrProgress !== null && (
            <div style={{ color: '#808000', fontSize: '12px', marginBottom: '8px' }}>
              辨識中… {ocrProgress}%
            </div>
          )}

          {ocrRaw && (
            <div
              style={{
                background: '#11100e',
                border: '1px solid #24211c',
                padding: '10px',
                borderRadius: '2px',
              }}
            >
              <div style={{ color: '#423c33', fontSize: '10px', marginBottom: '4px' }}>
                OCR 原始輸出
              </div>
              <pre style={{ color: '#555', fontSize: '10px', whiteSpace: 'pre-wrap', margin: 0 }}>
                {ocrRaw}
              </pre>
            </div>
          )}
        </div>

        {/* Right: form */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div>
            <label style={labelStyle}>物品名稱 *</label>
            <input
              style={{ ...inputStyle, color: '#808000' }}
              list="trade-item-options"
              value={itemText}
              onChange={(e) => pickItem(e.target.value, byLabel.get(e.target.value))}
              placeholder="輸入名稱搜尋"
            />
            <datalist id="trade-item-options">
              {[...byLabel.keys()].map((label) => (
                <option key={label} value={label} />
              ))}
            </datalist>
            <div style={{ color: form.item_ref ? '#5a8a5a' : '#666', fontSize: '10px', marginTop: '2px' }}>
              {form.item_ref ? `已對應：${itemText}` : '未對應物品，可直接輸入名稱'}
            </div>
            {errors.item_name && (
              <div style={{ color: '#ff4444', fontSize: '10px', marginTop: '2px' }}>
                {errors.item_name}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>屬性描述</label>
            <textarea
              style={{ ...inputStyle, color: '#6060ff', minHeight: '80px', resize: 'vertical' }}
              value={form.item_stats_raw}
              onChange={handleField('item_stats_raw')}
            />
          </div>

          <div>
            <label style={labelStyle}>物品類別</label>
            <select style={inputStyle} value={form.category} onChange={handleField('category')}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>價格 *</label>
            <input
              style={inputStyle}
              value={form.price}
              onChange={handleField('price')}
              placeholder="例：3 Ber、FG 議價"
            />
            {errors.price && (
              <div style={{ color: '#ff4444', fontSize: '10px', marginTop: '2px' }}>
                {errors.price}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>聯絡方式 *</label>
            <input
              style={inputStyle}
              value={form.contact}
              onChange={handleField('contact')}
              placeholder="Discord tag 或遊戲 ID"
            />
            {errors.contact && (
              <div style={{ color: '#ff4444', fontSize: '10px', marginTop: '2px' }}>
                {errors.contact}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#1a1400',
              border: '1px solid #808000',
              color: '#808000',
              padding: '8px 20px',
              cursor: submitting ? 'wait' : 'pointer',
              borderRadius: '2px',
              fontSize: '13px',
            }}
          >
            {submitting ? '發布中…' : '刊登掛單'}
          </button>
        </form>
      </div>
    </div>
  );
}
