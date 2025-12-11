export default function(eleventyConfig) {
  eleventyConfig.addPairedShortcode("callout", function(content, type = "info") {
    return `<aside class="callout callout-${type}">
  ${content}
</aside>`;
  });
}
