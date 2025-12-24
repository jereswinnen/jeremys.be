# Blog Index Layout Ideas

Creative approaches for displaying articles + notes together.

---

## 1. River / Timeline

A continuous vertical stream where notes appear as compact cards and articles as expanded blocks. Visual weight signals content depth.

```
┌─────────────────────────────────┐
│ ● Dec 23 · Note title here...  │  ← compact, single line
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ ARTICLE                         │
│ Long-form Title                 │  ← larger, with excerpt
│ Brief excerpt of the article   │
│ Dec 20 · 5 min read             │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ ● Dec 18 · Another note...     │
└─────────────────────────────────┘
```

**Pros:** Chronological, scannable, emphasizes writing cadence
**Implementation:** Single loop, conditional styling based on tag

---

## 2. Newspaper / Masonry

Lead with one featured article (largest), then arrange others in a grid. Notes cluster in a sidebar or as small tiles.

```
┌──────────────────────┬─────────┐
│                      │ Note    │
│   FEATURED ARTICLE   ├─────────┤
│   with large title   │ Note    │
│                      ├─────────┤
│                      │ Note    │
├───────────┬──────────┴─────────┤
│ Article 2 │ Article 3          │
└───────────┴────────────────────┘
```

**Pros:** Editorial feel, visual hierarchy, highlights best work
**Implementation:** CSS Grid with `grid-template-areas`, slice collections

---

## 3. Grouped by Month

Cluster posts under month headers. Notes inline, articles as blocks.

```
December 2024
├── Article: Long title here
├── Note: Quick thought · Note: Another one
└── Article: Another piece

November 2024
├── ...
```

**Pros:** Temporal context, shows productivity patterns
**Implementation:** Group in Eleventy with custom collection or filter

---

## 4. Two-Column Split

Articles on left (main), notes on right (aside). Scroll independently or in sync.

```
┌─────────────────┬──────────────┐
│ ARTICLES        │ NOTES        │
│                 │              │
│ Title           │ · Short one  │
│ Excerpt...      │ · Another    │
│                 │ · Third      │
│ Title           │              │
│ Excerpt...      │ · Fourth     │
└─────────────────┴──────────────┘
```

**Pros:** Clear content type separation, dense information
**Implementation:** Two separate collection loops, CSS columns or grid

---

## 5. Cards with Visual Accents

Each post as a card. Notes have a colored left border or icon. Articles have a cover image or gradient header.

```
┌───┬─────────────────────────────┐
│ ● │ Note title                  │
│   │ Dec 23                      │
└───┴─────────────────────────────┘
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← gradient or image
│ Article Title                   │
│ Brief excerpt · Dec 20          │
└─────────────────────────────────┘
```

**Pros:** Visual distinction, modern feel
**Implementation:** Conditional classes, CSS custom properties per type

---

## 6. Bento Grid

Irregular grid where size reflects importance or length. Mix of 1x1, 2x1, 2x2 cells.

```
┌───────────┬─────┬─────┐
│           │     │     │
│  Article  │Note │Note │
│           │     │     │
├─────┬─────┼─────┴─────┤
│Note │Note │  Article  │
└─────┴─────┴───────────┘
```

**Pros:** Dynamic, eye-catching, good for portfolios
**Implementation:** CSS Grid with span classes, assign based on content length/type

---

## Quick Wins

- **Subtle type indicator**: Small pill/badge ("note" vs "article")
- **Reading time**: Show for articles only
- **Hover preview**: Show first 100 chars on hover for notes
- **Year dividers**: Light horizontal rule between years

---

## Recommendation

Start with **#1 (River)** — easiest to implement, works well with your existing `o-grid`, and scales naturally. Add type indicators and conditional sizing. Graduate to **#2 or #6** if you want more visual impact later.
