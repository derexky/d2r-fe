import { useState } from 'react';

const TABS = [
  { key: 'spawn', label: '出現方法' },
  { key: 'stats', label: '特殊魔王數據' },
];

const BOSSES = [
  { name: '地表暗黑',      lvl: 110, exp: '5,539,200', hp: '642,700',       fire: 95, cold: 95, lightning: 95, poison: 95 },
  { name: '超級督瑞爾',    lvl: 110, exp: '2,648,000', hp: '650,000-660,000', fire: 75, cold: 75, lightning: 75, poison: 75 },
  { name: '超級依族爾',    lvl: 110, exp: '3,179,200', hp: '650,000-660,000', fire: 75, cold: 75, lightning: 75, poison: 75 },
  { name: '莉莉絲',        lvl: 110, exp: '2,387,200', hp: '650,000-660,000', fire: 75, cold: 0,  lightning: 75, poison: 0  },
  { name: '超級莫菲斯托',  lvl: 110, exp: '3,409,600', hp: '650,000-660,000', fire: 75, cold: 75, lightning: 75, poison: 75 },
  { name: '超級暗黑破壞神',lvl: 110, exp: '5,539,200', hp: '650,000-660,000', fire: 75, cold: 75, lightning: 75, poison: 75 },
  { name: '超級巴爾',      lvl: 110, exp: '10,336,000', hp: '650,000-660,000', fire: 75, cold: 75, lightning: 75, poison: 75 },
];

const FAQ = [
  {
    q: '我只要等待地表暗黑就會出現嗎？',
    a: '是的。當遊戲進行中有時會出現「XXXX 顆喬單之石賣給商人」訊息，此時只需等待，最後就會出現「暗黑破壞神出現在地表」訊息，接觸小王即可遇見地表暗黑。',
  },
  {
    q: '等了很久都沒出現怎麼辦？',
    a: '以易牙居的經驗，只要在遊戲內一直等待，地表一定會出來。最快1分鐘內，最慢曾等過14小時，但最後都有出現。',
  },
  {
    q: '需要自己賣喬單之石（SOJ）嗎？',
    a: '正常情況下 SOJ 會自行觸發，不須刻意賣。但賣 SOJ 會增加地表出現的機率（如果財力允許）。',
  },
  {
    q: '殺死地表暗黑有什麼獎勵？',
    a: '殺死地表暗黑可獲得「毀滅小符（Annihilus Small Charm）」，能永久提升角色能力。',
  },
  {
    q: 'IP 的作用是什麼？',
    a: '地表暗黑一出現，同一 IP 的所有遊戲同時出現。找到正在跳 SOJ 的 IP，可提高遇見地表暗黑的機率。查看 IP 方法：開啟命令提示字元輸入 NETSTAT -N，4000 以前的數字即為目前 IP。',
  },
];

export default function DiabloClone() {
  const [tab, setTab] = useState('spawn');

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#ffcc99' }}>
        地表暗黑 / 特殊魔王
      </h1>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1 text-sm border transition-colors"
            style={{
              borderColor: tab === t.key ? '#ffcc99' : '#333',
              color: tab === t.key ? '#ffcc99' : '#888',
              backgroundColor: tab === t.key ? '#1a1000' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'spawn' && (
        <div className="space-y-4 max-w-2xl">
          {FAQ.map((item, i) => (
            <div key={i}>
              <p className="text-sm font-bold mb-1" style={{ color: '#ffcc99' }}>
                Q{i + 1}. {item.q}
              </p>
              <p className="text-sm text-gray-300 pl-4">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'stats' && (
        <div>
          <p className="text-xs text-gray-500 mb-3">所有特殊魔王只在地獄難度出現</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th className="text-left py-2 px-3 text-gray-400 font-normal">名稱</th>
                  <th className="text-center py-2 px-3 text-gray-400 font-normal">等級</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-normal">經驗值</th>
                  <th className="text-right py-2 px-3 text-gray-400 font-normal">生命值</th>
                  <th className="text-center py-2 px-2 text-gray-400 font-normal" style={{ color: '#cc3333' }}>火</th>
                  <th className="text-center py-2 px-2 text-gray-400 font-normal" style={{ color: '#3399ff' }}>冰</th>
                  <th className="text-center py-2 px-2 text-gray-400 font-normal" style={{ color: '#ffcc00' }}>電</th>
                  <th className="text-center py-2 px-2 text-gray-400 font-normal" style={{ color: '#33cc66' }}>毒</th>
                </tr>
              </thead>
              <tbody>
                {BOSSES.map((b, i) => (
                  <tr
                    key={b.name}
                    style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
                  >
                    <td className="py-2 px-3" style={{ color: '#ff0000' }}>{b.name}</td>
                    <td className="py-2 px-3 text-center text-gray-300">{b.lvl}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{b.exp}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{b.hp}</td>
                    <td className="py-2 px-2 text-center text-gray-300">{b.fire}%</td>
                    <td className="py-2 px-2 text-center text-gray-300">{b.cold}%</td>
                    <td className="py-2 px-2 text-center text-gray-300">{b.lightning}%</td>
                    <td className="py-2 px-2 text-center text-gray-300">{b.poison}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
