// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// The repo is dspuw.github.io, so the site is served from the root with no base path.
export default defineConfig({
  site: 'https://dspuw.github.io',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
