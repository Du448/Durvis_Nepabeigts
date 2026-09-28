/* Non-standard-size surcharge steps for single-leaf ("vienvērtņu") Boston
   doors, sourced from the manufacturer's own "Nestandarta izmērs (vienviru)"
   price-sheet tab. That sheet also covers double-leaf doors and door blocks
   with side-lights/toplights (its own TYPE 1-6 layouts with per-m² glazing
   costs), which this shop's product page has no way to configure (only a
   single leaf + swing direction) - so only the plain oversized single-leaf
   case (its "TYPE 1") is offered here. Anything beyond these brackets still
   goes through "Pieprasīt piedāvājumu" as before.

   Percentages are additive surcharges on the door's already-selected price
   (base or hardware-type price): final = round(price * (1 + totalPct/100)),
   matching the sheet's own worked example (999 € at +20% height → 1199 €). */
export const bostonWidthBrackets = [
  { key: "w-860-960", labelKey: "widthBracket860", pct: 0 },
  { key: "w-1000-1050", labelKey: "widthBracket1000", pct: 10 },
];

export const bostonHeightBrackets = [
  { key: "h-2000-2050", labelKey: "heightBracket2000", pct: 0 },
  { key: "h-2100-2200", labelKey: "heightBracket2100", pct: 20 },
  { key: "h-2250-2300", labelKey: "heightBracket2250", pct: 25 },
  { key: "h-2350-2400", labelKey: "heightBracket2350", pct: 30 },
  { key: "h-2450-2500", labelKey: "heightBracket2450", pct: 35 },
];
