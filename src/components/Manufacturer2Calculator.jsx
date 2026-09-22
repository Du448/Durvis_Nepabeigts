"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react";
import {
  CURRENCY,
  basePurposes,
  baseSizes,
  openingDirections,
  openingSides,
  doorTiers,
  lockSets,
  lockBrandOptions,
  steelThicknessOptions,
  glazingOptions,
  furnitureOptions,
  peepholeOptions,
  additionalOptions,
  casingOptions,
} from "@/data/manufacturer2Calculator";
import { manufacturer2Sections } from "@/data/manufacturer2";
import { getLocaleFromPathname, t, trData } from "@/lib/i18n";

/* Ražotājs-2 door calculator: a from-scratch analog of the manufacturer's own
   calculator (bulat-doors.com.ua/calculator/) — base filters, matching
   product tiers, then a per-tier configurator (locks, hardware colour, leaf
   design/colour outside+inside, frame coating, peephole, extra options).
   Prices are still the manufacturer's own reference figures (see data file);
   the summary is deliberately framed as a request, not a checkout total. */

// These are shown as a checkbox directly under the matching series in the
// leaf-design picker instead, so they're hidden from the general options list.
const SERIES_DESIGN_SURCHARGE_IDS = new Set([
  "series-400-inlay",
  "series-500-molding",
  "series-600-mirror",
  "model-607-tinted-mirror",
  "series-800-3d",
  "series-900-glass",
]);

// Priced automatically from the "Vēršanās virziens" choice instead, so it's
// hidden from the general options list.
const INSIDE_OPENING_OPTION_ID = "inside-opening";

// Stands in for a door photo the manufacturer hasn't shot yet (their own
// calculator shows the same gap) — a plain "coming soon" notice instead of
// pulling in their Ukrainian-language placeholder graphic.
function PhotoPendingPlaceholder({ locale, className = "" }) {
  return (
    <span
      className={`flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-line text-center ${className}`}
    >
      <span className="text-[13px] font-semibold uppercase tracking-wide text-muted">{trData(locale, "Drīzumā")}</span>
    </span>
  );
}

function TierGallery({ images, alt, locale, photoPending }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [touchX, setTouchX] = useState(null);
  const gallery = images && images.length ? images : [];
  const step = (delta) => setIndex((i) => ((i + delta) % gallery.length + gallery.length) % gallery.length);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setZoomOpen(false);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, gallery.length]);

  if (!gallery.length) {
    if (!photoPending) return null;
    return (
      <span className="relative block aspect-[4/5] overflow-hidden bg-[--color-soft]">
        <PhotoPendingPlaceholder locale={locale} />
      </span>
    );
  }
  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`${alt} — ${trData(locale, "palielināt attēlu")}`}
          className="block w-full cursor-zoom-in"
        >
          <span className="relative block aspect-[4/5] overflow-hidden border border-line bg-[--color-soft]">
            <Image src={gallery[index]} alt={alt} fill unoptimized sizes="380px" className="object-contain" />
          </span>
        </button>
        {gallery.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 flex items-center gap-1.5">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}/${gallery.length}`}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i === index ? "bg-[color:var(--color-accent)]" : "bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
      ) : null}

      {zoomOpen ? (
        <div
          className="fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX == null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            setTouchX(null);
            if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label={trData(locale, "Aizvērt")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={trData(locale, "Iepriekšējais")}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={26} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={trData(locale, "Nākamais")}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-[720px]" onClick={(e) => e.stopPropagation()}>
            <span className="relative mx-auto block aspect-[4/5] max-h-[80vh] w-full">
              <Image key={gallery[index]} src={gallery[index]} alt={alt} fill unoptimized sizes="720px" className="object-contain" />
            </span>
            {gallery.length > 1 ? (
              <figcaption className="mt-3 text-center text-[14px] text-white/70">
                {index + 1} / {gallery.length}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </div>
  );
}

// "kale" and "securemme" only match tiers whose lock is exclusively that
// brand — a tier carrying both (e.g. Standarts, Garants) is a "mix" match
// instead, never a match for either brand filtered on its own.
function tierMatchesLockBrand(tier, brandId) {
  const brands = tier.lockBrands || [];
  const hasKale = brands.includes("kale");
  const hasSecuremme = brands.includes("securemme");
  if (brandId === "kale") return hasKale && !hasSecuremme;
  if (brandId === "securemme") return hasSecuremme && !hasKale;
  if (brandId === "mix") return hasKale && hasSecuremme;
  return brands.includes(brandId);
}

function tierMinPrice(tier) {
  return tier.sizes.length ? Math.min(...tier.sizes.map((s) => s.price)) : tier.basePrice;
}

// Tedee (tedee.com) fits any standard European-profile cylinder via a clip-on
// adapter — every cylinder brand in this catalogue (Kale, Securemme, Mottura,
// Abloy) is that profile, so brand alone never rules it out. The one real
// distinction the spec text carries is single vs. dual-cylinder ("tandēma
// sistēma" / "2 cilindri" / "duetu sistēma"): a smart lock only turns one
// knob, so on a tandem setup it covers just one of the two locks. Physical
// clearance (door-frame gap) still has to be confirmed on site per Tedee's
// own install guide — that can't be known from the catalogue data.
function tedeeCylinderCompat(tier) {
  const specLine = (tier.hardwareSpec || []).find((line) => line.startsWith("Cilindrs"));
  if (!specLine) return null;
  const isDualCylinder = /tand[eē]m|duetu|2\s*cilind/i.test(specLine);
  return isDualCylinder
    ? {
        level: "partial",
        label: "Tedee — der 1 no 2 cilindriem",
        note:
          "Šai sērijai ir divi atsevišķi cilindri (tandēma sistēma). Tedee var uzstādīt uz viena no tiem ar adapteri — otrs paliek ar atslēgu. Galīgā piemērotība (durvju rāmja atstarpe) jāapstiprina uzstādot.",
      }
    : {
        level: "yes",
        label: "Tedee — der šai sērijai",
        note:
          "Standarta Eiropas profila cilindrs — Tedee uzstāda ar klipša adapteri, cilindru mainīt nevajag. Galīgā piemērotība (durvju rāmja atstarpe) jāapstiprina uzstādot.",
      };
}

const ALL_TIER_PRICES = doorTiers.map(tierMinPrice);
const PRICE_BOUNDS = { min: Math.min(...ALL_TIER_PRICES), max: Math.max(...ALL_TIER_PRICES) };

// Smallest opening the manufacturer will build a custom-size door for.
const CUSTOM_SIZE_MIN = { w: 760, h: 1850 };

// Mirrors baseSizes, mapping each entry to a dropdown option id — fixed
// sizes use their width in mm, "Individuāls izmērs" uses "custom" and
// matches tiers via `customSizeSupported` (see matchingTiers below).
const sizeFilterOptions = baseSizes.map((s) => ({ id: s.w ? String(s.w) : "custom", label: s.label }));

function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// Closes an open dropdown filter on an outside click/tap or Escape.
function useCloseOnOutside(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

// One dropdown filter button (lock brand, steel thickness, glazing, opening
// direction) — a closed trigger showing the label + active count, opening a
// checkbox panel for a multi-select "OR within the group" filter.
function FilterDropdown({ label, options, selected, onToggle, onClear, locale }) {
  const [open, setOpen] = useState(false);
  const ref = useCloseOnOutside(open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 border px-3 py-2 text-[13px] font-medium transition-colors ${
          selected.size
            ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
            : "border-line text-ink hover:border-[color:var(--color-accent)]"
        }`}
      >
        {trData(locale, label)}
        {selected.size ? (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[color:var(--color-accent)] px-1 text-[10px] font-semibold text-white">
            {selected.size}
          </span>
        ) : null}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[220px] border border-line bg-white p-3 shadow-lg">
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-[13px] text-ink">
                <input type="checkbox" checked={selected.has(opt.id)} onChange={() => onToggle(opt.id)} />
                {trData(locale, opt.label)}
              </label>
            ))}
          </div>
          {selected.size ? (
            <button
              type="button"
              onClick={onClear}
              className="mt-3 text-[12px] font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              {trData(locale, "Notīrīt")}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Dropdown filter for the min/max price range — same trigger shape as
// FilterDropdown, but the panel holds the two range sliders instead of
// checkboxes.
function PriceRangeDropdown({ min, max, bounds, onChangeMin, onChangeMax, locale }) {
  const [open, setOpen] = useState(false);
  const ref = useCloseOnOutside(open, () => setOpen(false));
  const active = min !== bounds.min || max !== bounds.max;
  const span = Math.max(1, bounds.max - bounds.min);
  const fillLeft = ((min - bounds.min) / span) * 100;
  const fillRight = ((bounds.max - max) / span) * 100;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 border px-3 py-2 text-[13px] font-medium transition-colors ${
          active ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]" : "border-line text-ink hover:border-[color:var(--color-accent)]"
        }`}
      >
        {trData(locale, "Cena")}
        {active ? (
          <span className="whitespace-nowrap text-[12px] font-medium">
            <Money value={min} /> – <Money value={max} />
          </span>
        ) : null}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-1 w-[260px] border border-line bg-white p-4 shadow-lg">
          <span className="mb-3 block text-[13px] font-medium text-ink">
            <Money value={min} /> – <Money value={max} />
          </span>
          <div className="range-dual">
            <span className="range-dual-track" />
            <span className="range-dual-fill" style={{ left: `${fillLeft}%`, right: `${fillRight}%` }} />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={5}
              value={min}
              onChange={(e) => onChangeMin(Math.min(Number(e.target.value), max))}
              aria-label={trData(locale, "Cena no")}
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={5}
              value={max}
              onChange={(e) => onChangeMax(Math.max(Number(e.target.value), min))}
              aria-label={trData(locale, "Cena līdz")}
            />
          </div>
          {active ? (
            <button
              type="button"
              onClick={() => {
                onChangeMin(bounds.min);
                onChangeMax(bounds.max);
              }}
              className="mt-3 text-[12px] font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              {trData(locale, "Notīrīt")}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Individual (non-standard) size pricing: width(m) x height(m) x price-per-m2,
// e.g. Garant sērija 1050x2150mm => 1.05 x 2.15 x 640 = 1444.80 EUR.
function customSizePrice(widthMm, heightMm, sqmPrice) {
  const w = Number(widthMm) || 0;
  const h = Number(heightMm) || 0;
  return Math.round((w / 1000) * (h / 1000) * sqmPrice * 100) / 100;
}

function Money({ value }) {
  return (
    <span>
      {value.toLocaleString("lv-LV")} {CURRENCY}
    </span>
  );
}

// auto-fill + minmax sizes columns to the ACTUAL container width rather than
// the viewport (unlike grid-cols-N sm:/lg: breakpoints) — this grid sits
// inside layouts whose width varies independently of the viewport (e.g. two
// FilmPickers side by side), so a viewport breakpoint alone under-sizes each
// column there and wraps multi-word labels into overlapping rows.
// The label sits in a fixed-height slot so a longer caption on one swatch
// never pushes its image out of line with the rest of the row. Clicking the
// image opens a full-size preview; picking a swatch is a separate checkbox
// so the two actions (look closer vs. choose) don't collide on one click.
function SwatchGrid({
  items,
  selected,
  onSelect,
  allowDeselect = false,
  columns = "grid-cols-[repeat(auto-fill,minmax(84px,1fr))]",
  locale,
}) {
  const [zoomIndex, setZoomIndex] = useState(null);
  const [touchX, setTouchX] = useState(null);
  const zoomItem = zoomIndex !== null ? items[zoomIndex] : null;

  const step = useCallback(
    (delta) => {
      setZoomIndex((i) => {
        if (i === null) return i;
        const n = items.length;
        return ((i + delta) % n + n) % n;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (zoomIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setZoomIndex(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIndex, step]);

  return (
    <>
      <div className={`grid ${columns} gap-x-3 gap-y-4`}>
        {items.map((item, index) => {
          const isActive = selected === item.image;
          return (
            <div key={`${item.image}-${index}`} className="block min-w-0 text-left">
              <span className="relative block">
                <button
                  type="button"
                  onClick={() => setZoomIndex(index)}
                  aria-label={`${trData(locale, item.label)} — ${trData(locale, "palielināt attēlu")}`}
                  className="group block w-full text-left"
                >
                  <span
                    className={`relative block aspect-square overflow-hidden border-2 bg-white ${
                      isActive ? "border-[color:var(--color-accent)]" : "border-line"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={trData(locale, item.label)}
                      fill
                      unoptimized
                      loading="lazy"
                      sizes="140px"
                      className="object-contain"
                    />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(isActive && allowDeselect ? null : item)}
                  aria-pressed={isActive}
                  aria-label={`${trData(locale, item.label)} — ${trData(locale, "atzīmēt kā izvēlēto")}`}
                  className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center border-2 ${
                    isActive ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]" : "border-line bg-white"
                  }`}
                >
                  {isActive ? <Check size={13} className="text-white" /> : null}
                </button>
              </span>
              <span
                className={`mt-1.5 block min-h-[2.6em] break-words text-[12px] leading-snug ${
                  isActive ? "font-semibold text-[color:var(--color-accent)]" : "text-ink"
                }`}
              >
                {trData(locale, item.label)}
              </span>
            </div>
          );
        })}
      </div>

      {zoomItem ? (
        <div
          className="fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={trData(locale, zoomItem.label)}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX == null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            setTouchX(null);
            if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            onClick={() => setZoomIndex(null)}
            aria-label={trData(locale, "Aizvērt")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={trData(locale, "Iepriekšējais")}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={26} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={trData(locale, "Nākamais")}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <span className="relative mx-auto block aspect-square max-h-[76vh] w-full">
              <Image key={zoomItem.image} src={zoomItem.image} alt={trData(locale, zoomItem.label)} fill unoptimized sizes="480px" className="object-contain" />
            </span>
            <figcaption className="mt-3 text-center text-[14px] text-white">
              {trData(locale, zoomItem.label)}
              {items.length > 1 ? (
                <span className="ml-2 text-white/55">
                  {zoomIndex + 1} / {items.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

function seriesOptionLabel(locale, g) {
  const title = trData(locale, g.title);
  if (g.included) return `${title} — ${trData(locale, "iekļauta")}`;
  if (g.surchargeOptionId) {
    const opt = additionalOptions.find((o) => o.id === g.surchargeOptionId);
    return opt ? `${title} — +${opt.price} ${CURRENCY}` : title;
  }
  return `${title} — ${trData(locale, "cena pēc pieprasījuma")}`;
}

function DesignPicker({ label, groups, seriesTitle, onSeriesChange, designImage, onDesignChange, includedExtras = [], locale }) {
  const [search, setSearch] = useState("");
  const group = groups.find((g) => g.title === seriesTitle) || groups[0];
  const query = search.trim().toLowerCase();
  const items = query ? groups.flatMap((g) => g.items).filter((item) => item.label.toLowerCase().includes(query)) : group.items;
  const surchargeOpt = group.surchargeOptionId ? additionalOptions.find((o) => o.id === group.surchargeOptionId) : null;
  const surchargeIncludedInTier = surchargeOpt ? includedExtras.includes(surchargeOpt.id) : false;
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="t-widget text-[color:var(--color-title)]">{label}</h4>
        <select
          value={group.title}
          onChange={(e) => onSeriesChange(e.target.value)}
          disabled={!!query}
          className="border border-line bg-white px-3 py-1.5 text-[13px] disabled:opacity-50"
        >
          {groups.map((g) => (
            <option key={g.title} value={g.title}>
              {seriesOptionLabel(locale, g)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2">
        {group.included ? (
          <span className="inline-block border border-green-700 bg-green-50 px-2 py-0.5 text-[12px] font-semibold text-green-700">
            {trData(locale, "Iekļauts pamatcenā")}
          </span>
        ) : surchargeOpt ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block border border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 px-2 py-0.5 text-[12px] font-semibold text-[color:var(--color-accent)]">
              +<Money value={surchargeOpt.price} /> {trData(locale, "piemaksa (viena puse)")}
            </span>
            {surchargeIncludedInTier ? (
              <span className="text-[12px] font-medium text-green-700">{trData(locale, "Jau iekļauts standartā")}</span>
            ) : null}
          </div>
        ) : (
          <span className="inline-block border border-line bg-neutral-50 px-2 py-0.5 text-[12px] font-medium text-muted">
            {trData(locale, "Cena pēc pieprasījuma")}
          </span>
        )}
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={trData(locale, "Meklēt pēc modeļa numura...")}
        className="mt-3 w-full border border-line bg-white px-3 py-1.5 text-[13px]"
      />
      <div className="mt-4">
        {items.length ? (
          <SwatchGrid items={items} selected={designImage} onSelect={onDesignChange} allowDeselect locale={locale} />
        ) : (
          <p className="text-[13px] text-muted">{trData(locale, "Nekas netika atrasts.")}</p>
        )}
      </div>
    </div>
  );
}

function FilmPicker({ label, groups, groupTitle, onGroupChange, filmImage, onFilmChange, locale }) {
  const [search, setSearch] = useState("");
  const group = groups.find((g) => g.title === groupTitle) || groups[0];
  const query = search.trim().toLowerCase();
  const items = query ? groups.flatMap((g) => g.items).filter((item) => item.label.toLowerCase().includes(query)) : group.items;
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="t-widget text-[color:var(--color-title)]">{label}</h4>
        {groups.length > 1 ? (
          <select
            value={group.title}
            onChange={(e) => {
              const g = groups.find((x) => x.title === e.target.value);
              onGroupChange(e.target.value);
              onFilmChange(g.items[0]);
            }}
            disabled={!!query}
            className="border border-line bg-white px-3 py-1.5 text-[13px] disabled:opacity-50"
          >
            {groups.map((g) => (
              <option key={g.title} value={g.title}>
                {trData(locale, g.title)}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={trData(locale, "Meklēt pēc krāsas nosaukuma vai numura...")}
        className="mt-3 w-full border border-line bg-white px-3 py-1.5 text-[13px]"
      />
      <div className="mt-4 max-h-[340px] overflow-y-auto pr-1">
        {items.length ? (
          <SwatchGrid items={items} selected={filmImage} onSelect={onFilmChange} locale={locale} />
        ) : (
          <p className="text-[13px] text-muted">{trData(locale, "Nekas netika atrasts.")}</p>
        )}
      </div>
    </div>
  );
}

// Small "?" popover for a fulfilment toggle — closes on an outside
// click/tap or Escape, same pattern as InfoPopoverButton below.
function ToggleHint({ text, locale }) {
  const [open, setOpen] = useState(false);
  const ref = useCloseOnOutside(open, () => setOpen(false));
  return (
    <span className="relative inline-block shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-line bg-white text-[11px] font-semibold leading-none text-muted hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
      >
        ?
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-[220px] border border-line bg-white p-3 text-left text-[12px] font-normal leading-[1.6] text-ink shadow-lg">
          {trData(locale, text)}
        </div>
      ) : null}
    </span>
  );
}

// One fulfilment choice (pickup / measurement / delivery-only /
// install+delivery) in the "Montāža un piegāde" section — mirrors the same
// toggle used on the product page so the two read as one design.
function ServiceToggleRow({ checked, onChange, label, hint, locale }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 py-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
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
      <span className="flex-1 text-[14px] text-ink">{trData(locale, label)}</span>
      {hint ? <ToggleHint text={hint} locale={locale} /> : null}
    </label>
  );
}

// Collapsed by default — each configurator step (locks onward) can be
// expanded on demand instead of forcing one long scroll of open panels.
function CollapsibleSection({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-line bg-white p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-start justify-between gap-3 text-left">
        <span>
          <span className="t-widget block text-[color:var(--color-title)]">{title}</span>
          {subtitle ? <span className="mt-1 block text-[12px] text-muted">{subtitle}</span> : null}
        </span>
        <ChevronDown size={18} className={`mt-0.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

// Small "i" button next to a peephole/lock option that reveals its spec
// blurb in a floating panel — closes the same way the filter dropdowns do
// (outside click / Escape), so it reads as one consistent popup pattern on
// the page. Some callers nest this inside a <label> (the lock checkboxes),
// so the click also calls preventDefault to stop the label from toggling
// its checkbox when the "i" is what was actually clicked.
function InfoPopoverButton({ description, locale }) {
  const [open, setOpen] = useState(false);
  const ref = useCloseOnOutside(open, () => setOpen(false));
  if (!description) return null;
  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={trData(locale, "Vairāk informācijas")}
        aria-expanded={open}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-white text-[11px] font-semibold leading-none text-muted hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
      >
        i
      </button>
      {open ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-30 mt-2 w-[240px] -translate-x-1/2 border border-line bg-white p-3 text-left text-[12px] font-normal leading-[1.6] text-ink shadow-lg"
        >
          {trData(locale, description)}
        </div>
      ) : null}
    </span>
  );
}

// Shared state for a picker whose cards each open a full manufacturer photo
// gallery (peephole options, smart-lock hardware) — tracks which item's
// gallery is open and the current slide, with arrow-key navigation.
function useGalleryZoom(items) {
  const [zoomId, setZoomId] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const zoomItem = items.find((o) => o.id === zoomId) || null;
  const gallery = zoomItem ? zoomItem.images || (zoomItem.image ? [zoomItem.image] : []) : [];

  const stepZoom = useCallback(
    (delta) => setZoomIndex((i) => ((i + delta) % gallery.length + gallery.length) % gallery.length),
    [gallery.length]
  );
  const openZoom = useCallback((id) => {
    setZoomIndex(0);
    setZoomId(id);
  }, []);
  const closeZoom = useCallback(() => setZoomId(null), []);

  useEffect(() => {
    if (!zoomItem) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeZoom();
      else if (e.key === "ArrowRight") stepZoom(1);
      else if (e.key === "ArrowLeft") stepZoom(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomItem, stepZoom, closeZoom]);

  return { zoomItem, gallery, zoomIndex, openZoom, closeZoom, stepZoom };
}

// Full-screen photo viewer for a useGalleryZoom() gallery — prev/next when
// there's more than one image, same visual language as TierGallery's zoom.
function GalleryZoomOverlay({ item, gallery, index, onStep, onClose, locale }) {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={trData(locale, item.name)}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={trData(locale, "Aizvērt")}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
      >
        <X size={20} />
      </button>

      {gallery.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            aria-label={trData(locale, "Iepriekšējais")}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-6 sm:h-14 sm:w-14"
          >
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            aria-label={trData(locale, "Nākamais")}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-6 sm:h-14 sm:w-14"
          >
            <ChevronRight size={26} strokeWidth={1.5} />
          </button>
        </>
      ) : null}

      <figure className="max-h-full w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
        <span className="relative mx-auto block aspect-square max-h-[76vh] w-full">
          <Image key={gallery[index]} src={gallery[index]} alt={trData(locale, item.name)} fill unoptimized sizes="480px" className="object-contain" />
        </span>
        <figcaption className="mt-3 text-center text-[14px] text-white">
          {trData(locale, item.name)}
          {gallery.length > 1 ? (
            <span className="ml-2 text-white/55">
              {index + 1} / {gallery.length}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </div>
  );
}

// A small photo thumbnail shared by the peephole cards and lock cards — click
// to open the full gallery, with a count badge when there's more than one
// shot. `onOpen` gets its own click handling so it works both as a bare
// button (peephole) and nested inside a <label> (lock checkboxes).
function GalleryThumbButton({ item, onOpen, className, imgClassName, imgSizes = "150px" }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpen(item.id);
      }}
      aria-label={item.zoomLabel}
      className={className}
    >
      <Image src={item.image} alt={item.zoomLabel} fill unoptimized sizes={imgSizes} className={imgClassName} />
      {item.images?.length > 1 ? (
        <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {item.images.length}
        </span>
      ) : null}
    </button>
  );
}

// Peephole ("Skata acs") picker — a small card per option with its own photo
// (click to zoom into the full manufacturer gallery) and, for the Yale smart
// viewers, an "i" popup with the manufacturer's spec blurb.
function PeepholePicker({ options, selectedId, onSelect, locale }) {
  const { zoomItem, gallery, zoomIndex, openZoom, closeZoom, stepZoom } = useGalleryZoom(options);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {options.map((p) => {
          const isActive = selectedId === p.id;
          return (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(p.id);
                }
              }}
              className={`flex w-[152px] cursor-pointer flex-col gap-2 border p-3 text-[13px] font-medium ${
                isActive
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
                  : "border-line hover:border-[color:var(--color-accent)]"
              }`}
            >
              {p.image ? (
                <GalleryThumbButton
                  item={{ ...p, zoomLabel: `${trData(locale, p.name)} — ${trData(locale, "palielināt attēlu")}` }}
                  onOpen={openZoom}
                  className="relative block aspect-square w-full cursor-zoom-in overflow-hidden border border-line bg-white"
                  imgClassName="object-contain p-2"
                />
              ) : null}
              <span className="flex items-start justify-between gap-2">
                <span className={isActive ? "text-[color:var(--color-accent)]" : "text-ink"}>
                  {trData(locale, p.name)}
                  {p.price ? (
                    <>
                      {" "}
                      +<Money value={p.price} />
                    </>
                  ) : null}
                </span>
                <InfoPopoverButton description={p.description} locale={locale} />
              </span>
            </div>
          );
        })}
      </div>

      <GalleryZoomOverlay item={zoomItem} gallery={gallery} index={zoomIndex} onStep={stepZoom} onClose={closeZoom} locale={locale} />
    </>
  );
}

// Small pill next to a lock option showing whether it fits this tier's
// cylinder (see tedeeCylinderCompat) — green "fits" or amber "fits one of
// two", with an "i" popup carrying the full explanation.
function CompatBadge({ compat, locale }) {
  if (!compat) return null;
  const tone =
    compat.level === "yes" ? "border-green-700 bg-green-50 text-green-700" : "border-amber-600 bg-amber-50 text-amber-700";
  return (
    <span className={`mt-1.5 flex w-fit items-center gap-1.5 border px-1.5 py-0.5 text-[11px] font-semibold leading-none ${tone}`}>
      {trData(locale, compat.label)}
      <InfoPopoverButton description={compat.note} locale={locale} />
    </span>
  );
}

// Lock/cylinder upgrade grid ("Papildu opcija maiņai") — same checkbox-card
// layout as before, now with a clickable photo (full gallery for the Tedee
// smart-lock hardware), an "i" spec popup where a description is set, and
// (via `compatById`) a per-tier cylinder-fit badge for specific lock ids.
function LockOptionsGrid({ lockSet, includedIds, checkedIds, onToggle, locale, compatById }) {
  const sorted = useMemo(
    () => [...lockSet].sort((a, b) => includedIds.includes(b.id) - includedIds.includes(a.id)),
    [lockSet, includedIds]
  );
  const { zoomItem, gallery, zoomIndex, openZoom, closeZoom, stepZoom } = useGalleryZoom(sorted);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((lock) => {
          const isIncluded = includedIds.includes(lock.id);
          const isChecked = isIncluded || checkedIds.has(lock.id);
          return (
            <label
              key={lock.id}
              className={`block border p-3 text-left text-[13px] ${isIncluded ? "cursor-default" : "cursor-pointer"} ${
                isChecked ? "border-[color:var(--color-accent)]" : "border-line hover:border-[color:var(--color-accent)]"
              }`}
            >
              <span className="mb-2 flex items-start justify-between gap-2">
                <input type="checkbox" checked={isChecked} disabled={isIncluded} onChange={() => onToggle(lock.id)} />
                <InfoPopoverButton description={lock.description} locale={locale} />
              </span>
              {lock.image ? (
                <GalleryThumbButton
                  item={{ ...lock, zoomLabel: `${trData(locale, lock.name)} — ${trData(locale, "palielināt attēlu")}` }}
                  onOpen={openZoom}
                  className="relative mb-2 block aspect-square w-full cursor-zoom-in overflow-hidden bg-[--color-soft]"
                  imgClassName="object-contain"
                  imgSizes="120px"
                />
              ) : null}
              <span className="block font-medium text-ink">{trData(locale, lock.name)}</span>
              {isIncluded ? (
                <span className="font-semibold text-green-700">{trData(locale, "Jau iekļauts standartā")}</span>
              ) : (
                <span className="text-[color:var(--color-accent)]">
                  +<Money value={lock.price} />
                </span>
              )}
              <CompatBadge compat={compatById?.[lock.id]} locale={locale} />
            </label>
          );
        })}
      </div>

      <GalleryZoomOverlay item={zoomItem} gallery={gallery} index={zoomIndex} onStep={stepZoom} onClose={closeZoom} locale={locale} />
    </>
  );
}

export default function Manufacturer2Calculator() {
  const locale = getLocaleFromPathname(usePathname());
  const [step, setStep] = useState("results");

  const [filterPurpose, setFilterPurpose] = useState(new Set());
  const [filterSize, setFilterSize] = useState(new Set());
  const [filterLockBrand, setFilterLockBrand] = useState(new Set());
  const [filterThickness, setFilterThickness] = useState(new Set());
  const [filterGlazing, setFilterGlazing] = useState(new Set());
  const [filterInsideOpeningOnly, setFilterInsideOpeningOnly] = useState(false);
  const [filterPriceMin, setFilterPriceMin] = useState(PRICE_BOUNDS.min);
  const [filterPriceMax, setFilterPriceMax] = useState(PRICE_BOUNDS.max);

  const [selectedTierId, setSelectedTierId] = useState(null);

  const dizainsSection = manufacturer2Sections.find((s) => s.key === "dizains");
  const krasasSection = manufacturer2Sections.find((s) => s.key === "krasas");
  const ralSection = manufacturer2Sections.find((s) => s.key === "ral");

  const selectedTier = doorTiers.find((t) => t.id === selectedTierId) || null;

  const filmGroupsForTier = useMemo(() => {
    if (!selectedTier) return krasasSection.groups;
    return selectedTier.target === "house"
      ? krasasSection.groups.filter((g) => g.title.includes("ielas"))
      : krasasSection.groups.filter((g) => g.title.includes("dzīvoklī"));
  }, [selectedTier, krasasSection]);

  const [config, setConfig] = useState(null);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const resetFilters = () => {
    setFilterPurpose(new Set());
    setFilterSize(new Set());
    setFilterLockBrand(new Set());
    setFilterThickness(new Set());
    setFilterGlazing(new Set());
    setFilterInsideOpeningOnly(false);
    setFilterPriceMin(PRICE_BOUNDS.min);
    setFilterPriceMax(PRICE_BOUNDS.max);
  };

  const matchingTiers = useMemo(() => {
    return doorTiers.filter((tier) => {
      if (filterPurpose.size && !filterPurpose.has(tier.target)) return false;
      if (filterSize.size) {
        const wantsCustom = filterSize.has("custom");
        const wantsFixed = [...filterSize].some((v) => v !== "custom");
        const hasFixedMatch = tier.sizes.some((s) => filterSize.has(String(s.w)));
        const hasCustomMatch = wantsCustom && tier.customSizeSupported;
        if (!(hasFixedMatch || hasCustomMatch)) return false;
        if (wantsFixed && !hasFixedMatch && !hasCustomMatch) return false;
      }
      if (filterLockBrand.size) {
        if (![...filterLockBrand].some((b) => tierMatchesLockBrand(tier, b))) return false;
      }
      if (filterThickness.size && !filterThickness.has(tier.steelThickness)) return false;
      if (filterGlazing.size) {
        const wants = [...filterGlazing];
        const matchesWith = wants.includes("with") && tier.hasGlazing;
        const matchesWithout = wants.includes("without") && !tier.hasGlazing;
        if (!matchesWith && !matchesWithout) return false;
      }
      if (filterInsideOpeningOnly && !tier.canOpenInside) return false;
      const minPrice = tierMinPrice(tier);
      if (minPrice < filterPriceMin || minPrice > filterPriceMax) return false;
      return true;
    });
  }, [
    filterPurpose,
    filterSize,
    filterLockBrand,
    filterThickness,
    filterGlazing,
    filterInsideOpeningOnly,
    filterPriceMin,
    filterPriceMax,
  ]);

  const anyFilterActive =
    filterPurpose.size > 0 ||
    filterSize.size > 0 ||
    filterLockBrand.size > 0 ||
    filterThickness.size > 0 ||
    filterGlazing.size > 0 ||
    filterInsideOpeningOnly ||
    filterPriceMin !== PRICE_BOUNDS.min ||
    filterPriceMax !== PRICE_BOUNDS.max;

  const startConfiguring = (tier) => {
    const defaultFilm = filmGroupsForTierFor(tier).groups[0].items[0];
    const defaultRalGroup = ralSection.groups[0];
    const included = tier.includedExtras || [];
    const lockSetIds = new Set((lockSets[tier.lockSet] || []).map((l) => l.id));
    const extraOptionIds = new Set([...additionalOptions, ...casingOptions].map((o) => o.id));
    setSelectedTierId(tier.id);
    setConfig({
      sizeMode: "fixed",
      size: tier.sizes[0] || { w: null, h: null, price: tier.basePrice || 0 },
      customWidth: tier.sizes[0]?.w || 900,
      customHeight: tier.sizes[0]?.h || 2050,
      openingDirection: tier.canOpenOutside ? "outside" : "inside",
      openingSide: "left",
      lockIds: new Set(included.filter((id) => lockSetIds.has(id))),
      furnitureId: "black-matte",
      outerSeriesTitle: dizainsSection.groups[0].title,
      outerDesign: null,
      innerSeriesTitle: dizainsSection.groups[0].title,
      innerDesign: null,
      outerFilmGroupTitle: filmGroupsForTierFor(tier).groups[0].title,
      outerFilm: defaultFilm,
      innerFilmGroupTitle: filmGroupsForTierFor(tier).groups[0].title,
      innerFilm: defaultFilm,
      frameGroupTitle: defaultRalGroup.title,
      frameSwatch: defaultRalGroup.items[0],
      peepholeId: tier.peepholeDefault || "standard",
      extraOptions: new Set(included.filter((id) => extraOptionIds.has(id))),
      serviceOptions: { pickup: false, measurement: false, deliveryOnly: false, installDelivery: false },
    });
    setStep("configure");
  };

  function filmGroupsForTierFor(tier) {
    return {
      groups:
        tier.target === "house"
          ? krasasSection.groups.filter((g) => g.title.includes("ielas"))
          : krasasSection.groups.filter((g) => g.title.includes("dzīvoklī")),
    };
  }

  // Itemised so the on-screen total and the downloadable PDF always agree —
  // both are just a sum over this same list, never two parallel calculations.
  const priceBreakdown = useMemo(() => {
    if (!selectedTier || !config) return [];
    const included = selectedTier.includedExtras || [];
    const lines = [];
    lines.push({
      label:
        config.sizeMode === "custom" && selectedTier.customSizeSupported
          ? "Individuāls izmērs"
          : "Bāzes cena",
      price:
        config.sizeMode === "custom" && selectedTier.customSizeSupported
          ? customSizePrice(config.customWidth, config.customHeight, selectedTier.sqmPrice)
          : (config.size?.price ?? selectedTier.basePrice ?? 0),
    });
    const lockSet = lockSets[selectedTier.lockSet] || [];
    for (const lockId of config.lockIds) {
      if (included.includes(lockId)) continue;
      const lock = lockSet.find((l) => l.id === lockId);
      if (lock) lines.push({ label: lock.name, price: lock.price });
    }
    const peephole = peepholeOptions.find((p) => p.id === config.peepholeId);
    if (peephole && peephole.price) lines.push({ label: peephole.name, price: peephole.price });
    if (config.openingDirection === "inside" && !included.includes(INSIDE_OPENING_OPTION_ID)) {
      const insideOpening = additionalOptions.find((o) => o.id === INSIDE_OPENING_OPTION_ID);
      if (insideOpening) lines.push({ label: insideOpening.name, price: insideOpening.price });
    }
    // Design-series surcharges (e.g. 400/500/600 series) apply per side — each
    // of outer/inner leaf design independently adds its series' surcharge.
    for (const seriesTitle of [config.outerSeriesTitle, config.innerSeriesTitle]) {
      const group = dizainsSection.groups.find((g) => g.title === seriesTitle);
      if (!group?.surchargeOptionId || included.includes(group.surchargeOptionId)) continue;
      const surcharge = additionalOptions.find((o) => o.id === group.surchargeOptionId);
      if (surcharge) lines.push({ label: surcharge.name, price: surcharge.price });
    }
    for (const optId of config.extraOptions) {
      if (included.includes(optId)) continue;
      const opt = additionalOptions.find((o) => o.id === optId) || casingOptions.find((o) => o.id === optId);
      if (opt) lines.push({ label: opt.name, price: opt.price });
    }
    return lines;
  }, [selectedTier, config]);

  const total = useMemo(() => priceBreakdown.reduce((sum, line) => sum + line.price, 0), [priceBreakdown]);

  /* Matching tiers, filtered live by the dropdown row below */
  if (step === "results") {
    return (
      <div className="container py-12 lg:py-16">
        <div className="max-w-[760px]">
          <h2 className="t-section">{trData(locale, "INDIVIDUĀLO PASŪTĪJUMU APRĒĶINĀŠANAS KALKULATORS")}</h2>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          {matchingTiers.length} {trData(locale, "sērijas")}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <FilterDropdown
            label="Durvju pielietojums"
            options={basePurposes}
            selected={filterPurpose}
            onToggle={(id) => setFilterPurpose((s) => toggleInSet(s, id))}
            onClear={() => setFilterPurpose(new Set())}
            locale={locale}
          />
          <FilterDropdown
            label="Vēlamais izmērs"
            options={sizeFilterOptions}
            selected={filterSize}
            onToggle={(id) => setFilterSize((s) => toggleInSet(s, id))}
            onClear={() => setFilterSize(new Set())}
            locale={locale}
          />
          <FilterDropdown
            label="Slēdzenes veids"
            options={lockBrandOptions}
            selected={filterLockBrand}
            onToggle={(id) => setFilterLockBrand((s) => toggleInSet(s, id))}
            onClear={() => setFilterLockBrand(new Set())}
            locale={locale}
          />
          <FilterDropdown
            label="Tērauda biezums"
            options={steelThicknessOptions}
            selected={filterThickness}
            onToggle={(id) => setFilterThickness((s) => toggleInSet(s, id))}
            onClear={() => setFilterThickness(new Set())}
            locale={locale}
          />
          <FilterDropdown
            label="Stiklojums"
            options={glazingOptions}
            selected={filterGlazing}
            onToggle={(id) => setFilterGlazing((s) => toggleInSet(s, id))}
            onClear={() => setFilterGlazing(new Set())}
            locale={locale}
          />
          <PriceRangeDropdown
            min={filterPriceMin}
            max={filterPriceMax}
            bounds={PRICE_BOUNDS}
            onChangeMin={setFilterPriceMin}
            onChangeMax={setFilterPriceMax}
            locale={locale}
          />

          <label className="flex items-center gap-2 border border-line px-3 py-2 text-[13px] font-medium text-ink">
            <input
              type="checkbox"
              checked={filterInsideOpeningOnly}
              onChange={(e) => setFilterInsideOpeningOnly(e.target.checked)}
            />
            {trData(locale, "Atbalsta vēršanos uz iekšu")}
          </label>

          {anyFilterActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[13px] font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              {trData(locale, "Notīrīt visus filtrus")}
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {matchingTiers.map((tier) => {
            const minPrice = tier.sizes.length ? Math.min(...tier.sizes.map((s) => s.price)) : tier.basePrice;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => startConfiguring(tier)}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:shadow-lg"
              >
                <span className="relative block aspect-square overflow-hidden bg-[--color-soft] p-3">
                  {tier.photoPending ? (
                    <PhotoPendingPlaceholder locale={locale} />
                  ) : (
                    <Image
                      src={tier.image}
                      alt={trData(locale, tier.name)}
                      fill
                      unoptimized
                      sizes="220px"
                      className="object-contain p-2 transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted shadow-sm backdrop-blur">
                    {tier.target === "house" ? trData(locale, "Privātmājai") : trData(locale, "Dzīvoklim")}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-1 p-3">
                  <span className="t-widget leading-tight text-[color:var(--color-title)]">{trData(locale, tier.name)}</span>
                  <span className="text-[12px] leading-snug text-muted">
                    {tier.sizeNote ? trData(locale, tier.sizeNote) : tier.sizes.map((s) => `${s.w}×${s.h}`).join(", ")}
                  </span>
                  <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-[color:var(--color-accent)]/10 px-2.5 py-1 text-[13px] font-semibold text-[color:var(--color-accent)] transition-colors group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                    <span>{trData(locale, "no")}</span>
                    <Money value={minPrice} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {matchingTiers.length === 0 ? (
          <p className="mt-8 text-[14px] text-muted">
            {trData(locale, "Neviena sērija neatbilst izvēlētajiem filtriem. Mēģini paplašināt kritērijus.")}
          </p>
        ) : null}
      </div>
    );
  }

  /* Step 3 — configure the chosen tier */
  if (step === "configure" && selectedTier && config) {
    const lockSet = lockSets[selectedTier.lockSet] || [];
    const activePeephole = peepholeOptions.find((p) => p.id === config.peepholeId);
    const activeFurniture = furnitureOptions.find((f) => f.id === config.furnitureId);
    const sizeLabel =
      config.sizeMode === "custom" && selectedTier.customSizeSupported
        ? `${config.customWidth}×${config.customHeight} mm`
        : config.size
          ? `${config.size.w}×${config.size.h} mm`
          : trData(locale, selectedTier.sizeNote);
    const lockLabels = [...config.lockIds]
      .map((id) => lockSet.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .map((name) => trData(locale, name));
    const extraOptionLabels = [...config.extraOptions]
      .map((id) => (additionalOptions.find((o) => o.id === id) || casingOptions.find((o) => o.id === id))?.name)
      .filter(Boolean)
      .map((name) => trData(locale, name));
    const SERVICE_OPTION_LABELS = [
      ["pickup", "Saņemšana noliktavā. Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r."],
      ["measurement", "Mērīšana"],
      ["deliveryOnly", "Tikai piegāde, bez montāžas"],
      ["installDelivery", "Montāža un piegāde"],
    ];

    const handleDownloadPdf = async () => {
      setPdfDownloading(true);
      try {
        const { generateConfiguratorPdf } = await import("@/lib/generateConfiguratorPdf");
        const specRows = [
          { label: trData(locale, "Izmērs"), value: sizeLabel },
          {
            label: trData(locale, "Vēršanās virziens"),
            value: trData(locale, openingDirections.find((d) => d.id === config.openingDirection)?.label || ""),
          },
          {
            label: trData(locale, "Vēršanās puse"),
            value: trData(locale, openingSides.find((d) => d.id === config.openingSide)?.label || ""),
          },
          lockLabels.length ? { label: trData(locale, "Slēdzenes"), value: lockLabels.join(", ") } : null,
          activeFurniture ? { label: trData(locale, "Furnitūras krāsa"), value: trData(locale, activeFurniture.name) } : null,
          config.outerDesign
            ? { label: `${trData(locale, "Zīmējums")} — ${trData(locale, "Ārpuse")}`, value: trData(locale, config.outerDesign.label) }
            : null,
          config.innerDesign
            ? { label: `${trData(locale, "Zīmējums")} — ${trData(locale, "Iekšpuse")}`, value: trData(locale, config.innerDesign.label) }
            : null,
          { label: `${trData(locale, "Plēve")} — ${trData(locale, "Ārpuse")}`, value: trData(locale, config.outerFilm.label) },
          { label: `${trData(locale, "Plēve")} — ${trData(locale, "Iekšpuse")}`, value: trData(locale, config.innerFilm.label) },
          { label: trData(locale, "Kārbas pārklājums"), value: trData(locale, config.frameSwatch.label) },
          activePeephole ? { label: trData(locale, "Skata acs"), value: trData(locale, activePeephole.name) } : null,
          extraOptionLabels.length ? { label: trData(locale, "Papildu opcijas"), value: extraOptionLabels.join(", ") } : null,
        ].filter(Boolean);

        await generateConfiguratorPdf({
          locale,
          tierName: trData(locale, selectedTier.name),
          tierIntro: selectedTier.intro ? trData(locale, selectedTier.intro) : "",
          tierTarget: trData(locale, selectedTier.target === "house" ? "Privātmājai" : "Dzīvoklim"),
          mainImageUrl: config.outerDesign?.image || selectedTier.image,
          secondaryImage: config.innerDesign ? { url: config.innerDesign.image } : null,
          specRows,
          serviceOptions: SERVICE_OPTION_LABELS.map(([key, label]) => ({
            label: trData(locale, label),
            on: !!config.serviceOptions[key],
          })),
          priceLines: priceBreakdown.map((line) => ({ label: trData(locale, line.label), price: line.price })),
          total,
          contact: {
            phone: "+370 662 13171",
            email: "info@tnbaltic.lt",
            address: "Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.",
          },
          fileName: `${(selectedTier.id || "piedavajums").toString()}.pdf`,
        });
      } finally {
        setPdfDownloading(false);
      }
    };

    return (
      <div className="container py-12 lg:py-16">
        <button
          type="button"
          onClick={() => setStep("results")}
          className="mb-6 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
        >
          <ChevronLeft size={16} /> {trData(locale, "Atpakaļ pie sērijām")}
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
          <div>
            {config.outerDesign || config.innerDesign ? null : (
              <TierGallery
                key={selectedTier.id}
                images={selectedTier.images || [selectedTier.image]}
                alt={trData(locale, selectedTier.name)}
                locale={locale}
                photoPending={selectedTier.photoPending}
              />
            )}

            {config.outerDesign || config.innerDesign ? (
              <div className="grid grid-cols-2 gap-3">
                {config.outerDesign ? (
                  <div>
                    <span className="relative block aspect-square overflow-hidden border border-line bg-white">
                      <Image
                        src={config.outerDesign.image}
                        alt={trData(locale, "Izvēlētais dizains — ārpuse")}
                        fill
                        unoptimized
                        sizes="190px"
                        className="object-contain"
                      />
                    </span>
                    <span className="mt-1.5 block text-center text-[12px] text-muted">
                      {trData(locale, "Ārpuse")} — {trData(locale, config.outerDesign.label)}
                    </span>
                  </div>
                ) : null}
                {config.innerDesign ? (
                  <div>
                    <span className="relative block aspect-square overflow-hidden border border-line bg-white">
                      <Image
                        src={config.innerDesign.image}
                        alt={trData(locale, "Izvēlētais dizains — iekšpuse")}
                        fill
                        unoptimized
                        sizes="190px"
                        className="object-contain"
                      />
                    </span>
                    <span className="mt-1.5 block text-center text-[12px] text-muted">
                      {trData(locale, "Iekšpuse")} — {trData(locale, config.innerDesign.label)}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 border border-line bg-white p-5">
              <h2 className="t-section !text-[24px]">{trData(locale, selectedTier.name)}</h2>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink">{trData(locale, selectedTier.intro)}</p>
              <p className="mt-3 text-[13px] text-muted">
                <strong className="text-ink">{trData(locale, "Garantija")}:</strong> {trData(locale, selectedTier.warranty)}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                <strong className="text-ink">{trData(locale, "Standarta izmēri")}:</strong>{" "}
                {selectedTier.sizes.length
                  ? selectedTier.sizes.map((s) => `${s.w}×${s.h} mm`).join(", ")
                  : trData(locale, selectedTier.sizeNote)}
              </p>

              {selectedTier.constructionSpec ? (
                <div className="mt-4">
                  <h5 className="text-[13px] font-semibold text-ink">{trData(locale, "Konstrukcija")}</h5>
                  <ul className="mt-1.5 space-y-1.5 border-l-2 border-line pl-4 text-[13px] leading-[1.6] text-muted">
                    {selectedTier.constructionSpec.map((h) => (
                      <li key={h}>{trData(locale, h)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedTier.finishSpec ? (
                <div className="mt-4">
                  <h5 className="text-[13px] font-semibold text-ink">{trData(locale, "Apdare un izolācija")}</h5>
                  <ul className="mt-1.5 space-y-1.5 border-l-2 border-line pl-4 text-[13px] leading-[1.6] text-muted">
                    {selectedTier.finishSpec.map((h) => (
                      <li key={h}>{trData(locale, h)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedTier.hardwareSpec ? (
                <div className="mt-4">
                  <h5 className="text-[13px] font-semibold text-ink">{trData(locale, "Slēdzenes un furnitūra")}</h5>
                  <ul className="mt-1.5 space-y-1.5 border-l-2 border-line pl-4 text-[13px] leading-[1.6] text-muted">
                    {selectedTier.hardwareSpec.map((h) => (
                      <li key={h}>{trData(locale, h)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-8">
            {/* Size */}
            <div className="border border-line bg-white p-4">
              <h4 className="t-widget mb-3 text-[color:var(--color-title)]">{trData(locale, "Izmērs")}</h4>
              {selectedTier.sizes.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTier.sizes.map((s) => (
                    <button
                      key={`${s.w}x${s.h}`}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, sizeMode: "fixed", size: s }))}
                      className={`border px-4 py-2 text-[13px] font-medium ${
                        config.sizeMode !== "custom" && config.size?.w === s.w
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                          : "border-line text-ink hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      {s.w}×{s.h} mm — <Money value={s.price} />
                    </button>
                  ))}
                  {selectedTier.customSizeSupported ? (
                    <button
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, sizeMode: "custom" }))}
                      className={`border px-4 py-2 text-[13px] font-medium ${
                        config.sizeMode === "custom"
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                          : "border-line text-ink hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      {trData(locale, "Individuāls izmērs")} — {selectedTier.sqmPrice.toLocaleString("lv-LV")} {CURRENCY}/m²
                    </button>
                  ) : null}
                </div>
              ) : selectedTier.customSizeSupported ? (
                <button
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, sizeMode: "custom" }))}
                  className={`border px-4 py-2 text-[13px] font-medium ${
                    config.sizeMode === "custom"
                      ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                      : "border-line text-ink hover:border-[color:var(--color-accent)]"
                  }`}
                >
                  {trData(locale, "Individuāls izmērs")} — {selectedTier.sqmPrice.toLocaleString("lv-LV")} {CURRENCY}/m²
                </button>
              ) : (
                <p className="text-[13px] text-muted">{trData(locale, selectedTier.sizeNote)}</p>
              )}
              {selectedTier.sizes.length && selectedTier.sizeNote ? (
                <p className="mt-2 text-[12px] text-muted">{trData(locale, selectedTier.sizeNote)}</p>
              ) : null}

              {selectedTier.customSizeSupported && config.sizeMode === "custom" ? (
                <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-line pt-4">
                  <label className="text-[13px] text-ink">
                    {trData(locale, "Platums, mm")}
                    <input
                      type="number"
                      min={CUSTOM_SIZE_MIN.w}
                      step={1}
                      value={config.customWidth}
                      onChange={(e) => setConfig((c) => ({ ...c, customWidth: e.target.value }))}
                      onBlur={(e) => setConfig((c) => ({ ...c, customWidth: Math.max(CUSTOM_SIZE_MIN.w, Number(e.target.value) || 0) }))}
                      className="mt-1 block w-28 border border-line px-2 py-1.5 text-[13px]"
                    />
                  </label>
                  <label className="text-[13px] text-ink">
                    {trData(locale, "Augstums, mm")}
                    <input
                      type="number"
                      min={CUSTOM_SIZE_MIN.h}
                      step={1}
                      value={config.customHeight}
                      onChange={(e) => setConfig((c) => ({ ...c, customHeight: e.target.value }))}
                      onBlur={(e) => setConfig((c) => ({ ...c, customHeight: Math.max(CUSTOM_SIZE_MIN.h, Number(e.target.value) || 0) }))}
                      className="mt-1 block w-28 border border-line px-2 py-1.5 text-[13px]"
                    />
                  </label>
                  <p className="text-[13px] leading-[1.6] text-ink">
                    {(Number(config.customWidth) / 1000 || 0).toLocaleString("lv-LV", { maximumFractionDigits: 2 })} m ×{" "}
                    {(Number(config.customHeight) / 1000 || 0).toLocaleString("lv-LV", { maximumFractionDigits: 2 })} m ×{" "}
                    {selectedTier.sqmPrice.toLocaleString("lv-LV")} {CURRENCY}/m² ={" "}
                    <strong className="text-[color:var(--color-accent)]">
                      <Money value={customSizePrice(config.customWidth, config.customHeight, selectedTier.sqmPrice)} />
                    </strong>
                  </p>
                </div>
              ) : null}
            </div>

            {/* Opening direction / side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-line bg-white p-4">
                <h4 className="t-widget mb-3 text-[color:var(--color-title)]">{trData(locale, "Vēršanās virziens")}</h4>
                <div className="flex flex-wrap gap-2">
                  {openingDirections
                    .filter((d) => (d.id === "outside" ? selectedTier.canOpenOutside : selectedTier.canOpenInside))
                    .map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setConfig((c) => ({ ...c, openingDirection: d.id }))}
                        className={`border px-4 py-2 text-[13px] font-medium ${
                          config.openingDirection === d.id
                            ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                            : "border-line text-ink hover:border-[color:var(--color-accent)]"
                        }`}
                      >
                        {trData(locale, d.label)}
                      </button>
                    ))}
                </div>
              </div>
              <div className="border border-line bg-white p-4">
                <h4 className="t-widget mb-3 text-[color:var(--color-title)]">{trData(locale, "Vēršanās puse")}</h4>
                <div className="flex flex-wrap gap-2">
                  {openingSides.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, openingSide: d.id }))}
                      className={`border px-4 py-2 text-[13px] font-medium ${
                        config.openingSide === d.id
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                          : "border-line text-ink hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      {trData(locale, d.label)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locks — multiple upgrades can be combined, same as the source calculator */}
            {!selectedTier.smartLock ? (
              <CollapsibleSection
                title={trData(locale, "Papildu opcija maiņai — slēdzenes un cilindri")}
                subtitle={trData(locale, "Var atzīmēt vairākas — cenas summējas ar bāzes komplektāciju.")}
              >
                <LockOptionsGrid
                  lockSet={lockSet}
                  includedIds={selectedTier.includedExtras || []}
                  checkedIds={config.lockIds}
                  onToggle={(id) => setConfig((c) => ({ ...c, lockIds: toggleInSet(c.lockIds, id) }))}
                  locale={locale}
                  compatById={{ "smart-lock-tedee": tedeeCylinderCompat(selectedTier) }}
                />
              </CollapsibleSection>
            ) : (
              <div className="border border-line bg-white p-4 text-[13px] text-muted">
                {trData(locale, "Šai sērijai ir iekļauta viedā slēdzene — atsevišķa cilindra jaunināšana nav nepieciešama.")}
              </div>
            )}

            {/* Hardware colour */}
            <CollapsibleSection title={trData(locale, "Furnitūras krāsa")}>
              <div className="flex flex-wrap gap-2">
                {furnitureOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, furnitureId: f.id }))}
                    className={`border px-4 py-2 text-[13px] font-medium ${
                      config.furnitureId === f.id
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                        : "border-line text-ink hover:border-[color:var(--color-accent)]"
                    }`}
                  >
                    {trData(locale, f.name)}
                  </button>
                ))}
              </div>
            </CollapsibleSection>

            {/* Leaf design: outer + inner */}
            <CollapsibleSection title={trData(locale, "Durvju vērtnes dizains")}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DesignPicker
                  label={trData(locale, "Zīmējums — ārpuse")}
                  groups={dizainsSection.groups}
                  seriesTitle={config.outerSeriesTitle}
                  onSeriesChange={(title) => setConfig((c) => ({ ...c, outerSeriesTitle: title }))}
                  designImage={config.outerDesign?.image}
                  onDesignChange={(item) => setConfig((c) => ({ ...c, outerDesign: item }))}
                  includedExtras={selectedTier.includedExtras || []}
                  locale={locale}
                />
                <DesignPicker
                  label={trData(locale, "Zīmējums — iekšpuse")}
                  groups={dizainsSection.groups}
                  seriesTitle={config.innerSeriesTitle}
                  onSeriesChange={(title) => setConfig((c) => ({ ...c, innerSeriesTitle: title }))}
                  designImage={config.innerDesign?.image}
                  onDesignChange={(item) => setConfig((c) => ({ ...c, innerDesign: item }))}
                  includedExtras={selectedTier.includedExtras || []}
                  locale={locale}
                />
              </div>
            </CollapsibleSection>

            {/* Film colour: outer + inner */}
            <CollapsibleSection title={trData(locale, "Pārklājuma plēves krāsa")}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FilmPicker
                  label={trData(locale, "Plēve — ārpuse")}
                  groups={filmGroupsForTier}
                  groupTitle={config.outerFilmGroupTitle}
                  onGroupChange={(title) => setConfig((c) => ({ ...c, outerFilmGroupTitle: title }))}
                  filmImage={config.outerFilm.image}
                  onFilmChange={(item) => setConfig((c) => ({ ...c, outerFilm: item }))}
                  locale={locale}
                />
                <FilmPicker
                  label={trData(locale, "Plēve — iekšpuse")}
                  groups={filmGroupsForTier}
                  groupTitle={config.innerFilmGroupTitle}
                  onGroupChange={(title) => setConfig((c) => ({ ...c, innerFilmGroupTitle: title }))}
                  filmImage={config.innerFilm.image}
                  onFilmChange={(item) => setConfig((c) => ({ ...c, innerFilm: item }))}
                  locale={locale}
                />
              </div>
            </CollapsibleSection>

            {/* Frame coating */}
            <CollapsibleSection title={trData(locale, "Kārbas pārklājums")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <select
                  value={config.frameGroupTitle}
                  onChange={(e) => {
                    const g = ralSection.groups.find((x) => x.title === e.target.value);
                    setConfig((c) => ({ ...c, frameGroupTitle: e.target.value, frameSwatch: g.items[0] }));
                  }}
                  className="border border-line bg-white px-3 py-1.5 text-[13px]"
                >
                  {ralSection.groups.map((g) => (
                    <option key={g.title} value={g.title}>
                      {trData(locale, g.title)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <SwatchGrid
                  items={ralSection.groups.find((g) => g.title === config.frameGroupTitle).items}
                  selected={config.frameSwatch.image}
                  onSelect={(item) => setConfig((c) => ({ ...c, frameSwatch: item }))}
                  locale={locale}
                />
              </div>
            </CollapsibleSection>

            {/* Peephole */}
            <CollapsibleSection title={trData(locale, "Skata acs")}>
              <PeepholePicker
                options={peepholeOptions}
                selectedId={config.peepholeId}
                onSelect={(id) => setConfig((c) => ({ ...c, peepholeId: id }))}
                locale={locale}
              />
            </CollapsibleSection>

            {/* Additional options */}
            <CollapsibleSection title={trData(locale, "Papildu opcijas")}>
              <div className="space-y-2.5">
                {additionalOptions
                  .filter((opt) => !SERIES_DESIGN_SURCHARGE_IDS.has(opt.id) && opt.id !== INSIDE_OPENING_OPTION_ID)
                  .map((opt) => {
                  const isIncluded = (selectedTier.includedExtras || []).includes(opt.id);
                  const isChecked = isIncluded || config.extraOptions.has(opt.id);
                  return (
                    <label key={opt.id} className="flex items-start justify-between gap-4 text-[14px] text-ink">
                      <span className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={isChecked}
                          disabled={isIncluded}
                          onChange={() => setConfig((c) => ({ ...c, extraOptions: toggleInSet(c.extraOptions, opt.id) }))}
                        />
                        {trData(locale, opt.name)}
                      </span>
                      {isIncluded ? (
                        <span className="whitespace-nowrap font-semibold text-green-700">{trData(locale, "Jau iekļauts standartā")}</span>
                      ) : (
                        <span className="whitespace-nowrap font-medium text-[color:var(--color-accent)]">
                          +<Money value={opt.price} />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </CollapsibleSection>

            {/* MDF izstrādājumi (aplodes) */}
            <CollapsibleSection
              title={trData(locale, "MDF izstrādājumi (aplodes)")}
              subtitle={trData(
                locale,
                "Aplodes un MDF paneļu komplekti — cenas atbilstoši durvju pielietojumam (dzīvoklis / privātmāja)."
              )}
            >
              <div className="space-y-2.5">
                {casingOptions.map((opt) => (
                  <label key={opt.id} className="flex items-start justify-between gap-4 text-[14px] text-ink">
                    <span className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={config.extraOptions.has(opt.id)}
                        onChange={() => setConfig((c) => ({ ...c, extraOptions: toggleInSet(c.extraOptions, opt.id) }))}
                      />
                      {trData(locale, opt.name)}
                    </span>
                    <span className="whitespace-nowrap font-medium text-[color:var(--color-accent)]">
                      +<Money value={opt.price} />
                    </span>
                  </label>
                ))}
              </div>
            </CollapsibleSection>

            {/* Montāža un piegāde */}
            <CollapsibleSection title={trData(locale, "Montāža un piegāde")}>
              <div className="divide-y divide-[--color-line]">
                <ServiceToggleRow
                  checked={config.serviceOptions.pickup}
                  onChange={() =>
                    setConfig((c) => ({
                      ...c,
                      serviceOptions: { ...c.serviceOptions, pickup: !c.serviceOptions.pickup },
                    }))
                  }
                  label="Saņemšana noliktavā. Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r."
                  locale={locale}
                />
                <ServiceToggleRow
                  checked={config.serviceOptions.measurement}
                  onChange={() =>
                    setConfig((c) => ({
                      ...c,
                      serviceOptions: { ...c.serviceOptions, measurement: !c.serviceOptions.measurement },
                    }))
                  }
                  label="Mērīšana"
                  hint="Mūsu speciālists ierodas objektā un veic precīzus durvju ailas uzmērījumus pirms pasūtījuma noformēšanas."
                  locale={locale}
                />
                <ServiceToggleRow
                  checked={config.serviceOptions.deliveryOnly}
                  onChange={() =>
                    setConfig((c) => ({
                      ...c,
                      serviceOptions: { ...c.serviceOptions, deliveryOnly: !c.serviceOptions.deliveryOnly },
                    }))
                  }
                  label="Tikai piegāde, bez montāžas"
                  hint="Durvis piegādājam norādītajā adresē — uzstādīšanu veicat paši vai ar saviem meistariem."
                  locale={locale}
                />
                <ServiceToggleRow
                  checked={config.serviceOptions.installDelivery}
                  onChange={() =>
                    setConfig((c) => ({
                      ...c,
                      serviceOptions: { ...c.serviceOptions, installDelivery: !c.serviceOptions.installDelivery },
                    }))
                  }
                  label="Montāža un piegāde"
                  hint="Durvis piegādājam un uzstādām ar saviem sertificētiem montieriem."
                  locale={locale}
                />
              </div>
            </CollapsibleSection>

            {/* Summary */}
            <div id="calc-summary" className="border-2 border-[color:var(--color-accent)] bg-[--color-soft] p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="t-widget text-[color:var(--color-title)]">{trData(locale, "Provizoriskā summa")}</span>
                <span className="text-[26px] font-semibold text-[color:var(--color-accent)]">
                  <Money value={total} />
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-[1.6] text-muted">
                {trData(locale, "Cena aprēķināta pēc mazumtirdzniecības cenrāža (spēkā no 01.08.2024). Galīgā cena tiek apstiprināta pasūtījuma noformēšanas brīdī.")}{" "}
                {trData(locale, "Skata acs")}: {trData(locale, activePeephole?.name)}.
                {config.sizeMode === "custom" && selectedTier.customSizeSupported ? (
                  <>
                    {" "}
                    {trData(locale, "Individuālā izmēra cena aprēķināta pēc formulas: platums (m) × augstums (m) ×")}{" "}
                    {selectedTier.sqmPrice.toLocaleString("lv-LV")} {CURRENCY}/m².
                  </>
                ) : null}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="/kontakti" className="btn btn-accent inline-block">
                  {trData(locale, "Pieprasīt piedāvājumu")}
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={pdfDownloading}
                  className="btn btn-outline-dark inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {pdfDownloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {trData(locale, "Lejupielādēt")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <FloatingPrice total={total} locale={locale} />
      </div>
    );
  }

  return null;
}

// Sticky pill in the bottom-right corner, visible throughout the whole
// configurator so the price is always on screen as options are toggled —
// not just once you've scrolled all the way down to the full summary.
// Clicking it jumps to that summary (#calc-summary) and its "Pieprasīt
// piedāvājumu" button.
function FloatingPrice({ total, locale }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById("calc-summary")?.scrollIntoView({ behavior: "smooth", block: "center" })}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-full border-2 border-[color:var(--color-accent)] bg-white px-4 py-2.5 shadow-xl transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3"
    >
      <span className="hidden text-[12px] font-medium text-muted sm:inline">{trData(locale, "Provizoriskā summa")}</span>
      <span className="text-[17px] font-semibold text-[color:var(--color-accent)] sm:text-[18px]">
        <Money value={total} />
      </span>
    </button>
  );
}
