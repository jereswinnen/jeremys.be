import Image from "@11ty/eleventy-img";
import path from "path";

export default function(eleventyConfig) {
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
}
