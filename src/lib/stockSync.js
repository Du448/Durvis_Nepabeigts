import { revalidateTag } from "next/cache";
import { products } from "@/data/products";
import { PRICES_TAG, readOverridesFresh, writeOverrides } from "@/lib/priceOverrides";
import {
  readStockMap,
  writeStockMap,
  readUnmatchedStock,
  writeUnmatchedStock,
  writeLastStockSync,
  readLastStockRows,
  writeLastStockRows,
  writeHiddenKits,
} from "@/lib/stockMap";
import { stockRowGroupKey, stockRowVariant, variantKey } from "@/lib/stockPdf";
import { parseHiddenFrame, parseHiddenLeaf, computeHiddenKits, verticalKey } from "@/lib/hiddenKits";

const byId = new Map(products.map((p) => [p.id, p]));

/* Expire the cached prices/stock now, not stale-while-revalidate ("max"),
   so the next visitor already sees the new stock. updateTag would do the
   same but only works in server actions, and syncStock also runs from the
   Telegram webhook route. */
const IMMEDIATELY = { expire: 0 };

/* Turns this week's parsed rows into product.inStock flags, learning new
   warehouse codes into the map as it goes (see stockMap.js for the two-layer
   code/group scheme). Rows that match neither an existing code nor a known
   group, and aren't marked ignored, come back in `unmatched` - grouped, so
   the admin links a model+colour once rather than every size/side code.

   Hidden doors are the exception to "a linked row's quantity is the
   product's stock": their leaves only count as far as there are frame parts
   to make complete sets (see hiddenKits.js). Frame part rows are recognised
   by name - they belong to no single product, so they're never linked or
   listed as unmatched - and the linked products' leaf rows are turned into
   set counts once the whole file has been read.

   `record: false` re-applies an already-recorded file (after a link in
   /admin) without touching the "last stock update" line. */
export async function syncStock(rows, { source = "manual", record = true } = {}) {
  const { codeMap, groupMap, ignoredGroups } = await readStockMap();
  const ignored = new Set(ignoredGroups);
  const nextCodeMap = { ...codeMap };

  const qtyByProduct = new Map();
  const qtyByVariant = new Map(); // productId -> Map("<size>|<left|right>" -> qty)
  const unmatched = new Map(); // groupKey -> { name, codes: [{code, qty, name}], totalQty }
  const frames = { horizontal: new Map(), vertical: new Map() };
  const leaves = new Map(); // "<productId>|<swing>|<side>|<width>|<height>" -> leaf part

  for (const row of rows) {
    const frame = parseHiddenFrame(row.name);
    if (frame) {
      const [map, key] = frame.part === "horizontal" ? [frames.horizontal, frame.width] : [frames.vertical, verticalKey(frame)];
      map.set(key, (map.get(key) || 0) + row.qty);
      continue;
    }

    const groupKey = stockRowGroupKey(row.name);
    let productId = nextCodeMap[row.code] || groupMap[groupKey];

    if (productId && !byId.has(productId)) productId = null; // stale link (product removed from the catalogue)

    if (productId) {
      nextCodeMap[row.code] = productId;
      const leaf = parseHiddenLeaf(row.name);
      if (leaf) {
        const key = [productId, leaf.swing, leaf.side, leaf.width, leaf.height].join("|");
        const entry = leaves.get(key) || { productId, ...leaf, qty: 0 };
        entry.qty += row.qty;
        leaves.set(key, entry);
        continue;
      }
      qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + row.qty);
      const variant = stockRowVariant(row.name);
      if (variant) {
        const variants = qtyByVariant.get(productId) || new Map();
        const key = variantKey(variant);
        variants.set(key, (variants.get(key) || 0) + row.qty);
        qtyByVariant.set(productId, variants);
      }
      continue;
    }
    if (ignored.has(groupKey)) continue;

    const entry = unmatched.get(groupKey) || { name: row.name, codes: [], totalQty: 0 };
    entry.codes.push({ code: row.code, qty: row.qty, name: row.name });
    entry.totalQty += row.qty;
    unmatched.set(groupKey, entry);
  }

  const kits = computeHiddenKits([...leaves.values()], frames);
  for (const leaf of kits) {
    const size = `${leaf.width}×${leaf.height}`;
    qtyByProduct.set(leaf.productId, (qtyByProduct.get(leaf.productId) || 0) + leaf.kits);
    const variants = qtyByVariant.get(leaf.productId) || new Map();
    variants.set(size, (variants.get(size) || 0) + leaf.kits);
    qtyByVariant.set(leaf.productId, variants);
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
    // Written fresh every run (not merged with the previous week's) so a
    // variant that drops out of the file - sold out, discontinued size -
    // doesn't keep showing last week's count.
    const stock = Object.fromEntries(qtyByVariant.get(productId) || []);
    overrides[productId] = { ...overrides[productId], inStock, stock };
    if (inStock) inStockCount++;
    else outOfStockCount++;
  }

  await writeOverrides(overrides);
  await writeStockMap({ codeMap: nextCodeMap, groupMap, ignoredGroups });
  revalidateTag(PRICES_TAG, IMMEDIATELY);

  try {
    await writeHiddenKits({
      horizontal: Object.fromEntries(frames.horizontal),
      vertical: Object.fromEntries(frames.vertical),
      leaves: kits,
    });
    if (record) await writeLastStockRows(rows.map(({ code, name, qty }) => ({ code, name, qty })));
  } catch (err) {
    // The breakdown only feeds /admin; the stock itself is already saved.
    console.error("stock sync: saving the hidden-door set breakdown failed", err);
  }

  const unmatchedGroups = [...unmatched.entries()]
    .map(([groupKey, entry]) => ({ groupKey, ...entry }))
    .sort((a, b) => b.totalQty - a.totalQty);
  await writeUnmatchedStock(unmatchedGroups);

  const summary = { rowCount: rows.length, inStockCount, outOfStockCount, unmatched: unmatchedGroups };
  if (!record) return summary;
  try {
    await writeLastStockSync(source, summary);
  } catch (err) {
    // Only feeds the "last update" line in /admin - not worth failing the sync over.
    console.error("stock sync: recording the sync time failed", err);
  }
  return summary;
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

  // Re-apply the whole last file with the new link, so a hidden-door leaf
  // is counted as complete sets against that file's frame parts. Only files
  // received before the rows were being kept fall back to patching in place.
  if (!ignore) {
    const lastRows = await readLastStockRows();
    if (lastRows) {
      await syncStock(lastRows, { record: false });
      return { ok: true };
    }
  }

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
      // Merge into whatever stock this product already has - a product can
      // be built from several unmatched groups linked one at a time (e.g. a
      // hidden door's leaf comes in as one group per size), and each link
      // must add its variant rather than replace the product's whole stock.
      const variants = new Map(Object.entries(overrides[productId]?.stock || {}));
      for (const c of codes) {
        const variant = c.name ? stockRowVariant(c.name) : null;
        if (!variant) continue;
        const key = variantKey(variant);
        variants.set(key, (variants.get(key) || 0) + (Number(c.qty) || 0));
      }
      overrides[productId] = {
        ...overrides[productId],
        inStock: Boolean(overrides[productId]?.inStock) || totalQty > 0,
        stock: Object.fromEntries(variants),
      };
      await writeOverrides(overrides);
      revalidateTag(PRICES_TAG, IMMEDIATELY);
    }
  }

  return { ok: true };
}

/* Undoes a previous "Ignorēt": the group can reappear as unmatched (and get
   linked for real) the next time a stock PDF mentions it - it doesn't
   reappear immediately, since the unmatched list only holds this week's
   leftovers, not history. */
export async function unignoreStockGroup(groupKey) {
  const map = await readStockMap();
  if (!map.ignoredGroups.includes(groupKey)) return { ok: true };
  await writeStockMap({ ...map, ignoredGroups: map.ignoredGroups.filter((k) => k !== groupKey) });
  return { ok: true };
}
