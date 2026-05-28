import { useState, useMemo } from 'react';
import { AFFIXES, AFFIXES2 } from './affixData';

type Source = 'equip' | 'misc';

const bySource = (src: Source) => src === 'equip' ? AFFIXES : AFFIXES2;

function getCats(src: Source, type: 'prefix' | 'suffix') {
  return [...new Set(bySource(src).filter(a => a.type === type).map(a => a.func))];
}

export default function AffixList() {
  const [src, setSrc] = useState<Source>('equip');
  const [tab, setTab] = useState<'prefix' | 'suffix'>('prefix');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  const cats = getCats(src, tab);
  const pool = bySource(src);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pool.filter(a => {
      if (a.type !== tab) return false;
      if (cat && a.func !== cat) return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.stat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [src, tab, search, cat, pool]);

  const srcLabel = src === 'equip'
    ? `一般裝備 (字首${AFFIXES.filter(a=>a.type==='prefix').length}/字尾${AFFIXES.filter(a=>a.type==='suffix').length})`
    : `特殊裝備 (字首${AFFIXES2.filter(a=>a.type==='prefix').length}/字尾${AFFIXES2.filter(a=>a.type==='suffix').length})`;

  return (
    <div className="text-sm">
      <h1 className="text-xl font-bold mb-1" style={{ color: '#00ffff' }}>
        魔法字首字尾
      </h1>
      <p className="text-xs text-gray-500 mb-3">
        items 欄：一般裝備為物品類型[ilvl]；特殊裝備為魔法/稀有[ilvl]
      </p>

      {/* Source tabs */}
      <div className="flex gap-1 mb-2">
        {(['equip', 'misc'] as Source[]).map(s => (
          <button
            key={s}
            onClick={() => { setSrc(s); setCat(''); }}
            className="px-3 py-1 text-xs border transition-colors"
            style={{
              borderColor: src === s ? '#cc9900' : '#2a2a2a',
              color: src === s ? '#ffcc00' : '#666',
              background: src === s ? '#1a1400' : 'transparent',
            }}
          >
            {s === 'equip' ? '一般裝備' : '特殊裝備'}
          </button>
        ))}
        <span className="text-xs self-center ml-1" style={{ color: '#555' }}>{srcLabel}</span>
      </div>

      {/* Prefix/Suffix tabs */}
      <div className="flex gap-1 mb-3">
        {(['prefix', 'suffix'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setCat(''); }}
            className="px-3 py-1 text-xs border transition-colors"
            style={{
              borderColor: tab === t ? '#00cccc' : '#2a2a2a',
              color: tab === t ? '#00ffff' : '#888',
              background: tab === t ? '#001a1a' : 'transparent',
            }}
          >
            {t === 'prefix' ? '字首 Prefix' : '字尾 Suffix'}
          </button>
        ))}
      </div>

      {/* Search + category filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋名稱或屬性…"
          className="px-2 py-1 text-xs border outline-none"
          style={{ background: '#0a0a0a', borderColor: '#2a2a2a', color: '#e0e0e0', width: 200 }}
        />
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          className="px-2 py-1 text-xs border outline-none"
          style={{ background: '#0a0a0a', borderColor: '#2a2a2a', color: cat ? '#e0e0e0' : '#666' }}
        >
          <option value="">全部類別</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs self-center" style={{ color: '#666' }}>{rows.length} 筆</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr style={{ background: '#111' }}>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 110 }}>類別</th>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 160 }}>名稱</th>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030' }}>屬性</th>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#888', width: 220 }}>物品 [ilvl]</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#0f0f0f' }}>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#888' }}>{a.func}</td>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#e0c060' }}>{a.name}</td>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#00ccaa' }}>{a.stat}</td>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#666' }}>{a.items ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
