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

export type OcrWord = { text: string; bbox: { x0: number; x1: number } };

const NUMERIC_WORD = /^[(:]?[+-]?\d+(?:-\d+)?%?[)]?$/;

/**
 * Rebuild one line from the Chinese model's words, taking each word that holds a digit from
 * the English model's overlapping word instead: chi_tra reads the tooltip's % as 9 or 0,
 * eng reads digits and % correctly but garbles the Chinese.
 */
export function mergeDigits(chi: OcrWord[], eng: OcrWord[]): string {
  return chi
    .map((w) => {
      if (!/\d/.test(w.text)) return w.text;
      let best: OcrWord | null = null, bestOverlap = 0;
      for (const e of eng) {
        const overlap = Math.min(w.bbox.x1, e.bbox.x1) - Math.max(w.bbox.x0, e.bbox.x0);
        if (overlap > bestOverlap) [best, bestOverlap] = [e, overlap];
      }
      return best && NUMERIC_WORD.test(best.text) ? best.text : w.text;
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
 * Horizontal bands of an RGBA image (dark ink on light) that hold a text line. A pixel is ink
 * when its red channel is below `inkBelow`; rows with fewer than 2 ink pixels count as blank
 * and bands shorter than `minHeight` are noise.
 */
export function findTextLines(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  minHeight = 4,
  inkBelow = 128,
): { top: number; bottom: number }[] {
  const lines: { top: number; bottom: number }[] = [];
  let top = -1;
  for (let y = 0; y <= height; y++) {
    let ink = 0;
    if (y < height) for (let x = 0; x < width && ink < 2; x++) if (data[(y * width + x) * 4] < inkBelow) ink++;
    if (ink >= 2 && top < 0) top = y;
    else if (ink < 2 && top >= 0) {
      if (y - top >= minHeight) lines.push({ top, bottom: y });
      top = -1;
    }
  }
  return lines;
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
