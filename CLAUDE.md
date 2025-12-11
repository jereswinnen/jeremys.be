# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Eleventy + Tailwind + Sass watchers)
pnpm build        # Production build
```

## Architecture

Eleventy 3.x static site with Nunjucks templating.

**Source:** `src/` → **Output:** `_site/`

### Content Collections

- `src/posts/` — Blog posts (markdown), auto-tagged via `posts.json`
- `src/projects/` — Project pages (markdown), auto-tagged via `projects.json`

Directory data files (`posts.json`, `projects.json`) set default layouts and tags for all files in that folder. Override layout in frontmatter: `layout: layouts/case-study.njk`

### Layouts & Partials

- `src/_includes/layouts/` — base.njk, post.njk, project.njk, case-study.njk
- `src/_includes/partials/` — header.njk, footer.njk

### Global Data

- `src/_data/site.json` — Site metadata (accessible as `site.*` in templates)
- `src/_data/nav.json` — Navigation items (iterable as `nav`)

### Styling

Two CSS pipelines output to `_site/assets/css/`:
- Tailwind v4: `src/assets/css/tailwind.css`
- Sass: `src/assets/css/styles.scss`

### Available Shortcodes

```njk
{% image "path.jpg", "alt text", "optional-class", "100vw" %}
{% youtube "video-id" %}
{% callout "info" %}Content{% endcallout %}
```

### Date Filters

- `readableDate` — "January 15, 2024"
- `htmlDateString` — "2024-01-15"
- `date` — Custom Luxon format
