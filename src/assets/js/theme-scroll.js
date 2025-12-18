/**
 * Theme Scroll Observer
 * Updates body[data-theme] based on which project is centered in viewport.
 * Remove this file and its script tag in base.njk to disable.
 */
(function () {
  const projects = document.querySelectorAll('article[data-theme]');
  if (!projects.length) return;

  let currentTheme = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const theme = entry.target.dataset.theme;
          if (theme !== currentTheme) {
            currentTheme = theme;
            document.body.dataset.theme = theme;
          }
        }
      });
    },
    {
      // Trigger when project crosses the center of viewport
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    }
  );

  projects.forEach((project) => observer.observe(project));

  // Clear theme when no project is centered (top/bottom of page)
  const clearObserver = new IntersectionObserver(
    (entries) => {
      const anyVisible = entries.some((e) => e.isIntersecting);
      if (!anyVisible && currentTheme !== null) {
        currentTheme = null;
        delete document.body.dataset.theme;
      }
    },
    {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    }
  );

  projects.forEach((project) => clearObserver.observe(project));
})();
