import { TRADE_CATEGORIES } from '../items/itemCategories';

export interface TradeItem {
  ref: string;
  name: string;
  kind: 'item' | 'runeword' | 'rune' | 'base' | 'misc';
  category: string | null;
  slot?: string;
}

const SLOT_LABEL: Record<string, string> = { weapon: '武器', armor: '盔甲', shield: '盾牌', helm: '頭盔' };

let cache: Promise<TradeItem[]> | undefined;

// Static file written by d2r-service's SyncService; retry on the next call if it failed
export function loadTradeItems(): Promise<TradeItem[]> {
  cache ??= fetch('/data/trade-items.json').then((r) => {
    if (!r.ok) throw new Error(`trade-items.json: HTTP ${r.status}`);
    return r.json() as Promise<TradeItem[]>;
  }).catch((err: unknown) => {
    cache = undefined;
    throw err;
  });
  return cache;
}

// Unique per item: same-named items differ in kind, category or slot (族長 axe vs sword, 精神 weapon vs shield)
export function itemLabel(t: TradeItem): string {
  const category = TRADE_CATEGORIES.find((c) => c.value === t.category)?.label ?? '';
  const kind =
    t.kind === 'runeword'
      ? `符文之語・${SLOT_LABEL[t.slot ?? ''] ?? ''}`
      : t.kind === 'rune'
        ? '符文'
        : t.kind === 'base'
          ? `底材・${category}`
          : category;
  return `${t.name}（${kind}）`;
}

export type BaseFilter = '' | 'named' | 'base';

export const BASE_FILTERS: { label: string; value: BaseFilter }[] = [
  { label: '全部', value: '' },
  { label: '暗金／套裝', value: 'named' },
  { label: '底材', value: 'base' },
];

// Dropdown options for one category, sorted by label; hasBoth says whether the base filter is worth showing
export function categoryOptions(items: TradeItem[], category: string, baseFilter: BaseFilter) {
  const inCategory = items.filter((t) => t.category === category);
  const hasBoth = inCategory.some((t) => t.kind === 'base') && inCategory.some((t) => t.kind !== 'base');
  const options = inCategory
    .filter((t) => !baseFilter || (t.kind === 'base') === (baseFilter === 'base'))
    .map((t) => ({ ref: t.ref, name: t.name, label: itemLabel(t) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-Hant'));
  return { options, hasBoth };
}
