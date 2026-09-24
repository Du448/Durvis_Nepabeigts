import { unstable_cache } from "next/cache";
import { get, put } from "@vercel/blob";

/* Prices the shop edits itself in /admin. The catalogue in @/data stays the
   source of truth for everything else; this file only holds the fields the
   admin panel can change, for the products whose values differ from it:

     { updatedAt, products: { "<id>": { price?, oldPrice?, inStock? } } }

   It lives in Vercel Blob, so it travels with the Vercel project. Pages read
   it through a tagged cache: saving in the panel calls updateTag(PRICES_TAG),
   which expires every statically generated page that rendered a price. */

export const PRICES_TAG = "prices";
const PRICES_PATH = "admin/price-overrides.json";

// Must match how the Blob store was created (private is the default).
const ACCESS = process.env.BLOB_ACCESS === "public" ? "public" : "private";

// A static token is one way to authenticate; a store connected via Vercel's
// newer OIDC flow instead exposes BLOB_STORE_ID and gets its OIDC token from
// the platform at request time, so either one means the store is usable.
export const blobConfigured = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const isBuild = () => process.env.NEXT_PHASE === "phase-production-build";

function sanitize(entry) {
  if (!entry || typeof entry !== "object") return null;
  const out = {};
  if (Number.isFinite(entry.price)) out.price = entry.price;
  if (entry.oldPrice === null || Number.isFinite(entry.oldPrice)) out.oldPrice = entry.oldPrice;
  if (typeof entry.inStock === "boolean") out.inStock = entry.inStock;
  return Object.keys(out).length ? out : null;
}

async function readOverrides() {
  if (!blobConfigured()) return {};
  try {
    // useCache: false reads straight from storage, so a save is visible at once.
    const res = await get(PRICES_PATH, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return {};
    const data = JSON.parse(await new Response(res.stream).text());
    const out = {};
    for (const [id, entry] of Object.entries(data?.products || {})) {
      const clean = sanitize(entry);
      if (clean) out[id] = clean;
    }
    return out;
  } catch (err) {
    console.error("price overrides: read failed", err);
    // A build should not fail because storage hiccuped; at runtime, throwing
    // keeps the last good page (ISR) instead of caching catalogue prices.
    if (isBuild()) return {};
    throw err;
  }
}

/* For pages: cached until the panel saves. */
export const getPriceOverrides = unstable_cache(readOverrides, ["price-overrides-v1"], {
  tags: [PRICES_TAG],
});

/* For the admin panel: always the current file. */
export const readOverridesFresh = readOverrides;

export async function writeOverrides(products) {
  const body = JSON.stringify({ updatedAt: new Date().toISOString(), products }, null, 1);
  await put(PRICES_PATH, body, {
    access: ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
