const BOSSES = [
  {
    name: '地表暗黑', note: 'Über Diablo (Annihilus)',
    lv: 110, xp: 5539200, hp: '642700',
    atk1: '130-247', ar1: 14043, atk2: '143-299', ar2: 13064,
    def: 2940, block: 50, pdr: 50, mdr: 50,
    fr: 95, cr: 95, lr: 95, pr: 95,
    eff: 15, immune: '－', ceff: 10,
  },
  {
    name: '超級督瑞爾', note: 'Über Duriel (Annihilus)',
    lv: 110, xp: 2648000, hp: '650000-660000',
    atk1: '468-494', ar1: 7185, atk2: '149-214', ar2: 9798,
    def: 2520, block: 50, pdr: 50, mdr: 75,
    fr: 75, cr: 75, lr: 75, pr: 75,
    eff: 100, immune: '－', ceff: 20,
  },
  {
    name: '超級依族爾', note: 'Über Izual (Annihilus)',
    lv: 110, xp: 3179200, hp: '650000-660000',
    atk1: '455-520', ar1: 13064, atk2: '455-520', ar2: 13064,
    def: 2520, block: 50, pdr: 30, mdr: 75,
    fr: 75, cr: 110, lr: 75, pr: 75,
    eff: 50, immune: '冰冷無效', ceff: 25,
  },
  {
    name: '莉莉絲', note: 'Lilith (Hellfire Torch)',
    lv: 110, xp: 2387200, hp: '650000-660000',
    atk1: '520-572', ar1: 30700, atk2: '520-572', ar2: 30700,
    def: 2310, block: 40, pdr: 30, mdr: 75,
    fr: 75, cr: 75, lr: 75, pr: 110,
    eff: 33, immune: '毒素無效', ceff: 0,
  },
  {
    name: '超級莫菲斯托', note: 'Über Mephisto (Hellfire Torch)',
    lv: 110, xp: 3409600, hp: '650000-660000',
    atk1: '487-572', ar1: 13064, atk2: '487-572', ar2: 13064,
    def: 3360, block: 50, pdr: 20, mdr: 75,
    fr: 75, cr: 75, lr: 110, pr: 110,
    eff: 0, immune: '閃電無效・毒素無效', ceff: 10,
  },
  {
    name: '超級暗黑破壞神', note: 'Über Diablo (Hellfire Torch)',
    lv: 110, xp: 5539200, hp: '650000-660000',
    atk1: '481-494', ar1: 14043, atk2: '143-299', ar2: 13064,
    def: 2940, block: 50, pdr: 50, mdr: 75,
    fr: 110, cr: 75, lr: 75, pr: 75,
    eff: 15, immune: '火焰無效', ceff: 10,
  },
  {
    name: '超級巴爾', note: 'Über Baal (Hellfire Torch)',
    lv: 110, xp: 10336000, hp: '650000-660000',
    atk1: '429-494', ar1: 16330, atk2: '214-312', ar2: 16330,
    def: 3150, block: 55, pdr: 50, mdr: 75,
    fr: 75, cr: 110, lr: 75, pr: 75,
    eff: 20, immune: '冰冷無效', ceff: 15,
  },
];

function resColor(v: number | string): string {
  const n = typeof v === 'number' ? v : parseInt(String(v));
  if (isNaN(n)) return '#e0e0e0';
  if (n >= 100) return '#ff4444';
  if (n >= 75) return '#ffaa00';
  return '#00ccaa';
}

function StatCell({ v, isRes = false }: { v: string | number; isRes?: boolean }) {
  const color = isRes ? resColor(v) : '#e0e0e0';
  const immune = isRes && (typeof v === 'number' ? v >= 100 : false);
  return (
    <td
      className="px-2 py-0.5 text-center border"
      style={{
        borderColor: '#1a1a1a',
        color,
        fontWeight: immune ? 'bold' : undefined,
        background: immune ? '#1a0000' : undefined,
      }}
    >
      {v}
    </td>
  );
}

export default function SuperBoss() {
  return (
    <div className="text-sm">
      <h1 className="text-xl font-bold mb-1" style={{ color: '#00ffff' }}>
        超強特殊頭目
      </h1>
      <p className="text-xs text-gray-500 mb-4">
        地獄難度・全部等級 110・<span style={{ color: '#ff4444' }}>紅色</span>=免疫（抵抗≥100）・
        <span style={{ color: '#ffaa00' }}>橙色</span>=75 抵抗上限・抵抗效率：突破免疫的傷害效率%
      </p>

      <div className="overflow-x-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr style={{ background: '#0d0d0d' }}>
              <th colSpan={2} className="px-2 py-1 border" style={{ borderColor: '#2a2a2a', color: '#888' }} />
              <th colSpan={3} className="px-2 py-1 border text-center" style={{ borderColor: '#2a2a2a', color: '#c0a030' }}>基本資料</th>
              <th colSpan={4} className="px-2 py-1 border text-center" style={{ borderColor: '#2a2a2a', color: '#6699cc' }}>近戰攻擊</th>
              <th colSpan={4} className="px-2 py-1 border text-center" style={{ borderColor: '#2a2a2a', color: '#66cc66' }}>防禦</th>
              <th colSpan={4} className="px-2 py-1 border text-center" style={{ borderColor: '#2a2a2a', color: '#cc6666' }}>元素抵抗</th>
              <th colSpan={3} className="px-2 py-1 border text-center" style={{ borderColor: '#2a2a2a', color: '#aa88cc' }}>免疫突破</th>
            </tr>
            <tr style={{ background: '#111' }}>
              {[
                ['名稱', '#c0a030'], ['說明', '#666'],
                ['等級', '#888'], ['經驗值', '#888'], ['生命值', '#888'],
                ['攻擊1', '#6699cc'], ['準確率1', '#6699cc'], ['攻擊2', '#6699cc'], ['準確率2', '#6699cc'],
                ['物理防禦', '#66cc66'], ['格檔率%', '#66cc66'], ['物理DR%', '#66cc66'], ['魔法DR%', '#66cc66'],
                ['火焰', '#ff6633'], ['冰冷', '#66ccff'], ['閃電', '#ffff44'], ['毒素', '#66ff66'],
                ['效率%', '#aa88cc'], ['免疫', '#aa88cc'], ['冰效率%', '#aa88cc'],
              ].map(([label, color]) => (
                <th key={label} className="px-2 py-1 border" style={{ borderColor: '#2a2a2a', color, whiteSpace: 'nowrap' }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOSSES.map((b, i) => (
              <tr key={b.name} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#0f0f0f' }}>
                <td className="px-2 py-1 border font-bold" style={{ borderColor: '#1a1a1a', color: '#e0c060', whiteSpace: 'nowrap' }}>{b.name}</td>
                <td className="px-2 py-1 border" style={{ borderColor: '#1a1a1a', color: '#555', whiteSpace: 'nowrap', fontSize: '0.65rem' }}>{b.note}</td>
                <StatCell v={b.lv} />
                <StatCell v={b.xp.toLocaleString()} />
                <StatCell v={b.hp} />
                <StatCell v={b.atk1} />
                <StatCell v={b.ar1.toLocaleString()} />
                <StatCell v={b.atk2} />
                <StatCell v={b.ar2.toLocaleString()} />
                <StatCell v={b.def.toLocaleString()} />
                <StatCell v={b.block} />
                <StatCell v={b.pdr} />
                <StatCell v={b.mdr} />
                <StatCell v={b.fr} isRes />
                <StatCell v={b.cr} isRes />
                <StatCell v={b.lr} isRes />
                <StatCell v={b.pr} isRes />
                <StatCell v={b.eff} />
                <td className="px-2 py-0.5 text-center border" style={{ borderColor: '#1a1a1a', color: b.immune === '－' ? '#333' : '#ff6666', whiteSpace: 'nowrap' }}>
                  {b.immune}
                </td>
                <StatCell v={b.ceff} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
