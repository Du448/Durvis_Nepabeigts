import fs from "node:fs";
import { factoryProducts } from "../../src/data/factory-products.js";
import { catalogSpecs } from "../../src/data/catalog-specs.js";
import { finishSections } from "../../src/data/finishes.js";
import { hiddenDoors } from "../../src/data/hidden-doors.js";
import { products } from "../../src/data/products.js";

const out = "tools/i18n/dump";
fs.mkdirSync(out, { recursive: true });

const B = () => new Set();
const b = {
  names: B(), shorts: B(), colors: B(), specLabels: B(), specValues: B(),
  fullLabels: B(), fullValues: B(), descTitles: B(), descParas: B(),
  setItems: B(), finishLabels: B(), finishText: B(), misc: B(),
};
const put = (k, s) => { if (typeof s === "string" && s.trim()) b[k].add(s); };

const eatProduct = (p) => {
  put("names", p.name); put("shorts", p.short);
  (p.colors || []).forEach((c) => put("colors", c));
  Object.entries(p.specs || {}).forEach(([k, v]) => { put("specLabels", k); put("specValues", String(v)); });
  (p.specsFull || []).forEach(([k, v]) => { put("fullLabels", k); put("fullValues", String(v)); });
  (p.description || []).forEach((s) => { put("descTitles", s.title); (s.body || []).forEach((x) => put("descParas", x)); });
  (p.set || []).forEach((i) => put("setItems", i));
  if (p.finishMaterial) {
    const f = p.finishMaterial;
    (f.lead || []).forEach((x) => put("descParas", x));
    put("descTitles", f.heading); put("descParas", f.intro);
    (f.layers || []).forEach((l) => { put("descTitles", l.title); put("descParas", l.text); });
  }
};

products.forEach(eatProduct);
factoryProducts.forEach(eatProduct);
hiddenDoors.forEach(eatProduct);
for (const rows of Object.values(catalogSpecs)) rows.forEach(([k, v]) => { put("fullLabels", k); put("fullValues", String(v)); });
for (const sec of finishSections) {
  put("finishText", sec.title); put("finishText", sec.lead);
  (sec.notes || []).forEach((n) => put("finishText", n));
  for (const g of sec.groups || []) { put("finishText", g.title); put("finishText", g.lead); (g.items || []).forEach((i) => put("finishLabels", i.label)); }
}

let total = 0;
for (const [k, set] of Object.entries(b)) {
  const arr = [...set].sort((x, y) => x.localeCompare(y, "lv"));
  fs.writeFileSync(`${out}/${k}.txt`, arr.join("\n"), "utf8");
  total += arr.length;
  console.log(k.padEnd(14), String(arr.length).padStart(5));
}
console.log("TOTAL", total);
