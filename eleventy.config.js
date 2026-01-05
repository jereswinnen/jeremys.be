import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItImplicitFigures from "markdown-it-implicit-figures";
import markdownItMark from "markdown-it-mark";
import pluginRss from "@11ty/eleventy-plugin-rss";
import shortcodes from "./src/_config/shortcodes/index.js";

export default function (eleventyConfig) {
  // Markdown config
  const md = markdownIt({ html: true })
    .use(markdownItAttrs)
    .use(markdownItImplicitFigures, {
      figcaption: true,
      copyAttrs: "class"
    })
    .use(markdownItMark);

  md.renderer.rules.figure_open = (tokens, idx) => {
    const token = tokens[idx];
    const attrs = token.attrs?.map(([k, v]) => `${k}="${v}"`).join(' ') || '';
    return attrs ? `<figure ${attrs}><div>` : '<figure><div>';
  };

  md.renderer.rules.figure_close = () => "</div></figure>";
  md.renderer.rules.figcaption_open = () => "<figcaption><small>";
  md.renderer.rules.figcaption_close = () => "</small></figcaption>";
  md.renderer.rules.mark_open = () => '<mark class="spoiler">';
  md.renderer.rules.mark_close = () => "</mark>";

  eleventyConfig.setLibrary("md", md);
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(shortcodes);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy("content/work/**/images/*");
  eleventyConfig.addPassthroughCopy("content/gamelog/**/images/*");

  // Dev server: reload on CSS changes from Tailwind/Sass
  eleventyConfig.setServerOptions({
    watch: ["./_site/assets/css/**/*.css"]
  });

  // Ignore non-content directories
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("_site/**");
  eleventyConfig.ignores.add("*.config.js");
  eleventyConfig.ignores.add("*.config.mjs");
  eleventyConfig.ignores.add("package*.json");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("prompts/**");

  // Date filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLL d, yyyy 'at' h:mm a").replace(/AM|PM/, m => m.toLowerCase());
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("date", (dateObj, format) => {
    if (dateObj === "now") {
      dateObj = new Date();
    }
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
  });

  // Filter to look up game by slug
  eleventyConfig.addFilter("getGame", (slug, games) => {
    return games.find(game => game.slug === slug);
  });

  // Filter gamelog entries by game slug
  eleventyConfig.addFilter("filterByGame", (entries, gameSlug) => {
    return entries.filter(entry => entry.data.game === gameSlug);
  });

  // Sort games by their latest gamelog entry date
  eleventyConfig.addFilter("sortByLatestEntry", (games, entries) => {
    return [...games].sort((a, b) => {
      const aEntries = entries.filter(e => e.data.game === a.slug);
      const bEntries = entries.filter(e => e.data.game === b.slug);
      const aLatest = aEntries.length ? aEntries[0].date : new Date(0);
      const bLatest = bEntries.length ? bEntries[0].date : new Date(0);
      return bLatest - aLatest;
    });
  });

  // Group posts by month
  eleventyConfig.addFilter("groupByMonth", (posts) => {
    const groups = {};
    posts.forEach(post => {
      const dt = DateTime.fromJSDate(post.date, { zone: "utc" });
      const key = dt.toFormat("yyyy-LL");
      const label = dt.toFormat("LLLL yyyy");
      if (!groups[key]) groups[key] = { key, label, posts: [] };
      groups[key].posts.push(post);
    });
    return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
  });

  // Group posts by day with week number
  eleventyConfig.addFilter("groupByDay", (posts) => {
    const groups = {};
    posts.forEach(post => {
      const dt = DateTime.fromJSDate(post.date, { zone: "utc" });
      const key = dt.toFormat("yyyy-LL-dd");
      const label = dt.toFormat("LLLL d, yyyy") + ` (Wk ${dt.weekNumber})`;
      if (!groups[key]) groups[key] = { key, label, posts: [] };
      groups[key].posts.push(post);
    });
    return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
  });

  // Format time, returns empty string if midnight (no time set)
  eleventyConfig.addFilter("formatTime", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (dt.hour === 0 && dt.minute === 0 && dt.second === 0) return "";
    return dt.toFormat("h:mm a").toLowerCase();
  });

  // Collections
  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getFilteredByTag("articles").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("notes", function (collectionApi) {
    return collectionApi.getFilteredByTag("notes").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("gamelog", function (collectionApi) {
    return collectionApi.getFilteredByTag("gamelog").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("blog", function (collectionApi) {
    return [
      ...collectionApi.getFilteredByTag("articles"),
      ...collectionApi.getFilteredByTag("notes"),
      ...collectionApi.getFilteredByTag("gamelog")
    ].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("work", function (collectionApi) {
    return collectionApi.getFilteredByTag("work").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "src/_includes",
      data: "src/_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
