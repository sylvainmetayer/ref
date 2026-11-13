import { mkdir, readFile, writeFile } from "node:fs/promises";
import { transform } from "esbuild";
import { png } from "./scripts/og/image.js";

const shortDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  // Sveltia CMS servi depuis npm (version suivie par Renovate, intégrité garantie par package-lock.json)
  eleventyConfig.addPassthroughCopy({ "node_modules/@sveltia/cms/dist": "admin/cms" }, { filter: (path) => !/\.(map|mjs)$/.test(path) });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers", "src/favicon.svg": "favicon.svg" });

  // Minification de la feuille de styles et du script à la génération (pas en --serve)
  eleventyConfig.on("eleventy.after", async ({ dir, runMode }) => {
    if (runMode !== "build") return;
    for (const [file, loader] of [["assets/style.css", "css"], ["assets/main.js", "js"]]) {
      const path = `${dir.output}/${file}`;
      const { code } = await transform(await readFile(path, "utf8"), { loader, minify: true });
      await writeFile(path, code);
    }
  });

  // Services publiés (draft: true exclus), triés par nom
  let referrals = [];
  const published = (api) =>
    api
      .getFilteredByGlob("src/referrals/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title, "fr"));
  eleventyConfig.addCollection("referrals", (api) => (referrals = published(api)));

  // Une page /parrainage-<catégorie>/ par catégorie d'au moins 3 fiches publiées : en dessous,
  // la page serait un quasi-doublon de la fiche
  const slugify = eleventyConfig.getFilter("slugify");
  const categoryUrl = (name) => `/parrainage-${slugify(name)}/`;
  const categoryPages = (items) =>
    Object.entries(Object.groupBy(items, (item) => item.data.category || ""))
      .filter(([name, group]) => name && group.length >= 3)
      .map(([name, group]) => ({ name, url: categoryUrl(name), items: group }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  eleventyConfig.addCollection("categoryPages", (api) => categoryPages(published(api)));
  // Adresse de la page d'une catégorie, vide si elle n'a pas de page
  eleventyConfig.addFilter("categoryUrl", (name) => categoryPages(referrals).find((page) => page.name === name)?.url || "");

  // Image de partage de chaque fiche : /assets/og/<slug>.png (cf. og:image dans base.njk)
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    await mkdir(`${dir.output}/assets/og`, { recursive: true });
    for (const { data } of referrals) {
      const { heading, slug, logo, tintColor: tint } = data;
      await writeFile(`${dir.output}/assets/og/${slug}.png`, png({ heading, slug, logo, tint, host: new URL(data.site.url).host }));
    }
  });

  eleventyConfig.addFilter("shortDate", (date) => shortDate.format(new Date(date)));
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  eleventyConfig.addFilter("longDate", (date) => longDate.format(new Date(date)));

  // Catégories distinctes d'une liste de services, triées
  eleventyConfig.addFilter("categories", (items) =>
    [...new Set(items.map((item) => item.data.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"))
  );

  // « A, B et C » à partir des titres d'une liste de services
  eleventyConfig.addFilter("titleList", (items) => {
    const titles = items.map((item) => item.data.title);
    return titles.length > 1 ? `${titles.slice(0, -1).join(", ")} et ${titles.at(-1)}` : titles.join("");
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  eleventyConfig.addFilter("head", (items, n) => items.slice(0, n));
  // Même catégorie d'abord, puis les suivants dans l'ordre alphabétique en repartant de la page
  // courante : chaque fiche reçoit des liens, pas seulement les premières de l'alphabet
  eleventyConfig.addFilter("related", (items, url, category) => {
    const at = items.findIndex((item) => item.url === url);
    const rest = [...items.slice(at + 1), ...items.slice(0, Math.max(at, 0))];
    return [...rest.filter((item) => item.data.category === category), ...rest.filter((item) => item.data.category !== category)];
  });

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
