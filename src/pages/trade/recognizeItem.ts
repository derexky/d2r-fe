// Reads a D2R tooltip screenshot: Tesseract OCR, then matches the name and cleans the stats.
import { createWorker, PSM, OEM, type Page, type Worker } from 'tesseract.js';
import { findTextLines, inkMask, makeLineCorrector, matchLine, mergeDigits, padLines } from './ocrText';
import { fitsRuneword, loadTradeItems, type TradeItem } from './tradeItems';

const jsonCache = new Map<string, Promise<string[]>>();

function loadList(path: string): Promise<string[]> {
  if (!jsonCache.has(path)) jsonCache.set(path, fetch(path).then((r) => r.json()));
  return jsonCache.get(path)!;
}

function fixOcrText(raw: string): string {
  return raw
    .replace(/[[【][^\]】\n]*[\]】]/g, '')                             // drop [bracketed] tooltip hints
    .replace(/[|{}[\]“”]/g, '')                                       // strip junk chars
    .replace(/¥/g, '+')                                               // ¥ → + (D2R font)
    .replace(/(\d+)(?:96|[Zz])(?=\s|$)/gm, '$1%')                    // N96 / NZ → N% (D2R % font)
    .replace(/(\d+)\s*有\s*%/g, '$1%')                               // N 有 % → N% (same glyph)
    .replace(/(?<=[一-鿿])[^\S\n]+(?=[一-鿿])/g, '') // collapse inter-CJK spaces, keep line breaks
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
}

// base types missing from base-item-names (it lists equipment only); without them the
// fuzzy match turns 大型咒符 into 大型盾
const MISC_BASES = ['小型咒符', '大型咒符', '特大咒符', '珠寶', '戒指', '護身符'];

// mouse hints D2R prints under every tooltip (Shift + 左鍵點擊以裝備, 按住 Shift 鍵進行比較)
const UI_HINT = /左鍵點擊|鍵進行比較/;

// D2R tooltips are light text (gold/blue/white/grey/red) on a near-black panel. Brightness is
// the strongest RGB channel, so blue and red stats stand out as much as white; the dimmest
// text (grey) lands around 100, the panel well below. Only used to find the text lines;
// recognition runs on the inverted image, whose anti-aliasing keeps thin CJK strokes.
// Tune if dim lines go missing.
const OCR_THRESHOLD = 80;
// Text-line height (px) the image is rescaled to; Tesseract reads CJK glyphs best around here.
const OCR_LINE_HEIGHT = 36;
const OCR_MAX_WIDTH = 4000;
// Lines chi_tra scores below this are item icons, inventory grid or scenery read as text.
const OCR_MIN_LINE_CONFIDENCE = 30;

// Workers live for the page lifetime: loading the WASM core and the language models is
// the slow part, so later uploads reuse them. chi_tra reads the Chinese, eng the numbers
// (see mergeDigits). Not 'chi_tra+eng': per word it may pick the English model and turn
// Chinese into Latin junk (行走速度 → TERE); chi_tra still reads the Latin abbreviations.
let workersPromise: Promise<Worker[]> | null = null;

function getWorkers() {
  if (!workersPromise) {
    workersPromise = Promise.all(
      ['chi_tra', 'eng'].map(async (lang) => {
        const w = await createWorker(lang, OEM.LSTM_ONLY);
        await w.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE });
        return w;
      }),
    );
    workersPromise.catch(() => { workersPromise = null; });
  }
  return workersPromise;
}

const ocrWords = (page: Page) =>
  page.blocks?.flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words))) ?? [];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

function invertedGray(img: HTMLImageElement, scale: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    // invert: Tesseract reads dark text on a light page best
    data[i] = data[i + 1] = data[i + 2] = 255 - Math.max(data[i], data[i + 1], data[i + 2]);
  }
  ctx.putImageData(imageData, 0, 0);
  return { canvas, data };
}

/** One inverted-grayscale canvas per tooltip line, scaled to OCR_LINE_HEIGHT. */
async function preprocessForOCR(file: File) {
  const img = await loadImage(file);
  const inkBelow = 255 - OCR_THRESHOLD;
  const probe = invertedGray(img, 1);
  // line height is unknown yet: strokes taller than 8% of the image cannot be text
  const probeMask = inkMask(probe.data, img.width, img.height, inkBelow, Math.max(24, img.height * 0.08));
  const heights = findTextLines(probeMask, img.width, img.height, 4)
    .map((l) => l.bottom - l.top)
    .sort((a, b) => a - b);
  if (!heights.length) throw new Error('no text found');
  const median = heights[heights.length >> 1];
  const scale = Math.min(4, OCR_LINE_HEIGHT / median, OCR_MAX_WIDTH / img.width);
  const { canvas, data } = Math.abs(scale - 1) < 0.05 ? probe : invertedGray(img, scale);
  const mask = inkMask(data, canvas.width, canvas.height, inkBelow, OCR_LINE_HEIGHT * 1.5);
  // paint the dropped grid lines white so Tesseract does not read them as | or 1
  for (let i = 0; i < mask.length; i++) if (!mask[i] && data[i * 4] < inkBelow) data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255;
  canvas.getContext('2d')!.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
  const lines = findTextLines(mask, canvas.width, canvas.height, Math.round(OCR_LINE_HEIGHT * 0.4));
  // real crops: Tesseract's `rectangle` option returned garbage for line-sized regions
  return padLines(lines, canvas.height).map(({ top, bottom }) => {
    const crop = document.createElement('canvas');
    crop.width = canvas.width;
    crop.height = bottom - top;
    crop.getContext('2d')!.drawImage(canvas, 0, top, crop.width, crop.height, 0, 0, crop.width, crop.height);
    return crop;
  });
}

export interface RecognizedItem {
  /** cleaned OCR text, before matching */
  raw: string;
  name: string;
  hit?: TradeItem;
  /** the runeword's base, when the base line matched one */
  baseHit?: TradeItem;
  /** base line plus corrected stat lines */
  stats: string;
}

/**
 * OCR `file` line by line. Returns null once `isStale()` turns true (a newer upload
 * superseded this one); throws when no text is recognised.
 */
export async function recognizeItem(
  file: File,
  onProgress: (percent: number) => void,
  isStale: () => boolean,
): Promise<RecognizedItem | null> {
  const [bands, [chi, eng]] = await Promise.all([preprocessForOCR(file), getWorkers()]);
  const parts: string[] = [];
  for (const [i, band] of bands.entries()) {
    const [c, e] = await Promise.all([chi, eng].map((w) => w.recognize(band, {}, { blocks: true })));
    if (isStale()) return null;
    if (c.data.confidence >= OCR_MIN_LINE_CONFIDENCE) parts.push(mergeDigits(ocrWords(c.data), ocrWords(e.data)));
    onProgress(Math.round(((i + 1) / bands.length) * 100));
  }

  const raw = fixOcrText(parts.join('\n'));
  if (!raw) throw new Error('no text recognised');
  const lines = raw.split('\n').filter((l) => !UI_HINT.test(l));

  const [catalog, baseItemNames, terms] = await Promise.all([
    loadTradeItems().catch(() => [] as TradeItem[]),
    loadList('/api/data/base-item-names'),
    loadList('/api/data/ocr-terms'),
  ]);

  // the name is usually the first line, but stray UI text can sit above it
  const nameHit = matchLine(lines.slice(0, 3), [...new Set(catalog.map((t) => t.name))]);
  const hit =
    nameHit &&
    (catalog.find((t) => t.name === nameHit.name && t.kind === 'item') ??
      catalog.find((t) => t.name === nameHit.name));
  const rest = lines.slice((nameHit?.index ?? 0) + 1);
  const correct = makeLineCorrector(terms);
  const base = matchLine(rest.slice(0, 1), [...MISC_BASES, ...baseItemNames])?.name ?? (rest[0] && correct(rest[0]));

  // a runeword's second line is its base
  const baseHit = hit?.kind === 'runeword' ? catalog.find((t) => t.name === base && fitsRuneword(t, hit)) : undefined;

  return {
    raw,
    name: hit ? hit.name : (lines[0] ?? ''),
    hit: hit || undefined,
    baseHit,
    stats: [base, ...rest.slice(1).map(correct)].filter(Boolean).join('\n'),
  };
}
