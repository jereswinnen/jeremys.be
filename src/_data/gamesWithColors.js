import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { extractDominantColor } from "./lib/extractColor.js";

const require = createRequire(import.meta.url);
const gamesData = require("./games.json");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  return Promise.all(
    gamesData.map(async (game) => {
      if (!game.cover) {
        return game;
      }

      const imagePath = path.resolve(
        __dirname,
        `../assets/images/games/${game.cover}`
      );
      const colors = await extractDominantColor(imagePath);

      return {
        ...game,
        backgroundColor: colors?.background,
        textColor: colors?.text,
      };
    })
  );
}
