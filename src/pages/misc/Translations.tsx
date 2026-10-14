import { useState, useMemo } from 'react';
import { RUNEWORDS, BASE_ITEMS, SET_ITEMS, UNIQUE_ITEMS, type TCategory } from './translationData';

type Tab = 'runewords' | 'base' | 'sets' | 'unique';

const TABS: Array<{ id: Tab; label: string; data: TCategory[] }> = [
  { id: 'runewords', label: '符文組', data: RUNEWORDS },
  { id: 'base',      label: '基礎裝備', data: BASE_ITEMS },
  { id: 'sets',      label: '成套裝備', data: SET_ITEMS },
  { id: 'unique',    label: '獨特裝備', data: UNIQUE_ITEMS },
];

export default function Translations() {
  const [tab, setTab] = useState<Tab>('runewords');
  const [search, setSearch] = useState('');

  const activeData = TABS.find(t => t.id === tab)!.data;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeData;
    return activeData
      .map(cat => ({
        ...cat,
        items: cat.items.filter(([en, old, nw]) =>
          en.toLowerCase().includes(q) ||
          old.includes(search.trim()) ||
          nw.includes(search.trim())
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [tab, search, activeData]);

  const total = filtered.reduce((s, c) => s + c.items.length, 0);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">
        新舊繁中翻譯對照表
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        暗黑破壞神 II：獄火重生 新舊繁體中文翻譯對照。
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch(''); }}
            className="px-3 py-1 text-xs border transition-colors"
            style={{
              borderColor: tab === t.id ? '#ffaa00' : '#423c33',
              color: tab === t.id ? '#ffaa00' : '#888',
              background: tab === t.id ? '#2a2000' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋（英文、舊譯、新譯）"
          className="px-3 py-1 text-sm bg-transparent border text-white w-64"
          style={{ borderColor: '#423c33' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            清除
          </button>
        )}
        <span className="text-xs text-gray-600">{total} 筆</span>
      </div>

      {/* Table */}
      <div className="space-y-4">
        {filtered.map(cat => (
          <div key={cat.label}>
            {cat.label !== '符文組' && cat.label !== '成套裝備' && cat.label !== '獨特裝備' && (
              <div
                className="text-xs font-bold px-2 py-1 mb-1"
                style={{ color: '#888', borderLeft: '2px solid #423c33', paddingLeft: '8px' }}
              >
                {cat.label}
              </div>
            )}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #302c26' }}>
                  <th className="text-left px-3 py-1.5 text-gray-500 font-normal w-1/3">英文</th>
                  <th className="text-left px-3 py-1.5 text-gray-500 font-normal w-1/3">舊譯</th>
                  <th className="text-left px-3 py-1.5 font-normal w-1/3" style={{ color: '#aaddff' }}>新譯</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map(([en, old, nw], i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/5 transition-colors"
                    style={{ borderBottom: '1px solid #1e1e1e' }}
                  >
                    <td className="px-3 py-1.5 text-gray-400 font-mono text-xs">{en}</td>
                    <td className="px-3 py-1.5 text-gray-300">{old || '—'}</td>
                    <td className="px-3 py-1.5" style={{ color: nw ? '#aaddff' : '#423c33' }}>
                      {nw || '（同舊譯）'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-600 text-sm py-4">沒有符合的結果。</p>
        )}
      </div>
    </div>
  );
}
