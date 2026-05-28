type Section = { title: string; items: { label: string; formula: string; notes?: string[] }[] };

const SECTIONS: Section[] = [
  {
    title: '物理傷害',
    items: [
      {
        label: '物理傷害',
        formula: '武器傷害值 × 技能加成 × 物理抗性 × 致命攻擊 + 元素傷害',
      },
      {
        label: '武器傷害值',
        formula: '基本傷害值 × (1 + 增強傷害%) + 增加最大傷害 + 增加最小傷害',
      },
      {
        label: '物理抗性係數',
        formula: '1 − 敵人物理抗性%',
        notes: ['例：敵人 50% 物理抗性 → 係數 = 0.5'],
      },
      {
        label: '致命攻擊係數',
        formula: '1 + 技能致命% + 裝備致命%',
      },
      {
        label: '元素傷害實受',
        formula: '元素傷害 × (100% − 目標抗性%)',
        notes: [
          '抗性 95% → 受 5%',
          '抗性 0% → 受 100%',
          '抗性 −70% → 受 170%（負抗性增傷）',
        ],
      },
    ],
  },
  {
    title: '命中率',
    items: [
      {
        label: '命中率',
        formula: '[攻擊者準確率 ÷ (攻擊者準確率 + 防禦者防禦力)] × [攻擊者等級 ÷ (攻擊者等級 + 防禦者等級)] × 200',
        notes: ['防禦力越高只降低敵方命中率，不減少傷害值'],
      },
    ],
  },
  {
    title: '生命補滿',
    items: [
      {
        label: '每秒生命恢復',
        formula: '25 × 生命補滿 ÷ 256',
      },
    ],
  },
  {
    title: '格擋率',
    items: [
      {
        label: '格擋率',
        formula: '盾牌格擋率 × (敏捷 − 15) ÷ (等級 × 2)',
        notes: [
          '上限 75%',
          '盾牌格擋率 = 人物基礎格擋 + 盾牌格擋 + 神聖之盾加成（聖騎士）',
        ],
      },
      {
        label: '人物基礎格擋率',
        formula: '聖騎士 30%｜野蠻人/刺客 25%｜亞馬遜/法師/死靈/德魯依 20%',
      },
      {
        label: '範例',
        formula: '99 等聖騎士持飾金盾 + 42 等神聖之盾 → 75% = 120 × (敏捷 − 15) ÷ 198 → 敏捷 = 139',
      },
    ],
  },
  {
    title: '致命 / 壓碎 / 撕裂',
    items: [
      {
        label: '注意',
        formula: '三者不可同時發動',
      },
      {
        label: '致命攻擊（Deadly Strike）',
        formula: '物理傷害 × 2',
        notes: [
          '發動上限 100%',
          '野蠻人「支配武器」與刺客「支配利爪」內建 100%',
        ],
      },
      {
        label: '壓碎攻擊（Crushing Blow）',
        formula: '對怪物：減少目前血量 1/4｜對頭目/王：1/10',
        notes: [
          '遠程武器發動時威力減半（1/8 or 1/20）',
          '受物理抗性影響：敵人 50% 物理抗性 → 實際壓碎傷害 1/8',
        ],
      },
      {
        label: '撕裂攻擊（Open Wounds）',
        formula: '撕裂傷害 = (攻擊者等級 × 9 + 40) ÷ 256，每 4 秒一次',
        notes: ['不受物理抗性影響'],
      },
    ],
  },
];

export default function Formulas() {
  return (
    <div className="text-sm max-w-2xl">
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
        遊戲公式
      </h1>

      <div className="space-y-6">
        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <h2 className="text-xs font-bold text-gray-400 mb-2 border-b pb-1" style={{ borderColor: '#2a2a2a' }}>
              {sec.title}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.label} className="border p-2" style={{ borderColor: '#1a1a1a' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#c0a030' }}>
                    {item.label}
                  </p>
                  <p className="text-xs font-mono text-gray-300">{item.formula}</p>
                  {item.notes && (
                    <ul className="mt-1 space-y-0.5">
                      {item.notes.map((n, i) => (
                        <li key={i} className="text-xs text-gray-500 pl-2">
                          · {n}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
