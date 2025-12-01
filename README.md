# My personal website

Includes my theorizing, writing, and photography.

## SEO & AIO playbook

- **Metadata defaults** live in `src/layouts/Layout.astro`. Each page should pass a `description`, `image`, and `canonical` when the content is specific. Pages without props inherit the `bio.short` summary.
- **Bios** are centralized in `src/data/bio.ts` with short, medium, and long formats. Reuse these strings for landing pages, schema, and press kits to keep the narrative consistent.
- **Meta descriptions** follow `{Outcome hook}. {Unique POV}. {Invitation}`. Keep them under 155 characters and ensure the lede verb matches the user intent (e.g., “Discover”, “Decode”, “Apply”).
- **Sitemap & robots** live in `public/` and are generated automatically by the custom Astro integration (`src/integrations/crawler-files.ts`) at build time. Update the `STATIC_ROUTES` or `DISALLOWED` arrays there whenever new sections launch.
- **LLM usage policy** lives at `public/llms.txt`. Update the allowed/restricted tables plus the change log whenever crawl guidance changes.

Run `npm run build` before shipping to confirm Astro’s prerender passes with the updated metadata.
