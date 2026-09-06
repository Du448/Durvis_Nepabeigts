"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";

/* Paged product carousel for the 50/50 split blocks, as on m-lux.by: two
   models per page, dots underneath, no frames around the group. Switching is
   a cross-fade — the reference site keeps the motion understated. */

const PER_PAGE = 2;

export default function SplitProductSlider({ products = [], className = "" }) {
  const locale = getLocaleFromPathname(usePathname());
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);

  const pages = [];
  for (let i = 0; i < products.length; i += PER_PAGE) {
    pages.push(products.slice(i, i + PER_PAGE));
  }

  const count = pages.length;
  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  /* Clamp during render rather than in an effect — the product list can shrink
     between renders and a stale index would blank the block for a frame. */
  const current = count ? Math.min(index, count - 1) : 0;

  if (!count) return null;

  return (
    <div
      className={`relative ${className}`}
      role="group"
      aria-roledescription="carousel"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 45) goTo(current + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Pages are stacked so the block keeps a stable height while switching */}
      <div className="grid">
        {pages.map((page, p) => (
          <div
            key={"page" + p}
            aria-hidden={p !== current}
            className={`col-start-1 row-start-1 grid grid-cols-2 gap-6 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              p === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {page.map((product) => (
              <ProductCard key={product.id} product={product} bare />
            ))}
          </div>
        ))}
      </div>

      {/* Arrows — revealed when the pointer is anywhere over the section */}
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            aria-label={t(locale, "hero.prevSlide")}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 text-[color:var(--color-muted)] opacity-0 transition-[opacity,color] duration-300 hover:text-[color:var(--color-title)] focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none lg:-left-10 lg:block"
          >
            <ChevronLeft size={30} strokeWidth={1.1} />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            aria-label={t(locale, "hero.nextSlide")}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 text-[color:var(--color-muted)] opacity-0 transition-[opacity,color] duration-300 hover:text-[color:var(--color-title)] focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none lg:-right-10 lg:block"
          >
            <ChevronRight size={30} strokeWidth={1.1} />
          </button>
        </>
      ) : null}

      {count > 1 ? (
        <div className="mt-7 flex items-center justify-center gap-3">
          {pages.map((_, p) => (
            <button
              key={"dot" + p}
              type="button"
              onClick={() => goTo(p)}
              aria-label={t(locale, "hero.goToSlide").replace("{n}", String(p + 1))}
              aria-current={p === current}
              className={`h-[7px] w-[7px] rounded-full transition-colors duration-300 ${
                p === current
                  ? "bg-[color:var(--color-title)]"
                  : "bg-[color:var(--color-line-strong)] hover:bg-[color:var(--color-muted)]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
