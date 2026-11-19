/**
 * Phone WORKS tiles: a tap lifts the colour field to show the work, a second
 * tap puts it back. On PC the strip reveals on hover instead and these tiles
 * are not displayed.
 */
export function initWorksToggle(): void {
  for (const tile of document.querySelectorAll<HTMLButtonElement>('[data-work-toggle]')) {
    tile.addEventListener('click', () => {
      const open = tile.getAttribute('aria-pressed') !== 'true';
      tile.setAttribute('aria-pressed', String(open));
    });
  }
}
