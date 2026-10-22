// Self-check for src/pages/trade/ocrText.ts. Run: node scripts/ocr-text.check.ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { editDistance, findTextLines, hideFixedStats, inkMask, makeLineCorrector, matchLine, mergeDigits, padLines } from '../src/pages/trade/ocrText.ts';

assert.equal(editDistance('增強傷害', '増強傷審'), 2);
assert.equal(editDistance('', 'abc'), 3);

const terms: string[] = JSON.parse(readFileSync(new URL('../public/data/ocr-terms.json', import.meta.url), 'utf8'));
const correct = makeLineCorrector(terms);
assert.equal(correct('+60% 增強傷審'), '+60% 增強傷害');           // one misread char snapped
assert.equal(correct('+3 冰封球'), '+3 冰封球');                    // known term untouched
assert.equal(correct('+20 力暈'), '+20 力暈');                      // 2-char runs never snapped
assert.equal(correct('新生天堂裂擊'), '新生天堂裂擊');              // never shortened to 天堂裂擊
assert.equal(correct('攻擊時有 10% 機會施展等紋 3 冰封求'), '攻擊時有 10% 機會施展等級 3 冰封求'); // 冰封球/冰封甲 tie: left as read

assert.deepEqual(matchLine(['技能', '死亡之剷', 'x'], ['死亡之鏟', '牙齒']), { name: '死亡之鏟', index: 1 });
assert.equal(matchLine(['完全無關'], ['死亡之鏟']), null);
assert.equal(matchLine(['大型咒符'], ['大型咒符', '大型盾'])?.name, '大型咒符'); // exact beats the 0.5 near miss

const word = (text: string, x0: number, x1: number, confidence = 90) => ({ text, confidence, bbox: { x0, x1 } });
assert.equal(
  mergeDigits(
    [word('+1009', 0, 50), word('跑步', 60, 100), word('(FBRW)', 110, 150)],
    [word('+10%', 2, 48), word('18', 60, 100), word('(FRW)', 110, 150)],
  ),
  '+10% 跑步 (FBRW)', // Latin words stay as chi_tra read them
);
assert.equal(mergeDigits([word('生命', 0, 40), word('-730%', 50, 90)], [word('415', 0, 40), word('—73%', 50, 90)]), '生命 -730%'); // eng word not numeric: keep chi
assert.equal(mergeDigits([word('生命5', 0, 40)], [word('415', 0, 40)]), '生命5');
assert.equal( // one chi number read as several eng words is joined
  mergeDigits([word('附加', 0, 40), word('218-483', 50, 120), word('火焰', 130, 170)], [word('Miho', 0, 40), word('218', 50, 75), word('-', 80, 85), word('483', 95, 120)]),
  '附加 218-483 火焰',
);
assert.equal( // eng number reaching into the next glyph (44 點 → 44%) is not used
  mergeDigits([word('24-44', 50, 120), word('點', 130, 160)], [word('24-44%', 50, 160)]),
  '24-44 點',
);
const sym = (text: string, x0: number, x1: number) => ({ text, bbox: { x0, x1 } });
assert.equal( // the % ring read as a digit (5% → 59%) is dropped when eng has no number to offer
  mergeDigits(
    [word('有', 146, 172), { ...word('59%', 187, 243), symbols: [sym('5', 187, 206), sym('9', 208, 221), sym('%', 210, 243)] }],
    [word('%', 187, 243, 0)],
  ),
  '有 5%',
);
assert.equal( // a real digit before % is kept
  mergeDigits([{ ...word('59%', 0, 60), symbols: [sym('5', 0, 18), sym('9', 20, 38), sym('%', 40, 60)] }], []),
  '59%',
);
assert.equal( // low-confidence junk set apart at the line ends is dropped
  mergeDigits([word('|', 0, 2, 10), word('+1', 60, 80), word('所有技能', 90, 170), word('ww', 300, 320, 19)], []),
  '+1 所有技能',
);
assert.equal( // a low-confidence word right next to the text is real (chi_tra scores 恢復 0 at times)
  mergeDigits([word('打擊', 0, 60), word('恢', 70, 100, 0), word('復', 105, 130, 0)], []),
  '打擊 恢 復',
);                    // words with Chinese are never replaced

// 5x10 image: ink on rows 1-2 and 6-8, a single speck on row 4, a grid line down column 4
const w = 5, h = 10, data = new Uint8ClampedArray(w * h * 4).fill(255);
const ink = (y: number, xs: number[]) => xs.forEach((x) => (data[(y * w + x) * 4] = 0));
[1, 2].forEach((y) => ink(y, [0, 1, 2]));
ink(4, [3]);
[6, 7, 8].forEach((y) => ink(y, [1, 2]));
for (let y = 0; y < h; y++) ink(y, [4]);
const mask = inkMask(data, w, h, 128, 4);
assert.equal(mask[4], 0); // grid line removed
const lines = findTextLines(mask, w, h, 2);
assert.deepEqual(lines, [{ top: 1, bottom: 3 }, { top: 6, bottom: 9 }]);
assert.deepEqual(padLines(lines, h), [{ top: 0, bottom: 4 }, { top: 4, bottom: 10 }]);

console.log('ocrText ok');

const titan = ['等級需求: 42', '+150-200% 增強傷害', '5-9% 偷取生命', '+20 力量', '+2 標槍和長矛技能 (限亞馬遜)'];
assert.equal(
  hideFixedStats('戰爭標槍\n等級需求: 42\n+180% 增強傷害\n7% 偷取生命\n+20力量\n+2 標槍和長矛技能 (限亞馬遜)', titan),
  '戰爭標槍\n+180%ED\n7%LL', // base and rolled stats stay
);
assert.equal(
  hideFixedStats('特大咒符GC\n放在物品欄以獲得其加成效果\n需要等級：75\n破除怪物的閃電免疫\n+44 生命(Life)\n無形（無法修復）', []),
  '特大咒符GC\n+44Life\n無形（無法修復）', // no DB match needed for requirements and number-free lines
);
assert.equal(
  hideFixedStats('特大咒符GC\n+10% 跑步 / 行走速度(FRW)\n敵人電擊抗性(-LR) -9%\n傷害降低(DR) 6\n+2-148 生命 (依角色等級)', []),
  '特大咒符GC\n+10%FRW\n-9%LR\n6DR\n+2-148 生命 (依角色等級)', // only Latin abbreviations shrink a line
);
assert.equal(
  hideFixedStats('特大咒符GC\n+10% 跑步 / 行走速度\n敵人電擊抗性 -9%\n怪物金幣掉落量提高 26%\n+20% 高速施法速度\n每級增加 生命 3', []),
  '特大咒符GC\n+10%FRW\n-9%LR\n26%EG\n+20%FCR\n每級增加 生命 3', // no filter: exact keys, then partial ones
);
