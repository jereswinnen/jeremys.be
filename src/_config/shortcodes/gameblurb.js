import Image from "@11ty/eleventy-img";
import path from "path";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true });

export default function(eleventyConfig) {
  eleventyConfig.addPairedAsyncShortcode("gameblurb", async function(content, gameSlug) {
    const games = this.ctx?.games || [];
    const game = games.find(g => g.slug === gameSlug);

    if (!game) {
      console.warn(`Game not found: ${gameSlug}`);
      return `<div class="c-game-blurb"><p>Game not found: ${gameSlug}</p></div>`;
    }

    // Process cover image
    let coverHtml = "";
    if (game.cover) {
      const inputPath = path.join("src/assets/images/games", game.cover);
      try {
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

        coverHtml = Image.generateHTML(metadata, {
          alt: game.title,
          class: "c-game-blurb__cover",
          loading: "lazy",
          decoding: "async",
          sizes: "120px"
        });
      } catch (e) {
        console.warn(`Could not process cover for ${gameSlug}:`, e.message);
      }
    }

    // Process content as Markdown and trim to avoid stray whitespace
    const blurbHtml = md.render(content.trim()).trim();

    // Return compact HTML to avoid markdown processing whitespace as paragraphs
    return `<article class="c-game-blurb"><div class="c-game-blurb__media">${coverHtml}</div><div class="c-game-blurb__content"><header class="c-game-blurb__header"><h3 class="c-game-blurb__title">${game.title}</h3><span class="c-game-blurb__platform">${game.platform}</span></header><div class="c-game-blurb__body">${blurbHtml}</div></div></article>`;
  });
}
