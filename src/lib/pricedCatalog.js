import { products } from "@/data/products";
import { getPriceOverrides } from "@/lib/priceOverrides";

/* The catalogue with the admin panel's price changes applied. Server pages
   that show a price read products through these helpers instead of importing
   @/data/products directly. */

export function applyOverride(product, override) {
  if (!override) return product;
  const next = { ...product };
  if (Number.isFinite(override.price)) next.price = override.price;
  if ("oldPrice" in override) next.oldPrice = override.oldPrice;
  // A sale price that is not above the current price would show as a "discount" upwards.
  if (next.oldPrice != null && !(next.oldPrice > next.price)) next.oldPrice = null;
  if (typeof override.inStock === "boolean") next.inStock = override.inStock;
  return next;
}

export async function getProducts() {
  const overrides = await getPriceOverrides();
  if (!Object.keys(overrides).length) return products;
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
