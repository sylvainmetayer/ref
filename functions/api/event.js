import { track } from "../_lib/track.js";

// Événements envoyés par le navigateur (navigator.sendBeacon) depuis assets/main.js
const EVENTS = new Set(["copy", "filter", "other"]);

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return new Response(null, { status: 403 });
  }

  let body;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!EVENTS.has(body?.event)) {
    return new Response(null, { status: 400 });
  }

  track(env, request, body);
  return new Response(null, { status: 204 });
}
