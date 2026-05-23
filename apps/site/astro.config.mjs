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
        // Lockup (cracked-b glyph + "brittle" wordmark) generated from the
        // home page's Logo.astro 1:1, written out as a static SVG so
        // Starlight can pick it up here. Two variants: dark fill for the
        // light theme, light fill for the dark theme. The SVGs are
        // loaded via <img>, which isolates them from page CSS, so
        // `currentColor` wouldn't work — the fill has to be baked in
        // per-variant. `replacesTitle: true` drops the default "Brittle
        // Docs" text since the wordmark already says it.
        light: './public/brittle-logo-light.svg',
        dark: './public/brittle-logo-dark.svg',
        alt: 'Brittle',
        replacesTitle: true,
      },
      customCss: ['./src/styles/starlight.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/brittlehq/brittle',
        },
      ],
      sidebar: [
        {
          label: 'Get started',
          items: [
            { label: 'Introduction', link: '/docs/' },
            { label: 'Installation', link: '/docs/installation' },
            { label: 'Quickstart', link: '/docs/quickstart' },
          ],
        },
        {
          label: 'Reporters',
          items: [
            { label: 'Overview', link: '/docs/reporter/overview' },
            { label: 'Playwright', link: '/docs/reporter/playwright' },
            { label: 'WebdriverIO', link: '/docs/reporter/wdio' },
            { label: 'Jest', link: '/docs/reporter/jest' },
            { label: 'Vitest', link: '/docs/reporter/vitest' },
            { label: 'Configuration', link: '/docs/reporter/configuration' },
          ],
        },
        {
          label: 'Self-host',
          items: [
            { label: 'Overview', link: '/docs/self-host/overview' },
            { label: 'Hub configuration', link: '/docs/self-host/configuration' },
            { label: 'AI failure analysis', link: '/docs/self-host/ai-analysis' },
            { label: 'Production notes', link: '/docs/self-host/production' },
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
