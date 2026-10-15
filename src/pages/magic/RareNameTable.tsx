import { useMemo } from 'react';
import { RARE_PREFIXES, RARE_SUFFIXES } from './rareNameData';

// Rare item name pool; kind, search and item type come from the affix page's shared controls
export default function RareNameTable({ kind, search, gid, onShowRare }: {
  kind: '前綴' | '後綴';
  search: string;
  gid: string;
  onShowRare: () => void;
}) {
  const data = kind === '前綴' ? RARE_PREFIXES : RARE_SUFFIXES;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter(r =>
      (!gid || r.gids.includes(gid)) && (!q || r.en.toLowerCase().includes(q) || r.zh.includes(q)));
  }, [search, gid, data]);

  return (
    <div className="overflow-x-auto">
      <p className="text-xs mb-2" style={{ color: '#666' }}>
        稀有裝備（黃色）的名字由一個字首加一個字尾隨機組成，只是外觀、不帶任何屬性；字尾依物品類型而定。
        可出現的屬性請看{' '}
        <button onClick={onShowRare} className="underline" style={{ color: '#00cccc' }}>稀有裝備</button>
        ・字首 {RARE_PREFIXES.length} 個・字尾 {RARE_SUFFIXES.length} 個・{rows.length} 筆
      </p>
      <table className="text-xs border-collapse" style={{ minWidth: 280 }}>
        <thead>
          <tr style={{ background: '#141210' }}>
            <th className="px-3 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 160 }}>英文</th>
            <th className="px-3 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 120 }}>中文</th>
            <th className="px-3 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#888' }}>可出現物品類型</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.en} style={{ background: i % 2 === 0 ? '#11100e' : '#0f0f0f' }}>
              <td className="px-3 py-0.5 border" style={{ borderColor: '#191714', color: '#e0c060' }}>{r.en}</td>
              <td className="px-3 py-0.5 border" style={{ borderColor: '#191714', color: '#e0e0e0' }}>{r.zh}</td>
              <td className="px-3 py-0.5 border" style={{ borderColor: '#191714', color: r.types.length ? '#888' : '#554' }}>
                {r.types.length ? r.types.join('、') : '無（遊戲中不會出現）'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
