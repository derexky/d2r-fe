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

export default function JewelList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#808000' }}>
        獨特珠寶
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        遊戲中唯一的獨特珠寶，共有 8 種變體（4 屬性 × 2 觸發方式）。
        鑲嵌後可提升技能傷害並降低怪物抗性。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACETS.map((f, i) => (
          <div key={i} className="border p-3" style={{ borderColor: '#2a2a2a' }}>
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
    </div>
  );
}
