import { get, put } from "@vercel/blob";
import { blobConfigured } from "@/lib/priceOverrides";

/* Teaches the weekly stock PDF's warehouse codes to the site's own product
   ids - a one-time link per model+colour, made once in /admin and reused by
   every later upload. Two layers, most specific first:

     codeMap:  "<warehouse code>"           -> "<product id>"
     groupMap: "<model+colour, size/side stripped>" -> "<product id>"

   A code the warehouse hasn't been seen under yet still matches through its
   group (a new size of an already-linked colour), and gets its own codeMap
   entry the moment it does, so matching only gets faster over time.
   ignoredGroups holds groups explicitly marked "not a site product"
   (hardware, aplodes, house numbers, ...) so they stop reappearing as
   unmatched every week. */

const STOCK_MAP_PATH = "admin/stock-map.json";
const ACCESS = process.env.BLOB_ACCESS === "public" ? "public" : "private";

const EMPTY = { codeMap: {}, groupMap: {}, ignoredGroups: [] };

export async function readStockMap() {
  if (!blobConfigured()) return { ...EMPTY };
  try {
    const res = await get(STOCK_MAP_PATH, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return { ...EMPTY };
    const data = JSON.parse(await new Response(res.stream).text());
    return {
      codeMap: data?.codeMap && typeof data.codeMap === "object" ? data.codeMap : {},
      groupMap: data?.groupMap && typeof data.groupMap === "object" ? data.groupMap : {},
      ignoredGroups: Array.isArray(data?.ignoredGroups) ? data.ignoredGroups : [],
    };
  } catch (err) {
    console.error("stock map: read failed", err);
    return { ...EMPTY };
  }
}

export async function writeStockMap({ codeMap, groupMap, ignoredGroups }) {
  const body = JSON.stringify({ updatedAt: new Date().toISOString(), codeMap, groupMap, ignoredGroups }, null, 1);
  await put(STOCK_MAP_PATH, body, {
    access: ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

// The leftovers of the most recent upload - not a history, just "what needs
// linking right now" - so the admin panel has something to show even when
// opened well after the Telegram bot processed the file.
const UNMATCHED_PATH = "admin/stock-unmatched.json";

export async function readUnmatchedStock() {
  if (!blobConfigured()) return { updatedAt: null, groups: [] };
  try {
    const res = await get(UNMATCHED_PATH, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return { updatedAt: null, groups: [] };
    const data = JSON.parse(await new Response(res.stream).text());
    return { updatedAt: data?.updatedAt || null, groups: Array.isArray(data?.groups) ? data.groups : [] };
  } catch (err) {
    console.error("stock map: read unmatched failed", err);
    return { updatedAt: null, groups: [] };
  }
}

export async function writeUnmatchedStock(groups) {
  const body = JSON.stringify({ updatedAt: new Date().toISOString(), groups }, null, 1);
  await put(UNMATCHED_PATH, body, {
    access: ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
