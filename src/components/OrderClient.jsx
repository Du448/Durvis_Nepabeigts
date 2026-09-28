"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { useCartItems } from "@/lib/useCartItems";
import { clearCart } from "@/lib/cart";
import { serviceLabels } from "@/lib/order-options";
import { formatPrice, linePrice } from "@/lib/product-utils";
import { bostonHardwareOptions } from "@/data/boston-hardware";
import { bostonColorPalette } from "@/data/boston-colors";
import { bostonWidthBrackets, bostonHeightBrackets } from "@/data/boston-size-brackets";
import { bostonGlassColors } from "@/data/boston-glass-colors";
import { imageProps } from "@/lib/images";
import { mainPhone, company } from "@/lib/site";
import { scrollBehavior } from "@/lib/motion";

// A cart line's hardware-type choice, translated for display - "" when the
// product has no hardware options or none was picked.
function hardwareTypeLabel(product, line, locale) {
  const opt = bostonHardwareOptions[product?.id]?.find((o) => o.key === line?.hardwareType);
  return opt ? t(locale, `product.${opt.labelKey}`) : "";
}

// A cart line's colour-tone choice, translated for display - "" when none
// was picked (only made-to-order Boston models carry this field at all).
function colorToneLabel(line, locale) {
  const sw = bostonColorPalette.find((c) => c.ral === line?.colorTone);
  return sw ? sw.name[locale] || sw.name.lv : "";
}

// A cart line's non-standard-size choice, translated for display - "" when
// the shopper didn't opt into a custom size.
function customSizeLabel(line, locale) {
  if (!line?.customSize) return "";
  const width = bostonWidthBrackets.find((b) => b.key === line.widthBracket);
  const height = bostonHeightBrackets.find((b) => b.key === line.heightBracket);
  return [width, height]
    .filter(Boolean)
    .map((b) => t(locale, `product.${b.labelKey}`))
    .join(", ");
}

// A cart line's glass-tint choice, translated for display - "" when none
// was picked.
function glassToneLabel(line, locale) {
  const sw = bostonGlassColors.find((g) => g.key === line?.glassTone);
  return sw ? t(locale, `product.${sw.labelKey}`) : "";
}

/* Order checkout, modelled on rdveikals.lv's /order page: one page, two
   numbered sections (customer details, delivery), an order summary beside
   the form, and a single submit - just without their third (payment) section,
   since a made-to-order door's price is confirmed after measurement rather
   than paid upfront. Submitting books the request with the shop and, unlike
   the plain contact form, also mails the customer their own confirmation
   (see /api/order). */
export default function OrderClient() {
  const locale = getLocaleFromPathname(usePathname());
  const { loaded, items, subtotal, itemCount } = useCartItems();

  const [customerType, setCustomerType] = useState("private");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [vatCode, setVatCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [comment, setComment] = useState("");

  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (orderNumber) confirmRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  }, [orderNumber]);

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          customerType,
          firstName,
          lastName,
          companyName,
          companyCode,
          vatCode,
          email,
          phone,
          deliveryMethod,
          address: { city, street, postalCode },
          comment,
          consent,
          fax_number: honeypot,
          items: items.map(({ line, product }) => ({
            name: product.name,
            size: line.size || "",
            direction: line.direction
              ? t(locale, line.direction === "right" ? "product.directionRight" : "product.directionLeft")
              : "",
            qty: line.qty,
            price: formatPrice(product, linePrice(product, line) * line.qty),
            services: serviceLabels(line.services, t, locale).join(", "),
            jambColor: line.jambColor || "",
            hardwareType: hardwareTypeLabel(product, line, locale),
            colorTone: colorToneLabel(line, locale),
            customSize: customSizeLabel(line, locale),
            glassTone: glassToneLabel(line, locale),
            url: `${window.location.origin}${withLocaleHref(locale, paths.product(product.id))}`,
          })),
          subtotal: formatPrice({ currency: "EUR" }, subtotal),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "send_failed");
      clearCart();
      setOrderNumber(data.orderNumber);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (!loaded) return <div className="container min-h-[40vh] py-10" />;

  if (orderNumber) {
    return (
      <div className="container py-10">
        <div ref={confirmRef} role="status" className="mx-auto max-w-[560px] border border-line bg-white p-6 sm:p-8">
          <CheckCircle2 size={40} className="text-[color:var(--color-accent)]" aria-hidden />
          <h2 className="mt-4 text-[22px] font-medium text-[color:var(--color-title)]">{t(locale, "order.thanksTitle")}</h2>
          <p className="mt-3 text-[15px] text-ink">
            {t(locale, "order.thanksNumberLabel")}: <span className="font-medium">{orderNumber}</span>
          </p>
          <p className="mt-2 text-[15px] text-ink">{t(locale, "order.thanksBody")}</p>
          <div className="mt-6 border-t border-line pt-4 text-[14px] text-muted">
            {t(locale, "contacts.urgentCall")}{" "}
            <a href={mainPhone.href} className="inline-flex items-center gap-1 font-semibold text-ink underline">
              <Phone size={14} aria-hidden />
              {mainPhone.label}
            </a>
          </div>
          <Link href={withLocaleHref(locale, "/")} className="btn btn-accent mt-6">
            {t(locale, "search.backHome")}
          </Link>
        </div>
      </div>
    );
  }

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
      <Link href={withLocaleHref(locale, paths.cart)} className="text-[13px] text-muted underline hover:text-ink">
        {t(locale, "order.backToCart")}
      </Link>

      <form onSubmit={onSubmit} className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="space-y-6">
          {/* Step 1 */}
          <section className="border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-medium text-[color:var(--color-title)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[color:var(--color-accent)] text-[13px] font-semibold text-white">
                1
              </span>
              {t(locale, "order.step1Title")}
            </h2>

            <div className="mt-4 flex gap-2">
              {["private", "business"].map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={customerType === type}
                  onClick={() => setCustomerType(type)}
                  className={`min-h-11 flex-1 border px-3 text-[14px] transition-colors ${
                    customerType === type
                      ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                      : "border-line text-ink hover:border-[--color-muted]"
                  }`}
                >
                  {t(locale, type === "private" ? "order.customerTypePrivate" : "order.customerTypeBusiness")}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {customerType === "business" ? (
                <>
                  <div className="sm:col-span-2">
                    <label htmlFor="o-company" className="mb-1 block text-sm text-muted">
                      {t(locale, "order.companyName")}
                    </label>
                    <input
                      id="o-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="o-companycode" className="mb-1 block text-sm text-muted">
                      {t(locale, "legal.companyCode")}
                    </label>
                    <input
                      id="o-companycode"
                      type="text"
                      value={companyCode}
                      onChange={(e) => setCompanyCode(e.target.value)}
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="o-vatcode" className="mb-1 block text-sm text-muted">
                      {t(locale, "legal.vatCode")}
                    </label>
                    <input id="o-vatcode" type="text" value={vatCode} onChange={(e) => setVatCode(e.target.value)} className="field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="o-contact" className="mb-1 block text-sm text-muted">
                      {t(locale, "order.contactPerson")}
                    </label>
                    <input
                      id="o-contact"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="o-first" className="mb-1 block text-sm text-muted">
                      {t(locale, "order.firstName")}
                    </label>
                    <input
                      id="o-first"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="o-last" className="mb-1 block text-sm text-muted">
                      {t(locale, "order.lastName")}
                    </label>
                    <input
                      id="o-last"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="o-email" className="mb-1 block text-sm text-muted">
                  {t(locale, "order.email")}
                </label>
                <input
                  id="o-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="o-phone" className="mb-1 block text-sm text-muted">
                  {t(locale, "order.phone")}
                </label>
                <input
                  id="o-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="field"
                />
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-medium text-[color:var(--color-title)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[color:var(--color-accent)] text-[13px] font-semibold text-white">
                2
              </span>
              {t(locale, "order.step2Title")}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["pickup", "courier"].map((method) => (
                <button
                  key={method}
                  type="button"
                  aria-pressed={deliveryMethod === method}
                  onClick={() => setDeliveryMethod(method)}
                  className={`min-h-[64px] border px-4 py-3 text-left transition-colors ${
                    deliveryMethod === method
                      ? "border-[color:var(--color-accent)] ring-1 ring-[color:var(--color-accent)]"
                      : "border-line hover:border-[--color-muted]"
                  }`}
                >
                  <span className="block text-[14px] font-medium text-ink">
                    {t(locale, method === "pickup" ? "order.deliveryPickup" : "order.deliveryCourier")}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted">
                    {method === "pickup" ? t(locale, "order.deliveryPickupPrice") : t(locale, "order.deliveryCourierHint")}
                  </span>
                </button>
              ))}
            </div>

            {deliveryMethod === "pickup" ? (
              <p className="mt-3 text-[13px] text-muted">{company.address}</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="o-city" className="mb-1 block text-sm text-muted">
                    {t(locale, "order.addressCity")}
                  </label>
                  <input id="o-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="field" />
                </div>
                <div>
                  <label htmlFor="o-street" className="mb-1 block text-sm text-muted">
                    {t(locale, "order.addressStreet")}
                  </label>
                  <input
                    id="o-street"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="o-postal" className="mb-1 block text-sm text-muted">
                    {t(locale, "order.addressPostal")}
                  </label>
                  <input id="o-postal" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="field" />
                </div>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="o-comment" className="mb-1 block text-sm text-muted">
                {t(locale, "order.comment")}
              </label>
              <textarea
                id="o-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(locale, "order.commentPlaceholder")}
                className="field"
              />
            </div>
          </section>

          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Fax
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <label className="flex items-start gap-2 text-[13px] text-muted">
            <input type="checkbox" className="mt-[3px]" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
            <span>
              {t(locale, "order.consent")}{" "}
              <Link href={withLocaleHref(locale, "/privatumo-politika")} className="underline" target="_blank">
                {t(locale, "legal.privacyLink")}
              </Link>
            </span>
          </label>

          <button type="submit" disabled={sending} className="btn btn-accent disabled:opacity-60">
            {sending ? t(locale, "order.sending") : t(locale, "order.submit")}
          </button>
          {error ? (
            <div role="alert" className="text-[color:var(--color-danger)]">
              {t(locale, "order.error")}
            </div>
          ) : null}
        </div>

        {/* Order summary */}
        <aside className="border border-line bg-white p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
          <h2 className="text-[16px] font-medium text-[color:var(--color-title)]">{t(locale, "order.summaryTitle")}</h2>
          <p className="mt-1 text-[13px] text-muted">{t(locale, "cart.itemsCount").replace("{n}", String(itemCount))}</p>

          <ul className="mt-4 space-y-3 border-t border-line pt-4">
            {items.map(({ line, product }) => {
              const directionLabel = line.direction
                ? t(locale, line.direction === "right" ? "product.directionRight" : "product.directionLeft")
                : "";
              const chips = [
                line.size,
                directionLabel,
                hardwareTypeLabel(product, line, locale),
                colorToneLabel(line, locale),
                customSizeLabel(line, locale),
                glassToneLabel(line, locale),
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li key={line.lineId} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[--color-soft]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        {...imageProps(product.image)}
                        className="object-contain mix-blend-multiply p-1"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-ink">
                      {product.name}
                      {line.qty > 1 ? <span className="text-muted"> ×{line.qty}</span> : null}
                    </p>
                    {chips ? <p className="text-[12px] text-muted">{chips}</p> : null}
                  </div>
                  <span className="shrink-0 text-[13px] font-medium text-ink">{formatPrice(product, linePrice(product, line) * line.qty)}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[15px] text-ink">{t(locale, "cart.subtotal")}</span>
            <span className="text-[20px] font-medium text-[color:var(--color-accent)]">
              {formatPrice({ currency: "EUR" }, subtotal)}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.5] text-muted">{t(locale, "cart.priceNote")}</p>
        </aside>
      </form>
    </div>
  );
}
