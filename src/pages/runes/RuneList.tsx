const RUNES = [
  { id: 1,  name_zh: '艾爾',   name_en: 'El',    weapon: '+50 攻擊準確率, +1 照亮範圍',                     armor: '+15 防禦, +1 照亮範圍',                          lvl: 11 },
  { id: 2,  name_zh: '艾德',   name_en: 'Eld',   weapon: '+175% 對不死系生物傷害, +50 對不死系生物準確率', armor: '15% 減緩精力消耗 / +7% 格擋率(盾)',              lvl: 11 },
  { id: 3,  name_zh: '特爾',   name_en: 'Tir',   weapon: '+2 法力於每次殺死敵人後',                        armor: '+2 法力於每次殺死敵人後',                        lvl: 13 },
  { id: 4,  name_zh: '那夫',   name_en: 'Nef',   weapon: '擊退',                                           armor: '+30 對飛射性武器防禦',                           lvl: 13 },
  { id: 5,  name_zh: '愛斯',   name_en: 'Eth',   weapon: '-25% 目標防禦力',                                armor: '法力重生 +15%',                                  lvl: 15 },
  { id: 6,  name_zh: '伊司',   name_en: 'Ith',   weapon: '+9 最大傷害值',                                  armor: '15% 受損的生命轉移至法力',                       lvl: 15 },
  { id: 7,  name_zh: '塔爾',   name_en: 'Tal',   weapon: '+75 毒素傷害，持續5秒',                          armor: '+30% 毒素抵抗 / +35% 毒素抗性(盾)',              lvl: 17 },
  { id: 8,  name_zh: '拉爾',   name_en: 'Ral',   weapon: '增加 5-30 點火焰傷害',                           armor: '+30% 火焰抵抗 / +35% 火焰抗性(盾)',              lvl: 19 },
  { id: 9,  name_zh: '歐特',   name_en: 'Ort',   weapon: '增加 1-50 閃電傷害',                             armor: '+30% 閃電抵抗 / +35% 閃電抗性(盾)',              lvl: 21 },
  { id: 10, name_zh: '書爾',   name_en: 'Thul',  weapon: '增加 3-14 冰冷傷害，凍結目標3秒',               armor: '+30% 冰冷抵抗 / +35% 冰冷抗性(盾)',              lvl: 23 },
  { id: 11, name_zh: '安姆',   name_en: 'Amn',   weapon: '7% 偷取生命',                                    armor: '攻擊者受到傷害 14 點',                           lvl: 25 },
  { id: 12, name_zh: '索爾',   name_en: 'Sol',   weapon: '+9 最小傷害值',                                  armor: '減少傷害 7 點',                                  lvl: 27 },
  { id: 13, name_zh: '夏',     name_en: 'Shael', weapon: '20% 增加攻擊速度',                               armor: '20% 快速再度攻擊 / 20% 快速再度格擋(盾)',        lvl: 29 },
  { id: 14, name_zh: '多爾',   name_en: 'Dol',   weapon: '成功擊中有25%機率使怪物逃跑',                    armor: '恢復生命 +7',                                    lvl: 31 },
  { id: 15, name_zh: '海爾',   name_en: 'Hel',   weapon: '需求 -20%',                                      armor: '需求 -15%',                                      lvl: 0  },
  { id: 16, name_zh: '破',     name_en: 'Io',    weapon: '+10 體力',                                        armor: '+10 體力',                                       lvl: 35 },
  { id: 17, name_zh: '盧姆',   name_en: 'Lum',   weapon: '+10 精力',                                        armor: '+10 精力',                                       lvl: 37 },
  { id: 18, name_zh: '科',     name_en: 'Ko',    weapon: '+10 敏捷',                                        armor: '+10 敏捷',                                       lvl: 39 },
  { id: 19, name_zh: '法爾',   name_en: 'Fal',   weapon: '+10 力量',                                        armor: '+10 力量',                                       lvl: 41 },
  { id: 20, name_zh: '藍姆',   name_en: 'Lem',   weapon: '75% 額外金錢從怪物身上取得',                     armor: '50% 額外金錢從怪物身上取得',                     lvl: 43 },
  { id: 21, name_zh: '普爾',   name_en: 'Pul',   weapon: '+75% 對惡魔系怪物傷害, +100 對惡魔準確率',      armor: '+30% 增加防禦',                                  lvl: 45 },
  { id: 22, name_zh: '烏姆',   name_en: 'Um',    weapon: '25% 撕裂傷口機會',                               armor: '全面抗性 +15% / 全面抗性 +22%(盾)',               lvl: 47 },
  { id: 23, name_zh: '馬爾',   name_en: 'Mal',   weapon: '防止怪物治療',                                   armor: '法術傷害減少 7',                                 lvl: 49 },
  { id: 24, name_zh: '伊斯特', name_en: 'Ist',   weapon: '30% 更佳機率取得魔法物品',                       armor: '25% 更佳機率取得魔法物品',                       lvl: 51 },
  { id: 25, name_zh: '古爾',   name_en: 'Gul',   weapon: '20% 額外的攻擊準確率加成',                       armor: '+5% 最大毒素抗性',                               lvl: 53 },
  { id: 26, name_zh: '伐克斯', name_en: 'Vex',   weapon: '7% 偷取法力',                                    armor: '+5% 最大火焰抗性',                               lvl: 55 },
  { id: 27, name_zh: '歐姆',   name_en: 'Ohm',   weapon: '+50% 增強傷害',                                  armor: '+5% 最大冰冷抗性',                               lvl: 57 },
  { id: 28, name_zh: '羅',     name_en: 'Lo',    weapon: '20% 致命一擊機率',                               armor: '+5% 最大閃電抗性',                               lvl: 59 },
  { id: 29, name_zh: '瑟',     name_en: 'Sur',   weapon: '目標盲目',                                        armor: '+5% 法力上限值 / +50 法力(盾)',                  lvl: 61 },
  { id: 30, name_zh: '貝',     name_en: 'Ber',   weapon: '20% 造成壓碎性打擊機率',                         armor: '傷害減少 8%',                                    lvl: 63 },
  { id: 31, name_zh: '喬',     name_en: 'Jah',   weapon: '忽視目標防禦',                                   armor: '+5% 生命上限值 / +50 生命(盾)',                  lvl: 65 },
  { id: 32, name_zh: '查姆',   name_en: 'Cham',  weapon: '凍結目標',                                        armor: '無法冰凍',                                       lvl: 67 },
  { id: 33, name_zh: '薩德',   name_en: 'Zod',   weapon: '無法破壞',                                        armor: '無法破壞',                                       lvl: 69 },
];

export default function RuneList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#c0a030' }}>
        符文介紹
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        符文可鑲嵌於凹槽裝備中，依特殊排列方式可組合成
        <a href="/runewords" className="ml-1" style={{ color: '#c0a030' }}>符文字</a>。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">圖</th>
              <th className="text-center py-2 px-2 text-gray-400 font-normal">#</th>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">名稱</th>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">鑲在武器</th>
              <th className="text-left py-2 px-2 text-gray-400 font-normal">鑲在盔甲 / 頭盔 / 盾牌</th>
              <th className="text-center py-2 px-2 text-gray-400 font-normal">需求等級</th>
            </tr>
          </thead>
          <tbody>
            {RUNES.map((r, i) => (
              <tr
                key={r.id}
                style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
              >
                <td className="py-1 px-2">
                  <img
                    src={`/assets/img/rune${r.name_en}[1].gif`}
                    alt={r.name_zh}
                    className="w-8 h-8 object-contain"
                  />
                </td>
                <td className="py-1 px-2 text-center text-gray-500">{r.id}</td>
                <td className="py-1 px-2 whitespace-nowrap">
                  <span style={{ color: '#c0a030' }}>{r.name_zh}</span>
                  <span className="text-gray-500 text-xs ml-1">({r.name_en})</span>
                </td>
                <td className="py-1 px-2 text-gray-300">{r.weapon}</td>
                <td className="py-1 px-2 text-gray-300">{r.armor}</td>
                <td className="py-1 px-2 text-center text-gray-400">
                  {r.lvl > 0 ? r.lvl : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
