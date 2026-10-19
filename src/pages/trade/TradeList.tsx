// d2r-fe/src/pages/trade/TradeList.tsx
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { signIn, useUser } from '../../auth';

interface Trade {
  id: number;
  item_name: string;
  item_stats_raw: string | null;
  price: string;
  contact?: string; // only sent to signed-in users
  category: string | null;
  created_at: string;
  mine: boolean;
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
  { label: '手套', value: 'gloves' },
  { label: '腰帶', value: 'belts' },
  { label: '靴類', value: 'boots' },
  { label: '其他', value: 'other' },
];

function truncate(text: string | null, max = 60): string {
  if (!text) return '';
  const single = text.replace(/\n/g, ' / ');
  return single.length > max ? single.slice(0, max) + '…' : single;
}

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
  const params = category ? { category } : undefined;
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    // uid in the key refetches on sign-in/out, since contacts and "mine" depend on it
    queryKey: ['trades', category, user?.uid ?? null],
    queryFn: () => api.getTrades(params),
    enabled: user !== undefined,
  });

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
            onClick={() => setCategory(c.value)}
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

      {isLoading || user === undefined ? (
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
              {trade.contact ? (
                <button
                  onClick={() => copyContact(trade)}
                  title={trade.contact}
                  style={actionStyle}
                >
                  {copiedId === trade.id ? '已複製' : '聯繫'}
                </button>
              ) : (
                <button onClick={signIn} style={actionStyle}>
                  登入查看
                </button>
              )}
              {trade.mine && (
                <button onClick={() => takeDown(trade)} style={actionStyle}>
                  下架
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
