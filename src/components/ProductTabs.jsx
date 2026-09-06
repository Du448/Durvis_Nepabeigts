"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, t, trData } from "@/lib/i18n";

/* Description / specification tabs under the product, as on the manufacturer's
   own product pages: an underlined tab strip, then either the long written
   description broken into headed sections, or the full specification table.
   The short "Specifikācija" accordion above the fold stays as it is. */

export default function ProductTabs({ product }) {
  const locale = getLocaleFromPathname(usePathname());
  /* Stored in Latvian alongside the rest of the catalogue data, like `short`
     and `specs`; `trData` renders it in the page's language. */
  const sections = product?.description || [];
  const rows = product?.specsFull || [];

  /* The manufacturer puts a walkthrough video at the top of its description
     tab; keep it there, as a privacy-friendly nocookie embed. */
  const videoId = (product?.video || "").match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)?.[1];

  const tabs = [
    sections.length ? { key: "description", label: t(locale, "product.tabDescription") } : null,
    rows.length ? { key: "specs", label: t(locale, "product.tabSpecs") } : null,
  ].filter(Boolean);

  const [active, setActive] = useState(tabs[0]?.key || "description");

  if (!tabs.length) return null;

  return (
    <section className="border-t border-line">
      <div className="container py-10 lg:py-14">
        <div className="flex flex-wrap items-center gap-8 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-selected={active === tab.key}
              role="tab"
              className={`-mb-px border-b-2 pb-3 text-[15px] font-medium transition-colors duration-200 sm:text-[17px] ${
                active === tab.key
                  ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
              <tbody>
                {rows.map(([label, value], i) => (
                  <tr key={label} className={i % 2 ? "bg-white" : "bg-[--color-soft]"}>
                    <th scope="row" className="w-[46%] border border-line px-3 py-2 text-left font-normal text-muted">
                      {trData(locale, label)}
                    </th>
                    <td className="border border-line px-3 py-2 text-ink">{trData(locale, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
