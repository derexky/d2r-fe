// d2r-fe/src/pages/trade/TradeList.tsx
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { signIn, useUser } from '../../auth';
import { TRADE_CATEGORIES } from '../items/itemCategories';
import { BASE_FILTERS, categoryOptions, loadTradeItems, type BaseFilter } from './tradeItems';

interface Trade {
  id: number;
  item_name: string;
  item_stats_raw: string | null;
  price: string;
  contact?: string; // only sent to signed-in users
  category: string | null;
  item_ref: string | null;
  created_at: string;
  mine: boolean;
}

const FILTER_CHIPS = [{ label: '全部', value: '' }, ...TRADE_CATEGORIES];

const ellipsis: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const selectStyle: React.CSSProperties = {
  background: '#191714',
  border: '1px solid #302c26',
  color: '#aaa',
  padding: '4px 8px',
  borderRadius: '2px',
  fontSize: '12px',
};

const actionStyle: React.CSSProperties = {
  background: '#191714',
  border: '1px solid #302c26',
  color: '#aaa',
  padding: '2px 8px',
  borderRadius: '2px',
  fontSize: '11px',
  cursor: 'pointer',
  flexShrink: 0,
};

export default function TradeList() {
  const [category, setCategory] = useState('');
  const [itemRef, setItemRef] = useState('');
  const params = {
    ...(category && { category }),
    ...(itemRef && { item_ref: itemRef }),
  };

  const { data: tradeItems = [] } = useQuery({
    queryKey: ['trade-items'],
    queryFn: loadTradeItems,
    staleTime: Infinity,
  });
  const [baseFilter, setBaseFilter] = useState<BaseFilter>('');
  const { options: categoryItems, hasBoth } = useMemo(
    () => categoryOptions(tradeItems, category, baseFilter),
    [tradeItems, category, baseFilter],
  );
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    // uid in the key refetches on sign-in/out, since contacts and "mine" depend on it
    queryKey: ['trades', category, itemRef, user?.uid ?? null],
    queryFn: () => api.getTrades(params),
    enabled: user !== undefined,
  });

  // look the trade up in the latest list, so signing in from the dialog reveals the contact
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = trades.find((t) => t.id === selectedId);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyContact = (trade: Trade) => {
    navigator.clipboard.writeText(trade.contact!).then(
      () => {
        setCopiedId(trade.id);
        setTimeout(() => setCopiedId((id) => (id === trade.id ? null : id)), 1500);
      },
      () => window.prompt('複製聯絡方式：', trade.contact),
    );
  };

  const takeDown = async (trade: Trade) => {
    if (!window.confirm(`確定下架「${trade.item_name}」？`)) return;
    try {
      await api.deleteTrade(trade.id);
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined;
      window.alert(status === 401 ? '請重新登入' : status === 404 ? '掛單不存在' : '下架失敗');
    }
    setSelectedId(null);
    queryClient.invalidateQueries({ queryKey: ['trades'] });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h1 className="text-xl font-bold">
          交易市集
        </h1>
        <Link
          to="/trade/new"
          style={{
            background: '#1a1400',
            border: '1px solid #808000',
            color: '#808000',
            padding: '4px 14px',
            borderRadius: '2px',
            fontSize: '12px',
            textDecoration: 'none',
          }}
        >
          + 掛單
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {FILTER_CHIPS.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setCategory(c.value);
              setItemRef('');
              setBaseFilter('');
            }}
            style={{
              background: category === c.value ? '#1a1400' : 'transparent',
              border: `1px solid ${category === c.value ? '#808000' : '#302c26'}`,
              color: category === c.value ? '#808000' : '#666',
              padding: '2px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {categoryItems.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {hasBoth && (
            <select
              value={baseFilter}
              onChange={(e) => {
                setBaseFilter(e.target.value as BaseFilter);
                setItemRef('');
              }}
              aria-label="依是否為底材篩選"
              style={selectStyle}
            >
              {BASE_FILTERS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          )}
          <select
            value={itemRef}
            onChange={(e) => setItemRef(e.target.value)}
            aria-label="依物品篩選"
            style={{ ...selectStyle, maxWidth: '100%' }}
          >
            <option value="">全部物品</option>
            {categoryItems.map((t) => (
              <option key={t.ref} value={t.ref}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading || user === undefined ? (
        <div style={{ color: '#555', fontSize: '13px' }}>載入中…</div>
      ) : trades.length === 0 ? (
        <div style={{ color: '#555', fontSize: '13px' }}>暫無掛單</div>
      ) : (
        <div>
          {trades.map((trade) => (
            <button
              key={trade.id}
              onClick={() => setSelectedId(trade.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: '1px solid #606000',
                background: '#0d0d00',
                padding: '6px 10px',
                marginBottom: '3px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              <span style={{ ...ellipsis, color: '#808000', fontWeight: 'bold', width: '140px', flexShrink: 0, fontSize: '13px' }}>
                {trade.item_name}
              </span>
              <span style={{ ...ellipsis, flex: 1, color: '#6060ff', fontSize: '11px' }}>
                {trade.item_stats_raw?.replace(/\n/g, ' / ')}
              </span>
              <span style={{ color: '#ff8c00', fontSize: '12px', flexShrink: 0 }}>{trade.price}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <dialog
          // showModal gives the backdrop, focus trap and Esc-to-close
          ref={(d) => {
            if (d && !d.open) d.showModal();
          }}
          onClose={() => setSelectedId(null)}
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
          style={{
            margin: 'auto', // Tailwind's reset zeroes the margin that centers a modal dialog
            border: '1px solid #808000',
            background: '#0d0d00',
            color: 'inherit',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(128, 128, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            padding: '12px 14px',
            borderRadius: '2px',
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(440px, calc(100vh - 32px))',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {selected.item_ref ? (
                <button
                  onClick={() => {
                    setCategory(selected.category ?? '');
                    setBaseFilter('');
                    setItemRef(selected.item_ref!);
                    setSelectedId(null);
                  }}
                  title="只看這個物品的掛單"
                  style={{ color: '#808000', fontWeight: 'bold', fontSize: '14px', background: 'none', border: 'none', padding: 0, textAlign: 'left', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {selected.item_name}
                </button>
              ) : (
                <span style={{ color: '#808000', fontWeight: 'bold', fontSize: '14px' }}>{selected.item_name}</span>
              )}
              <span style={{ color: '#ff8c00', fontSize: '13px', flexShrink: 0 }}>{selected.price}</span>
            </div>
            {selected.item_stats_raw && (
              <div style={{ color: '#6060ff', fontSize: '12px', whiteSpace: 'pre-line', flex: 1, minHeight: 0, overflowY: 'auto' }}>{selected.item_stats_raw}</div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderTop: '1px solid #302c26',
                paddingTop: '8px',
                marginTop: 'auto',
                fontSize: '12px',
              }}
            >
              {selected.contact ? (
                <>
                  <span style={{ color: '#ccc', flex: 1, wordBreak: 'break-all' }}>{selected.contact}</span>
                  <button onClick={() => copyContact(selected)} style={actionStyle}>
                    {copiedId === selected.id ? '已複製' : '複製'}
                  </button>
                </>
              ) : (
                <button onClick={signIn} style={{ ...actionStyle, marginRight: 'auto' }}>
                  登入查看聯絡方式
                </button>
              )}
              {selected.mine && (
                <button onClick={() => takeDown(selected)} style={actionStyle}>
                  下架
                </button>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
