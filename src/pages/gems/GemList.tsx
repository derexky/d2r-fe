interface Gem {
  img: string;
  name: string;
  lvl: number;
  weapon: string;
  shield: string;
  armor: string;
}

interface GemGroup {
  type: string;
  color: string;
  gems: Gem[];
}

const GEM_GROUPS: GemGroup[] = [
  {
    type: '骷髏',
    color: '#aaaaaa',
    gems: [
      { img: 'chippedskull[1].gif',   name: '碎裂的骷髏',   lvl: 1,  weapon: '2% 擊中偷取生命, 1% 擊中偷取法力',  shield: '攻擊者受到傷害 4',  armor: '法力重生 8%, 生命補滿 +2' },
      { img: 'flawedskull[1].gif',    name: '裂開的骷髏',   lvl: 5,  weapon: '2% 擊中偷取生命, 2% 擊中偷取法力',  shield: '攻擊者受到傷害 8',  armor: '法力重生 8%, 生命補滿 +3' },
      { img: 'skull[1].gif',          name: '骷髏',         lvl: 12, weapon: '3% 擊中偷取生命, 2% 擊中偷取法力',  shield: '攻擊者受到傷害 12', armor: '法力重生 12%, 生命補滿 +3' },
      { img: 'flawlessskull[1].gif',  name: '無瑕疵的骷髏', lvl: 15, weapon: '3% 擊中偷取生命, 3% 擊中偷取法力',  shield: '攻擊者受到傷害 16', armor: '法力重生 12%, 生命補滿 +4' },
      { img: 'perfectskull[1].gif',   name: '完美的骷髏',   lvl: 18, weapon: '4% 擊中偷取生命, 3% 擊中偷取法力',  shield: '攻擊者受到傷害 20', armor: '法力重生 19%, 生命補滿 +5' },
    ],
  },
  {
    type: '紫寶石',
    color: '#9966cc',
    gems: [
      { img: 'chippedamethyst[1].gif',   name: '碎裂的紫寶石',   lvl: 1,  weapon: '+40 準確率',  shield: '+8 防禦',  armor: '+3 力量' },
      { img: 'flawedamethyst[1].gif',    name: '裂開的紫寶石',   lvl: 5,  weapon: '+60 準確率',  shield: '+12 防禦', armor: '+4 力量' },
      { img: 'amethyst[1].gif',          name: '紫寶石',         lvl: 12, weapon: '+80 準確率',  shield: '+18 防禦', armor: '+6 力量' },
      { img: 'flawlessamethyst[1].gif',  name: '無瑕疵的紫寶石', lvl: 15, weapon: '+100 準確率', shield: '+24 防禦', armor: '+8 力量' },
      { img: 'perfectamethyst[1].gif',   name: '完美的紫寶石',   lvl: 18, weapon: '+150 準確率', shield: '+30 防禦', armor: '+10 力量' },
    ],
  },
  {
    type: '藍寶石',
    color: '#3399ff',
    gems: [
      { img: 'chippedsaphire[1].gif',   name: '碎裂的藍寶石',   lvl: 1,  weapon: '增加 1-3 冰冷傷害',   shield: '抗寒 +12%', armor: '+10 法力' },
      { img: 'flawedsaphire[1].gif',    name: '裂開的藍寶石',   lvl: 5,  weapon: '增加 3-5 冰冷傷害',   shield: '抗寒 +16%', armor: '+17 法力' },
      { img: 'saphire[1].gif',          name: '藍寶石',         lvl: 12, weapon: '增加 4-7 冰冷傷害',   shield: '抗寒 +22%', armor: '+24 法力' },
      { img: 'flawlesssaphire[1].gif',  name: '無瑕疵的藍寶石', lvl: 15, weapon: '增加 6-10 冰冷傷害',  shield: '抗寒 +28%', armor: '+31 法力' },
      { img: 'perfectsaphire[1].gif',   name: '完美的藍寶石',   lvl: 18, weapon: '增加 10-14 冰冷傷害', shield: '抗寒 +40%', armor: '+38 法力' },
    ],
  },
  {
    type: '綠寶石',
    color: '#33cc66',
    gems: [
      { img: 'chippedemerald[1].gif',   name: '碎裂的綠寶石',   lvl: 1,  weapon: '增加 10 毒素傷害，持續 3 秒',  shield: '抗毒 +12%', armor: '+3 敏捷' },
      { img: 'flawedemerald[1].gif',    name: '裂開的綠寶石',   lvl: 5,  weapon: '增加 20 毒素傷害，持續 4 秒',  shield: '抗毒 +16%', armor: '+4 敏捷' },
      { img: 'emerald[1].gif',          name: '綠寶石',         lvl: 12, weapon: '增加 40 毒素傷害，持續 5 秒',  shield: '抗毒 +22%', armor: '+6 敏捷' },
      { img: 'flawlessemerald[1].gif',  name: '無瑕疵的綠寶石', lvl: 15, weapon: '增加 60 毒素傷害，持續 6 秒',  shield: '抗毒 +28%', armor: '+8 敏捷' },
      { img: 'perfectemerald[1].gif',   name: '完美的綠寶石',   lvl: 18, weapon: '增加 100 毒素傷害，持續 7 秒', shield: '抗毒 +40%', armor: '+10 敏捷' },
    ],
  },
  {
    type: '紅寶石',
    color: '#cc3333',
    gems: [
      { img: 'flawedruby[1].gif',    name: '碎裂的紅寶石',   lvl: 1,  weapon: '增加 3-4 火焰傷害',   shield: '抗火 +12%', armor: '+10 生命' },
      { img: 'chippedruby[1].gif',   name: '裂開的紅寶石',   lvl: 5,  weapon: '增加 5-8 火焰傷害',   shield: '抗火 +16%', armor: '+17 生命' },
      { img: 'ruby[1].gif',          name: '紅寶石',         lvl: 12, weapon: '增加 8-12 火焰傷害',  shield: '抗火 +22%', armor: '+24 生命' },
      { img: 'flawlessruby[1].gif',  name: '無瑕疵的紅寶石', lvl: 15, weapon: '增加 10-16 火焰傷害', shield: '抗火 +28%', armor: '+31 生命' },
      { img: 'perfectruby[1].gif',   name: '完美的紅寶石',   lvl: 18, weapon: '增加 15-20 火焰傷害', shield: '抗火 +40%', armor: '+38 生命' },
    ],
  },
  {
    type: '鑽石',
    color: '#ccccff',
    gems: [
      { img: 'chippeddiamond[1].gif',   name: '碎裂的鑽石',   lvl: 1,  weapon: '+28% 對不死生物傷害', shield: '所有抗性 +6',  armor: '+20 準確率' },
      { img: 'flaweddiamond[1].gif',    name: '裂開的鑽石',   lvl: 5,  weapon: '+34% 對不死生物傷害', shield: '所有抗性 +8',  armor: '+40 準確率' },
      { img: 'diamond[1].gif',          name: '鑽石',         lvl: 12, weapon: '+44% 對不死生物傷害', shield: '所有抗性 +11', armor: '+60 準確率' },
      { img: 'flawlessdiamond[1].gif',  name: '無瑕疵的鑽石', lvl: 15, weapon: '+54% 對不死生物傷害', shield: '所有抗性 +14', armor: '+80 準確率' },
      { img: 'perfectdiamond[1].gif',   name: '完美的鑽石',   lvl: 18, weapon: '+68% 對不死生物傷害', shield: '所有抗性 +19', armor: '+100 準確率' },
    ],
  },
  {
    type: '黃寶石',
    color: '#ffcc00',
    gems: [
      { img: 'chippedtopaz[1].gif',   name: '碎裂的黃寶石',   lvl: 1,  weapon: '增加 1-8 閃電傷害',  shield: '抗電 +12%', armor: '9% 更佳機率取得魔法裝備' },
      { img: 'flawedtopaz[1].gif',    name: '裂開的黃寶石',   lvl: 5,  weapon: '增加 1-14 閃電傷害', shield: '抗電 +16%', armor: '13% 更佳機率取得魔法裝備' },
      { img: 'topaz[1].gif',          name: '黃寶石',         lvl: 12, weapon: '增加 1-22 閃電傷害', shield: '抗電 +22%', armor: '16% 更佳機率取得魔法裝備' },
      { img: 'flawlesstopaz[1].gif',  name: '無瑕疵的黃寶石', lvl: 15, weapon: '增加 1-30 閃電傷害', shield: '抗電 +28%', armor: '20% 更佳機率取得魔法裝備' },
      { img: 'perfecttopaz[1].gif',   name: '完美的黃寶石',   lvl: 18, weapon: '增加 1-40 閃電傷害', shield: '抗電 +40%', armor: '24% 更佳機率取得魔法裝備' },
    ],
  },
];

export default function GemList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#c0a030' }}>
        寶石介紹
      </h1>

      <div className="space-y-6">
        {GEM_GROUPS.map((group) => (
          <div key={group.type}>
            <h2 className="text-base font-bold mb-2" style={{ color: group.color }}>
              {group.type}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th className="text-left py-1 px-2 text-gray-400 font-normal">圖</th>
                    <th className="text-left py-1 px-2 text-gray-400 font-normal">名稱</th>
                    <th className="text-center py-1 px-2 text-gray-400 font-normal">需求等級</th>
                    <th className="text-left py-1 px-2 text-gray-400 font-normal">鑲入武器</th>
                    <th className="text-left py-1 px-2 text-gray-400 font-normal">鑲入盾牌</th>
                    <th className="text-left py-1 px-2 text-gray-400 font-normal">鑲入盔甲 / 頭盔</th>
                  </tr>
                </thead>
                <tbody>
                  {group.gems.map((gem, i) => (
                    <tr
                      key={gem.img}
                      style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
                    >
                      <td className="py-1 px-2">
                        <img src={`/assets/img/${gem.img}`} alt={gem.name} className="w-8 h-8 object-contain" />
                      </td>
                      <td className="py-1 px-2 whitespace-nowrap text-gray-200">{gem.name}</td>
                      <td className="py-1 px-2 text-center text-gray-400">{gem.lvl}</td>
                      <td className="py-1 px-2 text-gray-300">{gem.weapon}</td>
                      <td className="py-1 px-2 text-gray-300">{gem.shield}</td>
                      <td className="py-1 px-2 text-gray-300">{gem.armor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
