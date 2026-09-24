import { NextResponse } from "next/server";
import { getProductById } from "@/data/products";
import { toCard } from "@/lib/catalog";
import { translateColorLabel } from "@/lib/i18n-data";
import { locales, defaultLocale } from "@/lib/i18n";

/* Product cards by id, for the two places that only learn which models they
   need in the browser: the wishlist (ids in localStorage) and the contact
   form (?produkts= from the product page). Serving them from here keeps the
   catalogue out of the client bundle. */

const MAX_IDS = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = locales.includes(searchParams.get("locale")) ? searchParams.get("locale") : defaultLocale;
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS);

  const cards = ids
    .map((id) => getProductById(id))
    .filter(Boolean)
    .map((p) => ({
      ...toCard(p, locale),
      colorLabels: (p.colors || []).filter(Boolean).map((c) => translateColorLabel(locale, c)),
    }));

  return NextResponse.json(
    { products: cards },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
