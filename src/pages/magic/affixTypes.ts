export interface Affix {
  id: string;
  kind: '前綴' | '後綴';
  name_zh: string;
  name_en: string | null;
  level: number;
  required_level: number | null;
  rare: boolean;
  types: string[];
  class_specific: string | null;
  stats: string[];
}

// d2r.world category gids stored in affixes.types
export const GID_LABELS: Record<string, string> = {
  rings: '戒指', amulets: '護身符', jewels: '珠寶', purehelms: '頭盔', 'bar-helms': '野蠻人頭盔',
  'dru-helms': '德魯伊頭盔', circlets: '頭環', armors: '護甲', pureshields: '盾牌', 'pal-shields': '聖騎士盾牌',
  'nec-shields': '死靈萎縮頭顱', 'war-shields': '術士魔典', belts: '腰帶', boots: '鞋子', gloves: '手套',
  swords: '刀劍', daggers: '匕首', axes: '斧', polearms: '長柄武器', purespears: '長矛',
  'ama-spears': '亞馬遜專用長矛', clubs: '短棒', puremaces: '釘鎚', hammers: '重槌', scepters: '權杖',
  staves: '法杖', orbs: '魔法使法珠', wands: '死靈法師魔杖', katars: '刺客拳刃', purebows: '弓',
  'ama-bows': '亞馬遜專用弓', crossbows: '弩', purejavelins: '標槍', 'ama-javelins': '亞馬遜專用標槍',
  'throwing-axes': '投擲飛斧', 'throwing-knives': '投擲飛刀', 'grand-charms': '特大咒符',
  'large-charms': '大型咒符', 'small-charms': '小型咒符',
};

export const CHARM_GIDS = ['small-charms', 'large-charms', 'grand-charms'] as const;
