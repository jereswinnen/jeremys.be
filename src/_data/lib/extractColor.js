import ColorThief from "colorthief";

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getSaturation([r, g, b]) {
  const [, s] = rgbToHsl(r, g, b);
  return s;
}

function findMostVibrant(palette) {
  return palette.reduce((most, color) => {
    return getSaturation(color) > getSaturation(most) ? color : most;
  }, palette[0]);
}

function boostSaturation([r, g, b], amount = 1.4) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const boostedS = Math.min(1, s * amount);
  return hslToRgb(h, boostedS, l);
}

function getLuminance([r, g, b]) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function getContrastingTextColor([r, g, b]) {
  const [h, s, l] = rgbToHsl(r, g, b);
  // Light bg → darken the color, dark bg → lighten the color
  const newL = l > 0.5 ? 0.12 : 0.92;
  const [nr, ng, nb] = hslToRgb(h, s, newL);
  return `rgb(${nr},${ng},${nb})`;
}

export async function extractDominantColor(imagePath, { saturate = false, saturationBoost = 1.4 } = {}) {
  try {
    const palette = await ColorThief.getPalette(imagePath, 8);
    const color = findMostVibrant(palette);
    const finalColor = saturate ? boostSaturation(color, saturationBoost) : color;
    return {
      background: `rgb(${finalColor.join(",")})`,
      text: getContrastingTextColor(finalColor),
    };
  } catch (error) {
    console.warn(`Could not extract color from ${imagePath}:`, error.message);
    return null;
  }
}
