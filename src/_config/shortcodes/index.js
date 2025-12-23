import image from "./image.js";
import gameCover from "./gameCover.js";
import youtube from "./youtube.js";
import callout from "./callout.js";
import mastodon from "./mastodon.js";

export default function(eleventyConfig) {
  image(eleventyConfig);
  gameCover(eleventyConfig);
  youtube(eleventyConfig);
  callout(eleventyConfig);
  mastodon(eleventyConfig);
}
