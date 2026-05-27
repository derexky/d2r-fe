import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Announcement {
  id: number;
  date: string;
  content: string;
}

export default function Home() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements().then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
        公告欄
      </h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid #404040' }}>
            <th className="text-left py-1 pr-4 w-28" style={{ color: '#c0c0c0' }}>日期</th>
            <th className="text-left py-1" style={{ color: '#c0c0c0' }}>內容</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id} style={{ borderBottom: '1px solid #222' }}>
              <td className="py-1 pr-4 text-gray-400 whitespace-nowrap">{a.date}</td>
              <td className="py-1">{a.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
