import { defineConfig } from 'astro/config';

// GitHub Pages serves this project under /<repo>/, so every absolute asset URL
// has to carry that prefix. Override both with env vars when deploying to a
// domain root (a real host, or the client's own domain).
const site = process.env.SITE_URL ?? 'https://chikuwa-taso.github.io';
const base = process.env.BASE_PATH ?? '/showa-corporatesite-stg';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
