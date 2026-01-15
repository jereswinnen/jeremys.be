import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

// Cache font loading
let fonts = null;

// Extract first content image from HTML (skips small icons)
function extractFirstImage(content) {
  if (!content) return null;
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    // Skip images with size-* classes (typically small icons)
    if (!match[0].includes('class="size-')) {
      return match[1];
    }
  }
  return null;
}

// Load image as base64 data URL for Satori
async function loadImageAsBase64(imagePath) {
  try {
    // Handle different path formats
    let fullPath = imagePath;

    // If it's a root-relative path, resolve from project root
    if (imagePath.startsWith("/")) {
      // Try multiple possible locations
      const possiblePaths = [
        join(process.cwd(), imagePath),
        join(process.cwd(), "src", imagePath),
        join(process.cwd(), "_site", imagePath),
      ];

      for (const p of possiblePaths) {
        if (existsSync(p)) {
          fullPath = p;
          break;
        }
      }
    }

    if (!existsSync(fullPath)) {
      return null;
    }

    const imageBuffer = await readFile(fullPath);
    const ext = fullPath.split(".").pop().toLowerCase();
    const mimeType = ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : "image/jpeg";
    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  } catch (e) {
    console.log(`[og-images] Could not load image: ${imagePath}`);
    return null;
  }
}

async function loadFonts() {
  if (fonts) return fonts;

  // Load PP Radio Grotesk fonts from local TTF files as Uint8Array (required by Satori)
  const radioGroteskRegularPath = join(process.cwd(), "src/assets/fonts/PPRadioGroteskRegular.ttf");
  const radioGroteskBoldPath = join(process.cwd(), "src/assets/fonts/PPRadioGroteskBold.ttf");

  const radioGroteskRegular = new Uint8Array(await readFile(radioGroteskRegularPath));
  const radioGroteskBold = new Uint8Array(await readFile(radioGroteskBoldPath));

  fonts = { radioGroteskRegular, radioGroteskBold };
  return fonts;
}

// Format date as "January 15, 2025"
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// OG Image template
function createTemplate(title, date, imageData) {
  const hasImage = !!imageData;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#D7D3CE",
        color: "#3E3428",
      },
      children: [
        // Left side: Content (date + title, vertically centered)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px",
              width: hasImage ? "700px" : "100%",
              gap: "16px",
            },
            children: [
              // Date (PP Radio Grotesk Bold, 70% opacity, slanted)
              date && {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    fontFamily: "PP Radio Grotesk",
                    fontWeight: 700,
                    transform: "skewX(-8deg)",
                    color: "rgba(62, 52, 40, 0.7)",
                  },
                  children: date,
                },
              },
              // Title
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: title.length > 60 ? "42px" : title.length > 30 ? "52px" : "64px",
                    fontFamily: "PP Radio Grotesk",
                    fontWeight: 400,
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    margin: 0,
                  },
                  children: title,
                },
              },
            ].filter(Boolean),
          },
        },
        // Right side: Image (if present)
        hasImage && {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "500px",
              height: "630px",
              overflow: "hidden",
            },
            children: {
              type: "img",
              props: {
                src: imageData,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              },
            },
          },
        },
      ].filter(Boolean),
    },
  };
}

async function generateOgImage(post, outputDir, siteName, gamesData = []) {
  // Get title, falling back to game title for gamelog posts without a title
  let title = post.data.title;
  if (!title && post.data.game) {
    const game = gamesData.find((g) => g.slug === post.data.game);
    if (game) {
      title = game.title;
    }
  }
  title = title || "Untitled";

  const date = formatDate(post.date || post.data.date);
  // Use URL-based slug for uniqueness
  const slug = post.url?.replace(/^\/|\/$/g, "").replace(/\//g, "-") || post.fileSlug || "post";

  // Try to extract and load the first image from post content
  let imageData = null;
  const content = post.content || post.templateContent;
  if (content) {
    const firstImagePath = extractFirstImage(content);
    if (firstImagePath) {
      imageData = await loadImageAsBase64(firstImagePath);
    }
  }

  const { radioGroteskRegular, radioGroteskBold } = await loadFonts();

  const svg = await satori(createTemplate(title, date, imageData), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "PP Radio Grotesk",
        data: radioGroteskRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "PP Radio Grotesk",
        data: radioGroteskBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();

  const outputPath = join(outputDir, `${slug}.png`);
  await writeFile(outputPath, png);

  return `/og/${slug}.png`;
}

export async function generateAllOgImages(collections, outputDir, siteName, gamesData = []) {
  const ogDir = join(outputDir, "og");

  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    await mkdir(ogDir, { recursive: true });
  }

  const posts = collections.blog || [];
  console.log(`[og-images] Generating ${posts.length} OG images...`);

  const startTime = Date.now();

  for (const post of posts) {
    await generateOgImage(post, ogDir, siteName, gamesData);
  }

  const elapsed = Date.now() - startTime;
  console.log(`[og-images] Generated ${posts.length} images in ${elapsed}ms`);
}
