"use client";

import { bostonColorPalette } from "@/data/boston-colors";

// The full Boston-series finish palette, shown as a reference grid of
// colour chips (RAL swatch + name), not a picker - which shade an order
// actually gets goes through the offer request, same as any other custom
// colour on this site, so nothing here is selectable.
export default function BostonColorPaletteGrid({ locale, premiumLabel }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      {bostonColorPalette.map((sw) => (
        <div key={sw.ral} className="group relative flex flex-col items-center gap-2 text-center">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-xl border border-line shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-md"
            style={{ backgroundColor: sw.hex }}
            title={sw.premium ? premiumLabel : undefined}
          >
            {sw.premium ? (
              <span className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium leading-none text-[color:var(--color-accent)] shadow-sm">
                +10%
              </span>
            ) : null}
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-[color:var(--color-title)]">{sw.name[locale] || sw.name.lv}</p>
            <p className="text-[12px] text-muted">RAL {sw.ral}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
