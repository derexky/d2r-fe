// d2r-fe/src/pages/trade/TradeNew.tsx
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { signIn, useUser } from '../../auth';
import { TRADE_CATEGORIES } from '../items/itemCategories';
import BackButton from '../../components/ui/BackButton';
import { recognizeItem } from './recognizeItem';
import { BASE_FILTERS, QUALITIES, categoryOptions, loadTradeItems, runewordBaseOptions, type BaseFilter } from './tradeItems';

const CATEGORIES = [{ label: '請選擇', value: '' }, ...TRADE_CATEGORIES];

interface FormState {
  item_name: string;
  item_stats_raw: string;
  price: string;
  contact: string;
  category: string;
  item_ref: string;
  quality: string;
  base_ref: string;
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
    quality: 'normal',
    base_ref: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const { data: tradeItems = [] } = useQuery({
    queryKey: ['trade-items'],
    queryFn: loadTradeItems,
    staleTime: Infinity,
  });
  const [baseFilter, setBaseFilter] = useState<BaseFilter>('');
  const { options: categoryItems, hasBoth } = useMemo(
    () => categoryOptions(tradeItems, form.category, baseFilter),
    [tradeItems, form.category, baseFilter],
  );

  const pickCategory = (category: string) => {
    setBaseFilter('');
    setForm((f) => {
      const keep = tradeItems.some((t) => t.ref === f.item_ref && t.category === category);
      return { ...f, category, item_ref: keep ? f.item_ref : '' };
    });
  };

  const pickBaseFilter = (filter: BaseFilter) => {
    setBaseFilter(filter);
    // drop a picked item the new filter hides
    setForm((f) => {
      const t = tradeItems.find((i) => i.ref === f.item_ref);
      const visible = !filter || !t || (t.kind === 'base') === (filter === 'base');
      return visible ? f : { ...f, item_ref: '' };
    });
  };

  const isBase = tradeItems.some((t) => t.ref === form.item_ref && t.kind === 'base');
  const runeword = tradeItems.find((t) => t.ref === form.item_ref && t.kind === 'runeword');
  const runewordBases = useMemo(() => runewordBaseOptions(tradeItems, runeword), [tradeItems, runeword]);

  const pickItem = (ref: string) => {
    const hit = categoryItems.find((t) => t.ref === ref);
    setForm((f) => ({ ...f, item_ref: ref, base_ref: '', item_name: hit ? hit.name : f.item_name }));
  };

  const latestFile = useRef<File | null>(null);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const handleImage = useCallback(async (file: File) => {
    latestFile.current = file;
    setImageUrl(URL.createObjectURL(file));
    setOcrProgress(0);
    setOcrRaw('');

    try {
      const r = await recognizeItem(file, setOcrProgress, () => latestFile.current !== file);
      if (!r) return; // a newer upload superseded this one
      setOcrRaw(r.raw);
      setBaseFilter('');
      setForm((f) => ({
        ...f,
        item_name: r.name,
        item_ref: r.hit?.ref ?? '',
        base_ref: r.baseHit?.ref ?? '',
        category: r.hit?.category ?? f.category,
        item_stats_raw: r.stats,
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
        quality: isBase ? form.quality : undefined,
        base_ref: (runeword && form.base_ref) || undefined,
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
            <label style={labelStyle}>物品類別</label>
            <select style={inputStyle} value={form.category} onChange={(e) => pickCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {categoryItems.length > 0 && (
            <div>
              <label style={labelStyle}>物品</label>
              {hasBoth && (
                <select
                  style={{ ...inputStyle, marginBottom: '4px' }}
                  value={baseFilter}
                  onChange={(e) => pickBaseFilter(e.target.value as BaseFilter)}
                  aria-label="依是否為底材篩選"
                >
                  {BASE_FILTERS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              )}
              <select style={inputStyle} value={form.item_ref} onChange={(e) => pickItem(e.target.value)}>
                <option value="">不在清單中（手動輸入名稱）</option>
                {categoryItems.map((t) => (
                  <option key={t.ref} value={t.ref}>
                    {t.label}
                  </option>
                ))}
              </select>
              {isBase && (
                <div role="radiogroup" aria-label="品質" style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px' }}>
                  {QUALITIES.map((q) => (
                    <label key={q.value} style={{ color: q.color, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="quality"
                        value={q.value}
                        checked={form.quality === q.value}
                        onChange={handleField('quality')}
                        style={{ marginRight: '4px' }}
                      />
                      {q.label}
                    </label>
                  ))}
                </div>
              )}
              {runeword && (
                <select
                  style={{ ...inputStyle, marginTop: '4px' }}
                  value={form.base_ref}
                  onChange={handleField('base_ref')}
                  aria-label="底材"
                >
                  <option value="">底材（未指定）</option>
                  {runewordBases.map((t) => (
                    <option key={t.ref} value={t.ref}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label style={labelStyle}>物品名稱 *</label>
            <input
              style={{ ...inputStyle, color: '#808000' }}
              value={form.item_name}
              // a typed name no longer matches the picked item
              onChange={(e) => setForm((f) => ({ ...f, item_name: e.target.value, item_ref: '' }))}
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
