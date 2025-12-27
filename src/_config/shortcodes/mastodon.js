import { DateTime } from "luxon";

function renderLinkCard(card) {
  if (!card) return '';

  const isYouTube = card.provider_name?.toLowerCase() === 'youtube';
  const hasImage = card.image && card.image.length > 0;

  if (isYouTube && hasImage) {
    return `
      <a href="${card.url}" class="c-link-card c-link-card--youtube" rel="noopener" target="_blank">
        <div class="c-link-card__thumbnail">
          <img src="${card.image}" alt="" loading="lazy" />
          <span class="c-link-card__play-button" aria-hidden="true"></span>
        </div>
        <div class="c-link-card__content">
          <span class="c-link-card__title">${card.title || 'YouTube Video'}</span>
          <span class="c-link-card__provider">youtube.com</span>
        </div>
      </a>
    `.replace(/>\s+</g, '><');
  }

  // Regular link card
  return `
    <a href="${card.url}" class="c-link-card" rel="noopener" target="_blank">
      ${hasImage ? `
        <div class="c-link-card__thumbnail">
          <img src="${card.image}" alt="" loading="lazy" />
        </div>
      ` : ''}
      <div class="c-link-card__content">
        <span class="c-link-card__title">${card.title || card.url}</span>
        ${card.description ? `<span class="c-link-card__description">${card.description}</span>` : ''}
        <span class="c-link-card__provider">${card.provider_name || new URL(card.url).hostname}</span>
      </div>
    </a>
  `.replace(/>\s+</g, '><');
}

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
    const linkCard = renderLinkCard(post.card);

    return `
    <figure class="o-prose--small c-quote--mastodon">
      <blockquote>${post.content}</blockquote>
      ${linkCard}
      <figcaption>
        <small>${author.display_name}</small>
        <small> - </small>
        <time datetime="${post.created_at}"><small><a href="${url}" rel="noopener" target="_blank">${formattedDate}</a></small></time>
      </figcaption>
    </figure>
    `.replace(/>\s+</g, '><');
  });
}
