/**
 * Keeps the part of the lockup that hangs below the header's white band legible.
 *
 * SHOWA ART PRINTING sits outside the white, directly on whatever the page is
 * showing — the hero video on the LP, a black ground on /facility, paper on the
 * rest — and the header is fixed, so that backdrop changes as the page scrolls
 * and as the video plays. Rather than hard-coding a colour per page, this reads
 * the backdrop that is actually there and flips the line to white when black
 * would be the harder of the two to read.
 *
 * Doing it in CSS was the first instinct and does not work: `mix-blend-mode:
 * difference` against a saturated frame returns the complement, so the wordmark
 * would come out blue over orange rather than black or white.
 */

const DARK_CLASS = 'is-on-dark';

/* Where black stops being the better choice. WCAG contrast against white is
   1.05 / (L + 0.05) and against black is (L + 0.05) / 0.05; they cross at
   L = sqrt(0.0525) - 0.05 = 0.179. Below it, white reads better. */
const CROSSOVER = 0.179;

/* Sample grid over the hanging line. Enough points to catch a backdrop that
   changes across the width — a diagonal in the video, say — without making each
   pass expensive. */
const COLS = 6;
const ROWS = 2;

/* Media is read through one small canvas: each video or image is drawn once per
   pass, then every sample point reads out of that bitmap. The draw stretches the
   source to fill the grid, which is harmless because points are mapped in
   normalised coordinates. */
const GRID = 64;

/* Below this the pixel is see-through enough that what matters is behind it —
   the NETWORK map is white line art on transparency, and taking it at face
   value would have the logo reading a map that is mostly not there. */
const MIN_ALPHA = 128;

type Rgb = [number, number, number];
type Media = HTMLVideoElement | HTMLImageElement;

function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: Rgb): number {
  return (
    0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
  );
}

function parseRgb(value: string): { rgb: Rgb; alpha: number } | null {
  const m = /^rgba?\(([^)]+)\)$/.exec(value.trim());
  if (!m) return null;
  const parts = m[1]!.split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return { rgb: [parts[0]!, parts[1]!, parts[2]!], alpha: parts[3] ?? 1 };
}

export function initLogoContrast(): void {
  const tails = [...document.querySelectorAll<HTMLElement>('[data-logo-tail]')];
  if (tails.length === 0) return;

  let ctx: CanvasRenderingContext2D | null = null;
  /** Posters stand in for a video that has not decoded — reduced motion never
      loads one at all, and then the poster is the whole of what is on screen. */
  const posters = new Map<string, HTMLImageElement>();

  function intrinsicOf(el: Media): [number, number] | null {
    const w = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth;
    const h = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight;
    return w > 0 && h > 0 ? [w, h] : null;
  }

  function isReady(el: Media): boolean {
    return el instanceof HTMLVideoElement ? el.readyState >= 2 : el.complete;
  }

  /** The source that actually has pixels for this element, if any. */
  function paintableFor(el: Media): Media | null {
    if (isReady(el) && intrinsicOf(el)) return el;
    if (!(el instanceof HTMLVideoElement) || !el.poster) return null;

    let img = posters.get(el.poster);
    if (!img) {
      img = new Image();
      img.src = el.poster;
      posters.set(el.poster, img);
    }
    return img.complete && intrinsicOf(img) ? img : null;
  }

  function bitmapOf(source: Media, cache: Map<Media, ImageData | null>): ImageData | null {
    const hit = cache.get(source);
    if (hit !== undefined) return hit;

    let data: ImageData | null = null;
    if (!ctx) {
      const canvas = document.createElement('canvas');
      canvas.width = GRID;
      canvas.height = GRID;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    }
    try {
      // Everything sampled is same-origin, so the canvas stays readable.
      ctx?.clearRect(0, 0, GRID, GRID);
      ctx?.drawImage(source, 0, 0, GRID, GRID);
      data = ctx?.getImageData(0, 0, GRID, GRID) ?? null;
    } catch {
      data = null;
    }
    cache.set(source, data);
    return data;
  }

  /** The colour a video or image shows at a viewport point, honouring object-fit. */
  function mediaColourAt(
    el: Media,
    x: number,
    y: number,
    cache: Map<Media, ImageData | null>,
  ): Rgb | null {
    const source = paintableFor(el);
    if (!source) return null;
    const size = intrinsicOf(source);
    if (!size) return null;
    const bitmap = bitmapOf(source, cache);
    if (!bitmap) return null;

    const [iw, ih] = size;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;

    // Where the content sits inside the box, as a 0..1 position in the source.
    const fit = getComputedStyle(el).objectFit || 'fill';
    let u: number;
    let v: number;
    if (fit === 'cover' || fit === 'contain') {
      const scale =
        fit === 'cover'
          ? Math.max(r.width / iw, r.height / ih)
          : Math.min(r.width / iw, r.height / ih);
      u = (x - (r.left + (r.width - iw * scale) / 2)) / (iw * scale);
      v = (y - (r.top + (r.height - ih * scale) / 2)) / (ih * scale);
    } else {
      // fill / none — the box is already the content's shape everywhere here.
      u = (x - r.left) / r.width;
      v = (y - r.top) / r.height;
    }

    const px = Math.min(GRID - 1, Math.max(0, Math.round(u * GRID)));
    const py = Math.min(GRID - 1, Math.max(0, Math.round(v * GRID)));
    const i = (py * GRID + px) * 4;
    if (bitmap.data[i + 3]! < MIN_ALPHA) return null; // see-through here
    return [bitmap.data[i]!, bitmap.data[i + 1]!, bitmap.data[i + 2]!];
  }

  /** Whatever the page itself paints, for points where nothing else does. */
  function pageColour(): Rgb {
    for (const el of [document.body, document.documentElement]) {
      const bg = parseRgb(getComputedStyle(el).backgroundColor);
      if (bg && bg.alpha > 0.5) return bg.rgb;
    }
    return [255, 255, 255];
  }

  let sawMedia = false;

  /** What is behind the logo at this point: the first thing that actually paints. */
  function backdropAt(
    x: number,
    y: number,
    logo: Element,
    cache: Map<Media, ImageData | null>,
  ): Rgb {
    for (const el of document.elementsFromPoint(x, y)) {
      if (el === logo || logo.contains(el) || el.contains(logo)) continue;

      if (el instanceof HTMLVideoElement || el instanceof HTMLImageElement) {
        // Flagged whether or not it has decoded yet, so the poll below keeps
        // looking until it does rather than giving up on the first pass.
        sawMedia = true;
        const c = mediaColourAt(el, x, y, cache);
        if (c) return c;
        continue; // transparent there, or not decoded — keep looking behind it
      }

      const bg = parseRgb(getComputedStyle(el).backgroundColor);
      if (bg && bg.alpha > 0.5) return bg.rgb;
    }
    return pageColour();
  }

  function sample(): void {
    const cache = new Map<Media, ImageData | null>();
    sawMedia = false;

    for (const tail of tails) {
      const logo = tail.closest('a') ?? tail;
      const r = tail.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;

      // Only the clipped-in part of the image is painted, so only it is sampled.
      const frac =
        Number(getComputedStyle(tail).getPropertyValue('--logo-kanji-frac').trim()) || 1;
      const top = r.top + frac * r.height;
      const band = r.bottom - top;
      if (band <= 0.5) continue; // nothing hangs out at this breakpoint

      let total = 0;
      let n = 0;
      for (let cx = 0; cx < COLS; cx++) {
        for (let cy = 0; cy < ROWS; cy++) {
          const x = r.left + ((cx + 0.5) / COLS) * r.width;
          const y = top + ((cy + 0.5) / ROWS) * band;
          total += relativeLuminance(backdropAt(x, y, logo, cache));
          n++;
        }
      }

      if (n > 0) tail.classList.toggle(DARK_CLASS, total / n < CROSSOVER);
    }
  }

  let queued = false;
  function schedule(): void {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sample();
    });
  }

  schedule();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  // rAF does not run in a background tab, so a page opened in one gets no first
  // pass at all — without this it would keep the markup's black until something
  // else happened to schedule a pass.
  addEventListener('visibilitychange', schedule);
  // A still page still changes underneath while a video plays, and media that
  // was not decoded on the first pass will be on a later one.
  setInterval(() => {
    if (sawMedia && document.visibilityState === 'visible') schedule();
  }, 250);

  addEventListener('load', schedule);
  for (const tail of tails) {
    const img = tail.querySelector('img');
    if (img && !img.complete) img.addEventListener('load', schedule, { once: true });
  }
}
