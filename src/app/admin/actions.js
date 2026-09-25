"use server";

import { updateTag } from "next/cache";
import { products } from "@/data/products";
import { isInStock } from "@/lib/product-utils";
import { PRICES_TAG, readOverridesFresh, writeOverrides, blobConfigured } from "@/lib/priceOverrides";
import { linkStockGroup } from "@/lib/stockSync";
import {
  isAdmin,
  passwordMatches,
  startSession,
  endSession,
  loginBlocked,
  recordFailure,
} from "@/lib/adminAuth";

const MAX_PRICE = 100000;
const byId = new Map(products.map((p) => [p.id, p]));

export async function loginAction(_prev, formData) {
  if (await loginBlocked()) return { error: "blocked" };
  const password = String(formData.get("password") || "");
  if (!passwordMatches(password)) {
    await recordFailure();
    return { error: "wrong" };
  }
  await startSession();
  return { ok: true };
}

export async function logoutAction() {
  await endSession();
  return { ok: true };
}

const money = (v) => Number.isFinite(v) && v > 0 && v <= MAX_PRICE && Math.round(v * 100) === v * 100;

/* One change from the panel: the values the row should end up with, or a
   reset back to the catalogue. Only the fields that differ from the
   catalogue are stored, so an edit back to the original value removes it. */
function toEntry(base, change) {
  const price = Number(change.price);
  const oldPrice = change.oldPrice === null || change.oldPrice === "" ? null : Number(change.oldPrice);
  const inStock = Boolean(change.inStock);

  if (!money(price)) return { error: "price" };
  if (oldPrice !== null && (!money(oldPrice) || oldPrice <= price)) return { error: "oldPrice" };

  const entry = {};
  if (price !== base.price) entry.price = price;
  if (oldPrice !== (base.oldPrice ?? null)) entry.oldPrice = oldPrice;
  if (inStock !== isInStock(base)) entry.inStock = inStock;
  return { entry: Object.keys(entry).length ? entry : null };
}

export async function saveAction(changes) {
  if (!(await isAdmin())) return { ok: false, error: "auth" };
  if (!blobConfigured()) return { ok: false, error: "storage" };
  if (!Array.isArray(changes) || !changes.length || changes.length > 500) return { ok: false, error: "input" };

  let overrides;
  try {
    overrides = await readOverridesFresh();
  } catch {
    return { ok: false, error: "read" };
  }

  const invalid = [];
  for (const change of changes) {
    const base = byId.get(change?.id);
    if (!base) {
      invalid.push({ id: String(change?.id), error: "unknown" });
      continue;
    }
    if (change.reset) {
      delete overrides[base.id];
      continue;
    }
    const { entry, error } = toEntry(base, change);
    if (error) {
      invalid.push({ id: base.id, error });
      continue;
    }
    if (entry) overrides[base.id] = entry;
    else delete overrides[base.id];
  }
  if (invalid.length) return { ok: false, error: "invalid", invalid };

  try {
    await writeOverrides(overrides);
  } catch (err) {
    console.error("price overrides: write failed", err);
    return { ok: false, error: "write" };
  }

  // Expire every page that rendered a price; the next visit renders fresh.
  updateTag(PRICES_TAG);
  return { ok: true, overrides, savedAt: new Date().toISOString() };
}

export async function linkStockGroupAction({ groupKey, codes, productId, ignore }) {
  if (!(await isAdmin())) return { ok: false, error: "auth" };
  if (!blobConfigured()) return { ok: false, error: "storage" };
  if (!groupKey || (!ignore && !productId)) return { ok: false, error: "input" };
  return linkStockGroup({ groupKey, codes, productId, ignore });
}
