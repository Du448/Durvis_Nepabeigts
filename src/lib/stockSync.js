import { revalidateTag } from "next/cache";
import { products } from "@/data/products";
import { PRICES_TAG, readOverridesFresh, writeOverrides } from "@/lib/priceOverrides";
import { readStockMap, writeStockMap, readUnmatchedStock, writeUnmatchedStock } from "@/lib/stockMap";
import { stockRowGroupKey } from "@/lib/stockPdf";

const byId = new Map(products.map((p) => [p.id, p]));

/* Turns this week's parsed rows into product.inStock flags, learning new
   warehouse codes into the map as it goes (see stockMap.js for the two-layer
   code/group scheme). Rows that match neither an existing code nor a known
   group, and aren't marked ignored, come back in `unmatched` - grouped, so
   the admin links a model+colour once rather than every size/side code. */
export async function syncStock(rows) {
  const { codeMap, groupMap, ignoredGroups } = await readStockMap();
  const ignored = new Set(ignoredGroups);
  const nextCodeMap = { ...codeMap };

  const qtyByProduct = new Map();
  const unmatched = new Map(); // groupKey -> { name, codes: [{code, qty}], totalQty }

  for (const row of rows) {
    const groupKey = stockRowGroupKey(row.name);
    let productId = nextCodeMap[row.code] || groupMap[groupKey];

    if (productId && !byId.has(productId)) productId = null; // stale link (product removed from the catalogue)

    if (productId) {
      nextCodeMap[row.code] = productId;
      qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + row.qty);
      continue;
    }
    if (ignored.has(groupKey)) continue;

    const entry = unmatched.get(groupKey) || { name: row.name, codes: [], totalQty: 0 };
    entry.codes.push({ code: row.code, qty: row.qty });
    entry.totalQty += row.qty;
    unmatched.set(groupKey, entry);
  }

  // Every already-linked product gets an explicit flag this run, including a
  // 0 (out of stock) for one whose codes are simply absent from this file -
  // otherwise a sold-out model would keep showing as available forever.
  const linkedProductIds = new Set([...Object.values(nextCodeMap), ...Object.values(groupMap)]);

  let overrides;
  try {
    overrides = await readOverridesFresh();
  } catch (err) {
    console.error("stock sync: reading price overrides failed", err);
    throw err;
  }

  let inStockCount = 0;
  let outOfStockCount = 0;
  for (const productId of linkedProductIds) {
    if (!byId.has(productId)) continue;
    const inStock = (qtyByProduct.get(productId) || 0) > 0;
    overrides[productId] = { ...overrides[productId], inStock };
    if (inStock) inStockCount++;
    else outOfStockCount++;
  }

  await writeOverrides(overrides);
  await writeStockMap({ codeMap: nextCodeMap, groupMap, ignoredGroups });
  revalidateTag(PRICES_TAG);

  const unmatchedGroups = [...unmatched.entries()]
    .map(([groupKey, entry]) => ({ groupKey, ...entry }))
    .sort((a, b) => b.totalQty - a.totalQty);
  await writeUnmatchedStock(unmatchedGroups);

  return {
    rowCount: rows.length,
    inStockCount,
    outOfStockCount,
    unmatched: unmatchedGroups,
  };
}

/* Called from the admin panel: links one group of warehouse codes (a
   model+colour, every size/side included) to a catalogue product, or marks
   it as not a site product at all. Applied immediately - doesn't wait for
   next week's file. */
export async function linkStockGroup({ groupKey, codes, productId, ignore }) {
  const map = await readStockMap();
  const nextGroupMap = { ...map.groupMap };
  const nextCodeMap = { ...map.codeMap };
  const nextIgnored = new Set(map.ignoredGroups);

  if (ignore) {
    nextIgnored.add(groupKey);
    delete nextGroupMap[groupKey];
  } else {
    if (!byId.has(productId)) return { ok: false, error: "unknown" };
    nextGroupMap[groupKey] = productId;
    nextIgnored.delete(groupKey);
    for (const code of codes || []) nextCodeMap[code] = productId;
  }

  await writeStockMap({ codeMap: nextCodeMap, groupMap: nextGroupMap, ignoredGroups: [...nextIgnored] });

  const { groups } = await readUnmatchedStock();
  await writeUnmatchedStock(groups.filter((g) => g.groupKey !== groupKey));

  if (!ignore && codes?.length) {
    const totalQty = codes.reduce((sum, c) => sum + (Number(c.qty) || 0), 0);
    let overrides;
    try {
      overrides = await readOverridesFresh();
    } catch {
      overrides = null;
    }
    if (overrides) {
      overrides[productId] = { ...overrides[productId], inStock: totalQty > 0 };
      await writeOverrides(overrides);
      revalidateTag(PRICES_TAG);
    }
  }

  return { ok: true };
}
