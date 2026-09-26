import { products, getProductById } from "@/data/products";
import { hoverImage, stockKind } from "@/lib/product-utils";
import { trData } from "@/lib/i18n-data";

/* Server-side view models for the browser. A full catalogue entry carries its
   whole gallery, specification table and description paragraphs; a card only
   needs what ProductCard and the category filters read. Names are translated
   here so the client never needs the catalogue dictionary for them. */
export function toCard(product, locale) {
  const images = product.images || [];
  return {
    id: product.id,
    name: trData(locale, product.name),
    collection: product.collection || "",
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    currency: product.currency || "EUR",
    image: images[0] || null,
    hover: hoverImage(product) || null,
    stock: stockKind(product),
    isNew: !!product.isNew,
    thermo: !!product.thermo,
    glass: !!product.glass,
    colors: product.colors || [],
    sizes: product.sizes || [],
    directions: product.directions || [],
  };
}

export const cardsFor = (list, locale) => list.map((p) => toCard(p, locale));

export function cardsByIds(ids, locale) {
  return ids.map((id) => getProductById(id)).filter(Boolean).map((p) => toCard(p, locale));
}

/* Plain substring match on name and collection, in the source language and
   the page's language, so "balta" finds a door listed as "Balts". */
export function searchProducts(query, locale, list = products) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return list.filter((p) => {
    const hay = [p.name, trData(locale, p.name), p.collection || ""].join(" ").toLowerCase();
    return hay.includes(q);
  });
}
