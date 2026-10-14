const FACETS = [
  {
    element: '火焰',
    color: '#ff4444',
    trigger: '殺死怪物時',
    castLvl: 47,
    spell: '火焰風暴',
    damage: '1-74 火焰傷害',
    skillBonus: '+3-5% 火焰技能傷害',
    resReduce: '-3-5% 怪物火焰抗性',
    imgs: ['jewel01[1].gif', 'jewel02[1].gif'],
  },
  {
    element: '冰冷',
    color: '#44aaff',
    trigger: '殺死怪物時',
    castLvl: 31,
    spell: '冰霜箭',
    damage: '17-45 冰冷傷害',
    skillBonus: '+3-5% 冰冷技能傷害',
    resReduce: '-3-5% 怪物冰冷抗性',
    imgs: ['jewel03[1].gif'],
  },
  {
    element: '閃電',
    color: '#ffff44',
    trigger: '殺死怪物時',
    castLvl: 37,
    spell: '靜電場',
    damage: '24-38 閃電傷害',
    skillBonus: '+3-5% 閃電技能傷害',
    resReduce: '-3-5% 怪物閃電抗性',
    imgs: ['jewel04[1].gif'],
  },
  {
    element: '毒素',
    color: '#44ff44',
    trigger: '殺死怪物時',
    castLvl: 51,
    spell: '毒素新星',
    damage: '+37 毒素傷害 (5秒)',
    skillBonus: '+3-5% 毒素技能傷害',
    resReduce: '-3-5% 怪物毒素抗性',
    imgs: ['jewel05[1].gif', 'jewel06[1].gif'],
  },
  {
    element: '火焰',
    color: '#ff4444',
    trigger: '升級時',
    castLvl: 41,
    spell: '火焰風暴',
    damage: '1-74 火焰傷害',
    skillBonus: '+3-5% 火焰技能傷害',
    resReduce: '-3-5% 怪物火焰抗性',
    imgs: ['jewel01[1].gif', 'jewel02[1].gif'],
  },
  {
    element: '冰冷',
    color: '#44aaff',
    trigger: '升級時',
    castLvl: 29,
    spell: '冰霜箭',
    damage: '17-45 冰冷傷害',
    skillBonus: '+3-5% 冰冷技能傷害',
    resReduce: '-3-5% 怪物冰冷抗性',
    imgs: ['jewel03[1].gif'],
  },
  {
    element: '閃電',
    color: '#ffff44',
    trigger: '升級時',
    castLvl: 43,
    spell: '靜電場',
    damage: '24-38 閃電傷害',
    skillBonus: '+3-5% 閃電技能傷害',
    resReduce: '-3-5% 怪物閃電抗性',
    imgs: ['jewel04[1].gif'],
  },
  {
    element: '毒素',
    color: '#44ff44',
    trigger: '升級時',
    castLvl: 23,
    spell: '毒素新星',
    damage: '+37 毒素傷害 (5秒)',
    skillBonus: '+3-5% 毒素技能傷害',
    resReduce: '-3-5% 怪物毒素抗性',
    imgs: ['jewel05[1].gif', 'jewel06[1].gif'],
  },
];

const D2R_JEWELS = [
  {
    name_zh: '防禦者的膽汁',
    name_en: "Defender's Bile",
    level_req: 75,
    stats: [
      '1% 機率施展等級 25 骸骨護甲（被擊中時）',
      '+(5-10)% 毒素技能傷害',
      '+95 毒素傷害（1秒）',
      '-(5-10)% 敵人的毒素抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
  {
    name_zh: '保衛者的冰霜',
    name_en: "Protector's Frost",
    level_req: 75,
    stats: [
      '1% 機率施展等級 25 冰封甲（被擊中時）',
      '+(5-10)% 冰冷技能傷害',
      '冰冷傷害 +10-30',
      '-(5-10)% 敵人的冰冷抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
  {
    name_zh: '守護者的閃電',
    name_en: "Guardian's Thunder",
    level_req: 75,
    stats: [
      '1% 機率施展等級 25 氣旋護甲（被擊中時）',
      '+(5-10)% 閃電技能傷害',
      '閃電傷害 +1-75',
      '-(5-10)% 敵人的閃電抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
  {
    name_zh: '防禦者的火焰',
    name_en: "Defender's Fire",
    level_req: 75,
    stats: [
      '1% 機率施展等級 25 熾烈之徑（被擊中時）',
      '+(5-10)% 火焰技能傷害',
      '火焰傷害 +20-60',
      '-(5-10)% 敵人的火焰抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
  {
    name_zh: '保衛者的岩石',
    name_en: "Protector's Stone",
    level_req: 75,
    stats: [
      '1% 機率施展等級 15 影散（被擊中時）',
      '+(30-50)% 增強傷害',
      '物理傷害 +10-30',
      '-(5-10)% 敵人的物理抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
  {
    name_zh: '守護者的光芒',
    name_en: "Guardian's Light",
    level_req: 75,
    stats: [
      '1% 機率施展等級 25 靈能護盾（被擊中時）',
      '+(5-10)% 魔法技能傷害',
      '魔法傷害 +15-35',
      '-(5-10)% 敵人的魔法抗性',
      '+(3-5)% 轉為經驗值',
      '+(25-50)% 額外金幣（怪物）',
      '(15-35)% 更佳機會取得魔法物品',
    ],
  },
];

export default function JewelList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1">
        獨特珠寶
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        遊戲中唯一的獨特珠寶，共有 8 種變體（4 屬性 × 2 觸發方式）。
        鑲嵌後可提升技能傷害並降低怪物抗性。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACETS.map((f, i) => (
          <div key={i} className="border p-3" style={{ borderColor: '#2a2620' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {f.imgs.map((img) => (
                  <img key={img} src={`/assets/img/${img}`} alt="" className="w-7 h-7" />
                ))}
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: '#ffff00' }}>
                  Rainbow Facet Jewel
                </span>
                <span className="text-xs text-gray-500 ml-2">需求等級：49</span>
              </div>
            </div>

            <div className="text-xs space-y-1 pl-1">
              <div style={{ color: f.color }}>
                {f.trigger}：100% 機率施放 {f.castLvl} 級{f.spell}
              </div>
              <div className="text-gray-300">{f.damage}</div>
              <div style={{ color: f.color }}>{f.skillBonus}（霈值）</div>
              <div style={{ color: f.color }}>{f.resReduce}（霈值）</div>
              <div className="text-gray-500 pt-1">
                觸發方式：<span className="text-gray-300">{f.trigger}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        霈值 = 隨機範圍值。同一元素的兩種觸發方式可疊加（例如同時裝備火焰殺死版與火焰升級版）。
      </p>

      <h2 className="text-base font-bold mt-6 mb-3" style={{ color: '#808000' }}>
        D2R 新增獨特珠寶
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {D2R_JEWELS.map((j) => (
          <div key={j.name_en} className="border p-3" style={{ borderColor: '#2a2620' }}>
            <div className="flex items-center gap-2 mb-2">
              <div>
                <span className="text-sm font-bold" style={{ color: '#ffff00' }}>{j.name_zh}</span>
                <span className="text-xs text-gray-400 ml-2">{j.name_en}</span>
                <span className="text-xs text-gray-500 ml-2">需求等級：{j.level_req}</span>
              </div>
            </div>
            <div className="text-xs space-y-1 pl-1">
              {j.stats.map((s, i) => (
                <div key={i} style={{ color: '#00ffff' }}>{s}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
