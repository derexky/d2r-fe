import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import StatList from '../../components/ui/StatList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Item {
  id: number;
  name_zh: string;
  name_en: string | null;
  category: string;
  tier: string;
  image_path: string | null;
  base_type_zh: string | null;
  base_type_en: string | null;
  level_req: number | null;
  stats: string | null;
}

const TIERS = ['normal', 'exceptional', 'elite'];
const TIER_LABELS: Record<string, string> = {
  normal: '普通',
  exceptional: '精英',
  elite: '頂級',
};

export default function UniqueList() {
  const { category } = useParams<{ category: string }>();
  const [tier, setTier] = useState('normal');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getItems({ category: category!, tier }).then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, [category, tier]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-3" style={{ color: '#808000' }}>
        獨特裝備 — {category}
      </h1>

      <div className="flex gap-2 mb-4">
        {TIERS.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: tier === t ? '#808000' : '#404040',
              color: tier === t ? '#808000' : '#888',
              backgroundColor: tier === t ? '#1a1400' : 'transparent',
            }}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border p-3"
              style={{ borderColor: '#606000' }}
            >
              <div className="flex items-start gap-3">
                {item.image_path && (
                  <img
                    src={item.image_path}
                    alt={item.name_zh}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold" style={{ color: '#808000' }}>
                    {item.name_zh}
                    {item.name_en && (
                      <span className="ml-2 text-xs text-gray-400">{item.name_en}</span>
                    )}
                  </div>
                  {item.base_type_zh && (
                    <div className="text-xs text-gray-400">
                      {item.base_type_zh}
                      {item.level_req != null && ` · 需求等級: ${item.level_req}`}
                    </div>
                  )}
                  {item.stats && <StatList stats={item.stats} />}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-sm">此分類暫無資料</p>
          )}
        </div>
      )}
    </div>
  );
}
