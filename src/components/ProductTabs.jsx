"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Ruler, DoorOpen, Layers, Wind, KeyRound, Palette, ListChecks } from "lucide-react";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import { useTr } from "@/components/DictProvider";
import { imageProps } from "@/lib/images";
import BostonColorPaletteGrid from "@/components/BostonColorPaletteGrid";
import { bostonColorPalette } from "@/data/boston-colors";
import { RULES_PLAIN } from "@/data/boston-config-options";
import { bostonSpec } from "@/lib/boston-config";
import ManufacturerFeatureSection from "@/components/ManufacturerFeatureSection";
import { buildSpecGroups } from "@/lib/product-specs";
import { getBostonConstructionSections } from "@/data/boston-construction";
import { decoluxStyles } from "@/data/decolux-colors";

// One icon per spec group, matching the buy box's own accent-tinted icon
// chips (ServiceBadge) so the two sections read as the same visual language.
const SPEC_GROUP_ICONS = {
  size: Ruler,
  application: DoorOpen,
  construction: Layers,
  sealing: Wind,
  locks: KeyRound,
  finish: Palette,
  other: ListChecks,
};

/* Description / specification tabs under the product, as on the manufacturer's
   own product pages: an underlined tab strip, then either the long written
   description broken into headed sections, or the specification table.

   This is the product's only specification table. Models with the
   manufacturer's full table (specsFull) show that; the rest show their short
   `specs` list, with the common row labels taken from the UI dictionary. The
   "all specifications" link in the buy box points at #charakteristikos.

   Models whose locks the manufacturer documents get a third tab, "Slēdzenes"
   (data in src/data/locks.js, resolved to the page's language on the
   server): the lock's photo on the left, its table on the right, and a
   switch between the door's locks. */

export const SPECS_ANCHOR = "charakteristikos";
export const OPEN_SPECS_EVENT = "product:open-specs";

export default function ProductTabs({ product, locks = [] }) {
  const { trData } = useTr();
  const locale = getLocaleFromPathname(usePathname());
  // Which workbook's palette and premium surcharge apply to this model.
  const paletteRules = bostonSpec(product)?.rules ?? RULES_PLAIN;
  const baseId = useId();

  /* Stored in Latvian alongside the rest of the catalogue data; `trData`
     renders it in the page's language. */
  const sections = product?.description || [];
  const specGroups = product ? buildSpecGroups(product, (v) => trData(locale, v), (k) => t(locale, k)) : [];

  const isBoston = product?.collection === "BOSTON";
  const isSmartLux = Boolean(product?.id?.startsWith("boston-smart-lux"));
  const bostonConstructionSections = getBostonConstructionSections(isSmartLux);

  const tabs = [
    sections.length ? { key: "description", label: t(locale, "product.tabDescription") } : null,
    specGroups.length ? { key: "specs", label: t(locale, "product.tabSpecs") } : null,
    locks.length ? { key: "locks", label: t(locale, "product.tabLocks") } : null,
    ...(isBoston
      ? bostonConstructionSections.map((section) => ({ key: section.key, label: t(locale, `product.${section.tabKey}`) }))
      : []),
    isBoston ? { key: "colors", label: t(locale, "product.bostonPalette") } : null,
  ].filter(Boolean);

  const [active, setActive] = useState(tabs[0]?.key || "description");
  const [decoluxStyle, setDecoluxStyle] = useState(decoluxStyles[0].key);

  // The "all specifications" link in the buy box opens the table.
  useEffect(() => {
    const open = () => setActive("specs");
    window.addEventListener(OPEN_SPECS_EVENT, open);
    return () => window.removeEventListener(OPEN_SPECS_EVENT, open);
  }, []);

  if (!tabs.length) return null;

  // Arrow keys move between tabs, as the WAI-ARIA tabs pattern expects.
  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((tab) => tab.key === active);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActive(next.key);
    document.getElementById(`${baseId}-tab-${next.key}`)?.focus();
  };

  return (
    <section id={SPECS_ANCHOR} className="scroll-mt-24 border-t border-line">
      <div className="container py-10 lg:py-14">
        <div role="tablist" className="flex flex-wrap items-center gap-8 border-b border-line" onKeyDown={onKeyDown}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`${baseId}-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              aria-controls={`${baseId}-panel`}
              tabIndex={active === tab.key ? 0 : -1}
              onClick={() => setActive(tab.key)}
              className={`-mb-px min-h-11 border-b-2 pb-3 text-[15px] font-medium transition-colors duration-200 sm:text-[17px] ${
                active === tab.key
                  ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} key={active} className="animate-fade-in">
          {active === "description" ? (
            <div className="mt-8 max-w-[900px] space-y-7">
              {sections.map((section, i) => (
                <div key={section.title || i}>
                  {section.title ? (
                    <h3 className="mb-2 text-[18px] font-medium text-[color:var(--color-title)] sm:text-[20px]">
                      {trData(locale, section.title)}
                    </h3>
                  ) : null}
                  {section.body.map((paragraph, j) => (
                    <p key={j} className="mt-2 text-[15px] leading-[1.7] text-ink">
                      {trData(locale, paragraph)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : active === "locks" ? (
            <LockPanel locks={locks} locale={locale} />
          ) : active === "colors" ? (
            <div className="mt-8 max-w-[900px]">
              <p className="mb-4 text-[15px] leading-[1.7] text-ink">{t(locale, "product.bostonPaletteIntro")}</p>
              <BostonColorPaletteGrid
                locale={locale}
                items={bostonColorPalette.filter((c) => !c.plainOnly || paletteRules.id !== "su")}
                premiumPct={paletteRules.premiumPct}
                premiumLabel={t(locale, "product.bostonPalettePremium").replace("{pct}", String(paletteRules.premiumPct))}
              />

              <div className="mt-10 border-t border-line pt-8">
                <h3 className="text-[18px] font-medium text-[color:var(--color-title)]">{t(locale, "product.decoluxPalette")}</h3>
                <p className="mb-4 mt-2 text-[15px] leading-[1.7] text-ink">{t(locale, "product.decoluxPaletteIntro")}</p>

                <div role="tablist" className="mb-5 inline-flex gap-1 bg-[--color-soft] p-1">
                  {decoluxStyles.map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      role="tab"
                      aria-selected={decoluxStyle === style.key}
                      onClick={() => setDecoluxStyle(style.key)}
                      className={`min-h-9 px-3.5 text-[13px] font-medium transition-colors duration-200 ${
                        decoluxStyle === style.key
                          ? "bg-white text-[color:var(--color-title)] shadow-sm"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {t(locale, `product.${style.labelKey}`)}
                    </button>
                  ))}
                </div>

                <BostonColorPaletteGrid
                  key={decoluxStyle}
                  locale={locale}
                  items={decoluxStyles.find((s) => s.key === decoluxStyle).items}
                />
                <p className="mt-4 text-[13px] leading-[1.6] text-muted">{t(locale, "product.decoluxPaletteNote")}</p>
              </div>
            </div>
          ) : bostonConstructionSections.some((section) => section.key === active) ? (
            (() => {
              const section = bostonConstructionSections.find((s) => s.key === active);
              return (
                <div className="mt-8">
                  <ManufacturerFeatureSection
                    heading={t(locale, `product.${section.headingKey}`)}
                    subtitle={t(locale, `product.${section.subtitleKey}`)}
                    note={section.noteKey ? t(locale, `product.${section.noteKey}`) : undefined}
                    banner={section.banner}
                    slides={section.slides.map((slide) => ({ image: slide.image, caption: t(locale, `product.${slide.captionKey}`) }))}
                    prevLabel={t(locale, "product.previous")}
                    nextLabel={t(locale, "product.next")}
                    closeLabel={t(locale, "product.close")}
                    zoomLabel={t(locale, "product.zoomIn")}
                  />
                </div>
              );
            })()
          ) : active === "specs" ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {specGroups.map((group) => {
                const Icon = SPEC_GROUP_ICONS[group.key] || ListChecks;
                return (
                  <div key={group.key} className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3 border-b border-line pb-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                        <Icon size={17} />
                      </span>
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-title)]">
                        {group.title}
                      </h3>
                    </div>
                    <SpecList rows={group.rows} />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Label ... dotted leader ... value, no table borders/zebra - modelled on
   rdveikals.lv's own specification tab, which sets each row as a baseline
   flex row with a dotted rule filling the gap instead of a bordered cell. A
   row lights up on hover (background + accent-tinted dots) so the list feels
   responsive rather than a static printout. */
function SpecList({ rows, caption }) {
  return (
    <div>
      {caption ? <h3 className="sr-only">{caption}</h3> : null}
      {rows.map(([label, value], i) => (
        <div
          key={`${label}-${i}`}
          className="group -mx-2 flex items-baseline gap-2 px-2 py-2 text-[13.5px] transition-colors duration-150 hover:bg-[--color-soft]"
        >
          <span className="shrink-0 max-w-[60%] leading-[1.45] text-muted">{label}</span>
          <span
            aria-hidden
            className="mb-[3px] h-0 flex-1 border-b border-dotted border-[--color-line] transition-colors duration-150 group-hover:border-[color:var(--color-accent)]"
          />
          <span className="shrink-0 max-w-[40%] text-right font-semibold leading-[1.45] text-ink">{value}</span>
        </div>
      ))}
    </div>
  );
}

function LockPanel({ locks, locale }) {
  const [index, setIndex] = useState(0);
  const lock = locks[index] || locks[0];

  return (
    <div className="mt-8">
      {locks.length > 1 ? (
        <div role="group" aria-label={t(locale, "product.chooseLock")} className="mb-8 flex flex-wrap gap-2">
          {locks.map((l, i) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={`min-h-11 border px-4 py-2 text-left transition-colors duration-200 ${
                i === index
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                  : "border-line bg-white text-ink hover:border-[color:var(--color-accent)]"
              }`}
            >
              <span className={`block text-[12px] uppercase tracking-[0.12em] ${i === index ? "text-white/80" : "text-muted"}`}>
                {l.kind}
              </span>
              <span className="block text-[14px] font-medium">{l.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      <LockDetail key={lock.id} lock={lock} locale={locale} />
    </div>
  );
}

/* One lock: photo (or a small gallery with thumbnails under it) on the left;
   its table, and any description, on the right. Keyed by lock, so switching
   locks starts again from the first photo. */
function LockDetail({ lock, locale }) {
  const [shown, setShown] = useState(0);
  const images = lock.images || [];
  const src = images[shown] || images[0];
  const label = `${lock.kind} ${lock.name}`;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-14">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden border border-line bg-white">
          {src ? (
            <Image
              key={src}
              src={src}
              alt={images.length > 1 ? `${label} - ${shown + 1}/${images.length}` : label}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-contain p-4 sm:p-6"
              {...imageProps(src)}
            />
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setShown(i)}
                aria-label={t(locale, "product.imageN").replace("{n}", String(i + 1))}
                aria-pressed={i === shown}
                className={`relative aspect-square overflow-hidden border bg-white ${
                  i === shown ? "border-[color:var(--color-accent)]" : "border-line hover:border-ink"
                }`}
              >
                <Image src={img} alt="" fill sizes="96px" className="object-contain p-1" {...imageProps(img)} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">{lock.kind}</p>
        <h3 className="mt-1 text-[20px] font-medium text-[color:var(--color-title)] sm:text-[24px]">{lock.name}</h3>
        <div className="mt-5">
          <SpecList rows={lock.rows} caption={label} />
        </div>
        {lock.about ? (
          <div className="mt-6 text-[15px] leading-[1.7] text-ink">
            {lock.about.text ? <p>{lock.about.text}</p> : null}
            {lock.about.points?.length ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {lock.about.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
