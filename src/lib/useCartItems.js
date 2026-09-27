"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";
import { readCart } from "@/lib/cart";

/* Shared by the cart page and the order page: reads the cart's lines from
   localStorage, then fetches the products they point at from /api/products -
   the same read-ids-then-fetch-cards pattern as WishlistClient/CompareClient,
   just used from two places instead of one. */
export function useCartItems() {
  const locale = getLocaleFromPathname(usePathname());
  const [lines, setLines] = useState(null);

  useEffect(() => {
    const sync = () => setLines(readCart());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:change", sync);
    };
  }, []);

  const idsKey = lines ? [...new Set(lines.map((l) => l.id))].join(",") : null;
  const [result, setResult] = useState({ key: null, byId: new Map() });

  useEffect(() => {
    if (!idsKey) return;
    const controller = new AbortController();
    fetch(`/api/products?locale=${locale}&ids=${encodeURIComponent(idsKey)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => setResult({ key: idsKey, byId: new Map((data.products || []).map((p) => [p.id, p])) }))
      .catch(() => {});
    return () => controller.abort();
  }, [idsKey, locale]);

  const loaded = idsKey === "" || (idsKey !== null && result.key === idsKey);

  const items = useMemo(() => {
    if (!loaded || !lines) return [];
    return lines
      .map((line) => {
        const product = result.byId.get(line.id);
        return product ? { line, product } : null;
      })
      .filter(Boolean);
  }, [loaded, lines, result]);

  const subtotal = items.reduce((sum, { product, line }) => sum + product.price * line.qty, 0);
  const itemCount = items.reduce((sum, { line }) => sum + line.qty, 0);

  return { loaded, items, subtotal, itemCount };
}
