import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface BaseItem {
  id: number;
  item_id: string;
  name_zh: string;
  name_en: string | null;
  gid: string;
  category: string;
  grade: string;
  qlvl: number | null;
  max_sockets: number | null;
  image_path: string | null;
  attrs: string | null;
}

const GRADES = ['normal', 'exceptional', 'elite'] as const;
const GRADE_LABELS: Record<string, string> = {
  normal: '普通',
  exceptional: '進階',
  elite: '菁英',
};

const GID_LABELS: Record<string, string> = {
  helms: '頭盔', armors: '護甲', shields: '盾牌', 'pal-shields': '聖騎士盾牌',
  belts: '腰帶', boots: '靴子', gloves: '手套', swords: '刀劍',
  axes: '斧', polearms: '長柄武器', spears: '長矛', clubs: '短棒',
  puremaces: '釘鎚', hammers: '重槌', scepters: '權杖', staves: '法杖',
  orbs: '法珠', wands: '魔杖', katars: '拳刃', daggers: '匕首',
  bows: '弓', crossbows: '弩', javelins: '標槍', throwings: '投擲武器',
};

function AttrsDisplay({ attrsJson }: { attrsJson: string }) {
  let attrs: Record<string, string> = {};
  try { attrs = JSON.parse(attrsJson); } catch { return null; }

  return (
    <div className="text-xs leading-relaxed mt-1">
      {Object.entries(attrs).map(([k, v]) => (
        <div key={k} className="flex gap-2">
          <span style={{ color: '#888' }}>{k}:</span>
          <span style={{ color: '#ccc' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function BaseItemList() {
  const { gid } = useParams<{ gid: string }>();
  const [grade, setGrade] = useState<string>('normal');

  const { data: items = [], isLoading } = useQuery<BaseItem[]>({
    queryKey: ['base-items', gid, grade],
    queryFn: () => api.getBaseItems({ gid: gid!, grade }),
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--gold)' }}>
        基礎裝備 — {GID_LABELS[gid!] ?? gid}
      </h1>

      <div className="flex gap-2 mb-4">
        {GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: grade === g ? '#808000' : '#3a352d',
              color: grade === g ? '#808000' : '#888',
              backgroundColor: grade === g ? '#1a1400' : 'transparent',
            }}
          >
            {GRADE_LABELS[g]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="border p-3 flex gap-3"
              style={{ borderColor: '#3a352d' }}
            >
              {item.image_path && (
                <img
                  src={item.image_path}
                  alt={item.name_zh}
                  className="w-10 h-10 object-contain shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: '#c8b400' }}>
                  {item.name_zh}
                  {item.name_en && (
                    <span className="ml-2 text-xs font-normal" style={{ color: '#888' }}>
                      {item.name_en}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#666' }}>
                  qlvl {item.qlvl ?? '—'}
                  {item.max_sockets != null && item.max_sockets > 0 && (
                    <span className="ml-2">最大孔數 {item.max_sockets}</span>
                  )}
                </div>
                {item.attrs && <AttrsDisplay attrsJson={item.attrs} />}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">此分類暫無資料</p>
          )}
        </div>
      )}
    </div>
  );
}
