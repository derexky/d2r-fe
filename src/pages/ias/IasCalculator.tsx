import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MERC_LABELS: Record<string, string> = {
  act1: '第一幕傭兵',
  act2: '第二幕傭兵',
  act3: '第三幕傭兵',
  act5: '第五幕傭兵',
};

interface CalcResult {
  frames: string;
  ias_required: string;
  next_breakpoint: { ias_required: string; frames: string } | null;
}

export default function IasCalculator() {
  const { merc } = useParams<{ merc: string }>();
  const [weapons, setWeapons] = useState<string[]>([]);
  const [weapon, setWeapon] = useState('');
  const [ias, setIas] = useState(0);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    api.getIasWeapons(merc!).then((r) => {
      setWeapons(r);
      if (r.length > 0) setWeapon(r[0]);
      setLoading(false);
    });
  }, [merc]);

  const calculate = async () => {
    if (!weapon) return;
    setCalculating(true);
    const r = await api.calculateIas(merc!, weapon, ias);
    setResult(r);
    setCalculating(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#00ffff' }}>
        IAS 計算 — {MERC_LABELS[merc!] || merc}
      </h1>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">武器類型</label>
          <select
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
            className="w-full px-3 py-2 text-sm border bg-black"
            style={{ borderColor: '#404040', color: '#00ffff' }}
          >
            {weapons.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            IAS 值 (增加攻擊速度)
          </label>
          <input
            type="number"
            min={0}
            max={200}
            value={ias}
            onChange={(e) => setIas(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border bg-black"
            style={{ borderColor: '#404040', color: '#ffffff' }}
          />
        </div>

        <button
          onClick={calculate}
          disabled={calculating}
          className="px-4 py-2 text-sm border transition-colors"
          style={{ borderColor: '#00ffff', color: '#00ffff' }}
        >
          {calculating ? '計算中...' : '計算攻速'}
        </button>
      </div>

      {result && (
        <div className="border p-4" style={{ borderColor: '#1a3a3a' }}>
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">目前斷點</div>
            <div className="text-2xl font-bold" style={{ color: '#00ffff' }}>
              {result.frames} 幀/攻
            </div>
            <div className="text-sm text-gray-400">
              需求 IAS: {result.ias_required}
            </div>
          </div>
          {result.next_breakpoint && (
            <div>
              <div className="text-xs text-gray-400 mb-1">下一個斷點</div>
              <div className="text-lg" style={{ color: '#ff8000' }}>
                {result.next_breakpoint.frames} 幀/攻
              </div>
              <div className="text-sm text-gray-400">
                需要 IAS: {result.next_breakpoint.ias_required}
                <span className="ml-2" style={{ color: '#ff8000' }}>
                  (還差 {Math.max(0, Number(result.next_breakpoint.ias_required) - ias)})
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
