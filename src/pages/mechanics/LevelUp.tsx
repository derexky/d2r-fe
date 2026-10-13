const DATA: Array<[string, string, number]> = [
  ['1 – 11',  '普通', 1],
  ['12 – 18', '普通', 2],
  ['19 – 23', '普通', 3],
  ['24 – 31', '普通', 4],
  ['32 – 36', '普通', 5],
  ['37 – 43', '夢魘', 1],
  ['44 – 48', '夢魘', 2],
  ['49 – 52', '夢魘', 3],
  ['53 – 62', '夢魘', 4],
  ['63 – 73', '地獄', 1],
  ['74 – 80', '地獄', 2],
  ['81 – 83', '地獄', 3],
  ['84 – 94', '地獄', 4],
  ['95 – 99', '地獄', 5],
];

const DIFF_COLOR: Record<string, string> = {
  '普通': '#66cc66',
  '夢魘': '#ffaa33',
  '地獄': '#ff5555',
};

export default function LevelUp() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--gold)' }}>
        最佳練級難度
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        各等級建議進入的難度與章節，可獲取最大經驗值。
      </p>

      <div className="overflow-x-auto">
        <table className="text-sm border-collapse" style={{ borderColor: '#302c26' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #423c33' }}>
              <th className="text-left px-4 py-2 text-gray-400 font-normal">角色等級</th>
              <th className="text-left px-4 py-2 text-gray-400 font-normal">難度</th>
              <th className="text-left px-4 py-2 text-gray-400 font-normal">章節</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map(([lvl, diff, act], i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #2a2620' }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-2 font-mono text-gray-200">{lvl}</td>
                <td className="px-4 py-2 font-bold" style={{ color: DIFF_COLOR[diff] }}>
                  {diff}
                </td>
                <td className="px-4 py-2 text-gray-300">第 {act} 章</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
