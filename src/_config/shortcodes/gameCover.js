export default function(eleventyConfig) {
  eleventyConfig.addShortcode("gameCover", function(gameSlug, games) {
    const game = games.find(g => g.slug === gameSlug);
    if (!game || !game.cover) return "";

    // Absolute path from project root for the transform plugin
    const imgSrc = `/src/assets/images/games/${game.cover}`;

    return `<img src="${imgSrc}" alt="${game.title}" class="game-cover" sizes="200px" eleventy:widths="200,400">`;
  });
}
