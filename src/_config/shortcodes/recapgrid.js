export default function(eleventyConfig) {
  eleventyConfig.addPairedShortcode("recapgrid", function(content, breakout = "") {
    const breakoutClass = breakout ? ` o-grid__${breakout}` : "";
    // Trim content to avoid whitespace being processed as paragraphs by markdown
    return `<div class="c-recap-grid${breakoutClass}">${content.trim()}</div>`;
  });
}
