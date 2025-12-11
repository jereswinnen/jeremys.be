import Image from "@11ty/eleventy-img";
import path from "path";

export default function(eleventyConfig) {
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
}
