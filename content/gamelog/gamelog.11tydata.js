export default {
  layout: "layouts/post.njk",
  tags: "gamelog",
  eleventyComputed: {
    permalink: (data) => {
      const date = data.page.date.toISOString().split('T')[0];
      return `/gamelog/${data.game}/${date}/`;
    }
  }
};
