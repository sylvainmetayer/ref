import { test } from "node:test";
import assert from "node:assert/strict";
import { checkLink, classify, deadlines, report } from "./controle-hebdo.js";

const dnsError = Object.assign(new TypeError("fetch failed"), { cause: { code: "ENOTFOUND" } });
const timeout = Object.assign(new Error("timeout"), { name: "TimeoutError" });

// Faux fetch : une réponse (statut ou erreur) par appel, dans l'ordre
const fakeFetch = (...outcomes) => {
  const calls = [];
  const fetch = async (url, { method }) => {
    calls.push(method);
    const next = outcomes.shift();
    if (next instanceof Error) throw next;
    return { status: next };
  };
  return { fetch, calls };
};
const noSleep = async () => {};

test("classify : seuls 404, 410 et un domaine inexistant sont des liens morts", () => {
  for (const status of [200, 204, 301, 302]) assert.equal(classify({ status }), "ok");
  for (const status of [404, 410]) assert.equal(classify({ status }), "dead");
  for (const status of [400, 401, 403, 405, 429, 500, 503]) assert.equal(classify({ status }), "check");
  assert.equal(classify({ error: dnsError }), "dead");
  assert.equal(classify({ error: timeout }), "check");
  assert.equal(classify({ error: new TypeError("fetch failed") }), "check");
});

test("checkLink : HEAD suffit quand il répond", async () => {
  const { fetch, calls } = fakeFetch(200);
  assert.deepEqual(await checkLink("https://x", { fetch, sleep: noSleep }), { result: "ok", detail: "HTTP 200" });
  assert.deepEqual(calls, ["HEAD"]);
});

test("checkLink : 405 sur HEAD, GET répond", async () => {
  const { fetch, calls } = fakeFetch(405, 200);
  assert.equal((await checkLink("https://x", { fetch, sleep: noSleep })).result, "ok");
  assert.deepEqual(calls, ["HEAD", "GET"]);
});

test("checkLink : 404 confirmé par GET, sans nouvelle tentative", async () => {
  const { fetch, calls } = fakeFetch(404, 404);
  assert.deepEqual(await checkLink("https://x", { fetch, sleep: noSleep }), { result: "dead", detail: "HTTP 404" });
  assert.deepEqual(calls, ["HEAD", "GET"]);
});

test("checkLink : 429 puis succès à la nouvelle tentative", async () => {
  const { fetch, calls } = fakeFetch(429, 429, 200);
  assert.equal((await checkLink("https://x", { fetch, sleep: noSleep })).result, "ok");
  assert.deepEqual(calls, ["HEAD", "GET", "HEAD"]);
});

test("checkLink : 403 persistant reste à vérifier", async () => {
  const { fetch } = fakeFetch(403, 403, 403, 403);
  assert.deepEqual(await checkLink("https://x", { fetch, sleep: noSleep }), { result: "check", detail: "HTTP 403" });
});

test("checkLink : délai dépassé et domaine inexistant", async () => {
  assert.deepEqual(await checkLink("https://x", { fetch: fakeFetch(timeout, timeout, timeout, timeout).fetch, sleep: noSleep }), {
    result: "check",
    detail: "délai dépassé",
  });
  assert.deepEqual(await checkLink("https://x", { fetch: fakeFetch(dnsError, dnsError).fetch, sleep: noSleep }), {
    result: "dead",
    detail: "ENOTFOUND",
  });
});

test("deadlines : expirée, bientôt, plus tard, brouillon, sans date", () => {
  const today = new Date("2026-12-20T06:00:00Z");
  const fiches = [
    { slug: "passee", validUntil: "2026-12-19" },
    { slug: "aujourdhui", validUntil: "2026-12-20" },
    { slug: "limite", validUntil: "2027-01-03" },
    { slug: "plus-tard", validUntil: "2027-01-04" },
    { slug: "brouillon", validUntil: "2026-01-01", draft: true },
    { slug: "sans-date" },
  ];
  assert.deepEqual(
    deadlines(fiches, today).map((f) => [f.slug, f.expired]),
    [["passee", true], ["aujourdhui", false], ["limite", false]]
  );
});

test("report : vide si tout va bien, slugs sans lien sinon", () => {
  assert.equal(report([{ slug: "a", result: "ok", detail: "HTTP 200" }], []), "");
  const text = report([{ slug: "a", result: "dead", detail: "HTTP 404" }], [{ slug: "b", validUntil: "2026-12-31", expired: false }]);
  assert.match(text, /Liens morts\n\n- \[ \] `a` : HTTP 404/);
  assert.match(text, /`b` : jusqu'au 2026-12-31/);
  assert.doesNotMatch(text, /https?:/);
});
