import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface GearItem {
  slot: string;
  item_name_zh: string;
  socket: string;
  props: string;
}

interface MercGear {
  slot: string;
  item_name_zh: string;
  base: string;
  quality: string;
  stats: { text: string; important: boolean }[];
}

interface Merc {
  gear: MercGear[];
  support: string[];
}

interface Guide {
  logic?: string;
  field?: string;
  sections?: { key: string; text: string }[];
  skills?: { tree: string; skills: { label: string; detail: string }[] }[];
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
  guide_url: string | null;
  description: string | null;
  merc: string | null;
  guide: string | null;
}

export default function BuildDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: build, isLoading: loading } = useQuery<Build>({
    queryKey: ['build', id],
    queryFn: () => api.getBuild(Number(id)),
  });

  if (loading) return <LoadingSpinner />;
  if (!build) return <p className="text-red-400">找不到攻略</p>;

  const statsObj: Record<string, string> = safeJson<Record<string, string>>(build.stats) ?? {};
  const stats: string[][] = Object.entries(statsObj);
  const skillsRaw: string[] = safeJson<string[]>(build.skills) ?? [];
  const skills: string[][] = skillsRaw.map((s) => [s]);
  const gearRaw: GearItem[] = safeJson<GearItem[]>(build.gear) ?? [];
  const gear: string[][] = gearRaw.map((g) => [g.slot, g.item_name_zh, g.socket, g.props]);
  const merc = safeJson<Merc>(build.merc);
  const guide = safeJson<Guide>(build.guide);
  const articles = guide
    ? [
        { label: '配裝思路', text: guide.logic },
        { label: '實戰手冊', text: guide.field },
        ...(guide.sections ?? []).map((x) => ({ label: SECTION_LABELS[x.key], text: x.text })),
      ].filter((a): a is { label: string; text: string } => !!a.text)
    : [];

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-2">
        {build.name}
      </h1>
      {build.description && (
        <p className="text-sm text-gray-300 mb-2">{build.description}</p>
      )}
      {build.test_info && (
        <p className="text-sm text-gray-400 mb-4">{build.test_info}</p>
      )}
      {build.guide_url && (
        <p
          className="text-sm mb-6 px-3 py-2 border-l-2 break-all"
          style={{ borderColor: 'var(--red)', backgroundColor: '#201511' }}
        >
          <span className="text-gray-500">資料來源：</span>
          <a
            href={build.guide_url}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-300"
            style={{ color: 'var(--gold)' }}
          >
            {build.guide_url}
          </a>
        </p>
      )}

      {!stats.length && !skills.length && !gear.length && !merc && !guide && (
        <p className="text-sm text-gray-500 mb-6">此流派尚無詳細攻略。</p>
      )}

      {stats.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>屬性 / 技能配點</h2>
          <DataTable rows={stats} />
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>技能</h2>
          <DataTable rows={skills} />
        </section>
      )}

      {gear.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>裝備</h2>
          <DataTable rows={gear} />
        </section>
      )}

      {merc && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>傭兵</h2>
          {merc.support.map((t, i) => (
            <p key={i} className="text-sm text-gray-300 whitespace-pre-line mb-3">{t}</p>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {merc.gear.map((g, i) => (
              <div key={i} className="border px-3 py-2 text-sm min-w-0" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}>
                <div className="text-xs text-gray-500">{g.slot}</div>
                <div className={`font-bold text-${g.quality}`}>{g.item_name_zh}</div>
                <div className="text-xs text-gray-500 mb-1 break-words">{g.base}</div>
                {g.stats.map((st, j) => (
                  <div key={j} style={{ color: st.important ? 'var(--color-stat)' : undefined }} className={st.important ? '' : 'text-gray-400'}>
                    {st.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>攻略</h2>
          <ArticleTabs articles={articles} />
        </section>
      )}

      {guide?.skills && guide.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold mb-2 tracking-widest" style={{ color: 'var(--gold)' }}>技能說明</h2>
          {guide.skills.map((tree) => (
            <div key={tree.tree} className="mb-3">
              <div className="text-sm text-gray-400 mb-1">{tree.tree}</div>
              {tree.skills.map((sk) => (
                <details key={sk.label} className="border-b text-sm" style={{ borderColor: 'var(--line)' }}>
                  <summary className="cursor-pointer py-1 text-gray-300 hover:text-yellow-300">{sk.label}</summary>
                  <p className="whitespace-pre-line text-gray-400 pb-2 pl-4">{sk.detail}</p>
                </details>
              ))}
            </div>
          ))}
        </section>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        {build.video_url && (
          <a
            href={build.video_url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 text-sm border hover:border-yellow-600 transition-colors"
            style={{ borderColor: '#3a352d', color: '#808000' }}
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
            style={{ borderColor: '#3a352d', color: '#c0c0c0' }}
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

// 爬回來的文章第一段是「英文眉標\n中文標題\n\n導語」，拆出來當段落標頭
function parseArticle(text: string) {
  const [head, ...rest] = text.split('\n\n');
  const [eyebrow, title = '', ...headRest] = head.split('\n');
  return { eyebrow, title, body: [headRest.join('\n'), ...rest].filter(Boolean).join('\n\n') };
}

const SECTION_LABELS: Record<string, string> = {
  iceGuideOverview: '角色定位',
  iceGuideReading: '配裝判讀',
  iceGuideBoundaries: '實戰邊界',
};

function ArticleTabs({ articles }: { articles: { label?: string; text: string }[] }) {
  const [active, setActive] = useState(0);
  const parsed = articles.map((a) => ({ label: a.label, ...parseArticle(a.text) }));
  const current = parsed[Math.min(active, parsed.length - 1)];
  return (
    <div>
      <div className="flex overflow-x-auto border-b mb-3" style={{ borderColor: 'var(--line)' }}>
        {parsed.map((a, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
              i === active ? 'text-yellow-300 font-bold' : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
            style={i === active ? { borderColor: 'var(--red)' } : undefined}
          >
            {a.label || a.eyebrow}
          </button>
        ))}
      </div>
      <Article {...current} />
    </div>
  );
}

function Article({ eyebrow, title, body }: ReturnType<typeof parseArticle>) {
  return (
    <article className="mb-4 pl-3 border-l-2" style={{ borderColor: 'var(--red)' }}>
      <div className="text-xs font-bold tracking-widest" style={{ color: 'var(--gold)' }}>{eyebrow}</div>
      {title && <h3 className="text-base font-bold text-gray-200 mb-1" style={{ fontFamily: "Georgia, 'Noto Serif TC', serif" }}>{title}</h3>}
      <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{body}</p>
    </article>
  );
}

function DataTable({ rows }: { rows: string[][] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="text-sm border-collapse w-full">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #24211c' }}>
              {row.map((cell, j) => (
                <td key={j} className="py-1 pr-4" style={{ color: '#00ffff' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
