import { products } from "@/data/products";
import { getPriceOverrides } from "@/lib/priceOverrides";

/* The catalogue with the admin panel's price changes applied. Server pages
   that show a price read products through these helpers instead of importing
   @/data/products directly. */

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

export async function getProducts() {
  const overrides = await getPriceOverrides();
  if (!Object.keys(overrides).length) return products.map(withDirections);
  return products.map((p) => applyOverride(p, overrides[p.id]));
}

export async function getProduct(id) {
  const base = products.find((p) => p.id === id);
  if (!base) return undefined;
  const overrides = await getPriceOverrides();
  return applyOverride(base, overrides[id]);
}

export async function getProductsInCategory(slug) {
  return (await getProducts()).filter((p) => p.category === slug);
}
