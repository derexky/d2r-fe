import { Link } from 'react-router-dom';
import NavTree from './NavTree';

export default function Sidebar() {
  return (
    <aside
      className="w-56 shrink-0 flex flex-col border-r overflow-y-auto"
      style={{ borderColor: '#404040', backgroundColor: '#0a0a0a' }}
    >
      <Link
        to="/"
        className="block px-3 py-4 text-center font-bold text-lg border-b"
        style={{ color: '#808000', borderColor: '#404040' }}
      >
        易牙居
      </Link>
      <NavTree />
    </aside>
  );
}
