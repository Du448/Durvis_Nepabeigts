"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import { useTr } from "@/components/DictProvider";
import { imageProps } from "@/lib/images";

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

const SPEC_LABEL_KEYS = {
  "Vērtnes biezums": "specs.leafThickness",
  "Kārbas biezums": "specs.frameThickness",
  Svars: "specs.weight",
  Slēdzenes: "specs.locks",
  Pildījums: "specs.filling",
  "Ārējā apdare": "specs.outsideFinish",
  "Iekšējā apdare": "specs.insideFinish",
  Apdare: "specs.finish",
  Actiņa: "specs.peephole",
  Furnitūra: "specs.hardware",
};

export default function ProductTabs({ product, locks = [] }) {
  const { trData } = useTr();
  const locale = getLocaleFromPathname(usePathname());
  const baseId = useId();

  /* Stored in Latvian alongside the rest of the catalogue data; `trData`
     renders it in the page's language. */
  const sections = product?.description || [];
  const rows = product?.specsFull?.length
    ? product.specsFull.map(([label, value]) => [trData(locale, label), trData(locale, value)])
    : Object.entries(product?.specs || {}).map(([label, value]) => {
        const raw = String(value);
        return [
          SPEC_LABEL_KEYS[label] ? t(locale, SPEC_LABEL_KEYS[label]) : trData(locale, label),
          raw === "Ir" ? t(locale, "values.yes") : raw === "Nav" ? t(locale, "values.no") : trData(locale, raw),
        ];
      });

  const tabs = [
    sections.length ? { key: "description", label: t(locale, "product.tabDescription") } : null,
    rows.length ? { key: "specs", label: t(locale, "product.tabSpecs") } : null,
    locks.length ? { key: "locks", label: t(locale, "product.tabLocks") } : null,
  ].filter(Boolean);

  const [active, setActive] = useState(tabs[0]?.key || "description");

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

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`}>
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
          ) : (
            <div className="mt-8 max-w-[900px] overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <caption className="sr-only">{t(locale, "product.tabSpecs")}</caption>
                <tbody>
                  {rows.map(([label, value], i) => (
                    <tr key={`${label}-${i}`} className={i % 2 ? "bg-white" : "bg-[--color-soft]"}>
                      <th scope="row" className="w-[46%] border border-line px-3 py-2 text-left font-normal text-muted">
                        {label}
                      </th>
                      <td className="border border-line px-3 py-2 text-ink">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
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
              <span className={`block text-[11px] uppercase tracking-[0.12em] ${i === index ? "text-white/80" : "text-muted"}`}>
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
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <caption className="sr-only">{label}</caption>
            <tbody>
              {lock.rows.map(([rowLabel, value], i) => (
                <tr key={`${rowLabel}-${i}`} className={i % 2 ? "bg-white" : "bg-[--color-soft]"}>
                  <th scope="row" className="w-[50%] border border-line px-3 py-2 text-left font-normal text-muted">
                    {rowLabel}
                  </th>
                  <td className="border border-line px-3 py-2 text-ink">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
