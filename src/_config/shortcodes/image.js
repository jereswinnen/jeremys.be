import path from "path";

export default function(eleventyConfig) {
  eleventyConfig.addShortcode("image", function(src, alt, className = "", sizes = "100vw") {
    if (!alt) {
      throw new Error(`Missing alt attribute for image: ${src}`);
    }

    // Resolve image path: absolute paths use /src/assets/images, relative paths use page directory
    const imgSrc = src.startsWith("/")
      ? `/src/assets/images${src}`
      : path.posix.join(path.dirname(this.page.inputPath), src);

    const classAttr = className ? ` class="${className}"` : "";

    return `<img src="${imgSrc}" alt="${alt}"${classAttr} sizes="${sizes}">`;
  });
}
