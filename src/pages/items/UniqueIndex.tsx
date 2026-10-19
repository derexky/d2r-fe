import { Link } from 'react-router-dom';
import { UNIQUE_CATEGORIES as CATEGORIES } from './itemCategories';


export default function UniqueIndex() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        獨特裝備
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            to={`/items/unique/${c.value}`}
            className="block px-3 py-2 text-sm text-center border hover:border-yellow-600 transition-colors"
            style={{ borderColor: '#3a352d', color: '#808000' }}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
