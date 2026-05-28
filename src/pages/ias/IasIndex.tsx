import { Link } from 'react-router-dom';

const MERCS = [
  { value: 'act1', label: '第一幕傭兵（冷/火箭手）' },
  { value: 'act2', label: '第二幕傭兵（沙漠勇士）' },
  { value: 'act5', label: '第五幕傭兵（野蠻人）' },
];

export default function IasIndex() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#00ffff' }}>
        IAS 攻速計算器
      </h1>
      <p className="text-sm text-gray-400 mb-4">選擇傭兵類型以計算攻速斷點</p>
      <div className="space-y-2 max-w-md">
        {MERCS.map((m) => (
          <Link
            key={m.value}
            to={`/ias/${m.value}`}
            className="block px-4 py-3 border text-sm hover:border-cyan-600 transition-colors"
            style={{ borderColor: '#1a3a3a', color: '#00ffff' }}
          >
            {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
