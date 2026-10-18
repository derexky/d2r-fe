import { useQuery } from '@tanstack/react-query';
import { useParams, Link, Navigate } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Build {
  id: number;
  class: string;
  name: string;
  rating: number | null;
  description: string | null;
  test_info: string | null;
  source: string | null;
  has_detail: boolean;
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
  druid: '#c08040',
  assassin: '#ff4040',
  warlock: '#cc66ff',
};

export default function BuildIndex() {
  const { class: cls } = useParams<{ class: string }>();
  const activeClass = cls || 'barbarian';

  // ponytail: 全部流派一次抓（約百筆、只有卡片欄位），職業切換與數量都在前端算
  const { data: all = [], isLoading, isError } = useQuery<Build[]>({
    queryKey: ['builds'],
    queryFn: () => api.getBuilds(),
  });

  if (!CLASS_COLORS[activeClass]) return <Navigate to="/builds/barbarian" replace />;

  const builds = all.filter((b) => b.class === activeClass);

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">職業攻略</h1>

      <nav className="flex flex-wrap gap-2 mb-4">
        {CLASSES.map((c) => {
          const active = activeClass === c.value;
          const count = all.filter((b) => b.class === c.value).length;
          return (
            <Link
              key={c.value}
              to={`/builds/${c.value}`}
              aria-current={active ? 'page' : undefined}
              className="px-3 py-1 text-sm border transition-colors"
              style={{
                borderColor: active ? CLASS_COLORS[c.value] : '#3a352d',
                color: active ? CLASS_COLORS[c.value] : '#888',
              }}
            >
              {c.label}
              {count > 0 && <span className="ml-1 text-xs opacity-60">{count}</span>}
            </Link>
          );
        })}
      </nav>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <p className="text-red-400 text-sm">攻略載入失敗，請稍後再試</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {builds.map((b) => {
            const body = (
              <span className="flex flex-col gap-2 min-w-0">
                <small>
                  {b.source === 'build-journal' ? 'BUILD JOURNAL' : '舊版資料'}
                  {!b.has_detail && ' · 尚無內容'}
                </small>
                <strong>{b.name}</strong>
                {(b.description || b.test_info) && (
                  <span className="text-xs text-gray-400 line-clamp-2">{b.description || b.test_info}</span>
                )}
                {b.rating != null && (
                  <span className="stars">
                    {'★'.repeat(b.rating)}
                    <i>{'★'.repeat(Math.max(0, 5 - b.rating))}</i>
                  </span>
                )}
              </span>
            );
            return b.has_detail ? (
              <Link key={b.id} to={`/builds/${b.class}/${b.id}`} className="card">
                {body}
              </Link>
            ) : (
              <div key={b.id} className="card opacity-50 pointer-events-none">
                {body}
              </div>
            );
          })}
          {builds.length === 0 && <p className="text-gray-500 text-sm col-span-full">暫無攻略</p>}
        </div>
      )}
    </div>
  );
}
