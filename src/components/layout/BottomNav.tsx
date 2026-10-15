import { NavLink, useLocation } from 'react-router-dom';
import { ITEM_TABS } from '../../pages/items/itemTabs';

// `match`: extra path prefixes that also light the tab (裝備 covers every 裝備圖鑑 section)
const TABS: { label: string; to: string; end: boolean; match?: string[] }[] = [
  { label: '首頁', to: '/', end: true },
  { label: '裝備', to: '/items/base', end: false, match: ITEM_TABS.map((t) => t.to) },
  { label: '符文組', to: '/runewords', end: false },
  { label: '攻略', to: '/builds', end: false },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      className="flex md:hidden shrink-0 border-t"
      style={{
        backgroundColor: '#11100e',
        borderColor: '#3a352d',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, to, end, match }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center py-4 text-sm transition-colors ${
              isActive || match?.some((m) => pathname.startsWith(m)) ? 'text-yellow-300' : 'text-gray-400'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
