/**
 * Measures how far the phone hero has to travel to stay put while ABOUT
 * scrolls over it: the rest of the shared wrapper below the hero, which is
 * ABOUT's height. TopSection's scroll-driven animation moves the hero down by
 * that much over the same distance of scroll. Sizes follow the window and the
 * copy's vw-based type, so it is re-measured whenever either changes. The value
 * is only read under 768px; on PC it is set and ignored.
 */
export function initHeroPin(): void {
  const top = document.getElementById('top');
  const lead = top?.parentElement;
  if (!top || !lead) return;

  const sync = (): void => {
    const pin = Math.max(0, lead.offsetHeight - top.offsetHeight);
    top.style.setProperty('--pin', `${pin}px`);
  };

  sync();
  const observer = new ResizeObserver(sync);
  observer.observe(lead);
  observer.observe(top);
}
