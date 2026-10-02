import { externalReferrer, track } from "../_lib/track.js";

// /go/<slug> : redirige vers le lien de parrainage et compte le clic.
// Le contexte (from, filter, ref) est ajouté en paramètres par assets/main.js ;
// sans JS (lien partagé), on se rabat sur l'en-tête Referer.
export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const slug = (params.path || [])[0];
  const links = await env.ASSETS.fetch(new URL("/links.json", url)).then((response) => response.json());

  if (!slug || !links[slug]) {
    return Response.redirect(new URL("/", url), 302);
  }

  track(env, request, {
    event: "go",
    slug,
    from: url.searchParams.get("from") || "direct",
    filter: url.searchParams.get("filter"),
    ref: url.searchParams.get("ref") ?? externalReferrer(request),
  });

  return Response.redirect(links[slug], 302);
}
