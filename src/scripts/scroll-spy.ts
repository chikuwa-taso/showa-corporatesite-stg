import { SECTION_IDS, type SectionId } from '../data/site';

/**
 * Lights the nav item for the section the reader is in. Replaces the prototype's
 * multi-target scroll listeners and polling interval with one IntersectionObserver.
 */
export function initScrollSpy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy-for]')];
  if (links.length === 0) return;

  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => el !== null,
  );

  let active: SectionId | null = null;

  function setActive(id: SectionId): void {
    if (id === active) return;
    active = id;
    for (const link of links) {
      const isActive = link.dataset.spyFor === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }

  const onscreen = new Set<string>();
  // #contact is shorter than the viewport, so its top never crosses the band below.
  // While the page is bottomed out, CONTACT wins over whatever else is onscreen.
  let atBottom = false;

  function resolve(): void {
    if (atBottom) {
      setActive('contact');
      return;
    }
    // Last in document order wins, so an incoming section takes over cleanly.
    for (let i = SECTION_IDS.length - 1; i >= 0; i -= 1) {
      const id = SECTION_IDS[i]!;
      if (onscreen.has(id)) {
        setActive(id);
        return;
      }
    }
  }

  // rootMargin takes no calc() or var(), so read the header height off the page.
  const headerHeight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 88;

  // The band runs from just under the fixed header down to 40% of the viewport,
  // mirroring the prototype's "last section whose top has crossed the header".
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onscreen.add(entry.target.id);
        else onscreen.delete(entry.target.id);
      }
      resolve();
    },
    { rootMargin: `-${headerHeight}px 0px -60% 0px` },
  );

  for (const section of sections) sectionObserver.observe(section);

  const sentinel = document.querySelector('[data-spy-sentinel]');
  if (sentinel) {
    new IntersectionObserver((entries) => {
      atBottom = entries.some((entry) => entry.isIntersecting);
      resolve();
    }).observe(sentinel);
  }

  setActive('top');
}
