import { Link } from 'react-router-dom';
import NavTree from './NavTree';

export default function Sidebar() {
  return (
    <aside
      className="w-60 shrink-0 flex flex-col border-r overflow-y-auto"
      style={{ borderColor: '#2a2722', backgroundColor: '#0a0a09' }}
    >
      <Link
        to="/"
        className="flex items-center justify-center shrink-0 h-[76px] font-bold text-lg border-b brand"
        style={{ borderColor: '#2a2722' }}
      >
        <span>◆</span>易牙居
      </Link>
      <NavTree />
    </aside>
  );
}
