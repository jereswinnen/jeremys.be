import image from "./image.js";
import youtube from "./youtube.js";
import callout from "./callout.js";
import mastodon from "./mastodon.js";
import themedSection from "./themedSection.js";
import sectionItem from "./sectionItem.js";

export default function(eleventyConfig) {
  image(eleventyConfig);
  youtube(eleventyConfig);
  callout(eleventyConfig);
  mastodon(eleventyConfig);
  themedSection(eleventyConfig);
  sectionItem(eleventyConfig);
}
