import { useState, useMemo } from 'react';
import { CHARM_AFFIXES } from './charmData';

const CATS = [...new Set(CHARM_AFFIXES.map(a => a.func))];

export default function CharmAffixes() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CHARM_AFFIXES.filter(a => {
      if (cat && a.func !== cat) return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.small.toLowerCase().includes(q) &&
          !a.large.toLowerCase().includes(q) && !a.grand.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, cat]);

  return (
    <div className="text-sm">
      <h1 className="text-xl font-bold mb-1" style={{ color: '#00ffff' }}>
        魔法飾品字首
      </h1>
      <p className="text-xs text-gray-500 mb-3">
        小型/大型/超大型魔法飾品（符咒）專用字首・共 {CHARM_AFFIXES.length} 條
        ・格式：能力值/(第一階段)[ilvl](第二階段)[ilvl]
      </p>

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
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs self-center" style={{ color: '#666' }}>{rows.length} 筆</span>
      </div>

      <div className="overflow-x-auto">
        <table className="text-xs border-collapse w-full">
          <thead>
            <tr style={{ background: '#111' }}>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 100 }}>類別</th>
              <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2a2a', color: '#c0a030', width: 160 }}>名稱</th>
              <th className="px-2 py-1 text-center border" style={{ borderColor: '#2a2a2a', color: '#6699cc' }}>小型飾品</th>
              <th className="px-2 py-1 text-center border" style={{ borderColor: '#2a2a2a', color: '#66aacc' }}>大型飾品</th>
              <th className="px-2 py-1 text-center border" style={{ borderColor: '#2a2a2a', color: '#66cccc' }}>超大型飾品</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#0f0f0f' }}>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#888' }}>{a.func}</td>
                <td className="px-2 py-0.5 border" style={{ borderColor: '#1a1a1a', color: '#e0c060' }}>{a.name}</td>
                <td className="px-2 py-0.5 border text-center font-mono" style={{ borderColor: '#1a1a1a', color: a.small === '－' ? '#333' : '#00ccaa' }}>{a.small}</td>
                <td className="px-2 py-0.5 border text-center font-mono" style={{ borderColor: '#1a1a1a', color: a.large === '－' ? '#333' : '#00ccaa' }}>{a.large}</td>
                <td className="px-2 py-0.5 border text-center font-mono" style={{ borderColor: '#1a1a1a', color: a.grand === '－' ? '#333' : '#00ccaa' }}>{a.grand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
