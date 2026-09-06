/* Reports catalogue strings that would still render in Latvian for a locale. */
import { factoryProducts } from "../../src/data/factory-products.js";
import { catalogSpecs } from "../../src/data/catalog-specs.js";
import { finishSections } from "../../src/data/finishes.js";
import { hiddenDoors } from "../../src/data/hidden-doors.js";
import { products } from "../../src/data/products.js";
import { catalogTranslations } from "../../src/data/translations/index.js";

const dict = catalogTranslations.lt;
const missing = new Map();
const check = (bucket, s) => {
  if (typeof s !== "string" || !s.trim()) return;
  if (dict[s]) return;
  // Pure codes/numbers need no translation.
  if (!/[a-zA-ZĀ-ž]/.test(s)) return;
  missing.set(s, bucket);
};

const eat = (p) => {
  check("name", p.name);
  check("short", p.short);
  (p.colors || []).forEach((c) => check("color", c));
  Object.entries(p.specs || {}).forEach(([k, v]) => { check("specLabel", k); check("specValue", String(v)); });
  (p.specsFull || []).forEach(([k, v]) => { check("fullLabel", k); check("fullValue", String(v)); });
  (p.description || []).forEach((s) => { check("descTitle", s.title); (s.body || []).forEach((b) => check("descPara", b)); });
  (p.set || []).forEach((i) => check("setItem", i));
  const f = p.finishMaterial;
  if (f) {
    (f.lead || []).forEach((x) => check("descPara", x));
    check("descTitle", f.heading); check("descPara", f.intro);
    (f.layers || []).forEach((l) => { check("descTitle", l.title); check("descPara", l.text); });
  }
};

products.forEach(eat);
factoryProducts.forEach(eat);
hiddenDoors.forEach(eat);
for (const rows of Object.values(catalogSpecs)) rows.forEach(([k, v]) => { check("fullLabel", k); check("fullValue", String(v)); });
for (const sec of finishSections) {
  check("finishText", sec.title); check("finishText", sec.lead);
  (sec.notes || []).forEach((n) => check("finishText", n));
  for (const g of sec.groups || []) { check("finishText", g.title); check("finishText", g.lead); (g.items || []).forEach((i) => check("finishLabel", i.label)); }
}

/* Pattern codes the manufacturer names the same in every language. */
const CODE = /^(Adel|B-|BM |Classic|Escada|Grille|Kombi|Lampre|Onix|Orion|Rhombus|Skif|Verona|PVC-|RAL)/;
const real = [...missing].filter(([s]) => !CODE.test(s));

console.log(`untranslated: ${real.length} (of ${missing.size} unmatched, rest are pattern codes)`);
for (const [s, bucket] of real) console.log(` [${bucket}] ${s.length > 120 ? s.slice(0, 120) + "…" : s}`);
