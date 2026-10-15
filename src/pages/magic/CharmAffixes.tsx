import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { type Affix, CHARM_GIDS } from './affixTypes';

const SIZE_LABELS = { 'small-charms': '小型咒符', 'large-charms': '大型咒符', 'grand-charms': '特大咒符' };
const SIZE_COLORS = { 'small-charms': '#6699cc', 'large-charms': '#66aacc', 'grand-charms': '#66cccc' };

interface CharmRow {
  kind: Affix['kind'];
  name: string;
  tiers: Record<string, Affix[]>; // charm gid -> tiers by alvl
}

export default function CharmAffixes() {
  const [search, setSearch] = useState('');

  const { data: affixes = [], isLoading } = useQuery<Affix[]>({
    queryKey: ['affixes'],
    queryFn: () => api.getAffixes(),
  });

  const groups = useMemo(() => {
    const byName = new Map<string, CharmRow>();
    for (const a of affixes) {
      for (const g of CHARM_GIDS) {
        if (!a.types.includes(g)) continue;
        const key = `${a.kind}|${a.name_zh}`;
        const row = byName.get(key) ?? { kind: a.kind, name: `${a.name_zh} ${a.name_en ?? ''}`, tiers: {} };
        (row.tiers[g] ??= []).push(a);
        byName.set(key, row);
      }
    }
    return [...byName.values()];
  }, [affixes]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(r =>
      r.name.toLowerCase().includes(q) ||
      Object.values(r.tiers).some(ts => ts.some(a => a.stats.join(' ').toLowerCase().includes(q))));
  }, [groups, search]);

  return (
    <div className="text-sm">
      <h1 className="text-xl font-bold mb-1">
        魔法飾品詞綴
      </h1>
      <p className="text-xs text-gray-500 mb-3">
        小型/大型/特大咒符的字首與字尾・共 {groups.length} 條・格式：屬性 [alvl]
      </p>

      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋名稱或屬性…"
          className="px-2 py-1 text-xs border outline-none"
          style={{ background: '#11100e', borderColor: '#2a2620', color: '#e0e0e0', width: 200 }}
        />
        <span className="text-xs self-center" style={{ color: '#666' }}>{rows.length} 筆</span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr style={{ background: '#141210' }}>
                <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 50 }}>類型</th>
                <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 160 }}>名稱</th>
                {CHARM_GIDS.map(g => (
                  <th key={g} className="px-2 py-1 text-center border" style={{ borderColor: '#2a2620', color: SIZE_COLORS[g] }}>{SIZE_LABELS[g]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.kind}${r.name}`} style={{ background: i % 2 === 0 ? '#11100e' : '#0f0f0f' }}>
                  <td className="px-2 py-0.5 border" style={{ borderColor: '#191714', color: '#888' }}>{r.kind}</td>
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
      )}
    </div>
  );
}
