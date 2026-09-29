const STORAGE_KEY = "cartLines";

/* Unlike the wishlist/compare id lists, a cart line is a whole configured
   order - product id plus the size, opening direction, jamb-finish colour and
   fulfilment services the visitor picked on the product page - because two
   people can want the same door in different sizes, and each is its own line.
   A `lineId` (not the product id) is the line's identity, so the same product
   can appear twice in different configurations. */

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function makeLineId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Two lines are "the same configuration" when every choice on them matches -
// adding the same door/size/direction/services again just bumps the quantity
// instead of creating a duplicate row.
function sameConfig(a, b) {
  return (
    a.id === b.id &&
    (a.size || "") === (b.size || "") &&
    (a.direction || "") === (b.direction || "") &&
    (a.jambColor || "") === (b.jambColor || "") &&
    JSON.stringify(a.boston || null) === JSON.stringify(b.boston || null) &&
    JSON.stringify(a.hidden || null) === JSON.stringify(b.hidden || null) &&
    [...(a.services || [])].sort().join(",") === [...(b.services || [])].sort().join(",")
  );
}

export function readCart() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((line) => line && typeof line.id === "string" && typeof line.lineId === "string");
}

export function writeCart(lines) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("cart:change"));
}

/* `line` carries everything but `lineId`/`qty` (defaulted here). Returns the
   line it ended up as - either the new one, or the existing line whose
   quantity just grew - so the caller (the "added to cart" toast) can show
   the right quantity. */
export function addToCart(line) {
  const lines = readCart();
  const qty = Math.max(1, line.qty || 1);
  const existing = lines.find((l) => sameConfig(l, line));
  if (existing) {
    const next = lines.map((l) => (l.lineId === existing.lineId ? { ...l, qty: l.qty + qty } : l));
    writeCart(next);
    return next.find((l) => l.lineId === existing.lineId);
  }
  const newLine = { ...line, lineId: makeLineId(), qty };
  writeCart([...lines, newLine]);
  return newLine;
}

export function updateCartQty(lineId, qty) {
  const lines = readCart();
  const next =
    qty > 0
      ? lines.map((l) => (l.lineId === lineId ? { ...l, qty } : l))
      : lines.filter((l) => l.lineId !== lineId);
  writeCart(next);
  return next;
}

export function removeCartLine(lineId) {
  const next = readCart().filter((l) => l.lineId !== lineId);
  writeCart(next);
  return next;
}

export function clearCart() {
  writeCart([]);
}

export function cartCount() {
  return readCart().reduce((sum, l) => sum + (l.qty || 0), 0);
}
