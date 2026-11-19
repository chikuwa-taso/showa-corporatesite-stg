/**
 * Fades `[data-reveal]` elements up into place as they scroll into view — the
 * phone comp's ABOUT copy and WORKS tiles. The hidden starting state is only
 * applied once this has run (html.reveal-ready), so without JS nothing is ever
 * left invisible; and the styles only exist under 768px, so PC is unaffected.
 */
export function initReveal(): void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    // Starts once the element is a little way up from the bottom edge, so the
    // fade is seen rather than finishing below the fold.
    { rootMargin: '0px 0px -12% 0px' },
  );

  document.documentElement.classList.add('reveal-ready');
  for (const target of targets) observer.observe(target);
}
