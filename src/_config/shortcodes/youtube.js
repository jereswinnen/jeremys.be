export default function(eleventyConfig) {
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
}
