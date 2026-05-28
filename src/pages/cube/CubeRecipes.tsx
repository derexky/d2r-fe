import { useState } from 'react';

const TABS = [
  { key: 'rune',  label: '符文升級' },
  { key: 'armor', label: '裝備升級' },
  { key: 'item',  label: '物品組合' },
];

interface Recipe {
  input: string;
  output: string;
  note?: string;
}

const RUNE_RECIPES: Recipe[] = [
  { input: '3× El 艾爾 (1)', output: 'Eld 艾德 (2)' },
  { input: '3× Eld 艾德 (2)', output: 'Tir 特爾 (3)' },
  { input: '3× Tir 特爾 (3)', output: 'Nef 那夫 (4)' },
  { input: '3× Nef 那夫 (4)', output: 'Eth 愛斯 (5)' },
  { input: '3× Eth 愛斯 (5)', output: 'Ith 伊司 (6)' },
  { input: '3× Ith 伊司 (6)', output: 'Tal 塔爾 (7)' },
  { input: '3× Tal 塔爾 (7)', output: 'Ral 拉爾 (8)' },
  { input: '3× Ral 拉爾 (8)', output: 'Ort 歐特 (9)' },
  { input: '3× Ort 歐特 (9)', output: 'Thul 書爾 (10)' },
  { input: '3× Thul 書爾 (10) + 碎裂的黃寶石', output: 'Amn 安姆 (11)' },
  { input: '3× Amn 安姆 (11) + 碎裂的紫寶石', output: 'Sol 索爾 (12)' },
  { input: '3× Sol 索爾 (12) + 碎裂的藍寶石', output: 'Shael 夏 (13)' },
  { input: '3× Shael 夏 (13) + 碎裂的紅寶石', output: 'Dol 多爾 (14)' },
  { input: '3× Dol 多爾 (14) + 碎裂的綠寶石', output: 'Hel 海爾 (15)', note: '限天梯 / 單機版' },
  { input: '3× Hel 海爾 (15) + 碎裂的鑽石', output: 'Io 破 (16)', note: '限天梯 / 單機版' },
  { input: '3× Io 破 (16) + 裂開的黃寶石', output: 'Lum 盧姆 (17)', note: '限天梯 / 單機版' },
  { input: '3× Lum 盧姆 (17) + 裂開的紫寶石', output: 'Ko 科 (18)', note: '限天梯 / 單機版' },
  { input: '3× Ko 科 (18) + 裂開的藍寶石', output: 'Fal 法爾 (19)', note: '限天梯 / 單機版' },
  { input: '3× Fal 法爾 (19) + 裂開的紅寶石', output: 'Lem 藍姆 (20)', note: '限天梯 / 單機版' },
  { input: '3× Lem 藍姆 (20) + 裂開的綠寶石', output: 'Pul 普爾 (21)', note: '限天梯 / 單機版' },
  { input: '2× Pul 普爾 (21) + 裂開的鑽石', output: 'Um 烏姆 (22)', note: '限天梯 / 單機版' },
  { input: '2× Um 烏姆 (22) + 黃寶石', output: 'Mal 馬爾 (23)', note: '限天梯 / 單機版' },
  { input: '2× Mal 馬爾 (23) + 紫寶石', output: 'Ist 伊司特 (24)', note: '限天梯 / 單機版' },
  { input: '2× Ist 伊司特 (24) + 藍寶石', output: 'Gul 古爾 (25)', note: '限天梯 / 單機版' },
  { input: '2× Gul 古爾 (25) + 紅寶石', output: 'Vex 伐克斯 (26)', note: '限天梯 / 單機版' },
  { input: '2× Vex 伐克斯 (26) + 綠寶石', output: 'Ohm 歐姆 (27)', note: '限天梯 / 單機版' },
  { input: '2× Ohm 歐姆 (27) + 鑽石', output: 'Lo 羅 (28)', note: '限天梯 / 單機版' },
  { input: '2× Lo 羅 (28) + 無瑕疵的黃寶石', output: 'Sur 瑟 (29)', note: '限天梯 / 單機版' },
  { input: '2× Sur 瑟 (29) + 無瑕疵的紫寶石', output: 'Ber 貝 (30)', note: '限天梯 / 單機版' },
  { input: '2× Ber 貝 (30) + 無瑕疵的藍寶石', output: 'Jah 喬 (31)', note: '限天梯 / 單機版' },
  { input: '2× Jah 喬 (31) + 無瑕疵的紅寶石', output: 'Cham 查姆 (32)', note: '限天梯 / 單機版' },
  { input: '2× Cham 查姆 (32) + 無瑕疵的綠寶石', output: 'Zod 薩德 (33)', note: '限天梯 / 單機版' },
];

const ARMOR_RECIPES: Recipe[] = [
  { input: 'El 艾爾 (1) + 碎裂的寶石 + 低品質盔甲', output: '相同型態的一般品質盔甲' },
  { input: 'Eld 艾德 (2) + 碎裂的寶石 + 低品質武器', output: '相同型態的一般品質武器' },
  { input: 'Tal (7) + Shael (13) + 完美的鑽石 + 一般品質獨特防具', output: '防具的進階版本', note: '黃金公式' },
  { input: 'Ko (18) + Lem (20) + 完美的鑽石 + 進階獨特防具', output: '防具的菁英版本', note: '限天梯，黃金公式' },
  { input: 'Ral (8) + Sol (12) + 完美的綠寶石 + 一般品質獨特武器', output: '武器的進階版本', note: '黃金公式' },
  { input: 'Lum (17) + Pul (21) + 完美的綠寶石 + 進階獨特武器', output: '武器的菁英版本', note: '限天梯，黃金公式' },
  { input: 'Ort (9) + Amn (11) + 完美的藍寶石 + 普通的稀有武器', output: '武器的進階版本', note: '黃色公式' },
  { input: 'Ral (8) + Thul (10) + 完美的紫寶石 + 普通的稀有防具', output: '防具的進階版本', note: '黃色公式' },
  { input: 'Fal (19) + Um (22) + 完美的藍寶石 + 進階的稀有武器', output: '武器的精英版本', note: '黃色公式' },
  { input: 'Ko (18) + Pul (21) + 完美的紫寶石 + 進階的稀有防具', output: '防具的精英版本', note: '黃色公式' },
  { input: 'Tal (7) + Thul (10) + 完美的黃寶石 + 一般品質盔甲', output: '相同型態具有變動凹槽數量的盔甲' },
  { input: 'Ral (8) + Amn (11) + 完美的紫寶石 + 一般品質武器', output: '相同型態具有變動凹槽數量的武器' },
  { input: 'Ral (8) + Thul (10) + 完美的藍寶石 + 一般品質頭盔', output: '相同型態具有變動凹槽數量的頭盔' },
  { input: 'Tal (7) + Amn (11) + 完美的紅寶石 + 一般品質盾牌', output: '相同型態具有變動凹槽數量的盾牌' },
  { input: 'Ort (9) + 武器', output: '修復完全的武器' },
  { input: 'Ral (8) + 盔甲', output: '修復完全的盔甲' },
  { input: 'Hel (15) + 城鎮捲軸 + 已有鑲物品的裝備', output: '將已鑲上之物品全部摧毀（凹槽依然存在）' },
  { input: '3× 無瑕疵的寶石 + 魔法武器', output: '有凹槽的魔法武器' },
];

const ITEM_RECIPES: Recipe[] = [
  { input: '3× 完美的骷髏 + 稀有物品 + 喬丹之石', output: '在稀有物品上增加一個凹槽' },
  { input: '1× 完美的骷髏 + 稀有物品 + 喬丹之石', output: '新的同類型高品質稀有物品' },
  { input: '6× 完美的骷髏 + 稀有物品', output: '同類型隨機低品質稀有物品（限6格以內）' },
  { input: '4× 治療藥劑 + 紅寶石 + 魔法/套裝/稀有劍類', output: '同類型劍類武器擁有吸血屬性' },
  { input: '3× 戒子', output: '隨機的護身符（最高等級 = [(3×角色等級)/4]+3）' },
  { input: '3× 護身符', output: '隨機的戒子（最高等級 = [(3×角色等級)/4]+3）' },
  { input: '3× 治療藥劑 + 3× 法力藥劑 + 碎裂的寶石', output: '回復藥劑' },
  { input: '3× 治療藥劑 + 3× 法力藥劑 + 寶石', output: '全面回復藥劑' },
  { input: '3× 小的回復藥劑', output: '全面回復藥劑' },
  { input: '3× 同類型同等級的寶石（低於完美）', output: '同類型高一等級的寶石' },
  { input: '3× 碎裂的寶石 + 劍類武器', output: '有魔法屬性同類型的劍（+1~2 凹槽）' },
  { input: '3× 碎裂的寶石 + 魔法武器', output: '有魔法屬性同類型的武器 (ilvl=25)' },
  { input: '3× 無瑕疵的寶石 + 魔法武器', output: '有魔法屬性同類型的武器 (ilvl=30)' },
  { input: '3× 標準的寶石 + 有1凹槽的魔法武器', output: '有魔法屬性同類型的武器 (ilvl=30)' },
  { input: '3× 完美的寶石（任何類型）+ 魔法物品', output: '同類型新的隨機魔法物品（最高等級100）' },
  { input: '2× 十字弓彈', output: '1捆箭矢（數量隨機）' },
  { input: '2× 箭矢', output: '1捆十字弓彈（數量隨機）' },
  { input: '1× 矛 + 1捆弓箭', output: '1捆標槍' },
  { input: '1× 斧頭 + 1× 匕首', output: '飛斧（數量隨機）' },
  { input: '扼殺氣體藥劑 + 任何治療藥劑', output: '解毒藥劑' },
  { input: '6× 完美的寶石（每種1個）+ 任何項鍊', output: '多彩的項鍊（全面抗性 15%~30%）' },
  { input: '1× 完美的綠寶石 + 戒指 + 解毒藥劑', output: '鉻綠戒指（抗毒 20%~27%）' },
  { input: '1× 完美的紅寶石 + 戒指 + 爆炸藥劑', output: '石榴石戒指（抗火 20%~27%）' },
  { input: '1× 完美的黃寶石 + 戒指 + 回復藥劑', output: '珊瑚戒指（抗電 20%~27%）' },
  { input: '1× 完美的藍寶石 + 戒指 + 溶解藥劑', output: '鈷石戒指（抗寒 20%~27%）' },
  { input: '小盾（魔法或以上）+ 狼牙棒 + 2× 骷髏頭', output: '小尖刺盾牌' },
  { input: '鑽石 + 法杖 + 波形劍 + 腰帶', output: '長柄斧' },
  { input: '維特之腿 + 傳送門之書', output: '隱藏乳牛關卡（僅限 ACT1 城鎮，需擊殺巴爾）' },
];

const RECIPES_MAP: Record<string, Recipe[]> = {
  rune: RUNE_RECIPES,
  armor: ARMOR_RECIPES,
  item: ITEM_RECIPES,
};

function RecipeTable({ recipes }: { recipes: Recipe[] }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr style={{ borderBottom: '1px solid #333' }}>
          <th className="text-left py-2 px-3 text-gray-400 font-normal w-1/2">材料</th>
          <th className="text-left py-2 px-3 text-gray-400 font-normal">結果</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((r, i) => (
          <tr
            key={i}
            style={{ backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent', borderBottom: '1px solid #1a1a1a' }}
          >
            <td className="py-2 px-3 text-gray-300">{r.input}</td>
            <td className="py-2 px-3">
              <span style={{ color: '#c0a030' }}>{r.output}</span>
              {r.note && (
                <span className="text-xs text-gray-500 ml-2">（{r.note}）</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function CubeRecipes() {
  const [tab, setTab] = useState('rune');

  return (
    <div>
      <h1 className="text-xl font-bold mb-4" style={{ color: '#c0a030' }}>
        方塊合成公式
      </h1>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1 text-sm border transition-colors"
            style={{
              borderColor: tab === t.key ? '#c0a030' : '#333',
              color: tab === t.key ? '#c0a030' : '#888',
              backgroundColor: tab === t.key ? '#1a1200' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <RecipeTable recipes={RECIPES_MAP[tab]} />
      </div>
    </div>
  );
}
