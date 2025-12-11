# IGDB Game Data Integration

## Objective

Integrate IGDB game data fetching into the Eleventy build process. Games should be defined with just an IGDB ID, and the build process automatically fetches cover images and metadata from a NextJS API.

## Context

- Eleventy 3.x static site
- Existing `src/_data/games.json` with manual game data
- User has a deployed NextJS API that wraps IGDB (provides game info including covers)
- Gaming logs reference games via `game: slug` in frontmatter

## Requirements

### Data Structure
Convert `src/_data/games.json` to `src/_data/games.js` that:
1. Reads a simple config of IGDB IDs and slugs
2. Fetches game data from the NextJS API at build time
3. Returns array of game objects with title, cover URL, platform, etc.

### Image Processing
- Use `@11ty/eleventy-img` to download and optimize cover images during build
- Store processed images in `_site/assets/images/games/`
- Generate responsive sizes (400w, 800w)

### Caching
- Cache API responses locally to avoid re-fetching on every build
- Simple file-based cache in `.cache/games/`

## Information Needed

Before implementing, I need:
1. **API endpoint URL** - Base URL of your NextJS API
2. **API endpoint format** - What's the endpoint structure? (e.g., `/api/games/[id]`)
3. **API response shape** - What fields does the API return? (title, cover URL, platforms, etc.)

## Implementation Steps

1. Create `.cache/games/` directory handling
2. Convert `games.json` → `games.js` with async data fetching
3. Add eleventy-img processing for covers
4. Update `post.njk` layout to use processed image paths
5. Test with example IGDB ID

## Example Target Usage

```js
// src/_data/games.js input config
const GAMES = [
  { slug: "elden-ring", igdbId: 119133 },
  { slug: "baldurs-gate-3", igdbId: 113895 },
];
```

```js
// Output at build time (returned to templates)
[
  {
    slug: "elden-ring",
    title: "Elden Ring",
    cover: "/assets/images/games/elden-ring-400w.webp",
    platform: "PS5"
  },
  // ...
]
```
