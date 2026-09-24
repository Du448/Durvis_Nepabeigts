"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import { useTr } from "@/components/DictProvider";

/* Description / specification tabs under the product, as on the manufacturer's
   own product pages: an underlined tab strip, then either the long written
   description broken into headed sections, or the specification table.

   This is the product's only specification table. Models with the
   manufacturer's full table (specsFull) show that; the rest show their short
   `specs` list, with the common row labels taken from the UI dictionary. The
   "all specifications" link in the buy box points at #charakteristikos. */

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

export default function ProductTabs({ product }) {
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

  /* The manufacturer puts a walkthrough video at the top of its description
     tab; keep it there, as a privacy-friendly nocookie embed. */
  const videoId = (product?.video || "").match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)?.[1];

  const tabs = [
    sections.length ? { key: "description", label: t(locale, "product.tabDescription") } : null,
    rows.length ? { key: "specs", label: t(locale, "product.tabSpecs") } : null,
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
              {videoId ? (
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title={product.name}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              ) : null}
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
