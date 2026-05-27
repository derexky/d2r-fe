import { useEffect, useState } from 'react';
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
  version: string;
  effects: string;
}

const SLOTS = [
  { value: 'weapon', label: '武器' },
  { value: 'armor', label: '盔甲' },
  { value: 'shield', label: '盾牌' },
  { value: 'helm', label: '頭盔' },
];

export default function RunewordList() {
  const { slot } = useParams<{ slot?: string }>();
  const [activeSlot, setActiveSlot] = useState(slot || 'weapon');
  const [words, setWords] = useState<Runeword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getRunewords({ slot: activeSlot }).then((r) => {
      setWords(r);
      setLoading(false);
    });
  }, [activeSlot]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-3" style={{ color: '#c0c0c0' }}>
        符文字
      </h1>

      <div className="flex gap-2 mb-4">
        {SLOTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setActiveSlot(s.value)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: activeSlot === s.value ? '#c0c0c0' : '#404040',
              color: activeSlot === s.value ? '#e0e0e0' : '#888',
              backgroundColor: activeSlot === s.value ? '#1a1a1a' : 'transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {words.map((rw) => {
            const runes: string[] = JSON.parse(rw.runes || '[]');
            const effects: string[] = JSON.parse(rw.effects || '[]');
            return (
              <div key={rw.id} className="border p-3" style={{ borderColor: '#404040' }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold" style={{ color: '#c0c0c0' }}>
                    {rw.name_zh}
                  </span>
                  {rw.name_en && <span className="text-xs text-gray-500">{rw.name_en}</span>}
                  <span className="text-xs text-gray-500">{rw.socket_count}孔 · {rw.version}</span>
                </div>
                <div className="text-sm mb-2" style={{ color: '#ff8000' }}>
                  {runes.join(' + ')}
                </div>
                <div className="text-sm space-y-0.5">
                  {effects.map((e, i) => (
                    <div key={i} style={{ color: '#00ffff' }}>{e}</div>
                  ))}
                </div>
              </div>
            );
          })}
          {words.length === 0 && <p className="text-gray-500 text-sm">暫無資料</p>}
        </div>
      )}
    </div>
  );
}
