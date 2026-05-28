import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

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
