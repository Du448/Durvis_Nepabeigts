"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Search, Heart, Scale, ShoppingBag, Shield, ShieldCheck, ZoomIn, ZoomOut, Ruler, Wrench, Truck, X, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AccordionItem from "@/components/anim/AccordionItem";
import ProductTabs, { SPECS_ANCHOR, OPEN_SPECS_EVENT } from "@/components/ProductTabs";
import MagneticButton from "@/components/anim/MagneticButton";
import RevealGrid from "@/components/anim/RevealGrid";
import { isInStock, stockKind, formatPrice } from "@/lib/product-utils";
import BostonConfigurator from "@/components/BostonConfigurator";
import HiddenDoorConfigurator from "@/components/HiddenDoorConfigurator";
import { bostonSpec, defaultConfig, encodeConfig, priceBoston } from "@/lib/boston-config";
import { defaultHiddenConfig, hiddenModel, hiddenSpec, priceHidden } from "@/lib/hidden-config";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { useTr } from "@/components/DictProvider";
import { isWishlisted, toggleWishlistId } from "@/lib/wishlist";
import { isCompared, toggleCompareId } from "@/lib/compare";
import { addToCart } from "@/lib/cart";
import { finishesColorQuery } from "@/lib/finishesLink";
import { paths } from "@/lib/routes";
import { imageProps } from "@/lib/images";
import { scrollBehavior } from "@/lib/motion";
import { extenderOptions, extendersTotal } from "@/lib/interior-extenders";

/* Interior doors are photographed as narrow studio renders about 275x585px.
   Poured into the 3:4 box the entrance doors need, they get blown up well past
   their own resolution, so on wide screens their gallery is half as tall and
   the render is shown closer to its native size. */
const FLAT_GALLERY_CATEGORIES = ["ieksdurvis", "sleptas-durvis"];

// Interior jamb finishing price list, shown in its own accordion on the
// product page. Fixed service prices, not tied to any one product. The
// "standard" tiers show the four included MDF colours below; the "custom
// colour" tiers let the visitor pick a shade right there, from the same
// swatches as the Ražotājs-2 configurator's "Durvīm dzīvoklī (PVC plēve)"
// group.
const JAMB_FINISH_ROWS = [
  { key: "jambFinishStandardSmall", price: 90, standard: true },
  { key: "jambFinishStandardLarge", price: 120, standard: true },
  { key: "jambFinishCustomSmall", price: 130, custom: true },
  { key: "jambFinishCustomLarge", price: 190, custom: true },
];

// The four included MDF colours the "standard" tiers describe.
const STANDARD_JAMB_COLORS = [
  { key: "jambColorWhiteMatte", image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/Balts_mat.jpg?updatedAt=1790344491443" },
  { key: "jambColorWhiteWood", image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/Balts_koks.png?updatedAt=1790344491571" },
  { key: "jambColorAnthracite", image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/antracyte.png?updatedAt=1790344491567" },
  { key: "jambColorWengeHorizon", image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/Venge.jpg?updatedAt=1790344491342" },
];

function ServiceBadge({ icon: Icon, label }) {
  return (
    <span className="group inline-flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-[--color-soft] text-[color:var(--color-accent)] transition-all duration-200 group-hover:scale-110 group-hover:border-[color:var(--color-accent)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
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

// Sticky price pill, bottom-right, on products whose options change the
// price - the same pill as the Ražotājs-2 configurator's. It stays on screen
// while options are picked; the figure bounces on every change. Clicking it
// jumps to the add-to-cart / request-offer buttons.
function FloatingPrice({ label, price, targetId }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: scrollBehavior(), block: "center" })}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2.5 rounded-full border-2 border-[color:var(--color-accent)] bg-white px-4 py-2.5 shadow-xl transition-transform hover:-translate-y-0.5 md:bottom-6 sm:right-6 sm:px-5 sm:py-3"
    >
      <span className="hidden text-[12px] font-medium text-muted sm:inline">{label}</span>
      <span
        key={price}
        aria-live="polite"
        className="animate-pulsate text-[17px] font-semibold text-[color:var(--color-accent)] sm:text-[18px]"
      >
        {price}
      </span>
    </button>
  );
}

// One extension-board width with a - n + stepper; 0 means "not wanted".
function ExtenderRow({ label, price, qty, onChange, decreaseLabel, increaseLabel }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex-1 text-[15px] text-ink">{label}</span>
      <span className="shrink-0 font-medium text-[color:var(--color-title)]">{price.toFixed(2)} €</span>
      <div className="flex shrink-0 items-center border border-line">
        <button
          type="button"
          aria-label={`${decreaseLabel}: ${label}`}
          disabled={qty === 0}
          onClick={() => onChange(qty - 1)}
          className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[--color-soft] disabled:opacity-40"
        >
          <Minus size={14} />
        </button>
        <span className="flex h-9 w-9 items-center justify-center text-[14px] text-ink" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          aria-label={`${increaseLabel}: ${label}`}
          onClick={() => onChange(qty + 1)}
          className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[--color-soft]"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// One of four mutually exclusive jamb-finish variants (colour x thickness).
// Selecting one writes it into the "Pieprasīt piedāvājumu" link alongside the
// fulfilment toggles above, the same way ServiceToggleRow's choices do.
function JambFinishRow({ selected, onSelect, label, price }) {
  const labelId = useId();
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-labelledby={labelId}
        onClick={onSelect}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-[color:var(--color-accent)]" : "border-[color:var(--color-muted)]/60"
        }`}
      >
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-accent)]" /> : null}
      </button>
      <span id={labelId} onClick={onSelect} className="flex-1 cursor-pointer text-[15px] text-ink">
        {label}
      </span>
      <span className="shrink-0 font-medium text-[color:var(--color-title)]">{price.toFixed(2)} €</span>
    </div>
  );
}

// The jamb-finish colour picker: a grid of swatches, each selectable (sets
// the accordion's colour choice) and independently zoomable (opens the
// shared lightbox below without changing the selection). The long custom
// catalogue (`scroll`) gets a search box and a name under each swatch.
const foldText = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function JambColorSwatchGrid({ items, jambColor, onSelect, onZoom, label, zoomLabel, searchLabel, emptyLabel, scroll = false }) {
  const [query, setQuery] = useState("");
  const q = foldText(query.trim());
  // Keep each swatch's index in `items` so zoom opens the right photo.
  const shown = items
    .map((sw, index) => ({ sw, index }))
    .filter(({ sw }) => !q || foldText(sw.label).includes(q));
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-3 text-[14px] font-medium text-[color:var(--color-title)]">
        {label}
        {jambColor ? <span className="font-normal text-muted"> - {jambColor}</span> : null}
      </p>
      {scroll ? (
        <label className="relative mb-3 block">
          <span className="sr-only">{searchLabel}</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchLabel}
            className="field w-full !pl-9"
          />
        </label>
      ) : null}
      {scroll && !shown.length ? <p className="py-4 text-[14px] text-muted">{emptyLabel}</p> : null}
      <div
        className={`grid grid-cols-4 gap-2 ${scroll ? "max-h-72 overflow-y-auto pr-1 sm:grid-cols-6" : ""}`}
      >
        {shown.map(({ sw, index }) => (
          <div key={sw.image} className="relative">
            <button
              type="button"
              onClick={() => onSelect(sw.label)}
              aria-pressed={jambColor === sw.label}
              title={sw.label}
              className={`relative block aspect-square w-full overflow-hidden border transition-colors ${
                jambColor === sw.label ? "border-[color:var(--color-accent)] ring-1 ring-[color:var(--color-accent)]" : "border-line"
              }`}
            >
              <Image
                src={sw.image}
                alt={sw.label}
                fill
                {...imageProps(sw.image)}
                loading="lazy"
                sizes="(min-width: 640px) 15vw, 25vw"
                className="bg-[--color-soft] object-contain"
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onZoom(index);
              }}
              aria-label={zoomLabel}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <ZoomIn size={13} />
            </button>
            {scroll ? (
              <p className="mt-1 line-clamp-2 text-[11px] leading-[1.3] text-muted">{sw.label}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* The server page passes the catalogue entry, four similar models as cards,
   and the configurator link (whether this model is one of its series, and the
   colour section to open) - so neither the catalogue nor the configurator's
   data has to ship to the browser. */
export default function ProductClient({ product, similar = [], configurator = null, locks = [], jambColors = [], orderTwin = null }) {
  const { trData, translateColorLabel } = useTr();
  const locale = getLocaleFromPathname(usePathname());
  // Made-to-order Boston models are configured (size, finish, hardware...)
  // and priced from the manufacturer's sheet - see @/lib/boston-config.
  const [bostonSpecData] = useState(() => bostonSpec(product));
  const [bostonConfig, setBostonConfig] = useState(() => (bostonSpecData ? defaultConfig(bostonSpecData) : null));
  const bostonDouble = bostonConfig?.leaf === "double" && bostonSpecData?.doubleImage;
  // Hidden doors: size, hinges, RAL and accessories from the Eirodurvis
  // price list - see @/lib/hidden-config. Announced ("coming soon") stock
  // models get no configurator and cannot be added to the cart.
  const [hiddenSpecData] = useState(() => hiddenSpec(product));
  const [hiddenConfig, setHiddenConfig] = useState(() => (hiddenSpecData ? defaultHiddenConfig(hiddenSpecData) : null));
  const configured = !!(bostonConfig || hiddenConfig);
  const comingSoon = stockKind(product) === "soon";
  const hiddenEdge = hiddenModel(product)?.edge || null;
  const colors = product?.colors || [];
  const interiorSecond = ["Akcenti", "Ielaidums", "Stikls"].find((k) => product?.specs?.[k]);
  const namedColors = !colors.length
    ? null
    : hiddenEdge
      ? [
          [t(locale, "product.leafFinish"), colors[0]],
          colors[1] ? [t(locale, hiddenEdge === "black" ? "product.frameEdgeFinish" : "product.edgeFinish"), colors[1]] : null,
        ].filter(Boolean)
      : product?.category === "ieksdurvis"
        ? [
            [trData(locale, "Tonis"), colors[0]],
            colors[1] ? [trData(locale, interiorSecond || "Akcenti"), colors[1]] : null,
          ].filter(Boolean)
        : null;
  const productImages = product?.images && product.images.length > 0 ? product.images : ["placeholder"];
  // Picking a door-and-a-half puts that version's photo first.
  const images = bostonDouble ? [bostonSpecData.doubleImage, ...productImages] : productImages;
  const isFlatGallery = FLAT_GALLERY_CATEGORIES.includes(product?.category);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const changeBostonConfig = (next) => {
    if (next.leaf !== bostonConfig?.leaf) {
      setActiveIdx(0);
      setSelectedIdx(0);
    }
    setBostonConfig(next);
  };
  const [activeSize, setActiveSize] = useState(product?.sizes?.[0] || "");
  const [activeDirection, setActiveDirection] = useState(product?.directions?.[0] || "");
  // Exact per-size(/side) warehouse count, when the warehouse sync has
  // linked this product to a warehouse code - undefined (not 0) means "no
  // data at all for this product", so the UI stays silent rather than
  // falsely claiming zero stock. But once a product IS linked, a size or
  // direction with no entry of its own genuinely means "none of those" -
  // the PDF/sheet only lists variants that have quantity, so e.g. a
  // left-hinged door with none in stock simply gets no row that week,
  // the same way the admin panel's own breakdown already defaults an
  // absent side to 0 - falling back to 0 here keeps the two views saying
  // the same thing instead of one going silent where the other shows "0".
  // Doors without a `directions` list (interior doors) are keyed by size
  // alone; doors with one are keyed "size|direction" - see stockPdf.js.
  const variantStock =
    activeSize && product?.stockByVariant
      ? (product.stockByVariant[activeDirection ? `${activeSize}|${activeDirection}` : activeSize] ?? 0)
      : undefined;
  const [serviceOptions, setServiceOptions] = useState({
    pickup: false,
    measurement: false,
    deliveryOnly: false,
    installDelivery: false,
  });
  const toggleServiceOption = (key) =>
    setServiceOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  const [jambFinishChoice, setJambFinishChoice] = useState(null);
  const [jambColor, setJambColor] = useState(null);
  const selectJambFinish = (key) =>
    setJambFinishChoice((prev) => {
      const next = prev === key ? null : key;
      const prevRow = JAMB_FINISH_ROWS.find((r) => r.key === prev);
      const nextRow = JAMB_FINISH_ROWS.find((r) => r.key === next);
      if (!nextRow || nextRow.custom !== prevRow?.custom || nextRow.standard !== prevRow?.standard) {
        setJambColor(null);
      }
      return next;
    });
  // Interior doors get extension boards in their own tone instead of the
  // entrance doors' jamb finish.
  const isInterior = product?.category === "ieksdurvis";
  const extenders = isInterior ? extenderOptions(product) : [];
  const [extenderQty, setExtenderQty] = useState({});
  const pickedExtenders = extenders.filter((o) => extenderQty[o.width] > 0);
  const extendersLine = pickedExtenders.length
    ? { tone: product.colors[0], items: Object.fromEntries(pickedExtenders.map((o) => [o.width, extenderQty[o.width]])) }
    : null;
  const jambFinishRow = JAMB_FINISH_ROWS.find((r) => r.key === jambFinishChoice);
  const jambFinishIsCustom = jambFinishRow?.custom;
  const jambFinishIsStandard = jambFinishRow?.standard;
  const selectedServiceCodes = [
    ...Object.entries(serviceOptions).filter(([, on]) => on).map(([key]) => key),
    ...(jambFinishChoice ? [jambFinishChoice] : []),
  ];
  const customJambSwatches = jambColors.map((sw) => ({ image: sw.image, label: trData(locale, sw.label) }));
  const standardJambSwatches = STANDARD_JAMB_COLORS.map((sw) => ({ image: sw.image, label: t(locale, `product.${sw.key}`) }));
  const [jambColorLightbox, setJambColorLightbox] = useState(null);
  const stepJambColorLightbox = (delta) =>
    setJambColorLightbox((state) => {
      if (!state) return state;
      const n = state.items.length;
      return { ...state, index: ((state.index + delta) % n + n) % n };
    });
  useEffect(() => {
    if (!jambColorLightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setJambColorLightbox(null);
      else if (e.key === "ArrowRight") stepJambColorLightbox(1);
      else if (e.key === "ArrowLeft") stepJambColorLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jambColorLightbox]);
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
  const [compared, setCompared] = useState(false);
  // Same bounce 220.lv plays on its own comparison icon when a product is
  // added - see .animate-pulsate in globals.css. Only on add, not on remove.
  const [wishlistPulse, setWishlistPulse] = useState(0);
  const [comparePulse, setComparePulse] = useState(0);
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

  useEffect(() => {
    if (!product?.id) return;
    const sync = () => setCompared(isCompared(product.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("compare:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("compare:change", sync);
    };
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    const line = addToCart(
      bostonConfig
        ? {
            id: product.id,
            size: `${bostonConfig.width}×${bostonConfig.height}`,
            services: selectedServiceCodes,
            jambColor,
            boston: bostonConfig,
          }
        : hiddenConfig
        ? {
            id: product.id,
            size: `${hiddenConfig.width}×${hiddenConfig.height}`,
            services: selectedServiceCodes,
            jambColor,
            hidden: hiddenConfig,
          }
        : {
            id: product.id,
            size: activeSize,
            direction: activeDirection,
            services: selectedServiceCodes,
            jambColor,
            ...(extendersLine ? { extenders: extendersLine } : {}),
          }
    );
    window.dispatchEvent(
      new CustomEvent("cart:added", {
        detail: {
          name: trData(locale, product.name),
          image: images[0] !== "placeholder" ? images[0] : null,
          size: line.size,
          direction: line.direction,
          qty: line.qty,
        },
      })
    );
  };

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "product.notFound")}</div>
      </main>
    );
  }

  const hasOffer = product.oldPrice != null && product.oldPrice > product.price;
  const displayPrice = bostonConfig
    ? priceBoston(bostonSpecData, bostonConfig).total
    : hiddenConfig
      ? priceHidden(hiddenSpecData, hiddenConfig).total
      : product.price + extendersTotal(extendersLine);
  // Options that move the price get the floating total.
  const pricedOptions = !comingSoon && (configured || extenders.length > 0);
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
              {/* A soft studio backdrop behind the photo - a flat white page
                  reads as a spec sheet, a faint gradient + shadow reads as a
                  photographed product. */}
              <div className="relative bg-[--color-soft] p-4 sm:p-8">
                {/* Wishlist / compare: icon-only, over the photo - the same
                    treatment ProductCard gives them on a catalogue tile,
                    instead of two more full-width buttons competing with
                    "Pievienot grozam" below. */}
                <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 sm:right-4 sm:top-4">
                  <button
                    type="button"
                    aria-label={t(locale, "a11y.addWishlist")}
                    aria-pressed={wishlisted}
                    onClick={() => {
                      const next = toggleWishlistId(product.id);
                      if (next.includes(product.id)) setWishlistPulse((k) => k + 1);
                    }}
                    className={`flex h-11 w-11 items-center justify-center bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white ${
                      wishlisted ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
                    }`}
                  >
                    <Heart key={wishlistPulse} size={18} strokeWidth={1.6} fill={wishlisted ? "currentColor" : "none"} className={wishlistPulse ? "animate-pulsate" : ""} />
                  </button>
                  <button
                    type="button"
                    aria-label={t(locale, "compare.title")}
                    aria-pressed={compared}
                    onClick={() => {
                      const next = toggleCompareId(product.id);
                      setCompared(next.includes(product.id));
                      if (next.includes(product.id)) setComparePulse((k) => k + 1);
                    }}
                    className={`flex h-11 w-11 items-center justify-center bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[color:var(--color-accent)] hover:text-white ${
                      compared ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
                    }`}
                  >
                    <Scale key={comparePulse} size={18} strokeWidth={1.6} className={comparePulse ? "animate-pulsate" : ""} />
                  </button>
                </div>

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
                            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
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
              </div>

              {/* Thumbnails under the main image */}
              <div className={`mt-3 grid-cols-5 gap-2 sm:grid-cols-6 ${images.length > 1 ? "grid" : "hidden"}`}>
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`relative group aspect-square overflow-hidden bg-[--color-soft] text-xs text-muted transition-all duration-200 hover:-translate-y-0.5 ${
                      idx === selectedIdx ? "opacity-100 ring-1 ring-[color:var(--color-accent)]" : "opacity-60 hover:opacity-100"
                    }`}
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
                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <span aria-hidden className="h-[2px] w-5 bg-[color:var(--color-accent)]" />
                  {product.collection}
                </div>
                {comingSoon ? (
                  <span className="inline-flex items-center gap-1.5 bg-[color:var(--color-alt)] px-2.5 py-1 text-[11px] font-semibold uppercase leading-none text-black">
                    {t(locale, "product.comingSoonPrice")}
                  </span>
                ) : isInStock(product) || stockKind(product) === "order" ? (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none ${
                      stockKind(product) === "factory"
                        ? "bg-[color:var(--color-stock-factory-soft)] text-[color:var(--color-stock-factory)]"
                        : stockKind(product) === "order"
                          ? "bg-[color:var(--color-stock-order-soft)] text-[color:var(--color-stock-order)]"
                          : "bg-[color:var(--color-stock-soft)] text-[color:var(--color-stock)]"
                    }`}
                  >
                    <span aria-hidden className="relative flex h-1.5 w-1.5">
                      {stockKind(product) !== "order" ? (
                        <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                      ) : null}
                      <span aria-hidden className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    {t(
                      locale,
                      stockKind(product) === "factory"
                        ? "product.inStockFactory"
                        : stockKind(product) === "order"
                          ? "product.toOrder"
                          : "product.inStock"
                    )}
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
              <h1 className="mt-3 text-[30px] font-semibold leading-[1.2] tracking-tight text-[color:var(--color-title)] sm:text-[40px]">
                {productName}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
                {comingSoon ? (
                  <span className="text-[26px] font-semibold leading-none text-[color:var(--color-muted)] sm:text-[30px]">
                    {t(locale, "product.comingSoonPrice")}
                  </span>
                ) : hasOffer ? (
                  <>
                    <span className="text-[32px] font-semibold leading-none text-[color:var(--color-accent)] sm:text-[38px]">
                      {formatPrice(product, displayPrice)}
                    </span>
                    <span className="text-[16px] text-muted line-through">{formatPrice(product, product.oldPrice)}</span>
                    <span className="inline-flex items-center bg-[color:var(--color-accent)] px-2 py-0.5 text-[12px] font-bold leading-none text-white">
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-[32px] font-semibold leading-none text-[color:var(--color-accent)] sm:text-[38px]">
                    {formatPrice(product, displayPrice)}
                  </span>
                )}
              </div>

              {bostonConfig ? (
                <BostonConfigurator spec={bostonSpecData} config={bostonConfig} onChange={changeBostonConfig} locale={locale} />
              ) : null}
              {hiddenConfig ? (
                <HiddenDoorConfigurator spec={hiddenSpecData} config={hiddenConfig} onChange={setHiddenConfig} locale={locale} />
              ) : null}
              {comingSoon ? (
                <div className="mt-6 border-l-2 border-[color:var(--color-alt)] bg-[--color-soft] px-4 py-3.5 text-[14px] leading-relaxed text-ink">
                  <p>{t(locale, "product.comingSoonNote")}</p>
                  {orderTwin ? (
                    <p className="mt-2">
                      {t(locale, "product.comingSoonOrder")}{" "}
                      <Link
                        href={withLocaleHref(locale, paths.product(orderTwin.id))}
                        className="font-semibold text-[color:var(--color-accent)] underline underline-offset-4 hover:text-[color:var(--color-title)]"
                      >
                        {t(locale, "product.comingSoonOrderFrom").replace("{price}", formatPrice(product, orderTwin.price))}
                      </Link>
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Only entrance doors have an outside / inside colour. On a
                  hidden door the two slots are the primed leaf and its
                  aluminium edge (with the frame, on the black models); on an
                  interior door the shade and its accents, inlay or glass -
                  named by the model's own spec row. */}
              {namedColors ? (
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-ink">
                  {namedColors.map(([label, color]) => (
                    <div key={label}>
                      <div className="mb-2 text-sm text-muted">{label}</div>
                      <span className="bg-[--color-soft] px-3 py-1.5">{translateColorLabel(locale, color)}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Colors (display only: exterior / interior) */}
              {product.colors?.length && !namedColors ? (
                <div className="mt-5">
                  <div className="text-sm text-muted mb-2">{t(locale, "product.colorLabel")}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                    <span className="bg-[--color-soft] px-3 py-1.5">{translateColorLabel(locale, product.colors[0])}</span>
                    {product.colors[1] ? (
                      <>
                        <span className="text-muted">/</span>
                        <span className="bg-[--color-soft] px-3 py-1.5">{translateColorLabel(locale, product.colors[1])}</span>
                      </>
                    ) : null}
                    {/* The shade change (configurator / finishes page) covers entrance doors only. */}
                    {product.collection === "BOSTON" || !product.category?.startsWith("ardurvis") ? null : configurator ? (
                      <Link
                        href={withLocaleHref(locale, `${paths.configurator}${configurator.colorQuery}`)}
                        className="px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-accent)] underline underline-offset-4 transition-colors hover:text-[color:var(--color-title)]"
                      >
                        {t(locale, "product.changeShade")}
                      </Link>
                    ) : (
                      <Link
                        href={withLocaleHref(locale, `${paths.finishes}${finishesColorQuery(product)}`)}
                        className="px-3 py-1.5 text-[13px] font-semibold text-[color:var(--color-accent)] underline underline-offset-4 transition-colors hover:text-[color:var(--color-title)]"
                      >
                        {t(locale, "product.changeShade")}
                      </Link>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Sizes */}
              {product.sizes?.length && !configured ? (
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

              {/* Opening direction */}
              {product.directions?.length && !configured ? (
                <div className="mt-5">
                  <label htmlFor="product-direction" className="block text-sm text-muted mb-2">
                    {t(locale, "product.direction")}
                  </label>
                  <select
                    id="product-direction"
                    value={activeDirection}
                    onChange={(e) => setActiveDirection(e.target.value)}
                    className="field max-w-[240px]"
                  >
                    {product.directions.map((d) => (
                      <option key={d} value={d}>
                        {t(locale, d === "right" ? "product.directionRight" : "product.directionLeft")}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Exact warehouse count for the selected size + direction */}
              {variantStock !== undefined ? (
                <p className={`mt-2 text-sm ${variantStock > 0 ? "text-muted" : "text-red-600"}`}>
                  {variantStock > 0
                    ? `${t(locale, "product.stockCountPrefix")}${variantStock}${t(locale, "product.stockCountSuffix")}`
                    : t(locale, "product.stockCountZero")}
                </p>
              ) : null}

              {/* Interior-door extension boards, right under the size they go with. */}
              {extenders.length ? (
                <div className="mt-5 max-w-[440px]">
                  <p className="text-sm text-muted">{t(locale, "product.extenders")}</p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-muted">{t(locale, "product.extendersIntro")}</p>
                  <div className="mt-1 divide-y divide-[--color-line]">
                    {extenders.map((o) => (
                      <ExtenderRow
                        key={o.width}
                        label={t(locale, "product.extenderBoard").replace("{w}", o.width)}
                        price={o.price}
                        qty={extenderQty[o.width] || 0}
                        onChange={(qty) => setExtenderQty((prev) => ({ ...prev, [o.width]: Math.max(0, qty) }))}
                        decreaseLabel={t(locale, "cart.decrease")}
                        increaseLabel={t(locale, "cart.increase")}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Security class */}
              {product.security ? (
                <div className="mt-3 flex items-center gap-2 text-[15px] text-muted">
                  <Shield size={16} />
                  <span>{product.security}</span>
                </div>
              ) : null}

              {/* The specification lives in one table, in the tabs below. */}
              <a
                href={`#${SPECS_ANCHOR}`}
                onClick={() => window.dispatchEvent(new Event(OPEN_SPECS_EVENT))}
                className="mt-2 inline-flex min-h-11 items-center text-[15px] font-medium text-[color:var(--color-accent)] underline underline-offset-4"
              >
                {t(locale, "product.allSpecs")}
              </a>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[--color-line]">
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
                {isInterior ? null : (
                <AccordionItem title={t(locale, "product.jambFinish")}>
                  <p className="mb-3">{t(locale, "product.jambFinishIntro")}</p>
                  <div role="radiogroup" className="divide-y divide-[--color-line]">
                    {JAMB_FINISH_ROWS.map((row) => (
                      <JambFinishRow
                        key={row.key}
                        selected={jambFinishChoice === row.key}
                        onSelect={() => selectJambFinish(row.key)}
                        label={t(locale, `product.${row.key}`)}
                        price={row.price}
                      />
                    ))}
                  </div>
                  {jambFinishIsCustom ? (
                    <JambColorSwatchGrid
                      items={customJambSwatches}
                      jambColor={jambColor}
                      onSelect={setJambColor}
                      onZoom={(index) => setJambColorLightbox({ items: customJambSwatches, index })}
                      label={t(locale, "product.jambFinishColorLabel")}
                      zoomLabel={t(locale, "product.zoomIn")}
                      searchLabel={t(locale, "product.jambColorSearch")}
                      emptyLabel={t(locale, "product.jambColorNone")}
                      scroll
                    />
                  ) : null}
                  {jambFinishIsStandard ? (
                    <JambColorSwatchGrid
                      items={standardJambSwatches}
                      jambColor={jambColor}
                      onSelect={setJambColor}
                      onZoom={(index) => setJambColorLightbox({ items: standardJambSwatches, index })}
                      label={t(locale, "product.jambFinishColorLabel")}
                      zoomLabel={t(locale, "product.zoomIn")}
                    />
                  ) : null}
                </AccordionItem>
                )}
              </div>

              {/* Actions - below the service / jamb choices they include. */}
              <div id="product-actions" className="mt-6 flex flex-wrap gap-3">
                {comingSoon ? null : (
                  <MagneticButton>
                    <button
                      type="button"
                      className="btn btn-accent shadow-[0_4px_16px_rgba(3,119,67,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(3,119,67,0.4)]"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag size={18} />
                      {t(locale, "product.addCart")}
                    </button>
                  </MagneticButton>
                )}
                <Link
                  href={withLocaleHref(
                    locale,
                    `${paths.contacts}?produkts=${encodeURIComponent(product.id)}${
                      bostonConfig || hiddenConfig
                        ? `&konfig=${encodeConfig(bostonConfig || hiddenConfig)}`
                        : `${activeSize ? `&izmers=${encodeURIComponent(activeSize)}` : ""}${
                            activeDirection ? `&virziens=${encodeURIComponent(activeDirection)}` : ""
                          }`
                    }${
                      selectedServiceCodes.length
                        ? `&pakalpojumi=${encodeURIComponent(selectedServiceCodes.join(","))}`
                        : ""
                    }${jambColor ? `&apdareKrasa=${encodeURIComponent(jambColor)}` : ""}${
                      extendersLine
                        ? `&paplatinataji=${encodeURIComponent(
                            Object.entries(extendersLine.items).map(([w, q]) => `${w}:${q}`).join(",")
                          )}`
                        : ""
                    }`
                  )}
                  className={`btn transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${comingSoon ? "btn-accent" : "btn-outline-dark"}`}
                >
                  {t(locale, comingSoon ? "product.notifyMe" : "product.requestOffer")}
                </Link>
              </div>

              {/* What every order can include, right under the buttons. */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-ink">
                <ServiceBadge icon={Ruler} label={t(locale, "product.featureMeasurement")} />
                <ServiceBadge icon={Wrench} label={t(locale, "product.featureInstall")} />
                <ServiceBadge icon={ShieldCheck} label={t(locale, "product.featureWarranty")} />
                <ServiceBadge icon={Truck} label={t(locale, "product.featureDelivery")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {pricedOptions ? (
        <FloatingPrice
          label={t(locale, "product.runningTotal")}
          price={formatPrice(product, displayPrice)}
          targetId="product-actions"
        />
      ) : null}

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

      {jambColorLightbox ? (
        <div
          className="animate-fade-in fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setJambColorLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={jambColorLightbox.items[jambColorLightbox.index].label}
        >
          <button
            type="button"
            onClick={() => setJambColorLightbox(null)}
            aria-label={t(locale, "product.close")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          {jambColorLightbox.items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepJambColorLightbox(-1);
                }}
                aria-label={t(locale, "product.previous")}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={26} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepJambColorLightbox(1);
                }}
                aria-label={t(locale, "product.next")}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-[720px]" onClick={(e) => e.stopPropagation()}>
            <div className="relative mx-auto aspect-square max-h-[76vh] w-auto">
              <Image
                key={jambColorLightbox.items[jambColorLightbox.index].image}
                src={jambColorLightbox.items[jambColorLightbox.index].image}
                alt={jambColorLightbox.items[jambColorLightbox.index].label}
                fill
                {...imageProps(jambColorLightbox.items[jambColorLightbox.index].image)}
                sizes="720px"
                className="animate-fade-in bg-[--color-soft] object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-[14px] text-white">
              {jambColorLightbox.items[jambColorLightbox.index].label}
              {jambColorLightbox.items.length > 1 ? (
                <span className="ml-2 text-white/55">
                  {jambColorLightbox.index + 1} / {jambColorLightbox.items.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </main>
  );
}
