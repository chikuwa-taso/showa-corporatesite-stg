/**
 * Prefixes a `public/` path with the configured base.
 *
 * Files in `public/` are copied verbatim, so Astro does not rewrite URLs that
 * point at them. Under a subpath deploy (GitHub Pages serves this at
 * /<repo>/) a bare `/assets/…` would 404 — every such URL goes through here.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
