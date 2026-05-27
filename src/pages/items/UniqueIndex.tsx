import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: '斧類', value: 'axes' },
  { label: '弓類', value: 'bows' },
  { label: '棍棒類', value: 'clubs' },
  { label: '匕首類', value: 'daggers' },
  { label: '鐵鎚類', value: 'hammers' },
  { label: '長柄類', value: 'javelins' },
  { label: '矛類', value: 'spears' },
  { label: '法杖類', value: 'staves' },
  { label: '刀類', value: 'swords' },
  { label: '棒杖類', value: 'wands' },
  { label: '圓盾類', value: 'shields' },
  { label: '頭盔類', value: 'helms' },
  { label: '盔甲類', value: 'armors' },
  { label: '手套類', value: 'gloves' },
  { label: '腰帶類', value: 'belts' },
  { label: '靴類', value: 'boots' },
  { label: '戒指', value: 'rings' },
  { label: '護身符', value: 'amulets' },
];

export default function UniqueIndex() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#808000' }}>
        獨特裝備
      </h1>
      <div className="grid grid-cols-3 gap-2 max-w-md">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            to={`/items/unique/${c.value}`}
            className="block px-3 py-2 text-sm text-center border hover:border-yellow-600 transition-colors"
            style={{ borderColor: '#404040', color: '#808000' }}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
