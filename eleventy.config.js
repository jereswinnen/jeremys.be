import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import shortcodes from "./src/_config/shortcodes/index.js";

export default function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(shortcodes);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy({"src/assets/images": "assets/images"});

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
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
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

  // Collections
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByTag("articles").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("notes", function(collectionApi) {
    return collectionApi.getFilteredByTag("notes").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("gaming", function(collectionApi) {
    return collectionApi.getFilteredByTag("gaming").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return [
      ...collectionApi.getFilteredByTag("articles"),
      ...collectionApi.getFilteredByTag("notes"),
      ...collectionApi.getFilteredByTag("gaming")
    ].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("work", function(collectionApi) {
    return collectionApi.getFilteredByTag("work").sort((a, b) => b.date - a.date);
  });

  // Set Nunjucks as the template engine for markdown files
  eleventyConfig.setLibrary("md", eleventyConfig.getMarkdownLibrary?.() || {
    render: (content) => content
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
