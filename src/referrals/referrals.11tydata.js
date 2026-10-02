// Couleurs de fond par défaut des logos (cf. maquette), choisie à partir du slug
const TINTS = ["#BFDBFE", "#FDE68A", "#BBF7D0", "#DDD6FE", "#FBCFE8", "#FED7AA", "#A5F3FC"];

const hash = (text) => [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0);

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

export default {
  layout: "referral.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/${data.page.fileSlug}/`),
    slug: (data) => data.page.fileSlug,
    tintColor: (data) => data.tint || TINTS[hash(data.page.fileSlug) % TINTS.length],
    initial: (data) => data.title.charAt(0).toUpperCase(),
    heading: (data) => {
      const label = data.kind === "Promo" ? "Code promo" : data.code ? "Code parrainage" : "Parrainage";
      return data.gain ? `${label} ${data.title} : ${data.gain} ${data.gainLabel || ""}`.trim() : `${label} ${data.title}`;
    },
    stepList: (data) => {
      if (data.steps?.length) return data.steps;
      return data.code
        ? [
            "Copiez le code ci-dessus.",
            `Ouvrez le lien et créez votre compte ${data.title}, en collant le code si demandé.`,
            "L'avantage est appliqué selon les conditions de l'offre.",
          ]
        : [
            "Ouvrez mon lien de parrainage.",
            `Créez votre compte ${data.title}.`,
            "L'avantage est appliqué selon les conditions de l'offre.",
          ];
    },
    metaTitle: (data) => data.metaTitle || `Parrainage ${data.title} : code et lien d'inscription`,
    metaDesc: (data) =>
      data.metaDesc ||
      `Inscrivez-vous à ${data.title}${data.category ? ` (${data.category.toLowerCase()})` : ""} avec mon lien de parrainage${data.advantage ? ` : ${lowerFirst(data.advantage)}` : ""}.`,
  },
};
