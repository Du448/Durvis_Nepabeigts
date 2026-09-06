"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Shield, ChevronUp, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AccordionItem from "@/components/anim/AccordionItem";
import ProductTabs from "@/components/ProductTabs";
import MagneticButton from "@/components/anim/MagneticButton";
import RevealGrid from "@/components/anim/RevealGrid";
import { getProductById, getProductsByCategory, isInStock, stockKind, formatPrice } from "@/data/products";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, translateColorLabel, withLocaleHref, t, trData } from "@/lib/i18n";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";

/* Interior doors are photographed as narrow studio renders about 275x585px.
   Poured into the 3:4 box the entrance doors need, they get blown up well past
   their own resolution, so on wide screens their gallery is half as tall and
   the render is shown closer to its native size. */
const FLAT_GALLERY_CATEGORIES = ["ieksdurvis", "sleptas-durvis"];

export default function ProductClient({ id }) {
  const locale = getLocaleFromPathname(usePathname());
  const product = getProductById(id);
  const productImages = product?.images && product.images.length > 0 ? product.images : ["placeholder"];
  const images = productImages;
  const galleryAspect = FLAT_GALLERY_CATEGORIES.includes(product?.category)
    ? "lg:aspect-[3/2]"
    : "";
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeSize, setActiveSize] = useState(product?.sizes?.[0] || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const thumbsRef = useRef(null);
  const mediaRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  /* Height of the photograph as actually painted inside its box. The
     thumbnail column is clipped to it, so the strip ends exactly at the
     bottom of the door photo and the rest is reached by scrolling. */
  const [mediaHeight, setMediaHeight] = useState(null);

  const scrollThumbs = (dir) => {
    const el = thumbsRef.current;
    if (!el) return;
    const firstBtn = el.querySelector("button");
    const step = firstBtn ? firstBtn.getBoundingClientRect().height + 8 : 80; // 8 = gap-2
    el.scrollBy({ top: dir * step, behavior: "smooth" });
  };

  const measureMedia = useCallback(() => {
    const box = mediaRef.current;
    if (!box) return;
    const img = box.querySelector("img");
    const { width, height } = box.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = img?.naturalWidth && img?.naturalHeight ? img.naturalWidth / img.naturalHeight : null;
    const painted = ratio ? Math.min(height, width / ratio) : height;
    setMediaHeight(Math.round(painted));
  }, []);

  const updateScrollButtons = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const top = el.scrollTop;
    setCanScrollUp(top > 0);
    setCanScrollDown(top < max);
  };

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

  useEffect(() => {
    measureMedia();
    const onResize = () => measureMedia();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureMedia, activeIdx]);

  useEffect(() => {
    updateScrollButtons();
    const el = thumbsRef.current;
    if (!el) return;
    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateScrollButtons();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [images.length]);

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "product.notFound")}</div>
      </main>
    );
  }

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const discount = hasOffer ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const similar = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);

  // JSON-LD breadcrumbs
  /* The catalogue stores names, specification rows and description copy in
     Latvian; the dictionary in @/data/translations renders them in the page's
     language. */
  const productName = trData(locale, product.name);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t(locale, "common.home"),
        item: withLocaleHref(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: productName,
        item: withLocaleHref(locale, `/produkts/${product.id}`),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

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
              {/* Shared aspect box to keep thumbnails column height equal to main image */}
              <div className={`relative aspect-[3/4] ${galleryAspect}`}>
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[112px_1fr] gap-3">
                  {/* Vertical thumbnails (desktop) */}
                  <div
                    className="relative hidden h-full overflow-hidden bg-[--color-soft] lg:block"
                    style={mediaHeight ? { height: `${mediaHeight}px` } : undefined}
                  >
                    <button
                      type="button"
                      className={`absolute left-1/2 -translate-x-1/2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 ${canScrollUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.previous")}
                      onClick={() => scrollThumbs(-1)}
                    >
                      <ChevronUp size={18} />
                    </button>
                    <div ref={thumbsRef} className="absolute inset-0 overflow-y-auto no-scrollbar pr-1">
                      <div className="flex h-max flex-col gap-2">
                        {images.map((src, idx) => (
                          <button
                            key={`v-${idx}`}
                            className={`relative group aspect-square border ${idx === selectedIdx ? "border-[--color-accent]" : "border-line"} bg-[--color-soft] text-xs text-muted w-full overflow-hidden`}
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
                                  alt={`${productName} — ${t(locale, "product.imageN").replace("{n}", String(idx + 1))}`}
                                  fill
                                  unoptimized
                                  referrerPolicy="no-referrer"
                                  sizes="120px"
                                  className="object-contain object-top"
                                />
                              </span>
                            )}
                            <span aria-hidden className="pointer-events-none absolute inset-0 ring-2 ring-[var(--color-ink)] opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`absolute left-1/2 -translate-x-1/2 bottom-2 z-20 inline-flex h-9 w-9 items-center justify-center border border-line bg-white shadow-md text-ink transition-opacity hover:bg-ink/10 ${canScrollDown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                      aria-label={t(locale, "product.next")}
                      onClick={() => scrollThumbs(1)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {/* Main image */}
                  <div ref={mediaRef} className="relative overflow-hidden">
                    {images[activeIdx] === "placeholder" ? (
                      <div className="w-full h-full bg-[--color-soft] flex items-center justify-center text-muted">
                        <span>{t(locale, "product.image")}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxIdx(activeIdx);
                          setLightboxOpen(true);
                        }}
                        className="relative block w-full h-full"
                        aria-label={t(locale, "product.openImage")}
                      >
                        <Image
                          src={images[activeIdx]}
                          alt={productName}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          loading="eager"
                          onLoad={measureMedia}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain object-top"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails grid (mobile only) */}
              <div className="mt-3 grid grid-cols-5 gap-2 lg:hidden">
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
                          alt={`${productName} — ${t(locale, "product.imageN").replace("{n}", String(idx + 1))}`}
                          fill
                          unoptimized
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
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.size")}</div>
                  <select
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
                    href={withLocaleHref(locale, `/kontakti?produkts=${encodeURIComponent(product.id)}`)}
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

              <div className="mt-3 text-[15px] text-muted">{t(locale, "product.freeServices")}</div>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[--color-line] border border-line bg-white">
                <AccordionItem title={t(locale, "product.specs")} defaultOpen>
                    <ul className="list-disc pl-5">
                      {Object.entries(product.specs || {}).map(([k, v]) => {
                        const labelKey =
                          k === "Vērtnes biezums"
                            ? "specs.leafThickness"
                            : k === "Kārbas biezums"
                              ? "specs.frameThickness"
                              : k === "Svars"
                                ? "specs.weight"
                                : k === "Slēdzenes"
                                  ? "specs.locks"
                                  : k === "Pildījums"
                                    ? "specs.filling"
                                    : k === "Ārējā apdare"
                                      ? "specs.outsideFinish"
                                      : k === "Iekšējā apdare"
                                        ? "specs.insideFinish"
                                        : k === "Apdare"
                                          ? "specs.finish"
                                          : k === "Actiņa"
                                            ? "specs.peephole"
                                            : k === "Furnitūra"
                                              ? "specs.hardware"
                                              : null;

                        const label = labelKey ? t(locale, labelKey) : trData(locale, k);
                        const rawValue = typeof v === "string" ? v : String(v);
                        const value =
                          rawValue === "Ir"
                            ? t(locale, "values.yes")
                            : rawValue === "Nav"
                              ? t(locale, "values.no")
                              : trData(locale, rawValue);

                        return (
                          <li key={k}>
                            <span className="text-muted">{label}:</span> {value}
                          </li>
                        );
                      })}
                    </ul>
                </AccordionItem>
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
                      the rest fall back to the general services blurb. */}
                  {product.set?.length ? (
                    <ul className="list-disc pl-5">
                      {product.set.map((item) => (
                        <li key={item}>{trData(locale, item)}</li>
                      ))}
                    </ul>
                  ) : (
                    t(locale, "pages.services.description")
                  )}
                </AccordionItem>
                <AccordionItem title={t(locale, "product.installDelivery")}>
                  {t(locale, "product.freeServices")}
                </AccordionItem>
                <AccordionItem title={t(locale, "product.warranty")}>
                  {t(locale, "pages.about.featuresDesc3")}
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description / specification tabs */}
      <ProductTabs product={product} />

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
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 text-white text-xl"
              aria-label={t(locale, "product.close")}
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <div className="relative w-full aspect-video bg-black">
              <Image
                src={images[lightboxIdx]}
                alt={`${productName} — ${t(locale, "product.openImage")}`}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                className="border border-line bg-white/10 text-white px-3 py-1.5"
                onClick={() => setLightboxIdx((i) => (i - 1 + images.length) % images.length)}
              >
                {t(locale, "product.previous")}
              </button>
              <div className="text-white text-sm">
                {lightboxIdx + 1} / {images.length}
              </div>
              <button
                type="button"
                className="border border-line bg-white/10 text-white px-3 py-1.5"
                onClick={() => setLightboxIdx((i) => (i + 1) % images.length)}
              >
                {t(locale, "product.next")}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  className={`aspect-square border ${idx === lightboxIdx ? 'border-[--color-accent]' : 'border-line'} bg-[--color-soft]`}
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={t(locale, "product.imageN").replace("{n}", String(idx + 1))}
                >
                  <span className="relative block h-full w-full overflow-hidden">
                    <Image src={src} alt={productName} fill unoptimized referrerPolicy="no-referrer" sizes="100px" className="object-contain" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
