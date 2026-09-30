/* Extension boards ("paplatinātāji") for interior doors - extra jamb boards
   that widen the frame to cover a thicker wall. Each tone comes in the board
   widths below, priced per set. A door's tone is the first of its `colors`
   (see src/data/products.js); a cart line stores the tone plus a quantity per
   board width, so it can be priced without the full product record. */

export const EXTENDER_PRICES = {
  "Pelēks ultramats": { 120: 10.5, 220: 13 },
  "Balts ultramats": { 120: 10.5, 170: 12, 220: 13 },
  "Zelta rustik": { 120: 18, 220: 23 },
  "Itāļu rieksts": { 120: 10.5, 220: 13 },
  "Rustic blanc": { 120: 18, 220: 23 },
  "Stoun ozols": { 120: 18, 220: 23 },
};

// [{ width, price }] for a product's tone, or [] when it has no boards.
export function extenderOptions(product) {
  const prices = EXTENDER_PRICES[product?.colors?.[0]];
  return prices ? Object.entries(prices).map(([width, price]) => ({ width, price })) : [];
}

// { tone, items: { [width]: qty } } -> [{ width, qty, price }] with qty > 0.
export function extenderLines(extenders) {
  const prices = EXTENDER_PRICES[extenders?.tone];
  if (!prices) return [];
  return Object.entries(extenders.items || {})
    .filter(([width, qty]) => qty > 0 && prices[width] != null)
    .map(([width, qty]) => ({ width, qty, price: prices[width] }));
}

export function extendersTotal(extenders) {
  return extenderLines(extenders).reduce((sum, l) => sum + l.price * l.qty, 0);
}
