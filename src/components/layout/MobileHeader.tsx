interface Props {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: Props) {
  return (
    <header
      className="flex md:hidden items-center justify-between shrink-0 px-4 h-14 border-b backdrop-blur-md"
      style={{ backgroundColor: '#0a0a09ed', borderColor: '#2a2722' }}
    >
      <button
        onClick={onMenuClick}
        className="text-gray-300 hover:text-white text-2xl leading-none p-1"
        aria-label="開啟選單"
      >
        ☰
      </button>
      <span className="font-bold text-base brand">
        <span>◆</span>易牙居
      </span>
      <div className="w-9" />
    </header>
  );
}
