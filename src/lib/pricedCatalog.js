import { products } from "@/data/products";
import { getPriceOverrides } from "@/lib/priceOverrides";
import { getFactoryStock } from "@/lib/factoryStock";

/* The catalogue with the admin panel's price changes and the manufacturer's
   live factory stock applied. Server pages that show a price or stock count
   read products through these helpers instead of importing @/data/products
   directly. */

// Made-to-order exterior metal doors are hinged left or right; the factory
// builds either, so every product in these categories gets both options
// unless its own data already specifies a narrower `directions` list.
const DIRECTION_CATEGORIES = ["ardurvis-dzivoklim", "ardurvis-privatmajai"];

export function withDirections(product) {
  if (product.directions || !DIRECTION_CATEGORIES.includes(product.category)) return product;
  return { ...product, directions: ["left", "right"] };
}

export function applyOverride(product, override) {
  const withDefaults = withDirections(product);
  if (!override) return withDefaults;
  const next = { ...withDefaults };
  if (Number.isFinite(override.price)) next.price = override.price;
  if ("oldPrice" in override) next.oldPrice = override.oldPrice;
  // A sale price that is not above the current price would show as a "discount" upwards.
  if (next.oldPrice != null && !(next.oldPrice > next.price)) next.oldPrice = null;
  if (typeof override.inStock === "boolean") next.inStock = override.inStock;
  if (override.stock) next.stockByVariant = override.stock;
  return next;
}

// Adds the manufacturer's own warehouse quantities on top of whatever
// stockByVariant the LV warehouse override already set - the two sources
// never cover the same product (factory-sourced products aren't stocked
// locally), but summing rather than replacing is safe either way.
function withFactoryStock(product, factoryVariants) {
  if (!factoryVariants || !factoryVariants.size) return product;
  const merged = { ...(product.stockByVariant || {}) };
  let anyQty = false;
  for (const [key, qty] of factoryVariants) {
    merged[key] = (merged[key] || 0) + qty;
    if (qty > 0) anyQty = true;
  }
  return { ...product, stockByVariant: merged, inStock: product.inStock || anyQty };
}

export async function getProducts() {
  const [overrides, factoryStock] = await Promise.all([getPriceOverrides(), getFactoryStock()]);
  return products.map((p) => withFactoryStock(applyOverride(p, overrides[p.id]), factoryStock.get(p.id)));
}

export async function getProduct(id) {
  const base = products.find((p) => p.id === id);
  if (!base) return undefined;
  const [overrides, factoryStock] = await Promise.all([getPriceOverrides(), getFactoryStock()]);
  return withFactoryStock(applyOverride(base, overrides[id]), factoryStock.get(id));
}

export async function getProductsInCategory(slug) {
  return (await getProducts()).filter((p) => p.category === slug);
}
