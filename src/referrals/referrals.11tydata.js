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
    // Parrainage sans lien ni code (ex. EDF, par téléphone) : on passe par moi
    contactUrl: (data) =>
      data.link || data.code ? "" : `mailto:${data.site.email}?subject=${encodeURIComponent(`Parrainage ${data.title}`)}`,
    initial: (data) => data.title.charAt(0).toUpperCase(),
    heading: (data) => {
      const label = data.kind === "Promo" ? "Code promo" : data.kind === "Affiliation" ? "Lien affilié" : data.code ? "Code parrainage" : "Parrainage";
      return data.gain ? `${label} ${data.title} : ${data.gain} ${data.gainLabel || ""}`.trim() : `${label} ${data.title}`;
    },
    stepList: (data) => {
      if (data.steps?.length) return data.steps;
      return data.code
        ? [
            "Copie le code ci-dessus.",
            `Ouvre le lien et crée ton compte ${data.title}, en collant le code si on te le demande.`,
            "L'avantage est appliqué selon les conditions de l'offre.",
          ]
        : [
            "Ouvre mon lien de parrainage.",
            `Crée ton compte ${data.title}.`,
            "L'avantage est appliqué selon les conditions de l'offre.",
          ];
    },
    // Titre Google : requête visée (« code/lien parrainage X ») + avantage chiffré
    metaTitle: (data) => {
      if (data.metaTitle) return data.metaTitle;
      const label = data.code ? "Code parrainage" : "Lien de parrainage";
      return data.gain ? `${label} ${data.title} : ${data.gain} ${data.gainLabel || ""}`.trim() : `${label} ${data.title}`;
    },
    metaDesc: (data) =>
      data.metaDesc ||
      `${data.advantage ? `${data.advantage} chez ${data.title}` : `Inscris-toi chez ${data.title}`} avec mon ${data.code ? "code" : "lien"} de parrainage. Mon avis sur ${data.title} et les étapes pour profiter de l'offre.`,
  },
};
