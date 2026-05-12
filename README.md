# brittle

Public-facing repo for [brittle.dev](https://brittle.dev) — marketing site, docs, and shared brand assets.

## Layout

```
apps/
  site/        Marketing landing page (Astro + Tailwind)
```

Future:
```
apps/
  docs/        Docs site (Astro + Starlight, or MDX)
packages/
  ui/          Shared brand components (logo, tokens) used across apps
```

## Develop

```bash
pnpm install
pnpm dev          # starts the site at http://localhost:4321
```

## Build

```bash
pnpm build        # builds all apps under apps/*
pnpm preview      # serves the built site locally
```

## License

The site code is MIT. The Brittle brand assets (logos, wordmark) are © Brittle and not licensed for reuse.
