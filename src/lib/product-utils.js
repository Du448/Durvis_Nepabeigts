/* Presentation helpers for a single product. Kept apart from @/data/products
   so client components can use them without pulling the whole catalogue into
   the browser bundle. */

/* Categories whose models are kept in stock. Per-product overrides are
   possible via an explicit `inStock` field on the product. */
export const IN_STOCK_CATEGORIES = ["ardurvis-dzivoklim", "ardurvis-privatmajai", "ieksdurvis"];

/* Models imported from the manufacturer's own catalogue carry their warehouse
   stock, which the shop labels differently from its local stock. */
export function stockKind(product) {
  if (!isInStock(product)) return null;
  return product?.stockSource === "factory" ? "factory" : "local";
}

/* Everything is priced in euro today, but the symbol still follows the entry's
   own currency so a re-import of the factory's hryvnia list cannot quietly
   relabel those prices as euro. */
export function formatPrice(product, value) {
  const amount = value == null ? product?.price : value;
  if (amount == null) return "";
  return product?.currency === "UAH" ? `${amount} ₴` : `${amount} €`;
}

export function isInStock(product) {
  if (!product) return false;
  if (typeof product.inStock === "boolean") return product.inStock;
  return IN_STOCK_CATEGORIES.includes(product.category);
}

/* --- Card hover image ---------------------------------------------------
   The first photo of every model is the flat outside/inside pair, so the
   image the card swaps to on hover should show the door standing open. Three
   ways to find it, in order of confidence:

   1. Photos whose file name says so - the shop's own uploads use Latvian
      ("atvērtā pozīcijā") and the manufacturer's older uploads Ukrainian
      ("vidkryte polozhennya").
   2. The manufacturer's numbered sets (0136-01.jpg, 0136-02.jpg, …) carry no
      words, but the shoot order is fixed: photo 4 is always the open door.
      Some sets skip a number, so match on the number, not on the position.
   3. A handful of sets photographed by the shop have neither - those are
      listed by hand below.

   Anything left over falls back to the second photo, whatever it shows. */

const OPEN_IN_NAME = /vidkry|vidkri|otkryt|otvir|atv[eē]r/i;
const FACTORY_OPEN_SHOT = /\D0*4(?:-\d+)?\.(?:jpe?g|png)$/i;

const OPEN_IMAGE_INDEX = {
  "prema-188": 5,
  "stilemax-light": 4,
  "stilemax-700": 1,
  "stilemax-350": 2,
  "stilemax-352": 4,
  "tehno-6": 3,
};

export function hoverImage(product) {
  const images = product?.images || [];
  if (images.length < 2) return images[0];

  const manual = OPEN_IMAGE_INDEX[product.id];
  if (manual != null && images[manual]) return images[manual];

  const files = images.map((url) => {
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  });

  const named = files.findIndex((f) => OPEN_IN_NAME.test(f));
  if (named > 0) return images[named];

  const numbered = files.findIndex((f) => FACTORY_OPEN_SHOT.test(f.split("?")[0]));
  if (numbered > 0) return images[numbered];

  return images[1];
}
