/**
 * 設備一覧's pictogram index: the ring follows the section being read, and each
 * pictogram jumps to its section.
 *
 * The jump itself needs no script — each item is a plain #fragment link, and the
 * page's scroll-padding plus each section's scroll-margin land the heading where
 * the comp puts it (smoothly, unless reduced motion is asked for, which
 * global.css already honours). This only keeps the ring in step.
 *
 * The section "being read" is the last one whose top has passed a line 40% of the
 * way down the window — far enough down that a section counts once its heading
 * and opening lines are on screen, not only once it has scrolled right up under
 * the header. At the very bottom of the page the last section wins regardless,
 * since a short final section may never reach that line.
 */

const ACTIVE = 'is-active';
const READ_LINE = 0.4;

export function initFacilityNav(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-fac-nav]')];
  const sections = [...document.querySelectorAll<HTMLElement>('[data-fac-section]')];
  if (links.length === 0 || sections.length === 0) return;

  let current: string | null = null;
  /** Set while a click's smooth scroll is still travelling. */
  let held = false;
  let release = 0;

  function mark(id: string): void {
    if (id === current) return;
    current = id;
    for (const link of links) {
      const on = link.dataset.facNav === id;
      link.classList.toggle(ACTIVE, on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }

  function update(): void {
    if (held) return;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      mark(sections[sections.length - 1]!.dataset.facSection!);
      return;
    }
    const line = window.innerHeight * READ_LINE;
    let id = sections[0]!.dataset.facSection!;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= line) id = s.dataset.facSection!;
    }
    mark(id);
  }

  let queued = false;
  function schedule(): void {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  // A click marks its own item at once and holds it until the smooth scroll
  // has arrived — otherwise the ring would step through every section in
  // between on the way. `scrollend` ends the hold; the timer is the fallback for
  // engines without it, and for a click that does not scroll at all.
  function releaseHold(): void {
    held = false;
    window.clearTimeout(release);
    update();
  }

  for (const link of links) {
    link.addEventListener('click', () => {
      if (!link.dataset.facNav) return;
      mark(link.dataset.facNav);
      held = true;
      window.clearTimeout(release);
      release = window.setTimeout(releaseHold, 1200);
    });
  }
  addEventListener('scrollend', () => {
    if (held) releaseHold();
  });

  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  // A page opened in a background tab gets no animation frames until it is
  // shown, and a #fragment load may land it mid-page.
  addEventListener('visibilitychange', schedule);
  addEventListener('load', update);
}
