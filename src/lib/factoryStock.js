/* Live stock from the manufacturer's own warehouse spreadsheet (Google
   Sheets, "Залишки ДВЕРІ БУЛАТ" - Чернігів tab), fetched read-only and
   merged into the catalogue's per-variant stock. The sheet is public (its
   CSV export needs no auth) but carries no warehouse-code-style identifier
   of its own, so rows are matched to catalogue products by the model
   number the manufacturer's own site already put in the product name
   ("modelis 547/251") - the one piece of the sheet's free-text Ukrainian
   description that survives translation unchanged.

   A model number often belongs to several catalogue products at once (one
   per colourway, e.g. "Termo House 710/265" comes in Venge and Antracīts
   as separate products) - those are disambiguated by matching the row's
   colour words against each candidate's `colors`, via COLOR_WORD_MAP
   below. That map only needs to cover the vocabulary this specific sheet
   actually uses (checked against the live data while building this), not
   Ukrainian generally. A model+colour combination that still can't be
   told apart is left unmatched rather than guessed.

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
// The colour/finish phrase sits between the model number and the closing
// "(<brand>) <width>мм" - e.g. "710/265 вулична Венге темний/Білий
// атласний (Кале) 850мм" -> "Венге темний/Білий атласний".
const COLOR_SEGMENT_RE = /\d+\/\d+\s*(?:вулична\s+)?(.+?)\s*\([^)]*\)\s*\d{3,4}\s*мм/i;

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
      name,
      model: `${modelMatch[1]}/${modelMatch[2]}`,
      width: widthMatch[1],
      side: sideMatch[1].toLowerCase() === "ліві" ? "left" : "right",
      qty,
    });
  }
  return rows;
}

// Ukrainian colour/finish words (this sheet's own vocabulary) -> the token
// the catalogue's Latvian `colors` values use for the same thing. Values
// already in Latin script (brand names like "Metalic", "Mottura", loan
// finish names like "Дорато"/"Dorato") pass through as-is via the fallback
// in normalizeColorTokens, so they don't need an entry here.
const COLOR_WORD_MAP = {
  венге: "venge",
  антрацит: "antracīts",
  дуб: "ozols",
  бронза: "bronza",
  горіх: "rieksts",
  натуральний: "naturāls",
  молочний: "piena",
  темний: "tumšs",
  темне: "tumšs",
  білий: "balts",
  атласний: "satīns",
  сірий: "pelēks",
  рустик: "rustik",
  авиньон: "avignon",
  авіньйон: "avignon",
  блан: "blan",
  зріз: "griezien",
  каменю: "akmens",
  оксид: "oksīds",
  дрімвуд: "dreamwood",
  шифер: "šifer",
  хром: "hrom",
  матовий: "mat",
  гладкий: "glud",
  супермат: "supermat",
  олово: "alva",
  срібло: "sudrab",
  срібний: "sudrab",
  срібна: "sudrab",
  золото: "zelt",
  золотий: "zelt",
  чорний: "melns",
  мат: "mat",
  пісочний: "smilšains",
};

function normalizeColorTokens(text) {
  const words = text.toLowerCase().match(/[а-яіїєґ]+|[a-z]+/giu) || [];
  const tokens = new Set();
  for (const w of words) {
    if (w.length < 3) continue;
    tokens.add(COLOR_WORD_MAP[w] || w);
  }
  return tokens;
}

function rowColorTokens(rowName) {
  const m = rowName.match(COLOR_SEGMENT_RE);
  return m ? normalizeColorTokens(m[1]) : new Set();
}

function productColorTokens(product) {
  return normalizeColorTokens((product.colors || []).join(" "));
}

// model number -> every catalogue product carrying it (usually one per
// colourway).
function buildModelIndex() {
  const index = new Map();
  for (const p of products) {
    const match = p.name.match(MODEL_RE);
    if (!match) continue;
    const model = `${match[1]}/${match[2]}`;
    const list = index.get(model) || [];
    if (!list.includes(p)) list.push(p);
    index.set(model, list);
  }
  return index;
}

// Picks the one candidate whose `colors` overlap the row's colour words
// more than every other candidate. Ties, or zero overlap, resolve to
// nothing rather than a guess.
function resolveCandidate(row, candidates) {
  if (candidates.length === 1) return candidates[0];
  const rowTokens = rowColorTokens(row.name);
  if (!rowTokens.size) return null;

  let best = null;
  let bestScore = 0;
  let tied = false;
  for (const product of candidates) {
    const productTokens = productColorTokens(product);
    let score = 0;
    for (const t of rowTokens) if (productTokens.has(t)) score++;
    if (score > bestScore) {
      best = product;
      bestScore = score;
      tied = false;
    } else if (score === bestScore && score > 0) {
      tied = true;
    }
  }
  return bestScore > 0 && !tied ? best : null;
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
    const candidates = modelIndex.get(row.model);
    if (!candidates?.length) continue;
    const product = resolveCandidate(row, candidates);
    if (!product) continue;
    const size = (product.sizes || []).find((s) => s.startsWith(`${row.width}×`));
    if (!size) continue;

    const variants = byProduct.get(product.id) || new Map();
    const key = `${size}|${row.side}`;
    variants.set(key, (variants.get(key) || 0) + row.qty);
    byProduct.set(product.id, variants);
  }

  return byProduct;
}
