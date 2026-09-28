/* Presentation helpers for a single product. Kept apart from @/data/products
   so client components can use them without pulling the whole catalogue into
   the browser bundle. */

import { bostonHardwareOptions } from "@/data/boston-hardware";
import { bostonColorPalette } from "@/data/boston-colors";
import { bostonWidthBrackets, bostonHeightBrackets } from "@/data/boston-size-brackets";

export function isBostonOrder(product) {
  return product?.collection === "BOSTON" && product?.stockSource === "order";
}

/* Every made-to-order Boston model can additionally be painted in a premium
   palette colour (+10%) and/or ordered in a non-standard single-leaf size
   (see @/data/boston-size-brackets) - both flat percentage surcharges the
   manufacturer's price sheet adds on top of whatever price the door already
   has (base or hardware-type price), summed and applied once, the same way
   the sheet's own worked examples combine a height + width surcharge. */
export function bostonSurchargePct(product, line) {
  if (!isBostonOrder(product)) return 0;
  const color = bostonColorPalette.find((c) => c.ral === line?.colorTone);
  let pct = color?.premium ? 10 : 0;
  if (line?.customSize) {
    const width = bostonWidthBrackets.find((b) => b.key === line.widthBracket);
    const height = bostonHeightBrackets.find((b) => b.key === line.heightBracket);
    pct += (width?.pct || 0) + (height?.pct || 0);
  }
  return pct;
}

/* A cart/order line's actual unit price: for made-to-order Boston models with
   a hardware-type choice (see @/data/boston-hardware), that choice's own
   price - which is the model's whole retail price with that hardware, not a
   surcharge - otherwise just the product's catalogue price; then the Boston
   colour/size surcharge (if any) on top. Cart lines only ever store the
   choice keys the shopper picked, not their resulting price, so every place
   that shows a line total re-derives it through here rather than trusting a
   stale number written at add-to-cart time. */
export function linePrice(product, line) {
  const options = bostonHardwareOptions[product?.id];
  const selected = options?.find((opt) => opt.key === line?.hardwareType);
  const base = selected ? selected.price : product?.price;
  const pct = bostonSurchargePct(product, line);
  return pct ? Math.round(base * (1 + pct / 100)) : base;
}

/* Categories whose models are kept in stock. Per-product overrides are
   possible via an explicit `inStock` field on the product. */
export const IN_STOCK_CATEGORIES = ["ardurvis-dzivoklim", "ardurvis-privatmajai", "ieksdurvis"];

/* Models imported from the manufacturer's own catalogue carry their warehouse
   stock, which the shop labels differently from its local stock. A third
   source, "order", is for models that are never kept on a shelf - they are
   only ever made to order - and gets its own badge/label rather than being
   folded into "in stock". */
export function stockKind(product) {
  if (product?.stockSource === "order") return "order";
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
