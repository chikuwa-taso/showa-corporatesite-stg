/**
 * Prefixes a `public/` path with the configured base.
 *
 * Files in `public/` are copied verbatim, so Astro does not rewrite URLs that
 * point at them. Under a subpath deploy (GitHub Pages serves this at
 * /<repo>/) a bare `/assets/…` would 404 — every such URL goes through here.
 */
export function asset(path: string): string {
  return withBase(path);
}

/**
 * Prefixes an internal link with the configured base.
 *
 * Same mechanic as `asset`, named apart because links and assets move
 * independently — only assets would follow a CDN, only routes a locale prefix.
 */
export function route(path: string): string {
  return withBase(path);
}

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
