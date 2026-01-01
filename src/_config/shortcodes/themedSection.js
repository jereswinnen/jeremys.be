export default function(eleventyConfig) {
  eleventyConfig.addPairedShortcode("themedSection", function(content, { source = "", theme = "", breakout = "" } = {}) {
    const breakoutClass = breakout ? ` o-grid__${breakout}` : "";
    const themeAttr = theme ? ` data-theme="${theme}"` : "";
    const sourceAttr = source ? ` data-source="${source}"` : "";
    // Trim content to avoid whitespace being processed as paragraphs by markdown
    return `<div class="c-themed-section${breakoutClass}"${themeAttr}${sourceAttr}>${content.trim()}</div>`;
  });
}
