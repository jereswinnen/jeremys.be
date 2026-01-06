import EleventyFetch from "@11ty/eleventy-fetch";
import "dotenv/config";

export default async function () {
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
