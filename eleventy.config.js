const shortDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Services publiés (draft: true exclus), triés par nom
  eleventyConfig.addCollection("referrals", (api) =>
    api
      .getFilteredByGlob("src/referrals/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title, "fr"))
  );

  eleventyConfig.addFilter("shortDate", (date) => shortDate.format(new Date(date)));
  eleventyConfig.addFilter("longDate", (date) => longDate.format(new Date(date)));

  // Catégories distinctes d'une liste de services, triées
  eleventyConfig.addFilter("categories", (items) =>
    [...new Set(items.map((item) => item.data.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"))
  );

  // Autres services que celui de la page courante
  eleventyConfig.addFilter("head", (items, n) => items.slice(0, n));
  eleventyConfig.addFilter("except", (items, url) => items.filter((item) => item.url !== url));

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
