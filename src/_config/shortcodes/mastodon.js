import { DateTime } from "luxon";

export default function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode("mastodon", async function (url) {
    const urlObj = new URL(url);
    const instance = urlObj.origin;
    const pathParts = urlObj.pathname.split('/');
    const statusId = pathParts[pathParts.length - 1];

    const response = await fetch(`${instance}/api/v1/statuses/${statusId}`);
    const post = await response.json();
    const author = post.account;
    const formattedDate = DateTime.fromISO(post.created_at).toFormat("LLL d, yyyy");

    return `
    <figure class="o-prose--small c-quote--mastodon">
      <blockquote>${post.content}</blockquote>
      <figcaption>
        <small>${author.display_name}</small>
        <small> - </small>
        <time datetime="${post.created_at}"><small><a href="${url}" rel="noopener">${formattedDate}</a></small></time>
      </figcaption>
    </figure>
    `;
  });
}
