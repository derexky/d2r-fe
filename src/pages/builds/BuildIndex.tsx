import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Build {
  id: number;
  class: string;
  name: string;
}

const CLASSES = [
  { value: 'barbarian', label: '野蠻人' },
  { value: 'amazon', label: '亞馬遜' },
  { value: 'sorceress', label: '法師' },
  { value: 'necromancer', label: '死靈法師' },
  { value: 'paladin', label: '聖騎士' },
  { value: 'druid', label: '德魯伊' },
  { value: 'assassin', label: '刺客' },
];

const CLASS_COLORS: Record<string, string> = {
  barbarian: '#808000',
  amazon: '#00c400',
  sorceress: '#6784ed',
  necromancer: '#c0c0c0',
  paladin: '#ffff00',
  druid: '#808000',
  assassin: '#ff4040',
};

export default function BuildIndex() {
  const { class: cls } = useParams<{ class: string }>();
  const navigate = useNavigate();
  const activeClass = cls || 'barbarian';
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getBuilds({ class: activeClass }).then((r) => {
      setBuilds(r);
      setLoading(false);
    });
  }, [activeClass]);

  const color = CLASS_COLORS[activeClass] || '#808000';

  return (
    <div>
      <h1 className="text-xl font-bold mb-3" style={{ color }}>
        職業攻略
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {CLASSES.map((c) => (
          <button
            key={c.value}
            onClick={() => navigate(`/builds/${c.value}`)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: activeClass === c.value ? CLASS_COLORS[c.value] : '#404040',
              color: activeClass === c.value ? CLASS_COLORS[c.value] : '#888',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-1 max-w-md">
          {builds.map((b) => (
            <Link
              key={b.id}
              to={`/builds/${b.class}/${b.id}`}
              className="block px-3 py-2 border text-sm hover:border-opacity-80 transition-colors"
              style={{ borderColor: '#303030', color }}
            >
              {b.name}
            </Link>
          ))}
          {builds.length === 0 && <p className="text-gray-500 text-sm">暫無攻略</p>}
        </div>
      )}
    </div>
  );
}
