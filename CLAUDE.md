# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Eleventy + Tailwind + Sass watchers)
pnpm build        # Production build
```

## Architecture

Eleventy 3.x static site with Nunjucks templating.

**Source:** `src/` + `content/` → **Output:** `_site/`

### Content

- `content/pages/` — Site pages (index, about, feed, sitemap)
- `content/posts/` — Blog posts (markdown), auto-tagged via `posts.json`
- `content/work/` — Work/project pages (markdown), auto-tagged via `work.json`

Directory data files set default layouts, tags, and permalinks. Override in frontmatter: `layout: layouts/case-study.njk`

### Converting content/ to git submodule

```bash
cd content && git init && git remote add origin <url> && git add . && git commit -m "init" && git push -u origin main
cd .. && rm -rf content && git add content && git commit -m "Remove content folder"
git submodule add <url> content
```

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
