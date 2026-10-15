import { useMemo } from 'react';
import { type Affix, CHARM_GIDS } from './affixTypes';

const SIZE_LABELS = { 'small-charms': '小型咒符', 'large-charms': '大型咒符', 'grand-charms': '特大咒符' };
const SIZE_COLORS = { 'small-charms': '#6699cc', 'large-charms': '#66aacc', 'grand-charms': '#66cccc' };

interface CharmRow {
  name: string;
  tiers: Record<string, Affix[]>; // charm gid -> tiers by alvl
}

// Charm affixes side by side per size; `affixes` is already filtered by kind and search
export default function CharmAffixTable({ affixes }: { affixes: Affix[] }) {
  const rows = useMemo(() => {
    const byName = new Map<string, CharmRow>();
    for (const a of affixes) {
      for (const g of CHARM_GIDS) {
        if (!a.types.includes(g)) continue;
        const row = byName.get(a.name_zh) ?? { name: `${a.name_zh} ${a.name_en ?? ''}`, tiers: {} };
        (row.tiers[g] ??= []).push(a);
        byName.set(a.name_zh, row);
      }
    }
    return [...byName.values()];
  }, [affixes]);

  return (
    <div className="overflow-x-auto">
      <p className="text-xs mb-2" style={{ color: '#666' }}>{rows.length} 筆・格式：屬性 [alvl]</p>
      <table className="text-xs border-collapse w-full">
        <thead>
          <tr style={{ background: '#141210' }}>
            <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 160 }}>名稱</th>
            {CHARM_GIDS.map(g => (
              <th key={g} className="px-2 py-1 text-center border" style={{ borderColor: '#2a2620', color: SIZE_COLORS[g] }}>{SIZE_LABELS[g]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} style={{ background: i % 2 === 0 ? '#11100e' : '#0f0f0f' }}>
              <td className="px-2 py-0.5 border" style={{ borderColor: '#191714', color: '#e0c060' }}>{r.name}</td>
              {CHARM_GIDS.map(g => (
                <td key={g} className="px-2 py-0.5 border text-center font-mono" style={{ borderColor: '#191714', color: r.tiers[g] ? '#00ccaa' : '#302c26' }}>
                  {r.tiers[g]
                    ? r.tiers[g].map(a => <div key={a.id}>{a.stats.join('，')} [{a.level}]</div>)
                    : '－'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
