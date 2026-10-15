import { useLocation, useNavigate } from 'react-router-dom';

// Back to the previous page; when opened directly (no in-app history) go to `fallback` instead
export default function BackButton({ fallback, label = '返回' }: { fallback: string; label?: string }) {
  const navigate = useNavigate();
  const { key } = useLocation();
  return (
    <button
      onClick={() => (key === 'default' ? navigate(fallback) : navigate(-1))}
      className="text-xs mb-3 hover:text-yellow-300 transition-colors"
      style={{ color: '#888' }}
    >
      ← {label}
    </button>
  );
}
