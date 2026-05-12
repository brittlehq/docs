import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeRapide from 'starlight-theme-rapide';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Single Astro app that serves both surfaces:
//   /                marketing landing (src/pages/index.astro)
//   /docs/*          Starlight-powered docs (src/content/docs/docs/**)
//
// Starlight is added as a regular integration. Its content collection
// (`src/content/docs/`) is the docs source root, and the URL of each
// page mirrors its path within that collection. To serve docs at
// `/docs/*` we put content under `src/content/docs/docs/`. The pattern
// reads a little odd but keeps the marketing landing at `/` and avoids
// Astro's global `base` config (which would shift the entire site).
export default defineConfig({
  site: 'https://brittle.dev',
  integrations: [
    starlight({
      title: 'Brittle Docs',
      plugins: [starlightThemeRapide()],
      /* ExpressiveCode owns the syntax-highlighted code blocks and
         doesn't honour our Starlight CSS overrides — it uses Shiki
         themes shipped at build time. Pin both light/dark slots to a
         dark theme so code blocks render on a dark surface regardless
         of the user's OS preference, matching the marketing site. */
      expressiveCode: {
        themes: ['github-dark', 'github-dark'],
        styleOverrides: {
          borderColor: '#2a2a32',
          borderRadius: '0.5rem',
          frames: {
            shadowColor: 'transparent',
          },
        },
      },
      logo: {
        // Inline SVG is overkill here; the cracked-b favicon does the job
        // and the Starlight sidebar already shows the title text.
        src: './public/favicon.svg',
        alt: 'Brittle',
        replacesTitle: false,
      },
      customCss: ['./src/styles/starlight.css'],
      social: {
        github: 'https://github.com/brittlehq/brittle',
      },
      sidebar: [
        {
          label: 'Get started',
          items: [
            { label: 'Quickstart', link: '/docs/quickstart' },
          ],
        },
        {
          label: 'Reporter',
          items: [
            { label: 'Configuration', link: '/docs/reporter/configuration' },
          ],
        },
        {
          label: 'Self-host',
          items: [
            { label: 'Overview', link: '/docs/self-host/overview' },
          ],
        },
      ],
      // Hide Starlight's auto-generated home button — the brand logo in
      // the top-left already deep-links to the marketing landing.
      disable404Route: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
