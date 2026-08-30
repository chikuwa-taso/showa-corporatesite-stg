const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function attachSources(video: HTMLVideoElement): void {
  if (video.dataset.sourced) return;
  video.dataset.sourced = 'true';

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
