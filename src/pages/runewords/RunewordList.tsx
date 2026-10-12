import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Runeword {
  id: number;
  name_zh: string;
  name_en: string | null;
  slot: string;
  socket_count: number;
  runes: string;
  effects: string;
  isOnlyLadder: boolean;
}

const RUNE_LIST = [
  'El','Eld','Tir','Nef','Eth','Ith','Tal','Ral','Ort','Thul',
  'Amn','Sol','Shael','Dol','Hel','Io','Lum','Ko','Fal','Lem',
  'Pul','Um','Mal','Ist','Gul','Vex','Ohm','Lo','Sur','Ber','Jah','Cham','Zod',
];

const SLOTS = [
  { value: 'weapon', label: '武器' },
  { value: 'armor', label: '盔甲' },
  { value: 'shield', label: '盾牌' },
  { value: 'helm', label: '頭盔' },
];

const SOCKETS = [2, 3, 4, 5, 6];

type VersionFilter = 'all' | 'nonladder' | 'ladder';

const VERSION_OPTIONS: { value: VersionFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'nonladder', label: '非梯子' },
  { value: 'ladder', label: '梯子限定' },
];

export default function RunewordList() {
  const { slot } = useParams<{ slot?: string }>();
  const [activeSlot, setActiveSlot] = useState(slot || 'weapon');
  const [socketFilter, setSocketFilter] = useState<number | null>(null);
  const [versionFilter, setVersionFilter] = useState<VersionFilter>('all');
  const [runeFilter, setRuneFilter] = useState<string | null>(null);

  const { data: words = [], isLoading } = useQuery<Runeword[]>({
    queryKey: ['runewords', activeSlot],
    queryFn: () => api.getRunewords({ slot: activeSlot }),
  });

  const filtered = useMemo(() => {
    return words.filter((rw) => {
      if (socketFilter !== null && rw.socket_count !== socketFilter) return false;
      if (versionFilter === 'ladder' && !rw.isOnlyLadder) return false;
      if (versionFilter === 'nonladder' && rw.isOnlyLadder) return false;
      if (runeFilter !== null) {
        const runes: string[] = JSON.parse(rw.runes || '[]');
        if (!runes.includes(runeFilter)) return false;
      }
      return true;
    });
  }, [words, socketFilter, versionFilter, runeFilter]);

  const filterBtn = (active: boolean) => ({
    borderColor: active ? '#888' : '#404040',
    color: active ? '#e0e0e0' : '#666',
    backgroundColor: active ? '#1a1a1a' : 'transparent',
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#c0c0c0' }}>
        符文字
      </h1>

      {/* Slot */}
      <div className="flex gap-2 mb-3">
        {SLOTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setActiveSlot(s.value)}
            className="px-3 py-1 text-sm border transition-colors"
            style={filterBtn(activeSlot === s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Socket count */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className="text-xs w-12 shrink-0" style={{ color: '#666' }}>插槽</span>
        <button
          onClick={() => setSocketFilter(null)}
          className="px-2 py-0.5 text-xs border transition-colors"
          style={filterBtn(socketFilter === null)}
        >
          全部
        </button>
        {SOCKETS.map((s) => (
          <button
            key={s}
            onClick={() => setSocketFilter(socketFilter === s ? null : s)}
            className="px-2 py-0.5 text-xs border transition-colors"
            style={filterBtn(socketFilter === s)}
          >
            {s}孔
          </button>
        ))}
      </div>

      {/* Ladder */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className="text-xs w-12 shrink-0" style={{ color: '#666' }}>版本</span>
        {VERSION_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setVersionFilter(value)}
            className="px-2 py-0.5 text-xs border transition-colors"
            style={filterBtn(versionFilter === value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rune filter */}
      <div className="flex items-start gap-1.5 mb-4 flex-wrap">
        <span className="text-xs w-12 shrink-0 pt-0.5" style={{ color: '#666' }}>含符文</span>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setRuneFilter(null)}
            className="px-2 py-0.5 text-xs border transition-colors"
            style={filterBtn(runeFilter === null)}
          >
            全部
          </button>
          {RUNE_LIST.map((rune) => (
            <button
              key={rune}
              onClick={() => setRuneFilter(runeFilter === rune ? null : rune)}
              className="px-1.5 py-0.5 text-xs border transition-colors"
              style={filterBtn(runeFilter === rune)}
            >
              {rune}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {filtered.map((rw) => {
            const runes: string[] = JSON.parse(rw.runes || '[]');
            const effects: string[] = JSON.parse(rw.effects || '[]');
            return (
              <div key={rw.id} className="border p-3" style={{ borderColor: '#404040' }}>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-bold" style={{ color: '#c0c0c0' }}>
                    {rw.name_zh}
                  </span>
                  {rw.name_en && (
                    <span className="text-xs" style={{ color: '#555' }}>{rw.name_en}</span>
                  )}
                  <span
                    className="text-xs px-1.5 py-0.5 border"
                    style={{ borderColor: '#404040', color: '#888' }}
                  >
                    {rw.socket_count}孔
                  </span>
                  {rw.isOnlyLadder && (
                    <span
                      className="text-xs px-1.5 py-0.5 border"
                      style={{ borderColor: '#804000', color: '#ff8000' }}
                    >
                      梯子
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {runes.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5 border"
                      style={{ borderColor: '#804000', color: '#ff8000' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="text-sm space-y-0.5">
                  {effects.map((e, i) => (
                    <div key={i} style={{ color: '#00ffff' }}>{e}</div>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm" style={{ color: '#666' }}>暫無符合條件的符文字</p>
          )}
        </div>
      )}
    </div>
  );
}
