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

// When stock was last applied, per source ("telegram" - the bot's weekly
// file, "manual" - a re-upload in /admin), for the admin header. Kept apart
// from the files above because linking a group in /admin rewrites those too,
// so their updatedAt doesn't say when a stock file last came in.
const LAST_SYNC_PATH = "admin/stock-last-sync.json";

export async function readLastStockSync() {
  if (!blobConfigured()) return {};
  try {
    const res = await get(LAST_SYNC_PATH, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return {};
    const data = JSON.parse(await new Response(res.stream).text());
    return data && typeof data === "object" ? data : {};
  } catch (err) {
    console.error("stock map: read last sync failed", err);
    return {};
  }
}

export async function writeLastStockSync(source, summary) {
  const current = await readLastStockSync();
  const entry = {
    at: new Date().toISOString(),
    rowCount: summary.rowCount,
    inStockCount: summary.inStockCount,
    outOfStockCount: summary.outOfStockCount,
  };
  await put(LAST_SYNC_PATH, JSON.stringify({ ...current, [source]: entry }, null, 1), {
    access: ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

// Two small files feeding the hidden-door set count (see hiddenKits.js):
// the last stock file's parsed rows, so linking a group in /admin can
// recount the sets from the whole file rather than patching one leaf in;
// and the breakdown of that count (leaves, frame parts, sets) for /admin.
const LAST_ROWS_PATH = "admin/stock-last-rows.json";
const HIDDEN_KITS_PATH = "admin/hidden-kits.json";

async function readJson(path, fallback) {
  if (!blobConfigured()) return fallback;
  try {
    const res = await get(path, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return fallback;
    return JSON.parse(await new Response(res.stream).text()) ?? fallback;
  } catch (err) {
    console.error(`stock map: read ${path} failed`, err);
    return fallback;
  }
}

async function writeJson(path, data) {
  await put(path, JSON.stringify({ updatedAt: new Date().toISOString(), ...data }, null, 1), {
    access: ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export async function readLastStockRows() {
  const data = await readJson(LAST_ROWS_PATH, null);
  return Array.isArray(data?.rows) ? data.rows : null;
}

export const writeLastStockRows = (rows) => writeJson(LAST_ROWS_PATH, { rows });

export const readHiddenKits = () => readJson(HIDDEN_KITS_PATH, null);

export const writeHiddenKits = (report) => writeJson(HIDDEN_KITS_PATH, report);
