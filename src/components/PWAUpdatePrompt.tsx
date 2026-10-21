import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, r) {
      if (!r) return;
      // 瀏覽器只在載入網頁時檢查新版；分頁一直開著、或 App 從背景切回時要自己檢查
      setInterval(() => r.update(), 60 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') r.update();
      });
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg bg-indigo-700 px-4 py-3 text-sm text-white shadow-lg">
      <span>有新版本可用</span>
      <button
        className="rounded bg-white px-2 py-1 text-indigo-700 font-semibold"
        onClick={() => updateServiceWorker(true)}
      >
        更新
      </button>
    </div>
  );
}
