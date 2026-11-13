// Image de partage (Open Graph) d'une fiche, même maquette que l'image générique
// src/assets/og.png. SVG rendu en PNG par resvg, sans police système.
import { readFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const W = 1200;
const H = 630;
const MARGIN = 90;
// Polices du site figées en TTF (resvg ne lit pas le woff2) : graisse 800 et Plex Mono 500
const font = { fontFiles: ["scripts/og/bricolage-grotesque-800.ttf", "scripts/og/ibm-plex-mono-500.ttf"], loadSystemFonts: false };
const TITLE = `font-family="Bricolage Grotesque 96pt ExtraBold" font-weight="800" letter-spacing="-0.04em"`;

const escape = (text) => text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

const textWidth = (text, size) => {
  const box = new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="300"><text x="0" y="200" font-size="${size}" ${TITLE}>${escape(text)}</text></svg>`, { font }).getBBox();
  return box ? box.x + box.width : 0;
};

// Plus grande taille (84 px au plus) à laquelle le texte tient dans la largeur donnée
const fit = (text, maxWidth) => {
  const width = textWidth(text, 84);
  const size = Math.floor(Math.min(84, (84 * maxWidth) / width));
  return { size, width: (width * size) / 84 };
};

export const svg = ({ heading, slug, logo, tint, host }) => {
  // « Parrainage Hetzner : 20 € de crédit » → deux lignes, la seconde surlignée
  const [first, second = "le lien et mon avis"] = heading.split(" : ");
  const one = fit(`${first},`, W - 2 * MARGIN);
  const two = fit(`${second}.`, W - 2 * MARGIN - 28);
  const image = logo ? `data:image/png;base64,${readFileSync(`src${logo}`).toString("base64")}` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#F3F4F9"/>
  <rect x="${MARGIN}" y="80" width="72" height="72" rx="20" fill="#C2410C" transform="rotate(-6 126 116)"/>
  <text x="126" y="130" font-size="38" text-anchor="middle" ${TITLE} fill="#FFFFFF">%</text>
  <text x="182" y="132" font-size="42" ${TITLE} fill="#1B1B2F">Mes codes</text>
  ${image ? `<rect x="${W - MARGIN - 112}" y="60" width="112" height="112" rx="30" fill="${tint}"/><clipPath id="logo"><rect x="${W - MARGIN - 112}" y="60" width="112" height="112" rx="30"/></clipPath><image href="${image}" x="${W - MARGIN - 112}" y="60" width="112" height="112" clip-path="url(#logo)"/>` : ""}
  <text x="${MARGIN}" y="316" font-size="${one.size}" ${TITLE} fill="#1B1B2F">${escape(first)},</text>
  <rect x="${MARGIN}" y="340" width="${Math.ceil(two.width) + 28}" height="${Math.round(two.size * 1.2)}" rx="14" fill="#FFE08A"/>
  <text x="${MARGIN + 14}" y="${340 + Math.round(two.size * 0.9)}" font-size="${two.size}" ${TITLE} fill="#1B1B2F">${escape(second)}.</text>
  <text x="${MARGIN}" y="545" font-size="30" font-family="IBM Plex Mono Medium" font-weight="500" fill="#5B5F73">${escape(`${host}/${slug}`)}</text>
</svg>`;
};

export const png = (fiche) => new Resvg(svg(fiche), { font }).render().asPng();
