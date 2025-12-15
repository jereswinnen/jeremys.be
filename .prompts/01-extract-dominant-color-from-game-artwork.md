# Extract Dominant Color from Game Artwork

<objective>
Implement a build-time solution to extract the dominant color from game artwork images and make it available for use in the Eleventy site's gamelog page.
</objective>

<context>
- Eleventy 3.x static site with Nunjucks templating
- Game data stored in `src/_data/games.json` with `cover` field referencing image filenames
- Gamelog page at `src/pages/gamelog.njk` iterates through games
- Goal: Display a colored div (w-full h-10) with each game's dominant artwork color
</context>

<requirements>
- Extract dominant color at build time (not runtime) for performance
- Store color data in a DRY way that doesn't require manual entry
- Output hex color values usable in templates
- Simple implementation appropriate for a static site
</requirements>

<approach>
1. Create a Node.js script or Eleventy data file that:
   - Reads game cover images
   - Extracts dominant color using a library like `colorthief` or `vibrant`
   - Outputs color data accessible in templates

2. Options to consider:
   - **Option A**: Eleventy computed data file that processes images and adds `dominantColor` to each game
   - **Option B**: Pre-build script that updates games.json with color values
   - **Option C**: Eleventy filter/shortcode that extracts color on demand (cached)

3. Update gamelog.njk to display test div:
   ```njk
   <div class="w-full h-10" style="background-color: {{ game.dominantColor }};"></div>
   ```
</approach>

<implementation_steps>
1. Install color extraction library (e.g., `colorthief` or `node-vibrant`)
2. Create data processing mechanism (computed data or build script)
3. Update gamelog template to use the color
4. Test with existing game artwork
</implementation_steps>

<success_criteria>
- Each game entry displays a div with its artwork's dominant color
- Colors extracted automatically at build time
- No manual color entry required when adding new games
- Build performance remains acceptable
</success_criteria>
