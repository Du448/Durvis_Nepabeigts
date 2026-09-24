"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { readWishlistIds } from "@/lib/wishlist";

export default function WishlistClient() {
  const locale = getLocaleFromPathname(usePathname());
  // null until localStorage has been read, so the page doesn't flash "empty".
  const [ids, setIds] = useState(null);

  useEffect(() => {
    const sync = () => setIds(readWishlistIds());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, []);

  // Cards come from /api/products, so the catalogue stays off the client.
  // Tagged with the id list it answers, so a stale response is never shown.
  const [result, setResult] = useState({ key: null, products: [] });
  const idsKey = ids ? ids.join(",") : null;

  useEffect(() => {
    if (!idsKey) return;
    const controller = new AbortController();
    fetch(`/api/products?locale=${locale}&ids=${encodeURIComponent(idsKey)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        // Keep the order the visitor saved them in.
        const byId = new Map((data.products || []).map((p) => [p.id, p]));
        setResult({ key: idsKey, products: idsKey.split(",").map((id) => byId.get(id)).filter(Boolean) });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [idsKey, locale]);

  const loaded = idsKey === "" || (idsKey !== null && result.key === idsKey);
  const products = idsKey && result.key === idsKey ? result.products : [];

  if (!loaded) return <div className="container min-h-[40vh] py-10" />;

  if (!products.length) {
    return (
      <div className="container py-10">
        <div className="border border-line bg-white p-6 text-[15px] text-muted">
          {t(locale, "wishlist.empty")}
          <div className="mt-4">
            <Link
              href={withLocaleHref(locale, "/")}
              className="btn btn-accent"
            >
              {t(locale, "search.backHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h2 className="sr-only">
        {products.length} {t(locale, "category.models")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <div key={p.id} className="min-w-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
