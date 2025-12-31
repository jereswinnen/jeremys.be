import image from "./image.js";
import gameCover from "./gameCover.js";
import youtube from "./youtube.js";
import callout from "./callout.js";
import mastodon from "./mastodon.js";
import recapgrid from "./recapgrid.js";
import gameblurb from "./gameblurb.js";

export default function(eleventyConfig) {
  image(eleventyConfig);
  gameCover(eleventyConfig);
  youtube(eleventyConfig);
  callout(eleventyConfig);
  mastodon(eleventyConfig);
  recapgrid(eleventyConfig);
  gameblurb(eleventyConfig);
}
