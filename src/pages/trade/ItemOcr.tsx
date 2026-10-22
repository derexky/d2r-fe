// d2r-fe/src/pages/trade/ItemOcr.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { recognizeItem } from './recognizeItem';

const boxStyle: React.CSSProperties = {
  background: '#191714',
  border: '1px solid #302c26',
  padding: '4px 8px',
  width: '100%',
  borderRadius: '2px',
  fontSize: '13px',
  boxSizing: 'border-box',
};

export default function ItemOcr() {
  const [progress, setProgress] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [raw, setRaw] = useState('');
  const [name, setName] = useState('');
  const [stats, setStats] = useState('');
  const [copied, setCopied] = useState(false);
  const latestFile = useRef<File | null>(null);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const handleImage = useCallback(async (file: File) => {
    latestFile.current = file;
    setImageUrl(URL.createObjectURL(file));
    setProgress(0);
    setError('');
    setRaw('');
    setCopied(false);
    try {
      const r = await recognizeItem(file, setProgress, () => latestFile.current !== file);
      if (!r) return;
      setRaw(r.raw);
      setName(r.name);
      setStats(r.stats);
    } catch {
      if (latestFile.current === file) setError('⚠ OCR 辨識失敗，請換一張截圖或手動輸入');
    } finally {
      if (latestFile.current === file) setProgress(null);
    }
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText([name, stats].filter(Boolean).join('\n'));
    setCopied(true);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">裝備辨識</h1>
      <p className="mb-4 text-[12px] text-[#666]">上傳 D2R 物品說明截圖，辨識成文字後複製，方便自己整理歸檔。</p>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px' }}>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file?.type.startsWith('image/')) handleImage(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('item-ocr-input')?.click()}
            style={{
              border: '2px dashed #423c33',
              background: '#141210',
              padding: '32px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '2px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="截圖" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ fontSize: '24px' }}>📷</div>
                <div style={{ color: '#555', fontSize: '12px' }}>拖曳或點選 D2R 截圖</div>
                <div style={{ color: '#423c33', fontSize: '11px' }}>裁切到只剩物品說明框，辨識會準很多</div>
              </>
            )}
          </div>
          <input
            id="item-ocr-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImage(file);
              e.target.value = ''; // let the same file be picked again
            }}
          />
          {progress !== null && (
            <div style={{ color: '#808000', fontSize: '12px', marginTop: '8px' }}>辨識中… {progress}%</div>
          )}
          {error && <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '8px' }}>{error}</div>}
        </div>

        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            style={{ ...boxStyle, color: '#808000' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="物品名稱"
            aria-label="物品名稱"
          />
          <textarea
            style={{ ...boxStyle, color: '#6060ff', minHeight: '200px', resize: 'vertical' }}
            value={stats}
            onChange={(e) => setStats(e.target.value)}
            placeholder="屬性"
            aria-label="屬性"
          />
          <button
            type="button"
            onClick={copy}
            disabled={!name && !stats}
            style={{
              background: '#1a1400',
              border: '1px solid #808000',
              color: '#808000',
              padding: '8px 20px',
              cursor: 'pointer',
              borderRadius: '2px',
              fontSize: '13px',
            }}
          >
            {copied ? '已複製 ✓' : '複製文字'}
          </button>
          {raw && (
            <details style={{ fontSize: '10px', color: '#423c33' }}>
              <summary style={{ cursor: 'pointer' }}>OCR 原始輸出</summary>
              <pre style={{ color: '#555', whiteSpace: 'pre-wrap', margin: '4px 0 0' }}>{raw}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
