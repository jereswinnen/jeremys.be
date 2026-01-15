import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

// Cache font loading
let fontData = null;

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

async function loadFont() {
  if (fontData) return fontData;

  // Fetch Inter font from Google Fonts (widely supported, clean look)
  const response = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
  );
  fontData = await response.arrayBuffer();
  return fontData;
}

// OG Image template - customize this for your design
function createTemplate(title, siteName, type, imageData) {
  // Layout with image on the right if present
  const hasImage = !!imageData;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
      },
      children: [
        // Left side: Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "60px",
              flex: hasImage ? "1" : "1",
              width: hasImage ? "700px" : "100%",
            },
            children: [
              // Top: Type label
              type && {
                type: "div",
                props: {
                  style: {
                    fontSize: "24px",
                    color: "#737373",
                    textTransform: "capitalize",
                  },
                  children: type,
                },
              },
              // Middle: Title
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                  },
                  children: {
                    type: "h1",
                    props: {
                      style: {
                        fontSize: title.length > 60 ? "42px" : title.length > 30 ? "52px" : "64px",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        margin: 0,
                      },
                      children: title,
                    },
                  },
                },
              },
              // Bottom: Site name
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "28px",
                    color: "#a3a3a3",
                  },
                  children: siteName,
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

async function generateOgImage(post, outputDir, siteName) {
  const title = post.data.title || "Untitled";
  // Use URL-based slug for uniqueness (e.g., /gamelog/zelda-totk/2025-12-21/ -> gamelog-zelda-totk-2025-12-21)
  const slug = post.url?.replace(/^\/|\/$/g, "").replace(/\//g, "-") || post.fileSlug || "post";

  // Determine post type from tags
  let type = null;
  if (post.data.tags?.includes("articles")) type = "article";
  else if (post.data.tags?.includes("notes")) type = "note";
  else if (post.data.tags?.includes("gamelog")) type = "gamelog";

  // Try to extract and load the first image from post content
  let imageData = null;
  const content = post.content || post.templateContent;
  if (content) {
    const firstImagePath = extractFirstImage(content);
    if (firstImagePath) {
      imageData = await loadImageAsBase64(firstImagePath);
    }
  }

  const font = await loadFont();

  const svg = await satori(createTemplate(title, siteName, type, imageData), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: font,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: font,
        weight: 600,
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

export async function generateAllOgImages(collections, outputDir, siteName) {
  const ogDir = join(outputDir, "og");

  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    await mkdir(ogDir, { recursive: true });
  }

  const posts = collections.blog || [];
  console.log(`[og-images] Generating ${posts.length} OG images...`);

  const startTime = Date.now();

  for (const post of posts) {
    await generateOgImage(post, ogDir, siteName);
  }

  const elapsed = Date.now() - startTime;
  console.log(`[og-images] Generated ${posts.length} images in ${elapsed}ms`);
}
