// Table slug → lien de parrainage, lue par la Pages Function /go/<slug>
export default class {
  data() {
    return { permalink: "/links.json", eleventyExcludeFromCollections: true };
  }

  render({ collections }) {
    return JSON.stringify(Object.fromEntries(collections.referrals.map((item) => [item.data.slug, item.data.link])));
  }
}
