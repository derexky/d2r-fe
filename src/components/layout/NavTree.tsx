import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to?: string;
  children?: NavItem[];
}

const NAV: NavItem[] = [
  {
    label: '裝備研究',
    children: [
      { label: '獨特裝備', to: '/items/unique' },
      { label: '成套裝備', to: '/items/sets' },
      { label: '職業專屬', to: '/items/class' },
      { label: '獨特珠寶', to: '/items/jewels' },
      { label: '手工製作', to: '/items/crafted' },
      { label: '方塊合成', to: '/cube' },
      { label: '魔法字首字尾', to: '/magic/affixes' },
      { label: '飾品字首', to: '/magic/charm-affixes' },
      { label: '稀有裝備名稱', to: '/magic/rare-names' },
    ],
  },
  {
    label: '符文研究',
    children: [
      { label: '符文介紹', to: '/runes' },
      { label: '符文字', to: '/runewords' },
      { label: '寶石介紹', to: '/gems' },
    ],
  },
  {
    label: '職業攻略',
    children: [
      { label: '野蠻人', to: '/builds/barbarian' },
      { label: '亞馬遜', to: '/builds/amazon' },
      { label: '法師', to: '/builds/sorceress' },
      { label: '死靈法師', to: '/builds/necromancer' },
      { label: '聖騎士', to: '/builds/paladin' },
      { label: '德魯伊', to: '/builds/druid' },
      { label: '刺客', to: '/builds/assassin' },
    ],
  },
  {
    label: 'IAS 攻速',
    children: [
      { label: '傭兵計算器', to: '/ias' },
      { label: '武器速度表', to: '/ias/weapons' },
    ],
  },
  {
    label: '遊戲機制',
    children: [
      { label: '神殿介紹', to: '/shrines' },
      { label: 'Magic Find', to: '/magic-find' },
      { label: '地表暗黑', to: '/diablo-clone' },
      { label: '各地區小王', to: '/kings' },
      { label: '攻速斷點表', to: '/breakpoints' },
      { label: '場景等級', to: '/area-levels' },
      { label: '遊戲公式', to: '/formulas' },
      { label: '超強特殊頭目', to: '/super-boss' },
    ],
  },
  { label: '關於易牙居', to: '/about' },
];

function NavNode({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(true);
  const indent = depth * 12;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full text-left px-2 py-1 text-sm font-bold hover:text-yellow-400 transition-colors"
          style={{ paddingLeft: `${8 + indent}px`, color: '#c0a030' }}
        >
          {open ? '▾' : '▸'} {item.label}
        </button>
        {open && (
          <div>
            {item.children.map((child) => (
              <NavNode key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to!}
      className={({ isActive }) =>
        `block text-sm py-1 hover:text-yellow-300 transition-colors ${isActive ? 'text-yellow-300 font-bold' : 'text-gray-300'}`
      }
      style={{ paddingLeft: `${20 + indent}px` }}
    >
      {item.label}
    </NavLink>
  );
}

export default function NavTree() {
  return (
    <nav className="py-2">
      {NAV.map((item) => (
        <NavNode key={item.label} item={item} />
      ))}
    </nav>
  );
}
