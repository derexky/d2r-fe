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
    ],
  },
  {
    label: '符文研究',
    children: [
      { label: '符文字', to: '/runewords' },
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
  { label: 'IAS 計算', to: '/ias' },
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
