import { Link } from 'react-router-dom';

const ARMOR_CATEGORIES = [
  { label: '頭盔', value: 'helms' },
  { label: '護甲', value: 'armors' },
  { label: '盾牌', value: 'shields' },
  { label: '聖騎士盾牌', value: 'pal-shields' },
  { label: '腰帶', value: 'belts' },
  { label: '靴子', value: 'boots' },
  { label: '手套', value: 'gloves' },
];

const WEAPON_CATEGORIES = [
  { label: '刀劍', value: 'swords' },
  { label: '斧', value: 'axes' },
  { label: '長柄武器', value: 'polearms' },
  { label: '長矛', value: 'spears' },
  { label: '短棒', value: 'clubs' },
  { label: '釘鎚', value: 'puremaces' },
  { label: '重槌', value: 'hammers' },
  { label: '權杖', value: 'scepters' },
  { label: '法杖', value: 'staves' },
  { label: '法珠', value: 'orbs' },
  { label: '魔杖', value: 'wands' },
  { label: '拳刃', value: 'katars' },
  { label: '匕首', value: 'daggers' },
  { label: '弓', value: 'bows' },
  { label: '弩', value: 'crossbows' },
  { label: '標槍', value: 'javelins' },
  { label: '投擲武器', value: 'throwings' },
];

function CategoryGrid({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold mb-2" style={{ color: '#c6a25a' }}>{title}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {items.map((c) => (
          <Link
            key={c.value}
            to={`/items/base/${c.value}`}
            className="block px-3 py-2 text-sm text-center border hover:border-yellow-600 transition-colors"
            style={{ borderColor: '#3a352d', color: '#808000' }}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BaseItemIndex() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        基礎裝備
      </h1>
      <CategoryGrid title="防具" items={ARMOR_CATEGORIES} />
      <CategoryGrid title="武器" items={WEAPON_CATEGORIES} />
    </div>
  );
}
