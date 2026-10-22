import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import BackButton from '../../components/ui/BackButton';

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

// Price stats of one tracked item, opened from the list on TraderiePage
export default function TraderieItem() {
  const item = useParams<{ item: string }>().item!;
  const [ladder, setLadder] = useState(true);
  const [mode, setMode] = useState<Mode>('sc');

  // same query as the list page, so the Chinese name usually comes from cache
  const { data: groups = [] } = useQuery({
    queryKey: ['price-tracked-groups'],
    queryFn: () => api.priceTrackedGroups(),
    staleTime: Infinity,
  });
  const zh = groups.find((g) => g.zh?.[item])?.zh?.[item];

  const { data: stats, isFetching: statsLoading } = useQuery<PriceStats>({
    queryKey: ['price-latest', item, ladder, mode],
    queryFn: () => api.priceLatest(item, ladder, mode),
  });

  return (
    <div style={{ maxWidth: '760px' }}>
      <BackButton fallback="/traderie" label="返回物品列表" />
      <h1 className="text-xl font-bold" style={{ marginBottom: zh ? '2px' : '12px' }}>{zh ?? item}</h1>
      {zh && <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '12px' }}>{item}</div>}
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
                {entry.items.map((it) => `${it.quantity !== 1 ? it.quantity + '× ' : ''}${it.name}`).join(' + ')}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{entry.freq} 次</span>
            </div>
          )) : <div style={{ color: 'var(--muted)', fontSize: '12px' }}>—</div>}
        </div>
      )}
    </div>
  );
}
