import { useState } from 'react';

interface CraftedRecipe {
  name: string;
  ingredients: string[];
  fixedMods: string[];
  randomMods: string[];
  baseTypes: string[];
}

const CATEGORIES: { key: string; label: string; color: string; recipes: CraftedRecipe[] }[] = [
  {
    key: 'hit',
    label: '打擊力道 (Hit Power)',
    color: '#ff6644',
    recipes: [
      {
        name: '普通級',
        ingredients: ['普通近戰武器', '完美藍寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5% 機率施放 4 級冰霜新星（攻擊時）',
          '擊中時使怪物逃跑 25%',
        ],
        randomMods: [
          '+1 插槽', '火焰/冰冷/閃電/毒素傷害', '攻擊值加成', '吸血', '擊退',
        ],
        baseTypes: ['斧、劍、矛、槌、鐮刀、匕首等普通近戰武器'],
      },
      {
        name: '精良級',
        ingredients: ['精良近戰武器', '完美藍寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5% 機率施放 4 級冰霜新星（攻擊時）',
          '擊中時使怪物逃跑 25%',
        ],
        randomMods: [
          '+1 插槽', '火焰/冰冷/閃電/毒素傷害', '攻擊值加成', '吸血', '擊退',
        ],
        baseTypes: ['斧、劍、矛、槌、鐮刀、匕首等精良近戰武器'],
      },
      {
        name: '精英級',
        ingredients: ['精英近戰武器', '完美藍寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5% 機率施放 4 級冰霜新星（攻擊時）',
          '擊中時使怪物逃跑 25%',
        ],
        randomMods: [
          '+1 插槽', '火焰/冰冷/閃電/毒素傷害', '攻擊值加成', '吸血', '擊退',
        ],
        baseTypes: ['斧、劍、矛、槌、鐮刀、匕首等精英近戰武器'],
      },
    ],
  },
  {
    key: 'blood',
    label: '鮮血 (Blood)',
    color: '#cc3333',
    recipes: [
      {
        name: '普通級',
        ingredients: ['普通武器', '完美紅寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '1-3% 生命偷取（攻擊時）',
          '+10-20 生命',
        ],
        randomMods: [
          '致命一擊', '補充生命', '吸血', '粉碎攻擊', '造成撕裂傷口',
        ],
        baseTypes: ['斧、劍、矛、槌等普通武器'],
      },
      {
        name: '精良級',
        ingredients: ['精良武器', '完美紅寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '1-3% 生命偷取（攻擊時）',
          '+10-20 生命',
        ],
        randomMods: [
          '致命一擊', '補充生命', '吸血', '粉碎攻擊', '造成撕裂傷口',
        ],
        baseTypes: ['斧、劍、矛、槌等精良武器'],
      },
      {
        name: '精英級',
        ingredients: ['精英武器', '完美紅寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '1-4% 生命偷取（攻擊時）',
          '+10-20 生命',
        ],
        randomMods: [
          '致命一擊', '補充生命', '吸血', '粉碎攻擊', '造成撕裂傷口',
        ],
        baseTypes: ['斧、劍、矛、槌等精英武器'],
      },
    ],
  },
  {
    key: 'caster',
    label: '施法師 (Caster)',
    color: '#8844ff',
    recipes: [
      {
        name: '普通級',
        ingredients: ['普通防具/珠寶飾品', '完美紫水晶', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5-10% 魔力再生',
          '+10-20 魔力',
          '1-4% 魔力偷取',
        ],
        randomMods: [
          '+1-3 技能等級', '施法速度加快', '魔力再生加成', '+冷卻時間',
        ],
        baseTypes: ['頭盔、盔甲、盾牌、手套、腰帶、靴子、護身符、戒指（普通）'],
      },
      {
        name: '精良級',
        ingredients: ['精良防具/珠寶飾品', '完美紫水晶', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5-10% 魔力再生',
          '+10-20 魔力',
          '1-4% 魔力偷取',
        ],
        randomMods: [
          '+1-3 技能等級', '施法速度加快', '魔力再生加成', '+冷卻時間',
        ],
        baseTypes: ['頭盔、盔甲、盾牌、手套、腰帶、靴子、護身符、戒指（精良）'],
      },
      {
        name: '精英級',
        ingredients: ['精英防具/珠寶飾品', '完美紫水晶', '珠寶', '符文（依等級）'],
        fixedMods: [
          '5-10% 魔力再生',
          '+10-20 魔力',
          '1-5% 魔力偷取',
        ],
        randomMods: [
          '+1-3 技能等級', '施法速度加快', '魔力再生加成', '+冷卻時間',
        ],
        baseTypes: ['頭盔、盔甲、盾牌、手套、腰帶、靴子、護身符、戒指（精英）'],
      },
    ],
  },
  {
    key: 'safety',
    label: '防禦力道 (Safety)',
    color: '#44aa44',
    recipes: [
      {
        name: '普通級',
        ingredients: ['普通防具/盾牌', '完美綠寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '+1 插槽',
          '+1-30 防禦',
          '+5 活力',
        ],
        randomMods: [
          '各系抗性', '傷害減免', '更佳取得魔法物品機率', '+生命',
        ],
        baseTypes: ['頭盔、盔甲、手套、腰帶、靴子、盾牌（普通）'],
      },
      {
        name: '精良級',
        ingredients: ['精良防具/盾牌', '完美綠寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '+1 插槽',
          '+1-30 防禦',
          '+5 活力',
        ],
        randomMods: [
          '各系抗性', '傷害減免', '更佳取得魔法物品機率', '+生命',
        ],
        baseTypes: ['頭盔、盔甲、手套、腰帶、靴子、盾牌（精良）'],
      },
      {
        name: '精英級',
        ingredients: ['精英防具/盾牌', '完美綠寶石', '珠寶', '符文（依等級）'],
        fixedMods: [
          '+1 插槽',
          '+1-30 防禦',
          '+5 活力',
        ],
        randomMods: [
          '各系抗性', '傷害減免', '更佳取得魔法物品機率', '+生命',
        ],
        baseTypes: ['頭盔、盔甲、手套、腰帶、靴子、盾牌（精英）'],
      },
    ],
  },
];

const RUNE_TABLE = [
  { clvl: '1–10', rune: 'El (1)' },
  { clvl: '11–20', rune: 'Eld (2)' },
  { clvl: '21–30', rune: 'Tir (3)' },
  { clvl: '31–40', rune: 'Nef (4)' },
  { clvl: '41–50', rune: 'Eth (5)' },
  { clvl: '51–60', rune: 'Ith (6)' },
  { clvl: '61–70', rune: 'Tal (7)' },
  { clvl: '71–80', rune: 'Ral (8)' },
  { clvl: '81–90', rune: 'Ort (9)' },
  { clvl: '91–99', rune: 'Thul (10)' },
];

export default function CraftedItems() {
  const [tab, setTab] = useState('hit');

  const cat = CATEGORIES.find((c) => c.key === tab)!;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#cc9966' }}>
        手工製作裝備
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        使用方塊配方製作的手工裝備，擁有固定詞綴加上隨機詞綴，可製作出強力個人裝備。
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className="px-3 py-1 text-sm border transition-colors"
            style={{
              borderColor: tab === c.key ? c.color : '#333',
              color: tab === c.key ? c.color : '#888',
              backgroundColor: tab === c.key ? '#110d00' : 'transparent',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mb-4 p-3 border max-w-lg" style={{ borderColor: '#1a1a1a' }}>
        <h3 className="text-xs font-bold text-gray-400 mb-2">符文對應等級（角色等級決定所需符文）</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-1">
          {RUNE_TABLE.map((r) => (
            <div key={r.clvl} className="text-xs">
              <span className="text-gray-500">Clvl {r.clvl}：</span>
              <span className="text-gray-300">{r.rune}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {cat.recipes.map((recipe) => (
          <div key={recipe.name} className="border p-3" style={{ borderColor: '#2a2a2a' }}>
            <h2 className="text-sm font-bold mb-2" style={{ color: cat.color }}>
              {recipe.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-gray-500 mb-1">材料</p>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-gray-300">• {ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-gray-500 mb-1">固定詞綴</p>
                <ul className="space-y-1">
                  {recipe.fixedMods.map((mod, i) => (
                    <li key={i} style={{ color: cat.color }}>• {mod}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-gray-500 mb-1">隨機詞綴（部分可能出現）</p>
                <ul className="space-y-1">
                  {recipe.randomMods.map((mod, i) => (
                    <li key={i} className="text-gray-400">• {mod}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t text-xs text-gray-600" style={{ borderColor: '#1a1a1a' }}>
              適用底材：{recipe.baseTypes[0]}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        注意：手工製作品需為藍色（魔法）品質底材。製作結果不可再次鑑定或重複製作。
      </p>
    </div>
  );
}
