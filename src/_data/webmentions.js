import EleventyFetch from "@11ty/eleventy-fetch";
import "dotenv/config";

// DUMMY DATA - Remove this block when done styling
const DUMMY_DATA = [
  // Article mentions
  { "wm-target": "https://jeremys.be/articles/media-recap/", "wm-property": "like-of", author: { name: "Alice", url: "https://mastodon.social/@alice", photo: "https://i.pravatar.cc/150?u=alice" } },
  { "wm-target": "https://jeremys.be/articles/media-recap/", "wm-property": "like-of", author: { name: "Bob", url: "https://mastodon.social/@bob", photo: "https://i.pravatar.cc/150?u=bob" } },
  { "wm-target": "https://jeremys.be/articles/media-recap/", "wm-property": "repost-of", author: { name: "Diana", url: "https://mastodon.social/@diana", photo: "https://i.pravatar.cc/150?u=diana" } },
  { "wm-target": "https://jeremys.be/articles/media-recap/", "wm-property": "in-reply-to", url: "https://mastodon.social/@frank/123", published: "2025-01-05T14:30:00Z", author: { name: "Frank Johnson", url: "https://mastodon.social/@frank", photo: "https://i.pravatar.cc/150?u=frank" }, content: { text: "Great recap!", html: "<p>Great recap!</p>" } },
  // Note mentions
  { "wm-target": "https://jeremys.be/notes/game-of-the-day-cast-n-chill/", "wm-property": "like-of", author: { name: "Charlie", url: "https://mastodon.social/@charlie", photo: "https://i.pravatar.cc/150?u=charlie" } },
  { "wm-target": "https://jeremys.be/notes/game-of-the-day-cast-n-chill/", "wm-property": "repost-of", author: { name: "Eve", url: "https://mastodon.social/@eve", photo: "https://i.pravatar.cc/150?u=eve" } },
  { "wm-target": "https://jeremys.be/notes/game-of-the-day-cast-n-chill/", "wm-property": "in-reply-to", url: "https://mastodon.social/@ivan/111", published: "2025-01-03T16:45:00Z", author: { name: "Ivan", url: "https://mastodon.social/@ivan", photo: "https://i.pravatar.cc/150?u=ivan" }, content: { text: "Love this! Cast n Chill is such a relaxing game.", html: "<p>Love this! Cast n Chill is such a relaxing game.</p>" } },
  { "wm-target": "https://jeremys.be/notes/game-of-the-day-cast-n-chill/", "wm-property": "in-reply-to", url: "https://mastodon.social/@julia/222", published: "2025-01-04T11:20:00Z", author: { name: "Julia Martinez", url: "https://mastodon.social/@julia", photo: "https://i.pravatar.cc/150?u=julia" }, content: { text: "Been meaning to try this one. How long is a typical session?", html: "<p>Been meaning to try this one. How long is a typical session?</p>" } },
  // Gamelog mentions
  { "wm-target": "https://jeremys.be/gamelog/hades-2/2025-12-31/", "wm-property": "like-of", author: { name: "Grace", url: "https://mastodon.social/@grace", photo: "https://i.pravatar.cc/150?u=grace" } },
  { "wm-target": "https://jeremys.be/gamelog/hades-2/2025-12-31/", "wm-property": "in-reply-to", url: "https://mastodon.social/@hank/789", published: "2025-01-06T10:00:00Z", author: { name: "Hank", url: "https://mastodon.social/@hank", photo: "https://i.pravatar.cc/150?u=hank" }, content: { text: "Hades 2 is amazing!", html: "<p>Hades 2 is amazing!</p>" } },
];
const USE_DUMMY_DATA = false; // Set to false to use real data
// END DUMMY DATA

export default async function () {
  if (USE_DUMMY_DATA) {
    return DUMMY_DATA;
  }

  const token = process.env.WEBMENTION_IO_TOKEN;
  const domain = "jeremys.be";

  if (!token) {
    console.log("No WEBMENTION_IO_TOKEN found, skipping webmentions fetch");
    return [];
  }

  const url = `https://webmention.io/api/mentions.jf2?domain=${domain}&token=${token}&per-page=1000`;

  try {
    const response = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    return response.children || [];
  } catch (error) {
    console.error("Error fetching webmentions:", error.message);
    return [];
  }
}
