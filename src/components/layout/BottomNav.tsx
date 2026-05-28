import { NavLink } from 'react-router-dom';

const TABS = [
  { label: '首頁', to: '/', end: true },
  { label: '裝備', to: '/items/unique', end: false },
  { label: '符文字', to: '/runewords', end: false },
  { label: '攻略', to: '/builds', end: false },
] as const;

export default function BottomNav() {
  return (
    <nav
      className="flex md:hidden shrink-0 border-t"
      style={{
        backgroundColor: '#0a0a0a',
        borderColor: '#404040',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, to, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center py-4 text-sm transition-colors ${
              isActive ? 'text-yellow-300' : 'text-gray-400'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
