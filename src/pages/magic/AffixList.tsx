import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BackButton from '../../components/ui/BackButton';
import { type Affix, GID_LABELS } from './affixTypes';
import CharmAffixTable from './CharmAffixTable';
import RareNameTable from './RareNameTable';

const VIEWS = { all: '全部詞綴', rare: '稀有裝備', charms: '咒符對照', names: '稀有名稱' } as const;
type View = keyof typeof VIEWS;

export default function AffixList() {
  const [tab, setTab] = useState<'前綴' | '後綴'>('前綴');
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const [gid, setGid] = useState(params.get('type') ?? '');
  const base = params.get('base');
  // ?view= is linkable: the old /magic/charm-affixes and /magic/rare-names pages redirect here
  const requested = params.get('view') as View | null;
  const view: View = !base && requested && requested in VIEWS ? requested : 'all';

  const { data: affixes = [], isLoading } = useQuery<Affix[]>({
    queryKey: ['affixes', base],
    queryFn: () => api.getAffixes(base ? { base } : undefined),
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return affixes.filter(a => {
      if (a.kind !== tab) return false;
      if (view !== 'charms' && gid && !a.types.includes(gid)) return false;
      if (view === 'rare' && !a.rare) return false;
      if (q && !`${a.name_zh} ${a.name_en ?? ''} ${a.stats.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [affixes, tab, search, gid, view]);

  return (
    <div className="text-sm">
      {base && <BackButton fallback="/items/base" label="返回底材" />}
      <h1 className="text-xl font-bold mb-1">
        魔法字首字尾
      </h1>
      {base && (
        <p className="text-xs mb-2" style={{ color: '#00cccc' }}>
          底材「{params.get('name') ?? base}」可出的詞綴・<Link to="/magic/affixes" className="underline">顯示全部</Link>
        </p>
      )}
      <p className="text-xs text-gray-500 mb-3">
        alvl 為詞綴等級（物品等級需 ≥ alvl 才可能出現）；標示「稀有」者亦會出現在稀有裝備
      </p>

      {/* View: every affix, those that also roll on rare items, charm affixes per size, or rare item names */}
      {!base && (
        <div className="flex gap-1 mb-2">
          {(Object.keys(VIEWS) as View[]).map(v => (
            <button
              key={v}
              onClick={() => setParams(v === 'all' ? {} : { view: v })}
              className="px-3 py-1 text-xs border transition-colors"
              style={{
                borderColor: view === v ? '#cc9900' : '#2a2620',
                color: view === v ? '#ffcc00' : '#666',
                background: view === v ? '#1a1400' : 'transparent',
              }}
            >
              {VIEWS[v]}
            </button>
          ))}
        </div>
      )}

      {/* Prefix/Suffix tabs */}
      <div className="flex gap-1 mb-3">
        {(['前綴', '後綴'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1 text-xs border transition-colors"
            style={{
              borderColor: tab === t ? '#00cccc' : '#2a2620',
              color: tab === t ? '#00ffff' : '#888',
              background: tab === t ? '#001a1a' : 'transparent',
            }}
          >
            {t === '前綴' ? '字首 Prefix' : '字尾 Suffix'}
          </button>
        ))}
      </div>

      {/* Search + item type filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋名稱或屬性…"
          className="px-2 py-1 text-xs border outline-none"
          style={{ background: '#11100e', borderColor: '#2a2620', color: '#e0e0e0', width: 200 }}
        />
        {view !== 'charms' && (
          <>
            <select
              value={gid}
              onChange={e => setGid(e.target.value)}
              className="px-2 py-1 text-xs border outline-none"
              style={{ background: '#11100e', borderColor: '#2a2620', color: gid ? '#e0e0e0' : '#666' }}
            >
              <option value="">全部物品類型</option>
              {Object.entries(GID_LABELS)
                .filter(([g]) => view === 'all' || !g.endsWith('charms')) /* no rare charms */
                .map(([g, label]) => <option key={g} value={g}>{label}</option>)}
            </select>
            {view !== 'names' && <span className="text-xs self-center" style={{ color: '#666' }}>{rows.length} 筆</span>}
          </>
        )}
      </div>

      {/* rare names are bundled data, so that view does not wait for the affix API */}
      {isLoading && view !== 'names' ? (
        <LoadingSpinner />
      ) : view === 'charms' ? (
        <CharmAffixTable affixes={rows} />
      ) : view === 'names' ? (
        <RareNameTable kind={tab} search={search} gid={gid} onShowRare={() => setParams({ view: 'rare' })} />
      ) : (
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr style={{ background: '#141210' }}>
                <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 160 }}>名稱</th>
                <th className="px-2 py-1 text-center border" style={{ borderColor: '#2a2620', color: '#c6a25a', width: 50 }}>alvl</th>
                <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#c6a25a' }}>屬性</th>
                <th className="px-2 py-1 text-left border" style={{ borderColor: '#2a2620', color: '#888', width: 260 }}>物品類型</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? '#11100e' : '#0f0f0f' }}>
                  <td className="px-2 py-0.5 border" style={{ borderColor: '#191714', color: '#e0c060' }}>
                    {a.name_zh} <span style={{ color: '#776' }}>{a.name_en}</span>
                    {a.rare && <span className="ml-1" style={{ color: '#ffff77' }}>稀有</span>}
                  </td>
                  <td className="px-2 py-0.5 border text-center" style={{ borderColor: '#191714', color: '#888' }}>{a.level}</td>
                  <td className="px-2 py-0.5 border" style={{ borderColor: '#191714', color: '#00ccaa' }}>
                    {a.stats.map((s, j) => <div key={j}>{s}</div>)}
                  </td>
                  <td className="px-2 py-0.5 border" style={{ borderColor: '#191714', color: '#666' }}>
                    {a.types.map(t => GID_LABELS[t] ?? t).join('、')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
