import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileDrawer from './MobileDrawer';
import BottomNav from './BottomNav';
import PWAUpdatePrompt from '../PWAUpdatePrompt';

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-black text-white">
      <div className="hidden md:contents">
        <Sidebar />
      </div>
      <MobileHeader onMenuClick={openDrawer} />
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
      <BottomNav />
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <PWAUpdatePrompt />
    </div>
  );
}
