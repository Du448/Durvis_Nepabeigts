/* Live stock from the manufacturer's own warehouse spreadsheet (Google
   Sheets, "Залишки ДВЕРІ БУЛАТ" - Чернігів tab), fetched read-only and
   merged into the catalogue's per-variant stock. The sheet is public (its
   CSV export needs no auth) but carries no warehouse-code-style identifier
   of its own, so rows are matched to catalogue products by the model
   number the manufacturer's own site already put in the product name
   ("modelis 547/251") - the one piece of the sheet's free-text Ukrainian
   description that survives translation unchanged. A model number that
   belongs to more than one catalogue product is treated as unmatched
   rather than guessed.

   Refreshed at most every REVALIDATE_SECONDS via Next's fetch cache - no
   cron job, no storage, nothing to keep in sync by hand. */

import { products } from "@/data/products";

const SHEET_ID = "1YO1ld_GPbUG1sC4o44kvr4Bj7jJqj-qJwrkUIlvwCZ0";
const SHEET_NAME = "ЧЕРНІГІВ";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
const REVALIDATE_SECONDS = 30 * 60;

// Real product rows all start with this; section/subtotal rows ("ВУЛИЧНИЙ
// ТИП ДВЕРЕЙ", "3.В-81 Кале", ...) don't and are skipped.
const ROW_RE = /^Двері/;
const MODEL_RE = /\b(\d{2,4})\/(\d{2,4})\b/;
const WIDTH_RE = /(\d{3,4})\s*мм/i;
// No \b here - JS regex word boundaries are ASCII-only and don't fire
// reliably around Cyrillic text, so anchoring on \b silently matched nothing.
const SIDE_RE = /(ліві|праві)/i;

function parseCsvLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') inQuotes = false;
      else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      cells.push(cur);
      cur = "";
    } else cur += c;
  }
  cells.push(cur);
  return cells;
}

function parseSheetRows(csvText) {
  const rows = [];
  for (const line of csvText.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const name = (cells[0] || "").trim();
    if (!ROW_RE.test(name)) continue;
    const qty = Number(cells[1]);
    if (!Number.isFinite(qty)) continue;
    const modelMatch = name.match(MODEL_RE);
    const widthMatch = name.match(WIDTH_RE);
    const sideMatch = name.match(SIDE_RE);
    if (!modelMatch || !widthMatch || !sideMatch) continue;
    rows.push({
      model: `${modelMatch[1]}/${modelMatch[2]}`,
      width: widthMatch[1],
      side: sideMatch[1].toLowerCase() === "ліві" ? "left" : "right",
      qty,
    });
  }
  return rows;
}

// model number -> product id, or "ambiguous" when more than one product
// carries the same number (never auto-matched).
function buildModelIndex() {
  const index = new Map();
  for (const p of products) {
    const match = p.name.match(MODEL_RE);
    if (!match) continue;
    const model = `${match[1]}/${match[2]}`;
    if (index.has(model) && index.get(model) !== p.id) index.set(model, "ambiguous");
    else if (!index.has(model)) index.set(model, p.id);
  }
  return index;
}

/* productId -> Map("<size>|<left|right>" -> qty), same key shape the LV
   warehouse sync uses, so the two sources merge without any special
   casing at the call site. */
export async function getFactoryStock() {
  let csvText;
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return new Map();
    csvText = await res.text();
  } catch (err) {
    console.error("factory stock: fetch failed", err);
    return new Map();
  }

  const rows = parseSheetRows(csvText);
  const modelIndex = buildModelIndex();
  const byProduct = new Map();

  for (const row of rows) {
    const productId = modelIndex.get(row.model);
    if (!productId || productId === "ambiguous") continue;
    const product = products.find((p) => p.id === productId);
    const size = (product?.sizes || []).find((s) => s.startsWith(`${row.width}×`));
    if (!size) continue;

    const variants = byProduct.get(productId) || new Map();
    const key = `${size}|${row.side}`;
    variants.set(key, (variants.get(key) || 0) + row.qty);
    byProduct.set(productId, variants);
  }

  return byProduct;
}
