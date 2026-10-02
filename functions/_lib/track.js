// Écrit un événement dans Workers Analytics Engine (dataset ref_events).
// Schéma des colonnes : blob1 event, blob2 service, blob3 page d'origine, blob4 filtre,
// blob5 référent externe, blob6 pays, blob7 appareil ; double1 = 1.
const MAX_LENGTH = 200;

const clean = (value) => String(value ?? "").slice(0, MAX_LENGTH);

export function track(env, request, { event, slug, from, filter, ref }) {
  const userAgent = request.headers.get("user-agent") || "";
  const device = /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "mobile" : "desktop";

  // Absent en local (wrangler pages dev sans binding) : on ignore
  env.EVENTS?.writeDataPoint({
    indexes: [clean(event)],
    blobs: [event, slug, from, filter, ref, request.cf?.country, device].map(clean),
    doubles: [1],
  });
}

// Hôte du référent s'il est externe au site, sinon ""
export function externalReferrer(request) {
  const referer = request.headers.get("referer");
  if (!referer) return "";
  const host = new URL(referer).hostname;
  return host === new URL(request.url).hostname ? "" : host;
}
