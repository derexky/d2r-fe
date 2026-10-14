import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

const S = {
  btn: {
    background: 'transparent', border: '1px solid #3a352d', color: 'var(--muted)',
    padding: '4px 12px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer',
  },
  btnActive: {
    background: '#1a1712', border: '1px solid var(--gold)', color: 'var(--gold)',
    padding: '4px 12px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer',
  },
  card: { border: '1px solid var(--line)', background: 'var(--panel)', borderRadius: '2px', padding: '10px 12px', marginBottom: '8px' },
};

type Mode = 'sc' | 'hc';

function tsToDate(ts?: { _seconds: number }): string {
  if (!ts) return '—';
  return new Date(ts._seconds * 1000).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface PriceItem { name: string; quantity: number }
interface PriceStats {
  synced_at?: { _seconds: number };
  price?: { count: number; top: { items: PriceItem[]; freq: number }[] };
  trade_window?: { earliest?: { _seconds: number }; latest?: { _seconds: number } };
}

export default function TraderiePage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [ladder, setLadder] = useState(true);
  const [mode, setMode] = useState<Mode>('sc');
  const [search, setSearch] = useState('');

  const { data: trackedItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['price-tracked-items'],
    queryFn: () => api.priceTrackedItems(),
    staleTime: Infinity,
  });

  const { data: stats, isFetching: statsLoading } = useQuery<PriceStats>({
    queryKey: ['price-latest', selectedItem, ladder, mode],
    queryFn: () => api.priceLatest(selectedItem!, ladder, mode),
    enabled: !!selectedItem,
  });

  const filtered = search.trim()
    ? trackedItems.filter((i) => i.toLowerCase().includes(search.trim().toLowerCase()))
    : trackedItems;

  return (
    <div>
      <h1 className="text-xl font-bold" style={{ color: 'var(--gold)', marginBottom: '12px' }}>成交價格統計</h1>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
        {/* 物品清單 */}
        <div className="w-full sm:w-[200px] max-h-56 sm:max-h-[calc(100vh-100px)]" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' as const }}>
          <input
            placeholder="搜尋物品…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'var(--panel)', border: '1px solid #3a352d', color: 'var(--ink)', padding: '5px 8px', borderRadius: '2px', fontSize: '12px', outline: 'none', marginBottom: '6px', boxSizing: 'border-box' as const }}
          />
          <div style={{ overflowY: 'auto' as const, flex: 1 }}>
          {itemsLoading && <div style={{ color: 'var(--muted)', fontSize: '12px' }}>載入中…</div>}
          {filtered.map((item) => (
            <div key={item}
              onClick={() => setSelectedItem(item)}
              style={{ padding: '5px 8px', cursor: 'pointer', borderRadius: '2px', fontSize: '13px', marginBottom: '2px', background: selectedItem === item ? '#1a1712' : 'transparent', border: `1px solid ${selectedItem === item ? 'var(--gold)' : 'transparent'}`, color: selectedItem === item ? 'var(--gold)' : 'var(--muted)' }}>
              {item}
            </div>
          ))}
          </div>
        </div>

        {/* 統計面板 */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {!selectedItem && (
            <div style={{ color: '#6b665d', fontSize: '13px', paddingTop: '8px' }}>← 選擇物品查看成交統計</div>
          )}

          {selectedItem && (
            <>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
                <button style={ladder ? S.btnActive : S.btn} onClick={() => setLadder(true)}>Ladder</button>
                <button style={!ladder ? S.btnActive : S.btn} onClick={() => setLadder(false)}>Non-Ladder</button>
                <button style={mode === 'sc' ? S.btnActive : S.btn} onClick={() => setMode('sc')}>Softcore</button>
                <button style={mode === 'hc' ? S.btnActive : S.btn} onClick={() => setMode('hc')}>Hardcore</button>
              </div>

              {statsLoading && <div style={{ color: 'var(--muted)', fontSize: '12px' }}>載入中…</div>}
              {!statsLoading && !stats && <div style={{ color: 'var(--muted)', fontSize: '12px' }}>尚無資料</div>}
              {stats && (
                <div style={S.card}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
                    <span>樣本 <span style={{ color: 'var(--ink)' }}>{stats.price?.count ?? 0} 筆</span></span>
                    <span>成交區間 <span style={{ color: 'var(--ink)' }}>{tsToDate(stats.trade_window?.earliest)} – {tsToDate(stats.trade_window?.latest)}</span></span>
                    <span>更新 <span style={{ color: 'var(--ink)' }}>{tsToDate(stats.synced_at)}</span></span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9a7d42', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>常見成交價</div>
                  {stats.price?.top?.length ? stats.price.top.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid #191714' }}>
                      <span style={{ color: '#6b665d', fontSize: '11px', minWidth: '24px' }}>#{i + 1}</span>
                      <span style={{ color: '#ffa040', flex: 1, fontSize: '13px' }}>
                        {entry.items.map((it) => `${it.quantity > 1 ? it.quantity + '× ' : ''}${it.name}`).join(' + ')}
                      </span>
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{entry.freq} 次</span>
                    </div>
                  )) : <div style={{ color: 'var(--muted)', fontSize: '12px' }}>—</div>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
