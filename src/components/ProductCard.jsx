"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Scale, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { isCompared, toggleCompareId } from "@/lib/compare";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/product-utils";
import { paths } from "@/lib/routes";
import { imageProps } from "@/lib/images";

/* Product card modelled on m-lux.by: 1px hairline border, 15px padding,
   square image, centred name and price, action icons revealed on hover.
   Takes a card view model from @/lib/catalog (name already translated, hover
   photo and stock label worked out on the server). */

export default function ProductCard({ product, bare = false }) {
  const locale = getLocaleFromPathname(usePathname());
  const [wishlisted, setWishlisted] = useState(false);
  const [compared, setCompared] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Same "added" bounce as the product page - see .animate-pulsate in
  // globals.css, lifted from 220.lv's own comparison sticker.
  const [wishlistPulse, setWishlistPulse] = useState(0);
  const [comparePulse, setComparePulse] = useState(0);

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

  useEffect(() => {
    const sync = () => setCompared(isCompared(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("compare:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("compare:change", sync);
    };
  }, [product.id]);

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  /* One badge per card, the most useful one: a deal beats "new", which beats
     the stock label. Stacked badges covered the photo and read as noise. */
  const badge = hasOffer
    ? { text: t(locale, "product.offerBadge"), className: "bg-[color:var(--color-accent)] text-white" }
    : product.isNew
      ? { text: t(locale, "product.newBadge"), className: "bg-[color:var(--color-title)] text-white" }
      : product.stock === "factory"
        ? {
            text: t(locale, "product.inStockFactory"),
            className: "bg-[color:var(--color-stock-factory-soft)] text-[color:var(--color-stock-factory)]",
          }
        : product.stock
          ? { text: t(locale, "product.inStock"), className: "bg-[color:var(--color-stock-soft)] text-[color:var(--color-stock)]" }
          : null;
  const shown = hovered && product.hover ? product.hover : product.image;
  const href = withLocaleHref(locale, paths.product(product.id));

  // A card can't offer the full size/direction picker the product page has,
  // so quick-add takes the first option of each - the same default the
  // product page itself starts on. The cart page can still change it.
  const handleQuickAdd = (e) => {
    e.preventDefault();
    const line = addToCart({
      id: product.id,
      size: product.sizes?.[0] || "",
      direction: product.directions?.[0] || "",
      services: [],
      jambColor: null,
    });
    window.dispatchEvent(
      new CustomEvent("cart:added", {
        detail: {
          name: product.name,
          image: product.image || null,
          size: line.size,
          direction: line.direction,
          qty: line.qty,
        },
      })
    );
  };

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
      {/* Image: every photo sits in the same soft box at the same scale. The
          catalogue mixes white-backed shots, grey studio shots and cut-outs;
          multiply blending lets the white ones take the box colour, and the
          fixed inset keeps tall and short doors the same visual size. The
          name link below is the card's one link for keyboard and screen
          reader users, so this duplicate is hidden from them. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-soft)]">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 block">
          {shown ? (
            <Image
              src={shown}
              alt={product.name}
              fill
              {...imageProps(shown)}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
              className="!inset-[6%] !h-[88%] !w-[88%] object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[color:var(--color-soft)] text-[color:var(--color-muted)]">
              {t(locale, "product.image")}
            </span>
          )}
        </Link>

        {/* Quick add to cart: slides up from the image's bottom edge on
            hover, always shown on touch screens - the same reveal pattern
            as the wishlist/compare icons above, just on a different edge so
            the two don't collide. */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 motion-reduce:translate-y-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex min-h-11 w-full items-center justify-center gap-2 bg-[color:var(--color-accent)] text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[color:var(--color-title)]"
          >
            <ShoppingBag size={16} strokeWidth={1.8} />
            {t(locale, "product.addCart")}
          </button>
        </div>
      </div>

      {badge ? (
        <span
          className={`pointer-events-none absolute z-10 px-2 py-1 text-[11px] font-semibold uppercase leading-none ${badge.className} ${
            bare ? "left-0 top-0" : "left-[15px] top-[15px]"
          }`}
        >
          {badge.text}
        </span>
      ) : null}

      {/* Wishlist and compare, top-right: revealed on hover with a mouse,
          always shown on touch screens (no hover there), and 44px each so
          they are easy to tap. */}
      <div className={`absolute z-10 flex translate-x-2 flex-col gap-1.5 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 focus-within:translate-x-0 focus-within:opacity-100 motion-reduce:translate-x-0 [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100 ${
          bare ? "right-0 top-0" : "right-[15px] top-[15px]"
        }`}>
        <button
          type="button"
          aria-label={t(locale, "a11y.addWishlist")}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.preventDefault();
            const next = toggleWishlistId(product.id);
            if (next.includes(product.id)) setWishlistPulse((k) => k + 1);
          }}
          className={`flex h-11 w-11 items-center justify-center bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white ${
            wishlisted ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
          }`}
        >
          <Heart key={wishlistPulse} size={17} strokeWidth={1.6} fill={wishlisted ? "currentColor" : "none"} className={wishlistPulse ? "animate-pulsate" : ""} />
        </button>
        <button
          type="button"
          aria-label={t(locale, "a11y.addCompare")}
          aria-pressed={compared}
          onClick={(e) => {
            e.preventDefault();
            const next = toggleCompareId(product.id);
            setCompared(next.includes(product.id));
            if (next.includes(product.id)) setComparePulse((k) => k + 1);
          }}
          className={`flex h-11 w-11 items-center justify-center bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white ${
            compared ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
          }`}
        >
          <Scale key={comparePulse} size={17} strokeWidth={1.6} className={comparePulse ? "animate-pulsate" : ""} />
        </button>
      </div>

      {/* Name */}
      <h3 className="mt-4 text-[14px] font-medium leading-[1.4] text-[color:var(--color-ink)]">
        <Link href={href} className="transition-colors duration-200 hover:text-[color:var(--color-ink)]/75">
          {product.name}
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
