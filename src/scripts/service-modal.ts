/**
 * Opens a SERVICE pictogram's detail panel.
 *
 * The panels are real <dialog> elements rendered into the page, so Esc, the
 * focus trap, restoring focus to the trigger, and holding the rest of the page
 * inert all come from the browser. This adds only what it does not: the open
 * click, the scroll lock, a backdrop click that closes, and warming the photo
 * before the panel is asked for.
 */
export function initServiceModal(): void {
  const triggers = [...document.querySelectorAll<HTMLElement>('[data-modal-open]')];
  if (triggers.length === 0) return;

  const root = document.documentElement;
  const dialogs = new Set<HTMLDialogElement>();

  /**
   * Driven by the `open` attribute rather than by the `close` event, so it
   * cannot get out of step: Esc, the close button, a click on the scrim and a
   * dialog the browser closes on its own all move that attribute, and a missed
   * event would otherwise leave the page permanently unscrollable.
   */
  function syncScrollLock(): void {
    let anyOpen = false;
    for (const dialog of dialogs) if (dialog.open) anyOpen = true;
    root.classList.toggle('has-modal', anyOpen);
  }

  const observer = new MutationObserver(syncScrollLock);

  for (const trigger of triggers) {
    const id = trigger.dataset.modalOpen;
    const dialog = id ? document.getElementById(id) : null;
    if (!(dialog instanceof HTMLDialogElement)) continue;

    dialogs.add(dialog);
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });

    // A lazy image inside a closed dialog never starts loading, so the panel
    // would otherwise open onto an empty frame. Hovering or tabbing to the
    // pictogram is the earliest honest signal that it is about to be needed.
    const warm = (): void => {
      for (const img of dialog.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) {
        img.loading = 'eager';
      }
    };
    trigger.addEventListener('pointerenter', warm, { once: true });
    trigger.addEventListener('focus', warm, { once: true });

    trigger.addEventListener('click', () => {
      warm();
      if (!dialog.open) dialog.showModal();
    });

    for (const close of dialog.querySelectorAll('[data-modal-close]')) {
      close.addEventListener('click', () => dialog.close());
    }

    // The dialog's own box is the scrim, so a click that lands on it rather than
    // on the composition inside is a click outside the content.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  syncScrollLock();
}
