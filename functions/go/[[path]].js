import { externalReferrer, track } from "../_lib/track.js";

// Lien de parrainage du slug demandé, ou null s'il n'existe pas
async function resolve({ request, env, params }) {
  const url = new URL(request.url);
  const slug = (params.path || [])[0];
  const links = await env.ASSETS.fetch(new URL("/links.json", url)).then((response) => response.json());
  return { url, slug, link: slug ? links[slug] || null : null };
}

// /go/<slug> : redirige vers le lien de parrainage et compte le clic.
// Le contexte (from, filter, ref) est ajouté en paramètres par assets/main.js ;
// sans JS (lien partagé), on se rabat sur l'en-tête Referer.
export async function onRequestGet(context) {
  const { request, env } = context;
  const { url, slug, link } = await resolve(context);

  if (!link) {
    return Response.redirect(new URL("/", url), 302);
  }

  track(env, request, {
    event: "go",
    slug,
    from: url.searchParams.get("from") || "direct",
    filter: url.searchParams.get("filter"),
    ref: url.searchParams.get("ref") ?? externalReferrer(request),
  });

  return Response.redirect(link, 302);
}

// HEAD (curl -I, vérificateurs de liens, aperçus) : même redirection, sans compter de clic
export async function onRequestHead(context) {
  const { url, link } = await resolve(context);
  return Response.redirect(link || new URL("/", url), 302);
}
