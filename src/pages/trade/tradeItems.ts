import { api } from '../../api';
import { TRADE_CATEGORIES } from '../items/itemCategories';

export interface TradeItem {
  ref: string;
  name: string;
  kind: 'item' | 'set' | 'runeword' | 'rune' | 'base' | 'misc';
  category: string | null;
  slot?: string;
  sockets?: number;
  types?: string[];
}

const SLOT_LABEL: Record<string, string> = { weapon: '武器', armor: '盔甲', shield: '盾牌', helm: '頭盔' };

let cache: Promise<TradeItem[]> | undefined;

// Built from the item DB by d2r-service; retry on the next call if it failed
export function loadTradeItems(): Promise<TradeItem[]> {
  cache ??= fetch('/api/data/trade-items').then((r) => {
    if (!r.ok) throw new Error(`trade-items: HTTP ${r.status}`);
    return r.json() as Promise<TradeItem[]>;
  }).catch((err: unknown) => {
    cache = undefined;
    throw err;
  });
  return cache;
}

// The tooltip lines the item DB holds for a unique or runeword; other kinds have none
export async function loadStatLabels(ref: string): Promise<string[]> {
  const [kind, id] = ref.split(':');
  if (kind === 'item') return (JSON.parse((await api.getItem(+id)).stats ?? '[]') as { label: string }[]).map((s) => s.label);
  if (kind === 'runeword') return JSON.parse((await api.getRuneword(+id)).effects ?? '[]');
  return [];
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
          : t.kind === 'set'
            ? `套裝・${category}`
            : category;
  return `${t.name}（${kind}）`;
}

// Same check as d2r-service: same slot, enough sockets and an allowed item type
export const fitsRuneword = (base: TradeItem, runeword: TradeItem) =>
  base.kind === 'base' &&
  base.slot === runeword.slot &&
  (base.sockets ?? 0) >= (runeword.sockets ?? 0) &&
  (!runeword.types || !!base.types?.some((t) => runeword.types!.includes(t)));

// Dropdown options for the bases a runeword can be made in, sorted by label
export const runewordBaseOptions = (items: TradeItem[], runeword: TradeItem | undefined) =>
  runeword
    ? items
        .filter((t) => fitsRuneword(t, runeword))
        .map((t) => ({ ref: t.ref, label: itemLabel(t) }))
        .sort((a, b) => a.label.localeCompare(b.label, 'zh-Hant'))
    : [];

// Item quality, only recorded for bases; colours follow the in-game item names
export const QUALITIES = [
  { value: 'normal', label: '普通', color: '#c8c8c8' },
  { value: 'magic', label: '魔法', color: '#6969ff' },
  { value: 'rare', label: '稀有', color: '#ffff64' },
  { value: 'crafted', label: '合成', color: '#ffa800' },
];

export type BaseFilter = '' | 'named' | 'base';

export const BASE_FILTERS: { label: string; value: BaseFilter }[] = [
  { label: '全部', value: '' },
  { label: '暗金／套裝', value: 'named' },
  { label: '藍黃橘裝／底材', value: 'base' },
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
