// Couleurs de fond par défaut des logos (cf. maquette), choisie à partir du slug
const TINTS = ["#BFDBFE", "#FDE68A", "#BBF7D0", "#DDD6FE", "#FBCFE8", "#FED7AA", "#A5F3FC"];

// Durée du badge « Nouveau » après la date d'ajout (champ date du frontmatter)
const NEW_DAYS = 60;

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
    // shortcut: état figé au build (une offre expire en ligne seulement au build suivant), passer à un build planifié (cron) si les dates se multiplient
    expired: (data) => Boolean(data.validUntil) && new Date(data.validUntil).toISOString().slice(0, 10) < data.build.date.toISOString().slice(0, 10),
    // shortcut: badge figé au build (il disparaît au premier build après les 60 jours), passer à un build planifié (cron) si l'écart gêne
    isNew: (data) => Boolean(data.date) && data.build.date - new Date(data.date) < NEW_DAYS * 86_400_000,
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
    // Titre Google : le H1 (requête « parrainage X » + avantage chiffré), sauf surcharge
    metaTitle: (data) => data.metaTitle || data.heading,
    metaDesc: (data) =>
      data.metaDesc ||
      `${data.advantage ? `${data.advantage} chez ${data.title}` : `Inscris-toi chez ${data.title}`} avec mon ${data.code ? "code" : "lien"} de parrainage. Mon avis sur ${data.title} et les étapes pour profiter de l'offre.`,
  },
};
