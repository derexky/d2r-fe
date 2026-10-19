import { api } from '../../api';
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

// The list never changes while the app runs; retry on the next call if it failed
export function loadTradeItems(): Promise<TradeItem[]> {
  cache ??= api.getTradeItems().catch((err: unknown) => {
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
