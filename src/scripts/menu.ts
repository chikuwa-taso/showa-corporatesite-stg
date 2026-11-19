/**
 * The phone header's menu toggle. Above 768px the toggle is not displayed and
 * the nav is the ordinary row, so nothing here has any effect on PC.
 *
 * Open, the nav fills the screen under the band and the page behind it stops
 * scrolling. Choosing a link, pressing Esc, or the window growing past the
 * phone breakpoint all close it again.
 */
export function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const bar = toggle?.closest<HTMLElement>('.header-bar');
  const nav = toggle?.getAttribute('aria-controls')
    ? document.getElementById(toggle.getAttribute('aria-controls')!)
    : null;
  if (!toggle || !bar || !nav) return;

  const root = document.documentElement;
  const phone = window.matchMedia('(max-width: 768px)');

  function set(open: boolean): void {
    bar!.classList.toggle('is-menu-open', open);
    root.classList.toggle('has-menu', open);
    toggle!.setAttribute('aria-expanded', String(open));
    toggle!.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  toggle.addEventListener('click', () => set(!bar.classList.contains('is-menu-open')));

  // A same-page link scrolls underneath the panel, so the panel has to get out
  // of the way; a link to another page is leaving anyway.
  for (const link of nav.querySelectorAll('a')) {
    link.addEventListener('click', () => set(false));
  }

  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && bar.classList.contains('is-menu-open')) {
      set(false);
      toggle.focus();
    }
  });

  phone.addEventListener('change', () => {
    if (!phone.matches) set(false);
  });
}
