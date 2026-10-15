import { NavLink, Outlet } from 'react-router-dom';
import { ITEM_TABS } from './itemTabs';

// One page for 基礎 / 獨特 / 成套 / 職業專屬: shared tabs above each section's own routes
export default function ItemsLayout() {
  return (
    <div>
      <div className="flex gap-1 mb-4 flex-wrap">
        {ITEM_TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className="px-3 py-1 text-xs border transition-colors"
            style={({ isActive }) => ({
              borderColor: isActive ? '#cc9900' : '#2a2620',
              color: isActive ? '#ffcc00' : '#888',
              background: isActive ? '#1a1400' : 'transparent',
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
