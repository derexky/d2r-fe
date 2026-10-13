import { Link } from 'react-router-dom';
import NavTree from './NavTree';

export default function Sidebar() {
  return (
    <aside
      className="w-56 shrink-0 flex flex-col border-r overflow-y-auto"
      style={{ borderColor: '#3a352d', backgroundColor: '#11100e' }}
    >
      <Link
        to="/"
        className="block px-3 py-4 text-center font-bold text-lg border-b brand"
        style={{ borderColor: 'var(--line)' }}
      >
        <span>◆</span>易牙居
      </Link>
      <NavTree />
    </aside>
  );
}
