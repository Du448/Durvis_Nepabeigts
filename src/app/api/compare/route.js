import { NextResponse } from "next/server";
import { getProduct } from "@/lib/pricedCatalog";
import { toCard, specRows } from "@/lib/catalog";
import { locales, defaultLocale, t } from "@/lib/i18n";

/* Full comparison rows by id, for the compare page: unlike /api/products
   (card data only), this also carries each product's translated
   specification table, so the browser never needs the catalogue dictionary
   to build the table. */

const MAX_IDS = 8;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = locales.includes(searchParams.get("locale")) ? searchParams.get("locale") : defaultLocale;
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS);

  const found = (await Promise.all(ids.map((id) => getProduct(id)))).filter(Boolean);
  const products = found.map((p) => ({
    ...toCard(p, locale),
    categoryLabel: t(locale, `categories.${p.category}`),
    specRows: specRows(p, locale),
  }));

  return NextResponse.json(
    { products },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
