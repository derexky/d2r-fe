type Row = [string, number, number, number];

const DATA: Row[] = [
  // 頭部
  ['頭環',           1, 2, 3],
  ['頭盔',           2, 2, 3],
  ['野蠻人頭盔',     2, 3, 3],
  ['德魯依頭盔',     2, 3, 3],
  ['骷髏盾（死靈）', 2, 2, 2],
  // 身體
  ['身體護甲',       3, 4, 4],
  // 盾牌
  ['盾牌',           3, 3, 4],
  ['聖騎士盾',       3, 4, 4],
  // 武器
  ['匕首',           2, 3, 3],
  ['刺客爪',         2, 3, 3],
  ['死靈魔杖',       2, 2, 2],
  ['法師球',         2, 3, 3],
  ['亞馬遜弓',       3, 4, 5],
  ['權杖',           3, 5, 5],
  ['斧',             4, 5, 6],
  ['法杖',           5, 6, 6],
  ['其他武器',       3, 4, 6],
];

export default function MaxSockets() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#ffaa00' }}>
        最大孔數
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        白色裝備透過拉扎克任務（西伊格攻城戰）可獲得最大孔數，數量依物品等級（ilvl）決定。
      </p>

      <div className="overflow-x-auto">
        <table className="text-sm border-collapse" style={{ borderColor: '#333' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444' }}>
              <th className="text-left px-4 py-2 text-gray-400 font-normal">裝備類型</th>
              <th className="text-center px-4 py-2 text-gray-400 font-normal">ilvl 1–25</th>
              <th className="text-center px-4 py-2 text-gray-400 font-normal">ilvl 26–40</th>
              <th className="text-center px-4 py-2 text-gray-400 font-normal">ilvl 41+</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map(([name, a, b, c], i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #2a2a2a' }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-2 text-gray-200">{name}</td>
                <td className="px-4 py-2 text-center font-mono" style={{ color: '#aad4ff' }}>{a}</td>
                <td className="px-4 py-2 text-center font-mono" style={{ color: '#aad4ff' }}>{b}</td>
                <td className="px-4 py-2 text-center font-mono" style={{ color: '#aad4ff' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * 魔法/稀有/成套/獨特裝備使用拉扎克任務只會得到 1 個孔。
      </p>
    </div>
  );
}
