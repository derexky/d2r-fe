// Pure helpers for turning Tesseract output of a D2R tooltip into clean text.
// Kept DOM-free so scripts/ocr-text.check.ts can run them under plain node.

export function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    prev = cur;
  }
  return prev[b.length];
}

function similarity(a: string, b: string): number {
  return a && b ? 1 - editDistance(a, b) / Math.max(a.length, b.length) : 0;
}

/** Best candidate for any of `lines`, with the index of the line it matched. */
export function matchLine(lines: string[], candidates: string[]): { name: string; index: number } | null {
  let best = { name: '', index: -1, score: 0 };
  lines.forEach((line, index) => {
    for (const name of candidates) {
      const score = similarity(line, name);
      if (score > best.score) best = { name, index, score };
    }
  });
  return best.score >= 0.5 ? { name: best.name, index: best.index } : null;
}

type Box = { x0: number; x1: number };
export type OcrWord = { text: string; confidence: number; bbox: Box; symbols?: { text: string; bbox: Box }[] };

/**
 * chi_tra reads the top ring of the tooltip font's % as a digit and then the % itself, so
 * 5% comes out as 59%. A digit lying mostly inside a % of the same word is that ghost.
 */
function dropPercentGhosts(w: OcrWord): string {
  const syms = w.symbols;
  const pct = syms?.filter((s) => s.text === '%') ?? [];
  if (!syms || !pct.length) return w.text;
  const ghost = (s: { text: string; bbox: Box }) =>
    /\d/.test(s.text) &&
    pct.some((p) => Math.min(s.bbox.x1, p.bbox.x1) - Math.max(s.bbox.x0, p.bbox.x0) > (s.bbox.x1 - s.bbox.x0) / 2);
  return syms.filter((s) => !ghost(s)).map((s) => s.text).join('');
}

const NUMERIC_WORD = /^[(:]?[+-]?\d+(?:-\d+)?%?[)]?$/;
// An end word Tesseract is unsure of and that sits apart from the text is an item icon or a
// panel border. Both tests are needed: chi_tra gives correct glyphs confidence 0 at times.
const EDGE_JUNK_CONFIDENCE = 30;
const EDGE_JUNK_GAP = 40; // px, about one scaled line height (OCR_LINE_HEIGHT)

/**
 * Rebuild one line from the Chinese model's words, taking the numbers from the English
 * model: chi_tra reads the tooltip's % as 9 or 0, eng reads digits and % correctly but
 * garbles the Chinese. A chi word without Chinese that holds a digit is replaced by the eng
 * words inside its span, joined (chi 218-483 may be eng 218 / - / 483), when they form one
 * number; an eng word reaching past the chi word has read the next glyph too (44 點 → 44%),
 * so it is not used. Latin abbreviations stay as chi_tra read them: eng glues them to the
 * garbled Chinese next to them (特大咒符GC → BARFGCC). Junk words at either end are dropped.
 */
export function mergeDigits(chi: OcrWord[], eng: OcrWord[]): string {
  const junk = (w: OcrWord, gap: number) => w.confidence < EDGE_JUNK_CONFIDENCE && gap > EDGE_JUNK_GAP;
  let start = 0, end = chi.length;
  while (end - start > 1 && junk(chi[start], chi[start + 1].bbox.x0 - chi[start].bbox.x1)) start++;
  while (end - start > 1 && junk(chi[end - 1], chi[end - 1].bbox.x0 - chi[end - 2].bbox.x1)) end--;
  return chi
    .slice(start, end)
    .map((w) => {
      if (!/\d/.test(w.text) || /[一-鿿]/.test(w.text)) return w.text;
      const own = dropPercentGhosts(w);
      const slack = (w.bbox.x1 - w.bbox.x0) * 0.15 + 4;
      const inside = eng.filter((e) => {
        const mid = (e.bbox.x0 + e.bbox.x1) / 2;
        return mid > w.bbox.x0 && mid < w.bbox.x1;
      });
      const fits = inside.every((e) => e.bbox.x0 >= w.bbox.x0 - slack && e.bbox.x1 <= w.bbox.x1 + slack);
      const joined = inside.map((e) => e.text).join('');
      return inside.length && fits && NUMERIC_WORD.test(joined) ? joined : own;
    })
    .join(' ');
}

const CJK_RUN = /[一-鿿]{2,}/g;

/**
 * Snap each Chinese run of a line to the closest known tooltip term. Numbers and symbols
 * are left as read. Only same-length terms qualify (OCR swaps CJK glyphs, it rarely drops
 * them, and a shorter term would eat real text such as a name prefix). One swap is allowed
 * per three characters, so two-character runs are never touched, and a tie between two
 * different terms leaves the run alone.
 */
export function makeLineCorrector(terms: string[]): (line: string) => string {
  const known = new Set(terms);
  const snap = (run: string): string => {
    const maxEdits = Math.floor(run.length / 3);
    if (known.has(run) || !maxEdits) return run;
    let best = run, bestD = maxEdits + 1, tie = false;
    for (const t of terms) {
      if (t.length !== run.length) continue;
      const d = editDistance(run, t);
      if (d < bestD) [best, bestD, tie] = [t, d, false];
      else if (d === bestD) tie = true;
    }
    return bestD <= maxEdits && !tie ? best : run;
  };
  return (line) => line.replace(CJK_RUN, snap);
}

/**
 * Ink mask (1 = ink) of an RGBA image with dark ink on light: a pixel is ink when its red
 * channel is below `inkBelow`. Vertical ink runs longer than `maxRun` are dropped: no glyph
 * stroke is taller than its line, while inventory grid lines and panel borders run across
 * many lines and would otherwise glue every line into one band. Horizontal runs are kept:
 * bold or blurred text fuses into runs as long as the line itself.
 */
export function inkMask(data: Uint8ClampedArray, width: number, height: number, inkBelow: number, maxRun: number) {
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4] < inkBelow ? 1 : 0;
  for (let x = 0; x < width; x++) {
    let start = 0;
    for (let y = 0; y <= height; y++) {
      if (y < height && mask[y * width + x]) continue;
      if (y - start > maxRun) for (let k = start; k < y; k++) mask[k * width + x] = 0;
      start = y + 1;
    }
  }
  return mask;
}

/**
 * Horizontal bands of an ink mask that hold a text line; bands shorter than `minHeight` are
 * noise. A row is blank when its ink is near the background level (10th percentile row) —
 * a photo of the screen has bright texture in every row, a clean crop has none.
 */
export function findTextLines(mask: Uint8Array, width: number, height: number, minHeight = 4): { top: number; bottom: number }[] {
  const rowInk = Array.from({ length: height }, (_, y) => {
    let n = 0;
    for (let x = 0; x < width; x++) n += mask[y * width + x];
    return n;
  });
  const sorted = [...rowInk].sort((a, b) => a - b);
  const base = sorted[Math.floor(height * 0.1)] ?? 0, p90 = sorted[Math.floor(height * 0.9)] ?? 0;
  const minInk = Math.max(2, base + 0.05 * (p90 - base));
  const lines: { top: number; bottom: number }[] = [];
  let top = -1;
  for (let y = 0; y <= height; y++) {
    const text = y < height && rowInk[y] >= minInk;
    if (text && top < 0) top = y;
    else if (!text && top >= 0) {
      if (y - top >= minHeight) lines.push({ top, bottom: y });
      top = -1;
    }
  }
  return splitTallLines(lines, mask, width);
}

/**
 * Split bands much taller than the median line (two lines with no blank row between them,
 * e.g. background text showing through the tooltip) at their least-inked rows.
 */
function splitTallLines(lines: { top: number; bottom: number }[], mask: Uint8Array, width: number) {
  if (lines.length < 3) return lines;
  const heights = lines.map((l) => l.bottom - l.top).sort((a, b) => a - b);
  const median = heights[heights.length >> 1];
  const rowInk = (y: number) => { let n = 0; for (let x = 0; x < width; x++) n += mask[y * width + x]; return n; };
  return lines.flatMap((l) => {
    const n = Math.round((l.bottom - l.top) / median);
    if (l.bottom - l.top < median * 1.6 || n < 2) return [l];
    const cuts = [l.top];
    for (let k = 1; k < n; k++) {
      const guess = Math.round(l.top + ((l.bottom - l.top) * k) / n);
      let best = guess;
      for (let y = guess - (median >> 2); y <= guess + (median >> 2); y++) if (rowInk(y) < rowInk(best)) best = y;
      cuts.push(best);
    }
    cuts.push(l.bottom);
    return cuts.slice(1).map((bottom, k) => ({ top: cuts[k], bottom }));
  });
}

/** Grow each band halfway into the gap to its neighbours (half a line at the edges): Tesseract misreads glyphs touching the crop. */
export function padLines(lines: { top: number; bottom: number }[], height: number) {
  return lines.map((l, i) => {
    const half = (l.bottom - l.top) >> 1;
    const top = i ? (lines[i - 1].bottom + l.top) >> 1 : l.top - half;
    const bottom = i < lines.length - 1 ? (l.bottom + lines[i + 1].top) >> 1 : l.bottom + half;
    return { top: Math.max(0, top), bottom: Math.min(height, bottom) };
  });
}
