// d2r-fe/src/pages/trade/TradeList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api';

interface Trade {
  id: number;
  item_name: string;
  item_stats_raw: string | null;
  price: string;
  contact: string;
  category: string | null;
  created_at: string;
}

const FILTER_CHIPS = [
  { label: '全部', value: '' },
  { label: '戒指', value: 'rings' },
  { label: '護身符', value: 'amulets' },
  { label: '護符', value: 'charms' },
  { label: '頭部', value: 'helms' },
  { label: '盔甲', value: 'armors' },
  { label: '武器', value: 'weapons' },
  { label: '盾牌', value: 'shields' },
  { label: '其他', value: 'other' },
];

function truncate(text: string | null, max = 60): string {
  if (!text) return '';
  const single = text.replace(/\n/g, ' / ');
  return single.length > max ? single.slice(0, max) + '…' : single;
}

export default function TradeList() {
  const [category, setCategory] = useState('');
  const params = category ? { category } : undefined;

  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['trades', category],
    queryFn: () => api.getTrades(params),
  });

  const copyContact = (contact: string) => {
    navigator.clipboard.writeText(contact);
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
        <h1 className="text-xl font-bold" style={{ color: '#808000' }}>
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
            onClick={() => setCategory(c.value)}
            style={{
              background: category === c.value ? '#1a1400' : 'transparent',
              border: `1px solid ${category === c.value ? '#808000' : '#333'}`,
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

      {isLoading ? (
        <div style={{ color: '#555', fontSize: '13px' }}>載入中…</div>
      ) : trades.length === 0 ? (
        <div style={{ color: '#555', fontSize: '13px' }}>暫無掛單</div>
      ) : (
        <div>
          {trades.map((trade) => (
            <div
              key={trade.id}
              style={{
                border: '1px solid #606000',
                background: '#0d0d00',
                padding: '6px 10px',
                marginBottom: '3px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  color: '#808000',
                  fontWeight: 'bold',
                  width: '140px',
                  flexShrink: 0,
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {trade.item_name}
              </div>
              <div
                style={{
                  flex: 1,
                  color: '#6060ff',
                  fontSize: '11px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {truncate(trade.item_stats_raw)}
              </div>
              <div style={{ color: '#ff8c00', fontSize: '12px', flexShrink: 0 }}>
                {trade.price}
              </div>
              <button
                onClick={() => copyContact(trade.contact)}
                title={trade.contact}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#aaa',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                聯繫
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
