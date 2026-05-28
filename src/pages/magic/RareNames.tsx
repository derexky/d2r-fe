import { useState, useMemo } from 'react';
import { RARE_PREFIXES, RARE_SUFFIXES } from './rareNameData';

type Tab = 'prefix' | 'suffix';

export default function RareNames() {
  const [tab, setTab] = useState<Tab>('prefix');
  const [search, setSearch] = useState('');

  const data = tab === 'prefix' ? RARE_PREFIXES : RARE_SUFFIXES;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(r => r.en.toLowerCase().includes(q) || r.zh.includes(q));
  }, [tab, search, data]);

  return (
    <div className="text-sm">
      <h1 className="text-xl font-bold mb-1" style={{ color: '#00ffff' }}>
        稀有裝備名稱
      </h1>
      <p className="text-xs text-gray-500 mb-3">
        稀有裝備（黃色）名稱生成池・字首 {RARE_PREFIXES.length} 個・字尾 {RARE_SUFFIXES.length} 個
      </p>

      <div className="flex gap-1 mb-3">
        {(['prefix', 'suffix'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(''); }}
            className="px-3 py-1 text-xs border transition-colors"
            style={{
              borderColor: tab === t ? '#00cccc' : '#2a2a2a',
              color: tab === t ? '#00ffff' : '#888',
              background: tab === t ? '#001a1a' : 'transparent',
            }}
          >
            {t === 'prefix' ? `字首 (${RARE_PREFIXES.length})` : `字尾 (${RARE_SUFFIXES.length})`}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋英文或中文…"
          className="px-2 py-1 text-xs border outline-none"
          style={{ background: '#0a0a0a', borderColor: '#2a2a2a', color: '#e0e0e0', width: 200 }}
        />
        <span className="text-xs self-center" style={{ color: '#666' }}>{rows.length} 筆</span>
      </div>

      <div className="overflow-x-auto">
        <table className="text-xs border-collapse" style={{ minWidth: 280 }}>
          <thead>
            <tr style={{ background: '#111' }}>
              <th className="px-3 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 160 }}>英文</th>
              <th className="px-3 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 120 }}>中文</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#0f0f0f' }}>
                <td className="px-3 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#e0c060' }}>{r.en}</td>
                <td className="px-3 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#e0e0e0' }}>{r.zh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
