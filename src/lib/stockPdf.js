/* Parses the weekly "Atlikumi" (stock) PDF from the local warehouse into
   plain rows. Each row of the source table is one line at a shared y
   position: a 5-digit warehouse code, a model/colour/size description, a
   unit ("gb."), and a quantity - see stockSync.js for how these rows turn
   into per-product in-stock flags. pdfjs-dist's text-only extraction (no
   canvas) works in a serverless function, unlike the `pdftotext` binary. */

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const CODE_RE = /^\d{4,6}$/;
const QTY_RE = /^[\d.,]+$/;

export async function parseStockPdf(bytes) {
  const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
  const rows = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();

    // Group text items by their (rounded) baseline y - one group is one
    // table row, regardless of how pdf.js chose to split the run into items.
    const lines = new Map();
    for (const item of content.items) {
      const str = item.str;
      if (!str || !str.trim()) continue;
      const y = Math.round(item.transform[5]);
      const x = item.transform[4];
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y).push({ x, str: str.trim() });
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
