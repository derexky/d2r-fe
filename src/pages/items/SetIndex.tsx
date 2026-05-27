import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ItemSet {
  id: number;
  name_zh: string;
  name_en: string | null;
}

export default function SetIndex() {
  const [sets, setSets] = useState<ItemSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSets().then((r) => {
      setSets(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#00c400' }}>
        成套裝備
      </h1>
      <div className="space-y-1 max-w-lg">
        {sets.map((s) => (
          <Link
            key={s.id}
            to={`/items/sets/${s.id}`}
            className="flex items-center gap-2 px-3 py-2 border hover:border-green-600 transition-colors"
            style={{ borderColor: '#1a3a1a' }}
          >
            <span style={{ color: '#00c400' }}>{s.name_zh}</span>
            {s.name_en && (
              <span className="text-xs text-gray-500">{s.name_en}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
