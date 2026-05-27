import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface GearItem {
  slot: string;
  item_name_zh: string;
  socket: string;
  props: string;
}

interface Build {
  id: number;
  class: string;
  name: string;
  test_info: string | null;
  stats: string | null;
  skills: string | null;
  gear: string | null;
  video_url: string | null;
  save_url: string | null;
}

export default function BuildDetail() {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuild(Number(id)).then((r) => {
      setBuild(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!build) return <p className="text-red-400">找不到攻略</p>;

  const statsObj: Record<string, string> = safeJson<Record<string, string>>(build.stats) ?? {};
  const stats: string[][] = Object.entries(statsObj);
  const skillsRaw: string[] = safeJson<string[]>(build.skills) ?? [];
  const skills: string[][] = skillsRaw.map((s) => [s]);
  const gearRaw: GearItem[] = safeJson<GearItem[]>(build.gear) ?? [];
  const gear: string[][] = gearRaw.map((g) => [g.slot, g.item_name_zh, g.socket, g.props]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-2" style={{ color: '#808000' }}>
        {build.name}
      </h1>
      {build.test_info && (
        <p className="text-sm text-gray-400 mb-4">{build.test_info}</p>
      )}

      {stats.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-300 mb-2">屬性 / 技能配點</h2>
          <DataTable rows={stats} />
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-300 mb-2">技能</h2>
          <DataTable rows={skills} />
        </section>
      )}

      {gear.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-300 mb-2">裝備</h2>
          <DataTable rows={gear} />
        </section>
      )}

      <div className="flex gap-3 mt-4">
        {build.video_url && (
          <a
            href={build.video_url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 text-sm border hover:border-yellow-600 transition-colors"
            style={{ borderColor: '#404040', color: '#808000' }}
          >
            觀看影片
          </a>
        )}
        {build.save_url && (
          <a
            href={build.save_url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 text-sm border hover:border-gray-400 transition-colors"
            style={{ borderColor: '#404040', color: '#c0c0c0' }}
          >
            下載存檔
          </a>
        )}
      </div>
    </div>
  );
}

function safeJson<T>(val: string | null): T | null {
  if (!val) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

function DataTable({ rows }: { rows: string[][] }) {
  if (!rows.length) return null;
  return (
    <table className="text-sm border-collapse w-full">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #222' }}>
            {row.map((cell, j) => (
              <td key={j} className="py-1 pr-4" style={{ color: '#00ffff' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
