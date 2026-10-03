const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Deal one of the clip's variants. The site is a static build, so the draw has
 * to happen here rather than at render time — otherwise every visitor gets
 * whichever one the build picked.
 *
 * Runs before the IntersectionObserver rather than inside it, so the poster is
 * in place as early as possible: the hero is onscreen from the start, and under
 * prefers-reduced-motion the poster is the whole of what anybody sees.
 */
function dealVariant(video: HTMLVideoElement): void {
  const raw = video.dataset.variants;
  if (!raw) return;

  let bases: unknown;
  try {
    bases = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(bases) || bases.length === 0) return;

  const base = bases[Math.floor(Math.random() * bases.length)] as string;
  video.poster = `${base}-poster.webp`;
  video.dataset.mp4 = `${base}.mp4`;
}

function attachSources(video: HTMLVideoElement): void {
  if (video.dataset.sourced) return;
  video.dataset.sourced = 'true';

  // The WebM alternate is gone — the mp4 is now the client's own stream, copied
  // rather than re-encoded, so there is nothing a transcode could improve on.
  // The loop stays: a source that is not there is simply skipped.
  for (const [type, url] of [
    ['video/webm', video.dataset.webm],
    ['video/mp4', video.dataset.mp4],
  ] as const) {
    if (!url) continue;
    const source = document.createElement('source');
    source.type = type;
    source.src = url;
    video.append(source);
  }
  video.load();
}

function play(video: HTMLVideoElement): void {
  if (reduceMotion.matches) return;
  // Autoplay is blocked unless the element is muted as a *property*.
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  attachSources(video);
  void video.play().catch(() => {});
}

export function initBackgroundVideo(): void {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('[data-bg-video]')];
  if (videos.length === 0) return;

  for (const video of videos) dealVariant(video);

  // Offscreen videos stay paused, and unseen ones never download at all.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) play(video);
        else if (!video.paused) video.pause();
      }
    },
    { rootMargin: '200px 0px' },
  );

  for (const video of videos) observer.observe(video);

  reduceMotion.addEventListener('change', () => {
    for (const video of videos) {
      if (reduceMotion.matches) video.pause();
      else if (video.checkVisibility?.() ?? true) play(video);
    }
  });
}
