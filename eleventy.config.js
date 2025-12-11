import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import Image from "@11ty/eleventy-img";
import path from "path";

export default function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets/images");

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
      ? path.join("src", src)
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

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByTag("projects").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Set Nunjucks as the template engine for markdown files
  eleventyConfig.setLibrary("md", eleventyConfig.getMarkdownLibrary?.() || {
    render: (content) => content
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
