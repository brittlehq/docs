import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Starlight needs the `docs` content collection registered with its
 * schema. Every `.md` / `.mdx` file under `src/content/docs/` becomes a
 * page; the URL is the file's path within that collection (so we keep
 * everything one level deeper at `src/content/docs/docs/*` to land at
 * `/docs/*`).
 */
export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
};
