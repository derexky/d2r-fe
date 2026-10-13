import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavTree from './NavTree';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      onCloseRef.current();
    }
  }, [pathname]);

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={handleBackdropClick}
      />
      <div
        className="fixed inset-y-0 left-0 w-64 z-50 flex flex-col overflow-y-auto"
        style={{ backgroundColor: '#11100e', borderRight: '1px solid #3a352d' }}
      >
        <div
          className="flex items-center justify-between px-4 py-4 shrink-0 border-b"
          style={{ borderColor: '#3a352d' }}
        >
          <span className="font-bold text-lg brand">
        <span>◆</span>易牙居
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
            aria-label="關閉選單"
          >
            ✕
          </button>
        </div>
        <NavTree />
      </div>
    </div>
  );
}
