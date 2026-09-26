/* Parses the weekly "Atlikumi" (stock) PDF from the local warehouse into
   plain rows. Each row of the source table is one line at a shared y
   position: a 5-digit warehouse code, a model/colour/size description, a
   unit ("gb."), and a quantity - see stockSync.js for how these rows turn
   into per-product in-stock flags. unpdf wraps pdf.js without its worker
   file, which plain pdfjs-dist cannot resolve once Vercel's serverless
   bundler traces and packages the function. */

import { extractTextItems } from "unpdf";

const CODE_RE = /^\d{4,6}$/;
const QTY_RE = /^[\d.,]+$/;

export async function parseStockPdf(bytes) {
  const { items: pages } = await extractTextItems(bytes);
  const rows = [];

  for (const items of pages) {
    // Group text items by their (rounded) baseline y - one group is one
    // table row, regardless of how pdf.js chose to split the run into items.
    const lines = new Map();
    for (const item of items) {
      const str = item.str;
      if (!str || !str.trim()) continue;
      const y = Math.round(item.y);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y).push({ x: item.x, str: str.trim() });
    }

    for (const [, parts] of lines) {
      parts.sort((a, b) => a.x - b.x);
      if (!parts.length) continue;
      const [first, ...rest] = parts;
      if (!CODE_RE.test(first.str)) continue; // not a product row (section header, totals, ...)

      const last = rest[rest.length - 1];
      if (!last || !QTY_RE.test(last.str)) continue; // no quantity on this line

      const qty = Number(last.str.replace(/\./g, "").replace(",", "."));
      if (!Number.isFinite(qty)) continue;

      const name = rest
        .slice(0, -1)
        .map((p) => p.str)
        .filter((s) => s !== "gb." && s !== "vnt.")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (!name) continue;

      rows.push({ code: first.str, name, qty });
    }
  }

  return rows;
}

// The warehouse tracks size and opening side as separate SKUs
// ("... 850x2050, Kreisās" / "... 850x2050, Labās"); the site shows one
// product per model+colour. Stripping the trailing "(...)" group's size/side
// groups several codes under the same visual name, so the admin only has to
// map each model+colour combination once.
export function stockRowGroupKey(name) {
  return name
    .replace(/,\s*\d{2,4}x\d{2,4}(mm)?\s*,?/gi, "")
    .replace(/,\s*(Kreisās|Labās|Kreiss|Labs)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const VARIANT_SIZE_RE = /(\d{2,4})\s*[x×]\s*(\d{2,4})(?:\s*mm)?/i;
const VARIANT_SIDE_RE = /\b(Kreisās|Kreiss|Labās|Labs)\b/i;
// Interior doors (RV-06, RV-10, ML-01, Stockholm, ...) have no opening side
// in the warehouse's own naming - just a leaf width in cm as the last thing
// before the closing bracket, e.g. "RV 06 (Balts ultramat, stikls melns, 80)".
const VARIANT_WIDTH_RE = /,\s*(\d{2})\)\s*$/;
// Hidden-door leaves: "... (2000x800x38mm, Balta grunts, OUT univers.)" or
// "... (2010x700x50mm, Balta grunts, INS Labā)" - height x width x leaf
// thickness, then finish, then a swing/side note. The frame's horizontal
// and vertical aluminium pieces (separate warehouse rows) aren't leaves and
// aren't matched here - see stockPdf's module comment in stockSync.js for
// why only the leaf count is shown.
const VARIANT_LEAF_RE = /\(\d{4}x(\d{2,4})x\d{2}mm,\s*Balta grunts,\s*(?:OUT univers\.|INS Kreisā|INS Labā)\)\s*$/i;

// Pulls the size and opening side out of one warehouse row's description,
// for the per-variant stock counts shown on the product page.
//  - Exterior doors: full WxH ("850×2050", normalised to the × the
//    catalogue uses) plus a side; returns null if either is missing rather
//    than guessing the side.
//  - Interior doors and hidden-door leaves: just a width, converted to the
//    catalogue's own `sizes` string; `side` is null (interior doors have no
//    side, and hidden-door leaves aren't sold by side on the site even
//    though the warehouse tracks Kreisā/Labā separately - both count
//    toward the same size).
export function stockRowVariant(name) {
  const sizeMatch = name.match(VARIANT_SIZE_RE);
  const sideMatch = name.match(VARIANT_SIDE_RE);
  if (sizeMatch && sideMatch) {
    return { size: `${sizeMatch[1]}×${sizeMatch[2]}`, side: /^k/i.test(sideMatch[1]) ? "left" : "right" };
  }
  const leafMatch = name.match(VARIANT_LEAF_RE);
  if (leafMatch) return { size: leafMatch[1], side: null };
  const widthMatch = name.match(VARIANT_WIDTH_RE);
  if (widthMatch) return { size: String(Number(widthMatch[1]) * 10), side: null };
  return null;
}

// The override.stock key for a variant: "size|side" when the door has a
// side, or just "size" when it doesn't (interior doors).
export const variantKey = (variant) => (variant.side ? `${variant.size}|${variant.side}` : variant.size);
