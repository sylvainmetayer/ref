// Lien de parrainage du slug demandé, ou null s'il n'existe pas
async function resolve({ request, env, params }) {
  const url = new URL(request.url);
  const slug = (params.path || [])[0];
  const links = await env.ASSETS.fetch(new URL("/links.json", url)).then((response) => response.json());
  return { url, slug, link: slug ? links[slug] || null : null };
}

// /go/<slug> (GET et HEAD) : redirige vers le lien de parrainage, ou vers l'accueil si le slug est inconnu
export async function onRequestGet(context) {
  const { url, link } = await resolve(context);
  return Response.redirect(link || new URL("/", url), 302);
}

export const onRequestHead = onRequestGet;
