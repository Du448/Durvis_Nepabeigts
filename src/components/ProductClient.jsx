"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Heart, Shield, ShieldCheck, ZoomIn, ZoomOut, Ruler, Wrench, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AccordionItem from "@/components/anim/AccordionItem";
import ProductTabs, { SPECS_ANCHOR, OPEN_SPECS_EVENT } from "@/components/ProductTabs";
import MagneticButton from "@/components/anim/MagneticButton";
import RevealGrid from "@/components/anim/RevealGrid";
import { isInStock, stockKind, formatPrice } from "@/lib/product-utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { useTr } from "@/components/DictProvider";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { finishesColorQuery } from "@/lib/finishesLink";
import { paths } from "@/lib/routes";
import { imageProps } from "@/lib/images";
import { scrollBehavior } from "@/lib/motion";

/* Interior doors are photographed as narrow studio renders about 275x585px.
   Poured into the 3:4 box the entrance doors need, they get blown up well past
   their own resolution, so on wide screens their gallery is half as tall and
   the render is shown closer to its native size. */
const FLAT_GALLERY_CATEGORIES = ["ieksdurvis", "sleptas-durvis"];

function ServiceBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-[--color-soft] text-[color:var(--color-accent)]">
        <Icon size={16} />
      </span>
      <span>{label}</span>
    </span>
  );
}

// Small "?" popover - closes on an outside click/tap or Escape, same pattern
// as the calculator's info buttons.
function ToggleHint({ text }) {
  const locale = getLocaleFromPathname(usePathname());
  const hintId = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <span className="relative inline-block shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={hintId}
        aria-label={t(locale, "a11y.moreInfo")}
        // 44px tap area around the small visual circle; the negative margin keeps the row's layout.
        className="group/hint -m-3 flex h-11 w-11 items-center justify-center"
      >
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full border border-line bg-white text-[11px] font-semibold leading-none text-muted group-hover/hint:border-[color:var(--color-accent)] group-hover/hint:text-[color:var(--color-accent)]"
        >
          ?
        </span>
      </button>
      {open ? (
        <div
          id={hintId}
          className="absolute right-0 top-full z-30 mt-2 w-[220px] border border-line bg-white p-3 text-left text-[12px] font-normal leading-[1.6] text-ink shadow-lg"
        >
          {text}
        </div>
      ) : null}
    </span>
  );
}

// A fulfilment choice: pickup / measurement / delivery-only / install+delivery.
// Selecting one or more writes their labels into the "Pieprasīt piedāvājumu"
// link so the request the visitor sends already states what they want.
// A row rather than a <label>: the switch takes its name from the text alone,
// and the "?" button next to it stays a separate control.
function ServiceToggleRow({ checked, onChange, label, hint }) {
  const labelId = useId();
  return (
    <div className="flex min-h-11 items-center gap-3 py-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          checked
            ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]"
            : "border-[color:var(--color-muted)]/60 bg-white"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked
              ? "translate-x-5 shadow-sm"
              : "translate-x-0.5 border border-[color:var(--color-muted)]/60"
          }`}
        />
      </button>
      <span id={labelId} onClick={onChange} className="flex-1 cursor-pointer text-[15px] text-ink">
        {label}
      </span>
      {hint ? <ToggleHint text={hint} /> : null}
    </div>
  );
}

/* The server page passes the catalogue entry, four similar models as cards,
   and the configurator link (whether this model is one of its series, and the
   colour section to open) - so neither the catalogue nor the configurator's
   data has to ship to the browser. */
export default function ProductClient({ product, similar = [], configurator = null, locks = [] }) {
  const { trData, translateColorLabel } = useTr();
  const locale = getLocaleFromPathname(usePathname());
  const productImages = product?.images && product.images.length > 0 ? product.images : ["placeholder"];
  const images = productImages;
  const isFlatGallery = FLAT_GALLERY_CATEGORIES.includes(product?.category);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeSize, setActiveSize] = useState(product?.sizes?.[0] || "");
  const [serviceOptions, setServiceOptions] = useState({
    pickup: false,
    measurement: false,
    deliveryOnly: false,
    installDelivery: false,
  });
  const toggleServiceOption = (key) =>
    setServiceOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  const selectedServiceCodes = Object.entries(serviceOptions)
    .filter(([, on]) => on)
    .map(([key]) => key);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const lightboxScrollRef = useRef(null);
  const ZOOM_MIN = 1;
  const ZOOM_MAX = 2.6;
  const ZOOM_STEP = 0.4;
  const zoomIn = () => setLightboxZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setLightboxZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const goToLightboxIdx = (updater) => {
    setLightboxZoom(1);
    setLightboxIdx(updater);
  };

  /* Growing the zoomed layer keeps it pinned at the scroll container's
     top-left corner by default, which reads as a lopsided, half-black crop
     rather than a closer look at the photo. Recentre the scroll position
     on every zoom change so the same spot the viewer was looking at stays
     in the middle of the frame. */
  useEffect(() => {
    const el = lightboxScrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: (el.scrollWidth - el.clientWidth) / 2,
      top: (el.scrollHeight - el.clientHeight) / 2,
    });
  }, [lightboxZoom, lightboxIdx]);
  const [wishlisted, setWishlisted] = useState(false);
  /* Width / height of the first photo, once it has loaded; until then a
     typical value for the category. */
  const [mainRatio, setMainRatio] = useState(null);

  useEffect(() => {
    if (!product?.id) return;
    const sync = () => setWishlisted(isWishlisted(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, [product?.id]);

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "product.notFound")}</div>
      </main>
    );
  }

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const discount = hasOffer ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  /* The catalogue stores names, specification rows and description copy in
     Latvian; the page's dictionary (DictProvider) renders them in its language. */
  const productName = trData(locale, product.name);

  return (
    <main>

      <section className="border-b border-line">
        <div className="container py-5">
          <div className="text-sm text-muted">
            <Link className="text-ink hover:text-ink" href={withLocaleHref(locale, "/")}>{t(locale, "common.home")}</Link>
            <span className="mx-1 text-muted">/</span>
            <span className="text-ink">{productName}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Gallery */}
            <div>
              {/* Main image, sized to the first photo's own proportions so the
                  thumbnails below sit right under it; a tall single-door photo
                  is capped at 80% of the screen height. */}
              <div
                className="relative mx-auto max-h-[80vh]"
                style={{ aspectRatio: mainRatio ?? (isFlatGallery ? 0.47 : 0.93) }}
              >
                  <div className="absolute inset-0 overflow-hidden">
                    {images[activeIdx] === "placeholder" ? (
                      <div className="w-full h-full bg-[--color-soft] flex items-center justify-center text-muted">
                        <span>{t(locale, "product.image")}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxIdx(activeIdx);
                          setLightboxZoom(1);
                          setLightboxOpen(true);
                        }}
                        className="group relative block w-full h-full cursor-zoom-in"
                        aria-label={t(locale, "product.openImage")}
                      >
                        <Image
                          src={images[activeIdx]}
                          alt={productName}
                          fill
                          {...imageProps(images[activeIdx])}
                          referrerPolicy="no-referrer"
                          preload={activeIdx === 0}
                          onLoad={(e) => {
                            if (mainRatio || activeIdx !== 0) return;
                            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                            if (w && h) setMainRatio(Math.min(1.6, Math.max(0.4, w / h)));
                          }}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center border border-line bg-white/90 text-ink opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
                        >
                          <ZoomIn size={18} />
                        </span>
                      </button>
                    )}
                  </div>
                              </div>

              {/* Thumbnails under the main image */}
              <div className={`mt-3 grid-cols-5 gap-2 sm:grid-cols-6 ${images.length > 1 ? "grid" : "hidden"}`}>
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`relative group aspect-square border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted overflow-hidden`}
                    onClick={() => { setSelectedIdx(idx); setActiveIdx(idx); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(selectedIdx)}
                    onFocus={() => setActiveIdx(idx)}
                    onBlur={() => setActiveIdx(selectedIdx)}
                    aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                  >
                    {src === "placeholder" ? (
                      t(locale, "product.image")
                    ) : (
                      <span className="relative block h-full w-full overflow-hidden">
                        <Image
                          src={src}
                          alt={`${productName} - ${t(locale, "product.imageN").replace("{n}", String(idx + 1))}`}
                          fill
                          {...imageProps(src)}
                          referrerPolicy="no-referrer"
                          sizes="120px"
                          className="object-contain"
                        />
                      </span>
                    )}
                    <span aria-hidden className="pointer-events-none absolute inset-0 ring-2 ring-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">{product.collection}</div>
                {isInStock(product) ? (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none ${
                      stockKind(product) === "factory"
                        ? "bg-[color:var(--color-stock-factory-soft)] text-[color:var(--color-stock-factory)]"
                        : "bg-[color:var(--color-stock-soft)] text-[color:var(--color-stock)]"
                    }`}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                    {t(locale, stockKind(product) === "factory" ? "product.inStockFactory" : "product.inStock")}
                  </span>
                ) : null}
                {configurator ? (
                  <Link
                    href={withLocaleHref(locale, paths.configurator)}
                    className="inline-flex items-center gap-1.5 bg-[color:var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-white"
                  >
                    <Shield size={12} />
                    {t(locale, "product.individualSolution")}
                  </Link>
                ) : null}
              </div>
              <h1 className="mt-2 text-[28px] font-medium leading-[1.3] text-[color:var(--color-title)] sm:text-[36px]">{productName}</h1>

              <div className="mt-2 flex items-baseline gap-2">
                {hasOffer ? (
                  <>
                    <span className="text-[24px] text-[color:var(--color-accent)]">{formatPrice(product)}</span>
                    <span className="text-muted line-through">{formatPrice(product, product.oldPrice)}</span>
                    <span className="text-[color:var(--color-accent)] font-medium">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-[24px] text-[color:var(--color-accent)]">{formatPrice(product)}</span>
                )}
              </div>

              {/* Colors (display only: exterior / interior) */}
              {product.colors?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.colorLabel")}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                    <span className="border border-line px-3 py-1.5">{translateColorLabel(locale, product.colors[0])}</span>
                    {product.colors[1] ? (
                      <>
                        <span className="text-muted">/</span>
                        <span className="border border-line px-3 py-1.5">{translateColorLabel(locale, product.colors[1])}</span>
                      </>
                    ) : null}
                    {product.collection === "BOSTON" ? null : configurator ? (
                      <Link
                        href={withLocaleHref(locale, `${paths.configurator}${configurator.colorQuery}`)}
                        className="border border-[color:var(--color-accent)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-white"
                      >
                        {t(locale, "product.changeShade")}
                      </Link>
                    ) : (
                      <Link
                        href={withLocaleHref(locale, `${paths.finishes}${finishesColorQuery(product)}`)}
                        className="border border-[color:var(--color-accent)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-white"
                      >
                        {t(locale, "product.changeShade")}
                      </Link>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length ? (
                <div className="mt-5">
                  <label htmlFor="product-size" className="block text-sm text-muted mb-2">
                    {t(locale, "product.size")}
                  </label>
                  <select
                    id="product-size"
                    value={activeSize}
                    onChange={(e) => setActiveSize(e.target.value)}
                    className="field max-w-[240px]"
                  >
                    {product.sizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Security class */}
              {product.security ? (
                <div className="mt-3 flex items-center gap-2 text-[15px] text-muted">
                  <Shield size={16} />
                  <span>{product.security}</span>
                </div>
              ) : null}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton>
                  <Link
                    href={withLocaleHref(
                      locale,
                      `${paths.contacts}?produkts=${encodeURIComponent(product.id)}${
                        activeSize ? `&izmers=${encodeURIComponent(activeSize)}` : ""
                      }${
                        selectedServiceCodes.length
                          ? `&pakalpojumi=${encodeURIComponent(selectedServiceCodes.join(","))}`
                          : ""
                      }`
                    )}
                    className="btn btn-accent"
                  >
                    {t(locale, "product.requestOffer")}
                  </Link>
                </MagneticButton>
                <button
                  type="button"
                  className={`btn btn-outline-dark ${wishlisted ? "!border-[color:var(--color-accent)] !text-[color:var(--color-accent)]" : ""}`}
                  onClick={() => toggleWishlistId(product.id)}
                >
                  <Heart size={18} />
                  {t(locale, "product.addWishlist")}
                </button>
              </div>

              {/* What every order can include, right under the buttons. */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-ink">
                <ServiceBadge icon={Ruler} label={t(locale, "product.featureMeasurement")} />
                <ServiceBadge icon={Wrench} label={t(locale, "product.featureInstall")} />
                <ServiceBadge icon={ShieldCheck} label={t(locale, "product.featureWarranty")} />
                <ServiceBadge icon={Truck} label={t(locale, "product.featureDelivery")} />
              </div>
              {/* The specification lives in one table, in the tabs below. */}
              <a
                href={`#${SPECS_ANCHOR}`}
                onClick={() => window.dispatchEvent(new Event(OPEN_SPECS_EVENT))}
                className="mt-2 inline-flex min-h-11 items-center text-[15px] font-medium text-[color:var(--color-accent)] underline underline-offset-4"
              >
                {t(locale, "product.allSpecs")}
              </a>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[--color-line] border border-line bg-white">
                {/* Models with a facing worth explaining (the Termix range is
                    clad in Stronwood, not the usual moisture-resistant MDF)
                    get their own section right under the specification. */}
                {product.finishMaterial ? (
                  <AccordionItem title={t(locale, "product.finishMaterial")}>
                    {product.finishMaterial.lead?.map((paragraph) => (
                      <p key={paragraph} className="mb-3">
                        {trData(locale, paragraph)}
                      </p>
                    ))}

                    {product.finishMaterial.heading ? (
                      <h4 className="mb-2 mt-4 text-[16px] font-medium text-[color:var(--color-title)]">
                        {trData(locale, product.finishMaterial.heading)}
                      </h4>
                    ) : null}

                    {product.finishMaterial.intro ? (
                      <p className="mb-3">{trData(locale, product.finishMaterial.intro)}</p>
                    ) : null}

                    {product.finishMaterial.layers?.length ? (
                      <ol className="list-decimal space-y-2 pl-5">
                        {product.finishMaterial.layers.map((layer) => (
                          <li key={layer.title}>
                            <span className="font-medium text-[color:var(--color-title)]">
                              {trData(locale, layer.title)}:
                            </span>{" "}
                            {trData(locale, layer.text)}
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </AccordionItem>
                ) : null}
                <AccordionItem title={t(locale, "product.set")}>
                  {/* Models that list what actually ships in the box say so;
                      the rest say the details are still to come. */}
                  {product.set?.length ? (
                    <ul className="list-disc pl-5">
                      {product.set.map((item) => (
                        <li key={item}>{trData(locale, item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[13px] text-muted">{t(locale, "product.detailsComingLater")}</div>
                  )}
                </AccordionItem>
                <AccordionItem title={t(locale, "product.installDelivery")}>
                  <div className="divide-y divide-[--color-line]">
                    <ServiceToggleRow
                      checked={serviceOptions.pickup}
                      onChange={() => toggleServiceOption("pickup")}
                      label={t(locale, "product.optionPickup")}
                    />
                    <ServiceToggleRow
                      checked={serviceOptions.measurement}
                      onChange={() => toggleServiceOption("measurement")}
                      label={t(locale, "product.optionMeasurement")}
                      hint={t(locale, "product.optionMeasurementHint")}
                    />
                    <ServiceToggleRow
                      checked={serviceOptions.deliveryOnly}
                      onChange={() => toggleServiceOption("deliveryOnly")}
                      label={t(locale, "product.optionDeliveryOnly")}
                      hint={t(locale, "product.optionDeliveryOnlyHint")}
                    />
                    <ServiceToggleRow
                      checked={serviceOptions.installDelivery}
                      onChange={() => toggleServiceOption("installDelivery")}
                      label={t(locale, "product.optionInstallDelivery")}
                      hint={t(locale, "product.optionInstallDeliveryHint")}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem title={t(locale, "product.warranty")}>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-[--color-soft] text-[color:var(--color-accent)]">
                      <ShieldCheck size={16} />
                    </span>
                    <span>{t(locale, "pages.about.featuresDesc3")}</span>
                  </div>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description / specification tabs */}
      <ProductTabs product={product} locks={locks} />

      {/* Similar products */}
      <section className="section-soft py-14">
        <div className="container">
          <h2 className="t-section mb-8 text-center">{t(locale, "product.similar")}</h2>
          <RevealGrid className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RevealGrid>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center border border-white/30 bg-black/40 text-white disabled:opacity-30"
                  aria-label={t(locale, "product.zoomOut")}
                  onClick={zoomOut}
                  disabled={lightboxZoom <= ZOOM_MIN}
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center border border-white/30 bg-black/40 text-white disabled:opacity-30"
                  aria-label={t(locale, "product.zoomIn")}
                  onClick={zoomIn}
                  disabled={lightboxZoom >= ZOOM_MAX}
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  className="ml-1 text-white text-xl"
                  aria-label={t(locale, "product.close")}
                  onClick={() => setLightboxOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div
                ref={lightboxScrollRef}
                className={`relative h-[min(75vh,720px)] w-full overflow-auto bg-black no-scrollbar ${lightboxZoom > ZOOM_MIN ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => (lightboxZoom > ZOOM_MIN ? setLightboxZoom(ZOOM_MIN) : zoomIn())}
              >
                <div
                  className="relative mx-auto"
                  style={{ width: `${lightboxZoom * 100}%`, height: `${lightboxZoom * 100}%`, minWidth: "100%", minHeight: "100%" }}
                >
                  <Image
                    src={images[lightboxIdx]}
                    alt={`${productName} - ${t(locale, "product.openImage")}`}
                    fill
                    {...imageProps(images[lightboxIdx])}
                    referrerPolicy="no-referrer"
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="border border-line bg-white/10 text-white px-3 py-1.5"
                  onClick={() => goToLightboxIdx((i) => (i - 1 + images.length) % images.length)}
                >
                  {t(locale, "product.previous")}
                </button>
                <div className="text-white text-sm">
                  {lightboxIdx + 1} / {images.length}
                </div>
                <button
                  type="button"
                  className="border border-line bg-white/10 text-white px-3 py-1.5"
                  onClick={() => goToLightboxIdx((i) => (i + 1) % images.length)}
                >
                  {t(locale, "product.next")}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`aspect-square border ${idx === lightboxIdx ? 'border-[--color-accent]' : 'border-line'} bg-[--color-soft]`}
                    onClick={() => goToLightboxIdx(idx)}
                    aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                  >
                    <span className="relative block h-full w-full overflow-hidden">
                      <Image src={src} alt={productName} fill {...imageProps(src)} referrerPolicy="no-referrer" sizes="80px" className="object-contain" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
