"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { imageProps } from "@/lib/images";

const AUTO_DISMISS_MS = 6000;

/* Confirms an add-to-cart without leaving the page, the way rdveikals.lv's
   mini-cart popup does: product thumbnail, what was added, then "go look at
   the cart" or "keep browsing". Mounted once in Header (present on every
   page) and driven entirely by the "cart:added" event ProductCard/
   ProductClient dispatch, so neither has to know this component exists. */
export default function CartToast() {
  const locale = getLocaleFromPathname(usePathname());
  const [entry, setEntry] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onAdded = (e) => {
      setEntry(e.detail);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setEntry(null), AUTO_DISMISS_MS);
    };
    window.addEventListener("cart:added", onAdded);
    return () => {
      window.removeEventListener("cart:added", onAdded);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!entry) return null;

  const variantBits = [entry.size, entry.direction ? t(locale, entry.direction === "right" ? "product.directionRight" : "product.directionLeft") : null].filter(Boolean);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[410] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      <div
        role="status"
        className="animate-toast-in pointer-events-auto w-full max-w-[380px] border border-line bg-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
      >
        <div className="flex items-start gap-3 p-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[color:var(--color-accent)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-[color:var(--color-title)]">{t(locale, "cart.addedTitle")}</p>
            <div className="mt-2.5 flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[--color-soft]">
                {entry.image ? (
                  <Image src={entry.image} alt="" fill sizes="56px" {...imageProps(entry.image)} className="object-contain mix-blend-multiply p-1" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] text-ink">{entry.name}</p>
                {variantBits.length ? <p className="text-[12px] text-muted">{variantBits.join(" · ")}</p> : null}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label={t(locale, "a11y.close")}
            onClick={() => setEntry(null)}
            className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-2 border-t border-line p-3">
          <button
            type="button"
            onClick={() => setEntry(null)}
            className="min-h-10 flex-1 border border-line px-3 text-[13px] text-ink transition-colors hover:border-[--color-muted]"
          >
            {t(locale, "cart.continueShopping")}
          </button>
          <Link
            href={withLocaleHref(locale, paths.cart)}
            onClick={() => setEntry(null)}
            className="btn btn-accent min-h-10 flex-1 justify-center px-3 text-[13px]"
          >
            {t(locale, "cart.viewCart")}
          </Link>
        </div>
      </div>
    </div>
  );
}
