"use client";

import Image from "next/image";
import { bostonColorPalette } from "@/data/boston-colors";
import { imageProps } from "@/lib/images";

// The full Boston-series finish palette, shown as a reference grid of
// colour chips (RAL swatch + name), not a picker - which shade an order
// actually gets goes through the offer request, same as any other custom
// colour on this site, so nothing here is selectable. `items` defaults to
// the Boston palette itself, but the same grid also renders the Decolux
// palette underneath it (see ProductTabs): those swatches are real
// manufacturer photos (`image`) rather than a flat `hex` chip, since Decolux
// is a printed wood/stone texture, not a paint colour - and they have no
// RAL code, so that second line is simply omitted for them.
export default function BostonColorPaletteGrid({ locale, premiumLabel, premiumPct = 20, items = bostonColorPalette }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      {items.map((sw) => (
        <div key={sw.ral || sw.image} className="group relative flex flex-col items-center gap-2 text-center">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-xl border border-line shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-md"
            style={sw.image ? undefined : { backgroundColor: sw.hex }}
            title={sw.premium ? premiumLabel : undefined}
          >
            {sw.image ? (
              <Image
                src={sw.image}
                alt={sw.name[locale] || sw.name.lv}
                fill
                sizes="(min-width: 768px) 15vw, 30vw"
                className="object-cover"
                {...imageProps(sw.image)}
              />
            ) : null}
            {sw.premium ? (
              <span className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium leading-none text-[color:var(--color-accent)] shadow-sm">
                +{premiumPct}%
              </span>
            ) : null}
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-[color:var(--color-title)]">{sw.name[locale] || sw.name.lv}</p>
            {sw.ral ? <p className="text-[12px] text-muted">RAL {sw.ral}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
