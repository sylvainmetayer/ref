import assert from "node:assert/strict";
import test from "node:test";
import { png, svg } from "./image.js";

const fiche = { heading: "Parrainage Hetzner : 20 € de crédit", slug: "hetzner", logo: "", tint: "#BBF7D0", host: "ref.example" };

test("png : image PNG de 1200 × 630", () => {
  const image = png(fiche);
  assert.equal(image.subarray(1, 4).toString(), "PNG");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});

test("svg : un titre long est réduit pour tenir, un titre sans avantage a sa seconde ligne", () => {
  const long = svg({ ...fiche, heading: `Parrainage ${"Très Long Nom De Service ".repeat(3)}: 20 €` });
  assert.ok(Number(long.match(/y="316" font-size="(\d+)"/)[1]) < 84);
  assert.match(svg({ ...fiche, heading: "Parrainage Revolut" }), /le lien et mon avis\./);
});
