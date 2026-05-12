import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// `site` is the production URL — used for canonical URLs and the OG image
// absolute URL. Add @astrojs/sitemap back once the docs site lands and
// we actually have multiple pages worth indexing.
export default defineConfig({
  site: 'https://brittle.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
