/**
 * Seasonal theme switcher
 * Sets data-theme based on time of day, adjusted for season
 *
 * Themes:
 * - sunrise: Early morning transitional theme
 * - sunset: Evening transitional theme
 * - (no theme): Day uses default :root, night respects dark mode preference
 */
(function() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  // Calculate day of year (0-365)
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);

  // Seasonal factor using cosine curve
  // Peaks at 1 around summer solstice (day 172), -1 at winter solstice
  const seasonal = Math.cos((dayOfYear - 172) * (2 * Math.PI / 365));

  // Calculate theme windows based on season
  // Summer: sunrise 5-7 AM, sunset 8-10 PM
  // Winter: sunrise 7-9 AM, sunset 5-7 PM
  const sunriseStart = 6 - seasonal;
  const sunriseEnd = 8 - seasonal;
  const sunsetStart = 18.5 + seasonal * 1.5;
  const sunsetEnd = 20.5 + seasonal * 1.5;

  // Apply theme if within sunrise or sunset window
  if (hour >= sunriseStart && hour < sunriseEnd) {
    document.documentElement.setAttribute('data-theme', 'sunrise');
  } else if (hour >= sunsetStart && hour < sunsetEnd) {
    document.documentElement.setAttribute('data-theme', 'sunset');
  }
})();
