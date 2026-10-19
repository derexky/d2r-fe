// Self-check for src/pages/trade/ocrText.ts. Run: node scripts/ocr-text.check.ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { editDistance, findTextLines, makeLineCorrector, matchLine, mergeDigits, padLines } from '../src/pages/trade/ocrText.ts';

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

const word = (text: string, x0: number, x1: number) => ({ text, bbox: { x0, x1 } });
assert.equal(
  mergeDigits(
    [word('+1009', 0, 50), word('跑步', 60, 100), word('(FRW)', 110, 150)],
    [word('+10%', 2, 48), word('18', 60, 100), word('(FRW)', 110, 150)],
  ),
  '+10% 跑步 (FRW)',
);
assert.equal(mergeDigits([word('生命', 0, 40), word('-730%', 50, 90)], [word('415', 0, 40), word('—73%', 50, 90)]), '生命 -730%'); // eng word not numeric: keep chi

// 4x10 image: ink on rows 1-2 and 6-8, a single speck on row 4
const w = 4, h = 10, data = new Uint8ClampedArray(w * h * 4).fill(255);
const ink = (y: number, xs: number[]) => xs.forEach((x) => (data[(y * w + x) * 4] = 0));
[1, 2].forEach((y) => ink(y, [0, 1, 2]));
ink(4, [3]);
[6, 7, 8].forEach((y) => ink(y, [1, 2]));
const lines = findTextLines(data, w, h, 2);
assert.deepEqual(lines, [{ top: 1, bottom: 3 }, { top: 6, bottom: 9 }]);
assert.deepEqual(padLines(lines, h), [{ top: 0, bottom: 4 }, { top: 4, bottom: 10 }]);

console.log('ocrText ok');
