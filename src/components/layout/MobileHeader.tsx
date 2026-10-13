interface Props {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: Props) {
  return (
    <header
      className="flex md:hidden items-center justify-between shrink-0 px-4 py-3 border-b"
      style={{ backgroundColor: '#11100e', borderColor: '#3a352d' }}
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
