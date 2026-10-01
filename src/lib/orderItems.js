/* An order's items, rebuilt on the server from the visitor's raw cart lines
   (product id, quantity and the choices made on the product page - see
   @/lib/cart). Names, prices, images and links all come from the catalogue
   and are computed exactly as the cart page computes them, so a hand-made
   request to /api/order cannot put its own prices or content into the
   shop's or the customer's email. Unknown product ids are dropped. */

import { getProduct } from "@/lib/pricedCatalog";
import { toCard } from "@/lib/catalog";
import { formatPrice, linePrice } from "@/lib/product-utils";
import { configRows } from "@/lib/config-rows";
import { serviceLabels } from "@/lib/order-options";
import { t, withLocaleHref } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

const MAX_ITEMS = 20;

function clip(value, max = 300) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

const CONFIG_SIZE = /^\d{3,4}×\d{3,4}$/;

// A configurator choice object (Boston / hidden / extension boards) - the
// pricing helpers normalise its fields themselves, so only its shape is checked.
const plainObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : null);

function readLine(raw) {
  const extenders = plainObject(raw?.extenders);
  return {
    id: clip(raw?.id, 120),
    qty: Math.max(1, Math.min(99, Math.trunc(Number(raw?.qty)) || 1)),
    size: clip(raw?.size, 30),
    direction: raw?.direction === "left" || raw?.direction === "right" ? raw.direction : "",
    jambColor: clip(raw?.jambColor, 60),
    services: (Array.isArray(raw?.services) ? raw.services : []).slice(0, 10).map((code) => clip(code, 40)),
    boston: plainObject(raw?.boston),
    hidden: plainObject(raw?.hidden),
    extenders: extenders && {
      tone: clip(extenders.tone, 40),
      items: Object.fromEntries(
        Object.entries(plainObject(extenders.items) || {})
          .slice(0, 6)
          .map(([width, qty]) => [width, Math.max(0, Math.min(99, Math.trunc(Number(qty)) || 0))])
      ),
    },
  };
}

export async function buildOrderItems(rawLines, locale) {
  if (!Array.isArray(rawLines)) return [];
  const lines = rawLines.slice(0, MAX_ITEMS).map(readLine);
  const products = await Promise.all(lines.map((line) => getProduct(line.id)));
  return lines.flatMap((line, i) => {
    if (!products[i]) return [];
    const product = toCard(products[i], locale);
    const configured = !!(line.boston || line.hidden);
    const total = linePrice(product, line) * line.qty;
    return [
      {
        name: clip(product.name),
        size: (product.sizes || []).includes(line.size) || (configured && CONFIG_SIZE.test(line.size)) ? line.size : "",
        direction: line.direction ? t(locale, line.direction === "right" ? "product.directionRight" : "product.directionLeft") : "",
        qty: line.qty,
        total,
        price: formatPrice(product, total),
        services: serviceLabels(line.services, t, locale).join(", "),
        jambColor: line.jambColor,
        config: configRows(product, line, locale).map(([label, value]) => clip(`${label}: ${value}`, 400)),
        url: `${SITE_URL}${withLocaleHref(locale, paths.product(product.id))}`,
        image: product.image ? (product.image.startsWith("/") ? `${SITE_URL}${product.image}` : product.image) : "",
      },
    ];
  });
}
