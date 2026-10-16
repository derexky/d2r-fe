import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api';

const chip = (active: boolean) => ({
  padding: '4px 10px', fontSize: '12px', borderRadius: '2px', cursor: 'pointer',
  background: active ? '#1a1712' : 'transparent',
  border: `1px solid ${active ? 'var(--gold)' : '#3a352d'}`,
  color: active ? 'var(--gold)' : 'var(--muted)',
});

// Tracked items by category; each item opens its price stats on /traderie/:item
export default function TraderiePage() {
  const [search, setSearch] = useState('');
  // kept in the URL so coming back from an item returns to the same category
  const [params, setParams] = useSearchParams();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['price-tracked-groups'],
    queryFn: () => api.priceTrackedGroups(),
    staleTime: Infinity,
  });

  // one category at a time, or every match grouped by category while searching
  const activeCategory = params.get('c') ?? groups[0]?.category;
  const q = search.trim().toLowerCase();
  const shown = q
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((i) => `${i} ${g.zh?.[i] ?? ''}`.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : groups.filter((g) => g.category === activeCategory);

  return (
    <div>
      <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>成交價格統計</h1>

      {/* search + categories stay pinned while the item list scrolls */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1, background: '#0b0b0a', padding: '8px 0 10px', marginBottom: '12px', borderBottom: '1px solid var(--line)' }}>
        <input
          placeholder="搜尋物品（中文或英文）…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '320px', background: 'var(--panel)', border: '1px solid #3a352d', color: 'var(--ink)', padding: '6px 10px', borderRadius: '2px', fontSize: '13px', outline: 'none', marginBottom: '10px', display: 'block' }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {groups.map((g) => (
            <button key={g.category} style={chip(!q && g.category === activeCategory)}
              onClick={() => { setParams({ c: g.category }, { replace: true }); setSearch(''); }}>
              {g.category} <span style={{ fontSize: '11px', opacity: 0.7 }}>{g.items.length}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div style={{ color: 'var(--muted)', fontSize: '13px' }}>載入中…</div>}
      {q && shown.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '13px' }}>找不到符合的物品</div>}

      {shown.map((g) => (
        <div key={g.category} style={{ marginBottom: '14px' }}>
          {q && <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '6px' }}>{g.category}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '6px' }}>
            {g.items.map((item) => (
              <Link key={item} to={`/traderie/${encodeURIComponent(item)}`}
                className="hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                style={{ display: 'block', padding: '8px 10px', fontSize: '13px', border: '1px solid var(--line)', background: 'var(--panel)', borderRadius: '2px', color: 'var(--ink)' }}>
                <div>{g.zh?.[item] ?? item}</div>
                {g.zh?.[item] && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{item}</div>}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
