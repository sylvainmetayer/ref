// Table slug → lien de parrainage, lue par la Pages Function /go/<slug>
// (les services sans lien, parrainés sur demande, n'y figurent pas)
export default class {
  data() {
    return { permalink: "/links.json", eleventyExcludeFromCollections: true };
  }

  render({ collections }) {
    return JSON.stringify(Object.fromEntries(collections.referrals.filter((item) => item.data.link).map((item) => [item.data.slug, item.data.link])));
  }
}
