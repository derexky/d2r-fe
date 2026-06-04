// d2r-fe/src/pages/trade/TradeNew.tsx
import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';

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
  background: '#1a1a1a',
  border: '1px solid #333',
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

  const handleImage = useCallback(async (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setOcrProgress(0);
    setOcrRaw('');

    try {
      const result = await Tesseract.recognize(file, 'chi_tra+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text.trim();
      setOcrRaw(text);

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      setForm((f) => ({
        ...f,
        item_name: lines[0] ?? '',
        item_stats_raw: lines.slice(1).join('\n'),
      }));
    } catch {
      setOcrRaw('⚠ OCR 辨識失敗，請手動填入屬性');
    } finally {
      setOcrProgress(null);
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
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
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
              border: '2px dashed #444',
              background: '#111',
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
                background: '#0a0a0a',
                border: '1px solid #222',
                padding: '10px',
                borderRadius: '2px',
              }}
            >
              <div style={{ color: '#444', fontSize: '10px', marginBottom: '4px' }}>
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
