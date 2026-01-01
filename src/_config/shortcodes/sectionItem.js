import Image from "@11ty/eleventy-img";
import path from "path";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true });

// Map source to subtitle field and image directory
const sourceConfig = {
  games: { subtitleField: "platform", imageDir: "games" },
  books: { subtitleField: "author", imageDir: "books" }
};

export default function(eleventyConfig) {
  eleventyConfig.addPairedAsyncShortcode("sectionItem", async function(content, source, slug) {
    const items = this.ctx?.[source] || [];
    const item = items.find(i => i.slug === slug);
    const config = sourceConfig[source] || { subtitleField: null, imageDir: source };

    if (!item) {
      console.warn(`Item not found: ${slug} in ${source}`);
      return `<div class="c-section-item"><p>Item not found: ${slug}</p></div>`;
    }

    // Process cover image
    let coverHtml = "";
    if (item.cover) {
      const inputPath = path.join("src/assets/images", config.imageDir, item.cover);
      try {
        const metadata = await Image(inputPath, {
          widths: [200, 400],
          formats: ["webp", "auto"],
          outputDir: `./_site/assets/images/${config.imageDir}/`,
          urlPath: `/assets/images/${config.imageDir}/`,
          filenameFormat: function(id, src, width, format) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            return `${name}-${width}w.${format}`;
          }
        });

        coverHtml = Image.generateHTML(metadata, {
          alt: item.title,
          class: "c-section-item__cover",
          loading: "lazy",
          decoding: "async",
          sizes: "120px"
        });
      } catch (e) {
        console.warn(`Could not process cover for ${slug}:`, e.message);
      }
    }

    // Process content as Markdown and trim to avoid stray whitespace
    const bodyHtml = md.render(content.trim()).trim();

    // Build subtitle if field exists
    const subtitle = config.subtitleField && item[config.subtitleField]
      ? `<span class="c-section-item__subtitle">${item[config.subtitleField]}</span>`
      : "";

    // Return compact HTML to avoid markdown processing whitespace as paragraphs
    return `<article class="c-section-item"><div class="c-section-item__media">${coverHtml}</div><div class="c-section-item__content"><header class="c-section-item__header"><h3 class="c-section-item__title">${item.title}</h3>${subtitle}</header><div class="c-section-item__body">${bodyHtml}</div></div></article>`;
  });
}
