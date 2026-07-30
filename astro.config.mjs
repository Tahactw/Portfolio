// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

/**
 * Site + base path are derived automatically so the owner never edits this file.
 *
 * In GitHub Actions, GITHUB_REPOSITORY is "owner/repo":
 *   - repo named  owner.github.io  -> site https://owner.github.io,      base /
 *   - any other repo name          -> site https://owner.github.io,      base /repo/
 *
 * Locally (npm run dev / build on your machine) it falls back to base "/".
 * If you later attach a custom domain, set the CUSTOM_DOMAIN env var in the
 * workflow (see .github/workflows/deploy.yml) — nothing here needs editing.
 */
const ghRepo = process.env.GITHUB_REPOSITORY; // e.g. "Tahactw/Portfolio"
const customDomain = process.env.CUSTOM_DOMAIN; // e.g. "tahamohammed.com"

let site = 'http://localhost:4321';
let base = '/';

if (customDomain) {
  site = `https://${customDomain}`;
  base = '/';
} else if (ghRepo && ghRepo.includes('/')) {
  const owner = ghRepo.split('/')[0] ?? '';
  const repo = ghRepo.split('/')[1] ?? '';
  site = `https://${owner.toLowerCase()}.github.io`;
  base = repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${repo}/`;
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      assetsInlineLimit: 2048,
    },
  },
});
