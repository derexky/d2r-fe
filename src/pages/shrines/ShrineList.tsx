interface Shrine {
  img?: string;
  name: string;
  effect: string;
  respawn: string;
  duration: string;
}

const SHRINES: Shrine[] = [
  { img: 'manarecharge[1].gif',    name: '法力回復神殿', effect: '法力重生 400%',                               respawn: '5 分鐘', duration: '96 秒' },
  { img: 'armor[1].gif',           name: '裝甲神殿',     effect: '+100% 防禦強化',                              respawn: '5 分鐘', duration: '48 秒' },
  { img: 'combat[1].gif',          name: '作戰神殿',     effect: '+200% 攻擊準度, +200% 最小/最大傷害',         respawn: '5 分鐘', duration: '48 秒' },
  { img: 'resistfire[1].gif',      name: '火燄抵抗神殿', effect: '+75% 火燄抗性',                               respawn: '5 分鐘', duration: '48 秒' },
  { img: 'resistcold[1].gif',      name: '冰凍抵抗神殿', effect: '+75% 冰凍抗性',                               respawn: '5 分鐘', duration: '48 秒' },
  { img: 'resistlightning[1].gif', name: '閃電抵抗神殿', effect: '+75% 閃電抗性',                               respawn: '5 分鐘', duration: '48 秒' },
  { img: 'resistpoison[1].gif',    name: '毒素抵抗神殿', effect: '+75% 毒素抗性',                               respawn: '5 分鐘', duration: '48 秒' },
  { img: 'skill[1].gif',           name: '技能神殿',     effect: '+2 到所有技能',                               respawn: '5 分鐘', duration: '96 秒' },
  { img: 'stamina[1].gif',         name: '耐力神殿',     effect: '耐力無限',                                    respawn: '5 分鐘', duration: '192 秒' },
  { img: 'experience[1].gif',      name: '經驗神殿',     effect: '1.5 倍經驗取得',                              respawn: '無法回覆', duration: '144 秒' },
  {                                 name: '活力神殿',     effect: '恢復生命與法力至最大值',                       respawn: '2 分鐘', duration: '—' },
  {                                 name: '生命神殿',     effect: '恢復生命至最大值',                            respawn: '2 分鐘', duration: '—' },
  {                                 name: '法力神殿',     effect: '恢復法力至最大值',                            respawn: '2 分鐘', duration: '—' },
  {                                 name: '傳送神殿',     effect: '開啟一個通往城鎮的傳送門',                    respawn: '無法回覆', duration: '無限' },
  {                                 name: '火燄神殿',     effect: '所有人與怪物生命削減為 1/2',                  respawn: '—', duration: '—' },
  {                                 name: '怪物神殿',     effect: '最接近玩家的怪物進化為頭目怪物',             respawn: '—', duration: '—' },
  {                                 name: '寶石神殿',     effect: '讓身上的寶石等級提升；若無寶石則給予碎裂的寶石', respawn: '—', duration: '—' },
  {                                 name: '爆裂神殿',     effect: '噴出 5~10 瓶火燄藥劑',                       respawn: '—', duration: '—' },
  {                                 name: '毒素神殿',     effect: '噴出 5~10 瓶毒素藥劑',                       respawn: '—', duration: '—' },
];

export default function ShrineList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#cc66ff' }}>
        神殿介紹
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">圖</th>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">名稱</th>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">效果</th>
              <th className="text-center py-2 px-2 text-gray-400 font-normal">回覆時間</th>
              <th className="text-center py-2 px-2 text-gray-400 font-normal">持續時間</th>
            </tr>
          </thead>
          <tbody>
            {SHRINES.map((s, i) => (
              <tr
                key={s.name}
                style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
              >
                <td className="py-1 px-2">
                  {s.img ? (
                    <img src={`/assets/img/${s.img}`} alt={s.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </td>
                <td className="py-1 px-2 whitespace-nowrap" style={{ color: '#cc66ff' }}>{s.name}</td>
                <td className="py-1 px-2 text-gray-300">{s.effect}</td>
                <td className="py-1 px-2 text-center text-gray-400">{s.respawn}</td>
                <td className="py-1 px-2 text-center text-gray-400">{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
