"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { updateCartQty, removeCartLine, clearCart } from "@/lib/cart";
import { useCartItems } from "@/lib/useCartItems";
import { serviceLabels } from "@/lib/order-options";
import { formatPrice, linePrice } from "@/lib/product-utils";
import { bostonHardwareOptions } from "@/data/boston-hardware";
import { bostonColorPalette } from "@/data/boston-colors";
import { bostonWidthBrackets, bostonHeightBrackets } from "@/data/boston-size-brackets";
import { bostonGlassColors } from "@/data/boston-glass-colors";
import { imageProps } from "@/lib/images";

/* Cart page, following the same client-reads-localStorage-then-fetches-cards
   pattern as WishlistClient/CompareClient: the cart only ever stores ids and
   the choices made on the product page, and /api/products fills in the
   name/price/image those choices are shown against. Checking out doesn't pay
   anything here - it hands the whole cart to the contact form as one combined
   enquiry, because a made-to-order door's final price depends on services
   and measurement the shop still has to confirm. */
export default function CartClient() {
  const locale = getLocaleFromPathname(usePathname());
  const { loaded, items, subtotal, itemCount } = useCartItems();

  if (!loaded) return <div className="container min-h-[40vh] py-10" />;

  if (!items.length) {
    return (
      <div className="container py-10">
        <div className="border border-line bg-white p-6 text-[15px] text-muted">
          {t(locale, "cart.empty")}
          <div className="mt-4">
            <Link href={withLocaleHref(locale, "/")} className="btn btn-accent">
              {t(locale, "search.backHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="space-y-4">
          {items.map(({ line, product }) => (
            <CartLine key={line.lineId} line={line} product={product} locale={locale} />
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="min-h-11 border border-line px-4 py-1.5 text-[13px] text-muted transition-colors duration-200 hover:border-[--color-muted] hover:text-ink"
          >
            {t(locale, "cart.clearCart")}
          </button>
        </div>

        <aside className="border border-line bg-white p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
          <h2 className="text-[16px] font-medium text-[color:var(--color-title)]">{t(locale, "cart.summary")}</h2>
          <p className="mt-1 text-[13px] text-muted">{t(locale, "cart.itemsCount").replace("{n}", String(itemCount))}</p>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[15px] text-ink">{t(locale, "cart.subtotal")}</span>
            <span className="text-[20px] font-medium text-[color:var(--color-accent)]">
              {formatPrice({ currency: "EUR" }, subtotal)}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.5] text-muted">{t(locale, "cart.priceNote")}</p>

          <Link href={withLocaleHref(locale, paths.order)} className="btn btn-accent mt-5 w-full justify-center">
            {t(locale, "cart.requestOffer")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function CartLine({ line, product, locale }) {
  const href = withLocaleHref(locale, paths.product(product.id));
  const services = serviceLabels(line.services, t, locale);
  const directionLabel = line.direction
    ? t(locale, line.direction === "right" ? "product.directionRight" : "product.directionLeft")
    : "";
  const hardwareLabel = bostonHardwareOptions[product.id]?.find((opt) => opt.key === line.hardwareType);
  const colorLabel = bostonColorPalette.find((c) => c.ral === line.colorTone);
  const widthLabel = line.customSize ? bostonWidthBrackets.find((b) => b.key === line.widthBracket) : null;
  const heightLabel = line.customSize ? bostonHeightBrackets.find((b) => b.key === line.heightBracket) : null;
  const glassLabel = bostonGlassColors.find((g) => g.key === line.glassTone);
  const chips = [
    line.size,
    directionLabel,
    line.jambColor,
    hardwareLabel ? t(locale, `product.${hardwareLabel.labelKey}`) : null,
    colorLabel ? colorLabel.name[locale] || colorLabel.name.lv : null,
    widthLabel ? t(locale, `product.${widthLabel.labelKey}`) : null,
    heightLabel ? t(locale, `product.${heightLabel.labelKey}`) : null,
    glassLabel ? t(locale, `product.${glassLabel.labelKey}`) : null,
    ...services,
  ].filter(Boolean);

  return (
    <div className="flex gap-4 border border-line bg-white p-4">
      <Link href={href} className="relative h-24 w-24 shrink-0 overflow-hidden bg-[--color-soft] sm:h-28 sm:w-28">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="112px"
            {...imageProps(product.image)}
            className="object-contain mix-blend-multiply p-2"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} className="text-[14px] font-medium text-ink hover:text-ink/75">
              {product.name}
            </Link>
            {product.collection ? (
              <div className="text-[12px] uppercase tracking-wide text-muted">{product.collection}</div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={t(locale, "cart.remove")}
            onClick={() => removeCartLine(line.lineId)}
            className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {chips.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span key={chip} className="border border-line bg-[--color-soft] px-2 py-0.5 text-[12px] text-ink">
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              aria-label={t(locale, "cart.decrease")}
              onClick={() => updateCartQty(line.lineId, line.qty - 1)}
              className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[--color-soft]"
            >
              <Minus size={14} />
            </button>
            <span className="flex h-9 w-10 items-center justify-center text-[14px] text-ink" aria-label={t(locale, "cart.qty")}>
              {line.qty}
            </span>
            <button
              type="button"
              aria-label={t(locale, "cart.increase")}
              onClick={() => updateCartQty(line.lineId, line.qty + 1)}
              className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[--color-soft]"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-[15px] font-medium text-[color:var(--color-accent)]">
            {formatPrice(product, linePrice(product, line) * line.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}
