import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Build {
  id: number;
  class: string;
  name: string;
  rating: number | null;
}

const CLASSES = [
  { value: 'barbarian', label: '野蠻人' },
  { value: 'amazon', label: '亞馬遜' },
  { value: 'sorceress', label: '法師' },
  { value: 'necromancer', label: '死靈法師' },
  { value: 'paladin', label: '聖騎士' },
  { value: 'druid', label: '德魯伊' },
  { value: 'assassin', label: '刺客' },
  { value: 'warlock', label: '術士' },
];

const CLASS_COLORS: Record<string, string> = {
  barbarian: '#808000',
  amazon: '#00c400',
  sorceress: '#6784ed',
  necromancer: '#c0c0c0',
  paladin: '#ffff00',
  druid: '#808000',
  assassin: '#ff4040',
  warlock: '#cc66ff',
};

export default function BuildIndex() {
  const { class: cls } = useParams<{ class: string }>();
  const navigate = useNavigate();
  const activeClass = cls || 'barbarian';

  const { data: builds = [], isLoading: loading } = useQuery<Build[]>({
    queryKey: ['builds', activeClass],
    queryFn: () => api.getBuilds({ class: activeClass }),
  });

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
              borderColor: activeClass === c.value ? CLASS_COLORS[c.value] : '#3a352d',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {builds.map((b) => (
            <Link
              key={b.id}
              to={`/builds/${b.class}/${b.id}`}
              className="block px-4 py-3 border transition-colors hover:border-yellow-600 hover:bg-[#1a1512]"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
            >
              <span className="block text-xs tracking-widest text-gray-500">
                {CLASSES.find((c) => c.value === b.class)?.label}
              </span>
              <span className="block mt-1 font-bold" style={{ color }}>{b.name}</span>
              {b.rating != null && (
                <span className="block mt-1 text-sm" style={{ color: 'var(--gold)' }}>
                  {'★'.repeat(b.rating)}
                  <span className="text-gray-600">{'★'.repeat(Math.max(0, 5 - b.rating))}</span>
                </span>
              )}
            </Link>
          ))}
          {builds.length === 0 && <p className="text-gray-500 text-sm col-span-full">暫無攻略</p>}
        </div>
      )}
    </div>
  );
}
