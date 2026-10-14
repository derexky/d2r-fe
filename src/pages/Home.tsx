import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const QUICK_LINKS = [
  { to: '/items/unique', mark: 'U', tag: 'ITEMS', label: '獨特裝備' },
  { to: '/runewords', mark: 'R', tag: 'RUNEWORDS', label: '符文組' },
  { to: '/builds', mark: 'B', tag: 'BUILDS', label: '職業攻略' },
  { to: '/breakpoints', mark: 'F', tag: 'MECHANICS', label: '攻速斷點表' },
  { to: '/cube', mark: 'C', tag: 'HORADRIC CUBE', label: '方塊合成' },
  { to: '/trade', mark: 'T', tag: 'MARKET', label: '交易市集' },
];

interface Announcement {
  id: number;
  date: string;
  content: string;
}

export default function Home() {
  const { data: items = [], isLoading: loading } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: () => api.getAnnouncements(),
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <section className="hero">
        <p className="eyebrow">DIABLO II : RESURRECTED</p>
        <h1>易牙居 <em>資料庫</em></h1>
        <p className="lead">裝備、符文組、職業攻略與遊戲機制，一站查齊。</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {QUICK_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="card">
            <span className="mark"><span>{l.mark}</span></span>
            <span className="flex flex-col gap-2">
              <small>{l.tag}</small>
              <strong>{l.label}</strong>
            </span>
          </Link>
        ))}
      </div>

      <p className="eyebrow mb-2">ANNOUNCEMENTS</p>
      <h2 className="text-3xl mb-4" style={{ color: '#e8e0d4' }}>公告欄</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #3a352d' }}>
              <th className="text-left py-1 pr-4 w-28" style={{ color: '#c0c0c0' }}>日期</th>
              <th className="text-left py-1" style={{ color: '#c0c0c0' }}>內容</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #24211c' }}>
                <td className="py-1 pr-4 text-gray-400 whitespace-nowrap">{a.date}</td>
                <td className="py-1">{a.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
