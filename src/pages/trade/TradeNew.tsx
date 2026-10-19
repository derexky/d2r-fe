// d2r-fe/src/pages/trade/TradeNew.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { createWorker, PSM, OEM, type Page, type Worker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import BackButton from '../../components/ui/BackButton';
import { findTextLines, makeLineCorrector, matchLine, mergeDigits, padLines } from './ocrText';

const CATEGORIES = [
  { label: '請選擇', value: '' },
  { label: '戒指', value: 'rings' },
  { label: '護身符', value: 'amulets' },
  { label: '護符', value: 'charms' },
  { label: '頭部', value: 'helms' },
  { label: '盔甲', value: 'armors' },
  { label: '武器', value: 'weapons' },
  { label: '盾牌', value: 'shields' },
  { label: '手套', value: 'gloves' },
  { label: '腰帶', value: 'belts' },
  { label: '靴類', value: 'boots' },
  { label: '其他', value: 'other' },
];

interface FormState {
  item_name: string;
  item_stats_raw: string;
  price: string;
  contact: string;
  category: string;
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
    .replace(/[|{}[\]]/g, '')                                         // strip junk chars
    .replace(/¥/g, '+')                                               // ¥ → + (D2R font)
    .replace(/(\d+)(?:96|[Zz])(?=\s|$)/gm, '$1%')                    // N96 / NZ → N% (D2R % font)
    .replace(/(\d+)\s*有\s*%/g, '$1%')                               // N 有 % → N% (same glyph)
    .replace(/(?<=[一-鿿])[^\S\n]+(?=[一-鿿])/g, '') // collapse inter-CJK spaces, keep line breaks
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
}

// D2R tooltips are light text (gold/blue/white/grey) on a near-black panel; the dimmest
// text colours land around gray 100, the panel well below. Only used to find the text lines;
// recognition runs on the inverted grayscale, whose anti-aliasing keeps thin CJK strokes.
// Tune if dim lines go missing.
const OCR_THRESHOLD = 80;
// Text-line height (px) the image is rescaled to; Tesseract reads CJK glyphs best around here.
const OCR_LINE_HEIGHT = 36;
const OCR_MAX_WIDTH = 4000;

// Workers live for the page lifetime: loading the WASM core and the language models is
// the slow part, so later uploads reuse them. chi_tra reads the Chinese, eng the numbers
// (see mergeDigits).
let workersPromise: Promise<Worker[]> | null = null;

function getWorkers() {
  if (!workersPromise) {
    workersPromise = Promise.all(
      ['chi_tra+eng', 'eng'].map(async (lang) => {
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
    data[i] = data[i + 1] = data[i + 2] = 255 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  ctx.putImageData(imageData, 0, 0);
  return { canvas, data };
}

/** One inverted-grayscale canvas per tooltip line, scaled to OCR_LINE_HEIGHT. */
async function preprocessForOCR(file: File) {
  const img = await loadImage(file);
  const inkBelow = 255 - OCR_THRESHOLD;
  const probe = invertedGray(img, 1);
  const heights = findTextLines(probe.data, img.width, img.height, 4, inkBelow)
    .map((l) => l.bottom - l.top)
    .sort((a, b) => a - b);
  if (!heights.length) throw new Error('no text found');
  const median = heights[heights.length >> 1];
  const scale = Math.min(4, OCR_LINE_HEIGHT / median, OCR_MAX_WIDTH / img.width);
  const { canvas, data } = Math.abs(scale - 1) < 0.05 ? probe : invertedGray(img, scale);
  const lines = findTextLines(data, canvas.width, canvas.height, Math.round(OCR_LINE_HEIGHT * 0.4), inkBelow);
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
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrRaw, setOcrRaw] = useState('');
  const [form, setForm] = useState<FormState>({
    item_name: '',
    item_stats_raw: '',
    price: '',
    contact: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

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
        parts.push(mergeDigits(ocrWords(c.data), ocrWords(e.data)));
        setOcrProgress(Math.round(((i + 1) / bands.length) * 100));
      }

      const text = fixOcrText(parts.join('\n'));
      setOcrRaw(text);
      const lines = text.split('\n');

      const [itemNames, baseItemNames, terms] = await Promise.all([
        loadList('/data/item-names.json'),
        loadList('/data/base-item-names.json'),
        loadList('/data/ocr-terms.json'),
      ]);

      // the name is usually the first line, but stray UI text can sit above it
      const nameHit = matchLine(lines.slice(0, 3), itemNames);
      const rest = lines.slice((nameHit?.index ?? 0) + 1);
      const correct = makeLineCorrector(terms);
      // base-item-names has no charms or jewels; their base type is snapped via the terms
      const base = matchLine(rest.slice(0, 1), baseItemNames)?.name ?? (rest[0] && correct(rest[0]));

      setForm((f) => ({
        ...f,
        item_name: nameHit?.name ?? lines[0] ?? '',
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
      });
      navigate('/trade');
    } finally {
      setSubmitting(false);
    }
  };

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
              value={form.item_name}
              onChange={handleField('item_name')}
            />
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
