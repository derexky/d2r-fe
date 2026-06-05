const P = '/assets/img/auras';

interface Aura {
  name: string;
  img: string;
  gif: string;
}

const OFFENSIVE: Aura[] = [
  { name: '力量',     img: `${P}/might.png`,         gif: `${P}/might.gif` },
  { name: '神聖火焰', img: `${P}/holy-fire.png`,      gif: `${P}/holy-fire.gif` },
  { name: '荊棘',     img: `${P}/thorns.png`,         gif: `${P}/thorns.gif` },
  { name: '祝福瞄準', img: `${P}/blessed-aim.png`,    gif: `${P}/blessed-aim.gif` },
  { name: '專注',     img: `${P}/concentration.png`,  gif: `${P}/concentration.gif` },
  { name: '神聖冰凍', img: `${P}/holy-freeze.png`,    gif: `${P}/holy-freeze.gif` },
  { name: '神聖電擊', img: `${P}/holy-shock.png`,     gif: `${P}/holy-shock.gif` },
  { name: '庇護',     img: `${P}/sanctuary.png`,      gif: `${P}/sanctuary.gif` },
  { name: '狂熱',     img: `${P}/fanaticism.png`,     gif: `${P}/fanaticism.gif` },
  { name: '信念',     img: `${P}/conviction.png`,     gif: `${P}/conviction.gif` },
];

const DEFENSIVE: Aura[] = [
  { name: '祈禱', img: `${P}/prayer.png`,            gif: `${P}/prayer.gif` },
  { name: '抗火', img: `${P}/resist-fire.png`,       gif: `${P}/resist-fire.gif` },
  { name: '反抗', img: `${P}/defiance.png`,          gif: `${P}/defiance.gif` },
  { name: '抗寒', img: `${P}/resist-cold.png`,       gif: `${P}/resist-cold.gif` },
  { name: '淨化', img: `${P}/cleansing.png`,         gif: `${P}/cleansing.gif` },
  { name: '抗電', img: `${P}/resist-lightning.png`,  gif: `${P}/resist-lightning.gif` },
  { name: '活力', img: `${P}/vigor.png`,             gif: `${P}/vigor.gif` },
  { name: '冥思', img: `${P}/meditation.png`,        gif: `${P}/meditation.gif` },
  { name: '救贖', img: `${P}/redemption.png`,        gif: `${P}/redemption.gif` },
  { name: '聖護', img: `${P}/salvation.png`,         gif: `${P}/salvation.gif` },
];

function AuraCard({ aura }: { aura: Aura }) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-2"
      style={{ border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d' }}
    >
      <span className="text-sm font-bold" style={{ color: '#cc66ff' }}>{aura.name}</span>
      <img src={aura.img} alt={aura.name} className="w-28 h-28 object-contain" />
      <img src={aura.gif} alt={`${aura.name} 特效`} className="w-28 h-28 object-contain" />
    </div>
  );
}

function AuraSection({ title, auras }: { title: string; auras: Aura[] }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-3" style={{ color: '#c0a030' }}>{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {auras.map((a) => <AuraCard key={a.name} aura={a} />)}
      </div>
    </section>
  );
}

export default function AuraList() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#cc66ff' }}>靈氣特效對照</h1>
      <p className="text-xs text-gray-500 mb-6">聖騎士靈氣特效與技能名稱對照表</p>
      <AuraSection title="攻擊靈氣" auras={OFFENSIVE} />
      <AuraSection title="防禦靈氣" auras={DEFENSIVE} />
    </div>
  );
}
