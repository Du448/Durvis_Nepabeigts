/* Pulls a handful of numeric/categorical attributes out of a product's free-
   text specification table, for the catalogue's technical filters (modelled
   on bulat-doors.com.ua's own "door leaf thickness / metal thickness /
   sealing contours / threshold" filters).

   The underlying data (`specsFull` rows, or the older `specs` object) was
   built up over time from several manufacturer catalogue exports, so the
   same attribute carries different label spellings on different products
   ("Vērtnes metāla biezums" vs "Metāla biezums vērtnē" vs "Ārējās metāla
   loksnes biezums", all meaning the same thing). Each function below tries
   its label candidates in order and returns the first match - checked
   against the live catalogue while building this, covering 84-95% of
   entrance-door models. A genuine "door frame profile" filter (Bulat's
   "Liekts profils 100mm/110mm/130mm") was left out: barely a fifth of
   products carry that specific spec at all, too sparse to be a useful
   filter rather than a mostly-empty one. */

function rowsOf(product) {
  return product.specsFull?.length ? product.specsFull : Object.entries(product.specs || {});
}

function findValue(rows, labels) {
  for (const [label, value] of rows) if (labels.includes(label)) return value;
  return null;
}

const LEAF_LABELS = ["Vērtnes biezums"];
export function leafThicknessMm(product) {
  const value = findValue(rowsOf(product), LEAF_LABELS);
  if (!value) return null;
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? m[1].replace(",", ".") : null;
}

// Frame and leaf metal gauge are recorded under a dozen different labels
// depending on the source export, but for a given door they're always the
// same steel sheet thickness - so one shared facet, first label that has a
// value.
const METAL_LABELS = [
  "Metāla biezums vērtnē",
  "Vērtnes metāla biezums",
  "Vērtnes konstrukciju metāla biezums",
  "Metāla biezums kārbā",
  "Kārbas metāla biezums",
  "Ārējās metāla loksnes biezums",
];
export function metalThicknessMm(product) {
  const value = findValue(rowsOf(product), METAL_LABELS);
  if (!value) return null;
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*m?m/i);
  return m ? m[1].replace(",", ".") : null;
}

// Same story: "N kontūru", "N uz vērtnes", "N gab." all just encode a count.
const SEAL_LABELS = ["Eiroblīvējums (kontūras)", "Blīvējuma kontūras", "Blīvējuma kontūru skaits"];
export function sealContourCount(product) {
  const rows = rowsOf(product);
  for (const label of SEAL_LABELS) {
    const row = rows.find(([l]) => l === label);
    if (!row) continue;
    const m = String(row[1]).match(/^(\d+)/);
    if (m) return m[1];
  }
  return null;
}

// Three real categories in the data: stainless steel, plain steel, and
// aluminium-with-thermal-break (used on thermo-break exterior doors).
const THRESHOLD_LABELS = ["Ārdurvju slieksnis", "Slieksnis", "Nerūsējošā tērauda slieksnis"];
export function thresholdType(product) {
  const rows = rowsOf(product);
  for (const label of THRESHOLD_LABELS) {
    const row = rows.find(([l]) => l === label);
    if (!row) continue;
    const value = String(row[1]).toLowerCase();
    if (value === "nav") continue; // "no [stainless threshold]" - says nothing about what it is
    if (value.includes("alumīnij")) return "aluminum-thermal";
    if (value.includes("nerūsējoš")) return "stainless";
    if (value === "ir") return "stainless"; // the boolean-style "Nerūsējošā tērauda slieksnis: Ir"
    if (value.includes("tērauda")) return "steel";
  }
  return null;
}
