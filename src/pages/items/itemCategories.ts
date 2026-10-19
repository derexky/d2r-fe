// Values match items.category in d2r-service's DB
export const UNIQUE_CATEGORIES = [
  { label: '斧類', value: 'axes' },
  { label: '弓類', value: 'bows' },
  { label: '弩類', value: 'crossbows' },
  { label: '匕首類', value: 'daggers' },
  { label: '鐵鎚類', value: 'maces' },
  { label: '長柄類', value: 'polearms' },
  { label: '節杖類', value: 'scepters' },
  { label: '矛類', value: 'spears' },
  { label: '法杖類', value: 'staves' },
  { label: '刀類', value: 'swords' },
  { label: '投擲類', value: 'throwing' },
  { label: '標槍類', value: 'javelins' },
  { label: '棒杖類', value: 'wands' },
  { label: '圓盾類', value: 'shields' },
  { label: '頭盔類', value: 'helms' },
  { label: '頭箍類', value: 'circlets' },
  { label: '盔甲類', value: 'armors' },
  { label: '手套類', value: 'gloves' },
  { label: '腰帶類', value: 'belts' },
  { label: '靴類', value: 'boots' },
  { label: '戒指', value: 'rings' },
  { label: '護身符', value: 'amulets' },
  { label: '護符', value: 'charms' },
];

// Every items.category plus the extra trade-item kinds, and 其他 for anything else
export const TRADE_CATEGORIES = [
  ...UNIQUE_CATEGORIES,
  { label: '珠寶', value: 'jewels' },
  { label: '職業專屬', value: 'class_specific' },
  { label: '符文之語', value: 'runewords' },
  { label: '符文', value: 'runes' },
  { label: '鑰匙', value: 'keys' },
  { label: '先祖雕像', value: 'statues' },
  { label: '其他', value: 'other' },
];
