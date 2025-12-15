import ColorThief from "colorthief";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const gamesData = require("./games.json");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  return Promise.all(
    gamesData.map(async (game) => {
      if (!game.cover) {
        return game;
      }

      try {
        const imagePath = path.resolve(
          __dirname,
          `../assets/images/games/${game.cover}`
        );
        const color = await ColorThief.getColor(imagePath);
        return {
          ...game,
          dominantColor: `rgb(${color.join(",")})`,
        };
      } catch (error) {
        console.warn(`Could not extract color for ${game.title}:`, error.message);
        return game;
      }
    })
  );
};
