import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import Image from "@11ty/eleventy-img";
import path from "path";

export default function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy({"src/assets/images": "assets/images"});

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

  // Image shortcode
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, className = "", sizes = "100vw") {
    if (!alt) {
      throw new Error(`Missing alt attribute for image: ${src}`);
    }

    const inputPath = src.startsWith("/")
      ? path.join("src/assets/images", src.replace(/^\//, ""))
      : path.join(path.dirname(this.page.inputPath), src);

    const metadata = await Image(inputPath, {
      widths: [400, 800, 1200],
      formats: ["webp", "auto"],
      outputDir: "./_site/assets/images/",
      urlPath: "/assets/images/",
      filenameFormat: function(id, src, width, format) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    });

    const imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    if (className) {
      imageAttributes.class = className;
    }

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Game cover shortcode
  eleventyConfig.addAsyncShortcode("gameCover", async function(gameSlug, games) {
    const game = games.find(g => g.slug === gameSlug);
    if (!game || !game.cover) return "";

    const inputPath = path.join("src/assets/images/games", game.cover);

    const metadata = await Image(inputPath, {
      widths: [200, 400],
      formats: ["webp", "auto"],
      outputDir: "./_site/assets/images/games/",
      urlPath: "/assets/images/games/",
      filenameFormat: function(id, src, width, format) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    });

    return Image.generateHTML(metadata, {
      alt: game.title,
      class: "game-cover",
      loading: "lazy",
      decoding: "async",
      sizes: "200px"
    });
  });

  // YouTube shortcode
  eleventyConfig.addShortcode("youtube", function(videoId) {
    return `<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/${videoId}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>`;
  });

  // Callout paired shortcode
  eleventyConfig.addPairedShortcode("callout", function(content, type = "info") {
    return `<aside class="callout callout-${type}">
  ${content}
</aside>`;
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
