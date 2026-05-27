import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import StatList from '../../components/ui/StatList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CLASSES = [
  { value: 'barbarian', label: '野蠻人' },
  { value: 'amazon', label: '亞馬遜' },
  { value: 'assassin', label: '刺客' },
  { value: 'druid', label: '德魯伊' },
  { value: 'necromancer', label: '死靈法師' },
  { value: 'paladin', label: '聖騎士' },
  { value: 'sorceress', label: '法師' },
];

interface Item {
  id: number;
  name_zh: string;
  name_en: string | null;
  category: string;
  tier: string;
  image_path: string | null;
  base_type_zh: string | null;
  level_req: number | null;
  stats: string | null;
}

export default function ClassItems() {
  const { class: cls } = useParams<{ class: string }>();
  const navigate = useNavigate();
  const activeClass = cls || 'barbarian';
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getItems({ class: activeClass }).then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, [activeClass]);

  const classLabel = CLASSES.find((c) => c.value === activeClass)?.label ?? activeClass;

  return (
    <div>
      <h1 className="text-xl font-bold mb-3" style={{ color: '#808000' }}>
        職業專屬裝備
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {CLASSES.map((c) => (
          <button
            key={c.value}
            onClick={() => navigate(`/items/class/${c.value}`)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: activeClass === c.value ? '#808000' : '#404040',
              color: activeClass === c.value ? '#808000' : '#888',
              backgroundColor: activeClass === c.value ? '#1a1400' : 'transparent',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <h2 className="text-sm text-gray-400 mb-3">{classLabel}</h2>
      {loading ? <LoadingSpinner /> : <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border p-3" style={{ borderColor: '#606000' }}>
            <div className="flex items-start gap-3">
              {item.image_path && (
                <img
                  src={item.image_path}
                  alt={item.name_zh}
                  className="w-12 h-12 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="flex-1">
                <div className="font-bold" style={{ color: '#808000' }}>
                  {item.name_zh}
                  {item.name_en && <span className="ml-2 text-xs text-gray-400">{item.name_en}</span>}
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
        {items.length === 0 && <p className="text-gray-500 text-sm">暫無資料</p>}
      </div>}
    </div>
  );
}
