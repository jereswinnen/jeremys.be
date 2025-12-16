import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const games = JSON.parse(
  fs.readFileSync(path.join(root, "src/_data/games.json"), "utf-8")
);

const gamelogDir = path.join(root, "content/gamelog");

// Format date as YYYY-MM-DD
function formatDateForFilename(date) {
  return date.toISOString().slice(0, 10);
}

// Format date as ISO with time
function formatDate(date) {
  return date.toISOString().slice(0, 19);
}

async function main() {
  const response = await prompts({
    type: "autocomplete",
    name: "game",
    message: "Select a game",
    choices: games.map((g) => ({
      title: `${g.title} (${g.platform})`,
      value: g,
    })),
    suggest: (input, choices) =>
      choices.filter((c) =>
        c.title.toLowerCase().includes(input.toLowerCase())
      ),
  });

  if (!response.game) {
    console.log("Cancelled.");
    process.exit(0);
  }

  const game = response.game;
  const now = new Date();
  const dateStr = formatDateForFilename(now);
  const baseFilename = `${dateStr}-${game.slug}`;

  fs.mkdirSync(gamelogDir, { recursive: true });

  let filename = `${baseFilename}.md`;
  let filepath = path.join(gamelogDir, filename);
  let counter = 2;

  while (fs.existsSync(filepath)) {
    filename = `${baseFilename}-${counter}.md`;
    filepath = path.join(gamelogDir, filename);
    counter++;
  }

  const content = `---
title:
date: ${formatDate(now)}
game: ${game.slug}
---

`;

  fs.writeFileSync(filepath, content);

  console.log(`Created: content/gamelog/${filename}`);
}

main();
