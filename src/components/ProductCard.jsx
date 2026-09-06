"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t, trData } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { isInStock, stockKind, formatPrice, hoverImage } from "@/data/products";

/* Product card modelled on m-lux.by: 1px hairline border, 15px padding,
   square image, centred name and price, action icons revealed on hover. */

export default function ProductCard({ product, bare = false }) {
  const locale = getLocaleFromPathname(usePathname());
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const sync = () => setWishlisted(isWishlisted(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, [product.id]);

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const images = product.images || [];
  const shown = hovered ? hoverImage(product) : images[0];
  const href = withLocaleHref(locale, `/produkts/${product.id}`);

  return (
    <div
      className={`group relative flex h-full flex-col bg-white text-center ${
        bare
          ? ""
          : "border border-[color:var(--color-line)] p-[15px] transition-colors duration-300 hover:border-[color:var(--color-line-strong)]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link href={href} className="relative block aspect-square overflow-hidden bg-white">
        {shown ? (
          <Image
            src={shown}
            alt={trData(locale, product.name)}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[color:var(--color-soft)] text-[color:var(--color-muted)]">
            {t(locale, "product.image")}
          </span>
        )}
      </Link>

      {/* Labels */}
      <div className={`pointer-events-none absolute z-10 flex flex-col items-start gap-1 ${
          bare ? "left-0 top-0" : "left-[15px] top-[15px]"
        }`}>
        {hasOffer ? (
          <span className="bg-[color:var(--color-accent)] px-2 py-1 text-[11px] font-semibold uppercase leading-none text-white">
            {t(locale, "product.offerBadge")}
          </span>
        ) : null}
        {product.isNew ? (
          <span className="bg-[color:var(--color-title)] px-2 py-1 text-[11px] font-semibold uppercase leading-none text-white">
            {t(locale, "product.newBadge")}
          </span>
        ) : null}
        {isInStock(product) ? (
          <span
            className={`px-2 py-1 text-[11px] font-semibold uppercase leading-none ${
              stockKind(product) === "factory"
                ? "bg-[color:var(--color-stock-factory-soft)] text-[color:var(--color-stock-factory)]"
                : "bg-[color:var(--color-stock-soft)] text-[color:var(--color-stock)]"
            }`}
          >
            {t(locale, stockKind(product) === "factory" ? "product.inStockFactory" : "product.inStock")}
          </span>
        ) : null}
      </div>

      {/* Hover action icons, top-right */}
      <div className={`absolute z-10 flex translate-x-2 flex-col gap-[2px] opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 ${
          bare ? "right-0 top-0" : "right-[15px] top-[15px]"
        }`}>
        <Link
          href={href}
          aria-label={t(locale, "product.openImage")}
          className="flex h-9 w-9 items-center justify-center bg-white text-[color:var(--color-title)] shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white"
        >
          <Eye size={17} strokeWidth={1.6} />
        </Link>
        <button
          type="button"
          aria-label={t(locale, "a11y.addWishlist")}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlistId(product.id);
          }}
          className={`flex h-9 w-9 items-center justify-center bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white ${
            wishlisted ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
          }`}
        >
          <Heart size={17} strokeWidth={1.6} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Name */}
      <h3 className="mt-4 text-[14px] font-medium leading-[1.4] text-[color:var(--color-ink)]">
        <Link href={href} className="transition-colors duration-200 hover:text-[color:var(--color-ink)]/75">
          {trData(locale, product.name)}
        </Link>
      </h3>

      {product.collection ? (
        <div className="mt-1 text-[12px] uppercase tracking-wide text-[color:var(--color-muted)]">
          {product.collection}
        </div>
      ) : null}

      {/* Price */}
      <div className="mt-auto pt-3 text-[14px] text-[color:var(--color-accent)]">
        {hasOffer ? (
          <>
            <span className="mr-2 text-[color:var(--color-muted)] line-through">
              {formatPrice(product, product.oldPrice)}
            </span>
            <span>{formatPrice(product)}</span>
          </>
        ) : (
          <span>{formatPrice(product)}</span>
        )}
      </div>
    </div>
  );
}
