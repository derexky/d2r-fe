import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import StatList from '../../components/ui/StatList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface SetMember {
  id: number;
  item_name_zh: string;
  item_name_en: string | null;
  slot: string;
  stats: string | null;
}

interface SetBonus {
  id: number;
  pieces_required: string;
  effects: string; // JSON: string[]
}

interface ItemSet {
  id: number;
  name_zh: string;
  name_en: string | null;
  members: SetMember[];
  bonuses: SetBonus[];
}

function safeParseJson<T>(val: string | null): T[] {
  if (!val) return [];
  try { return JSON.parse(val) as T[]; } catch { return []; }
}

export default function SetDetail() {
  const { id } = useParams<{ id: string }>();
  const [set, setSet] = useState<ItemSet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSet(Number(id)).then((r) => {
      setSet(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!set) return <p className="text-red-400">找不到套裝</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#00c400' }}>
        {set.name_zh}
        {set.name_en && <span className="ml-3 text-sm text-gray-400">{set.name_en}</span>}
      </h1>

      <section className="mb-6">
        <h2 className="text-sm font-bold mb-2 text-gray-300">套裝成員</h2>
        <div className="space-y-3">
          {set.members.map((m) => (
            <div key={m.id} className="border p-3" style={{ borderColor: '#1a3a1a' }}>
              <div className="font-semibold" style={{ color: '#00c400' }}>
                {m.item_name_zh}
                {m.item_name_en && <span className="ml-2 text-xs text-gray-400">{m.item_name_en}</span>}
                <span className="ml-2 text-xs text-gray-500">[{m.slot}]</span>
              </div>
              {m.stats && <StatList stats={m.stats} />}
            </div>
          ))}
        </div>
      </section>

      {set.bonuses.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-2 text-gray-300">套裝加成</h2>
          <div className="space-y-2">
            {set.bonuses.map((b) => {
              const effects: string[] = safeParseJson(b.effects);
              return (
                <div key={b.id} className="text-sm">
                  <div className="text-gray-400 mb-0.5">{b.pieces_required}:</div>
                  {effects.map((e, i) => (
                    <div key={i} style={{ color: '#00c400' }}>{e}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
