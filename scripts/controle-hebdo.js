// Contrôle hebdomadaire (cf. .github/workflows/controle-hebdo.yml) : liens de parrainage
// morts et offres expirées ou proches de l'échéance. Écrit le corps de l'issue sur la
// sortie standard, rien si tout va bien. Les fiches sont désignées par leur slug,
// jamais par leur lien (qui contient le code de parrainage).
import { readdir, readFile } from "node:fs/promises";

export const SOON_DAYS = 14;
const TIMEOUT_MS = 15_000;
const RETRY_DELAY_MS = 5_000;
// Certains sites refusent l'agent par défaut de Node (« node ») d'office
const HEADERS = { "user-agent": "Mozilla/5.0 (compatible; link-check)" };

// « dead » seulement si c'est sûr : 404, 410, domaine inexistant. Le reste (403, 405, 429,
// 5xx, délai dépassé, page anti-bot…) ne prouve rien et passe en vérification manuelle.
export const classify = (outcome) => {
  if (outcome.status) {
    if (outcome.status < 400) return "ok";
    return outcome.status === 404 || outcome.status === 410 ? "dead" : "check";
  }
  return outcome.error?.cause?.code === "ENOTFOUND" ? "dead" : "check";
};

const request = async (fetch, url, method) => {
  try {
    const res = await fetch(url, { method, redirect: "follow", headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { status: res.status };
  } catch (error) {
    return { error };
  }
};

const describe = (outcome) =>
  outcome.status ? `HTTP ${outcome.status}` : outcome.error?.name === "TimeoutError" ? "délai dépassé" : outcome.error?.cause?.code || "erreur réseau";

// HEAD d'abord (léger), GET si HEAD échoue (beaucoup de sites le gèrent mal), une nouvelle tentative si le doute persiste
export const checkLink = async (url, { fetch = globalThis.fetch, retries = 1, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) => {
  let outcome;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt) await sleep(RETRY_DELAY_MS);
    outcome = await request(fetch, url, "HEAD");
    if (classify(outcome) !== "ok") outcome = await request(fetch, url, "GET");
    if (classify(outcome) !== "check") break;
  }
  return { result: classify(outcome), detail: describe(outcome) };
};

// Fiches publiées dont validUntil (AAAA-MM-JJ) est dépassé ou tombe dans les SOON_DAYS jours
export const deadlines = (fiches, today) => {
  const day = today.toISOString().slice(0, 10);
  const soon = new Date(today.getTime() + SOON_DAYS * 86_400_000).toISOString().slice(0, 10);
  return fiches
    .filter((fiche) => !fiche.draft && fiche.validUntil && fiche.validUntil <= soon)
    .map((fiche) => ({ ...fiche, expired: fiche.validUntil < day }));
};

// shortcut: lecture du frontmatter par regex (champs à plat écrits par le CMS), passer à un parseur YAML si le format se complique
export const readFiches = async (dir) =>
  Promise.all(
    (await readdir(dir))
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const text = await readFile(`${dir}/${file}`, "utf8");
        return {
          slug: file.slice(0, -3),
          draft: /^draft:\s*true\s*$/m.test(text),
          validUntil: text.match(/^validUntil:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1],
        };
      })
  );

export const report = (links, offers) => {
  const lines = [];
  const section = (title, items) => items.length && lines.push(`## ${title}`, "", ...items, "");
  section("Liens morts", links.filter((l) => l.result === "dead").map((l) => `- [ ] \`${l.slug}\` : ${l.detail}`));
  section("Liens à vérifier à la main", links.filter((l) => l.result === "check").map((l) => `- [ ] \`${l.slug}\` : ${l.detail} (souvent un blocage anti-robot)`));
  section("Offres expirées", offers.filter((o) => o.expired).map((o) => `- [ ] \`${o.slug}\` : expirée le ${o.validUntil}`));
  section(`Offres qui expirent dans les ${SOON_DAYS} jours`, offers.filter((o) => !o.expired).map((o) => `- [ ] \`${o.slug}\` : jusqu'au ${o.validUntil}`));
  return lines.join("\n");
};

if (import.meta.main) {
  const links = JSON.parse(await readFile("_site/links.json", "utf8"));
  const checked = await Promise.all(Object.entries(links).map(async ([slug, url]) => ({ slug, ...(await checkLink(url)) })));
  for (const { slug, result, detail } of checked) console.error(`${slug} : ${result} (${detail})`);
  process.stdout.write(report(checked, deadlines(await readFiches("src/referrals"), new Date())));
}
