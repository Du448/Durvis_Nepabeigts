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
// Most models carry a slash-separated pair (e.g. "710/265"), which is what
// the catalogue's own "modelis 710/265" names use too. A smaller set of
// collections (Citadel, Tandem, Olimp, Termo Ultra...) only get a single
// number both on the sheet ("(квадро) 535", "(квадро) мод.155") and in the
// catalogue ("modelis 535") - SINGLE_MODEL_* below covers those.
const MODEL_RE = /\b(\d{2,4})\/(\d{2,4})\b/;
// Anchored on "(квадро)" (this sheet's own marker for these collections)
// rather than bare digits, which would otherwise catch widths and prices
// too. The optional "/Гладка"-style suffix ("/smooth") is swallowed into
// the match so it doesn't leak into the colour segment that follows.
const SINGLE_MODEL_SHEET_RE = /\(квадро\)\s*(?:мод\.)?\s*(\d{3,4})(?:\/\S+)?/i;
const SINGLE_MODEL_CATALOG_RE = /modelis\s+(\d{3,4})\b/i;
const WIDTH_RE = /(\d{3,4})\s*мм/i;
// No \b here - JS regex word boundaries are ASCII-only and don't fire
// reliably around Cyrillic text, so anchoring on \b silently matched nothing.
const SIDE_RE = /(ліві|праві)/i;
// The colour/finish phrase sits between the end of the model match and the
// closing "(<brand>) <width>мм" - e.g. "...Венге темний/Білий атласний
// (Кале) 850мм" -> "Венге темний/Білий атласний". The "(<brand>)" part is
// optional - "Електро" rows go straight to "<width>мм" with no brand in
// parentheses at all.
const COLOR_TAIL_RE = /^\s*(?:вулична\s+)?(.+?)\s*(?:\([^)]*\)\s*)?\d{3,4}\s*мм/i;

// The colour phrase sits after wherever the model number match ends,
// whether that was a "XXX/YYY" pair or a single "(квадро) NNN" - slicing
// from the end of that match keeps one shared tail pattern (COLOR_TAIL_RE)
// working for both.
function extractColorText(name, modelMatch) {
  const rest = name.slice(modelMatch.index + modelMatch[0].length);
  const m = rest.match(COLOR_TAIL_RE);
  return m ? m[1] : null;
}

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
    const rawQty = Number(cells[1]);
    if (!Number.isFinite(rawQty)) continue;
    // The sheet's "free balance" column goes negative when a colourway is
    // oversold beyond what's physically on the shelf (more reserved than
    // in stock, with the rest still in production per its own column) -
    // there's nothing to sell right now either way, so floor it at 0
    // rather than showing e.g. "-21 pcs" on the site.
    const qty = Math.max(0, rawQty);
    const widthMatch = name.match(WIDTH_RE);
    const sideMatch = name.match(SIDE_RE);
    if (!widthMatch || !sideMatch) continue;

    const pairMatch = name.match(MODEL_RE);
    const singleMatch = !pairMatch && name.match(SINGLE_MODEL_SHEET_RE);
    if (!pairMatch && !singleMatch) continue;

    rows.push({
      name,
      model: pairMatch ? `${pairMatch[1]}/${pairMatch[2]}` : singleMatch[1],
      modelType: pairMatch ? "pair" : "single",
      colorText: extractColorText(name, pairMatch || singleMatch),
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
  // \p{L} (any letter, any script) rather than an ASCII-only a-z run - the
  // latter used to split Latvian diacritics (š, ā, ī...) mid-word, e.g.
  // "Tumšs" -> "tum", which then never matched the dictionary's full
  // "tumšs" produced from the Ukrainian side.
  const words = text.toLowerCase().match(/[\p{L}]+/gu) || [];
  const tokens = new Set();
  for (const w of words) {
    if (w.length < 3) continue;
    tokens.add(COLOR_WORD_MAP[w] || w);
  }
  return tokens;
}

// Inside/outside colour segments as separate token sets, in order - a flat
// merged set can't tell "Venge tumšs / Venge tumšs" apart from "Venge tumšs
// / Balts satīns" (both share the inside colour, so a merged set ties);
// comparing side-by-side by position doesn't.
function rowColorSegments(row) {
  return row.colorText ? row.colorText.split("/").map(normalizeColorTokens) : [];
}

function productColorSegments(product) {
  return (product.colors || []).map(normalizeColorTokens);
}

// A uniform-colour product (e.g. "Venge tumšs" with nothing after it, same
// shade both sides) only has one `colors` entry while a two-tone row still
// has two segments ("Венге темний/Венге темне") - padding the shorter side
// by repeating its last segment lets that single colour stand for both
// sides instead of only ever being checked against side 0, which used to
// tie it with an unrelated two-tone product that also happened to share
// side 0's colour.
function segmentOverlapScore(rowSegments, productSegments) {
  let score = 0;
  const len = Math.max(rowSegments.length, productSegments.length);
  for (let i = 0; i < len; i++) {
    const rowSeg = rowSegments[i] || rowSegments[rowSegments.length - 1] || new Set();
    const productSeg = productSegments[i] || productSegments[productSegments.length - 1] || new Set();
    for (const t of rowSeg) if (productSeg.has(t)) score++;
  }
  return score;
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

// Same idea as buildModelIndex, but for the single-number collections
// (Citadel, Tandem, Olimp...). Skips anything already claimed by the pair
// index so a genuine "modelis 580/543" is never also filed under "580".
function buildSingleModelIndex() {
  const index = new Map();
  for (const p of products) {
    if (MODEL_RE.test(p.name)) continue;
    const match = p.name.match(SINGLE_MODEL_CATALOG_RE);
    if (!match) continue;
    const model = match[1];
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
  const rowSegments = rowColorSegments(row);
  if (!rowSegments.some((s) => s.size)) return null;

  let best = null;
  let bestScore = 0;
  let tied = false;
  for (const product of candidates) {
    const score = segmentOverlapScore(rowSegments, productColorSegments(product));
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
  const singleModelIndex = buildSingleModelIndex();
  const byProduct = new Map();

  for (const row of rows) {
    const index = row.modelType === "pair" ? modelIndex : singleModelIndex;
    let candidates = index.get(row.model);
    if (!candidates?.length) continue;

    // "Термо Хаус Електро" and plain "Термо Хаус" share model numbers and
    // sometimes the exact same colourway too, in which case colour and
    // width alone tie - the row already says which one it is, right in
    // its name, so use that before anything else.
    const isElektroRow = /електро/i.test(row.name);
    const elektroSplit = candidates.filter((p) => /elektro/i.test(p.name) === isElektroRow);
    if (elektroSplit.length) candidates = elektroSplit;

    // Narrow to the candidates that actually offer this row's width first -
    // a colourway that only comes in 950mm can't be the 1200mm row even
    // when two candidates share every colour word (e.g. the 950mm and
    // 1200mm cuts of the same Termo House colourway are separate catalogue
    // products with identical `colors`, so width is the only thing that
    // tells them apart).
    const sized = candidates
      .map((p) => ({ product: p, size: (p.sizes || []).find((s) => s.startsWith(`${row.width}×`)) }))
      .filter((c) => c.size);
    if (!sized.length) continue;
    const product = sized.length === 1 ? sized[0].product : resolveCandidate(row, sized.map((c) => c.product));
    if (!product) continue;
    const size = sized.find((c) => c.product === product).size;

    const variants = byProduct.get(product.id) || new Map();
    const key = `${size}|${row.side}`;
    variants.set(key, (variants.get(key) || 0) + row.qty);
    byProduct.set(product.id, variants);
  }

  return byProduct;
}
