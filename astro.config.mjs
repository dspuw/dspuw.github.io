// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// The repo is dspuw.github.io, so the site is served from the root with no base path.
// The custom domain dspuw.com is set in the repo's Settings > Pages.
export default defineConfig({
  site: 'https://dspuw.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
