/* The Decolux finish - a printed wood/stone-grain coating, normally the
   Nature series' own finish but also orderable as an add-on for a Boston
   door (hence its "organic" spot right under the Boston palette rather than
   a tab of its own). The manufacturer's "BOSTON Prezentācija" catalogue
   (page 17) shows it applied in three distinct styles, each with its own
   set of available tones - not one shared 7-colour list:

   - "Pilns pārklājums" (full coverage): the whole leaf in one Decolux tone.
   - "Reikas" (slats): vertical decorative slats - the only style that also
     offers the two light tones (Ziloņkauls, Balts).
   - "Ieliktņi" (inserts): a Decolux panel inset into the leaf.

   Every swatch below is a real manufacturer photo cropped from that page,
   not a guessed flat colour. */
const IMG = "/images/boston-construction";

export const decoluxStyles = [
  {
    key: "full",
    labelKey: "decoluxStyleFull",
    items: [
      { image: `${IMG}/decolux-full-tik-tumss.jpg`, name: { lt: "Tamsus tikas", lv: "Tumšs tīkkoks", en: "Dark teak" } },
      { image: `${IMG}/decolux-full-dub-tumss.jpg`, name: { lt: "Tamsus ąžuolas", lv: "Tumšs ozols", en: "Dark oak" } },
      { image: `${IMG}/decolux-full-betons-tumss.jpg`, name: { lt: "Tamsus betonas", lv: "Tumšs betons", en: "Dark concrete" } },
    ],
  },
  {
    key: "slats",
    labelKey: "decoluxStyleSlats",
    items: [
      { image: `${IMG}/decolux-rejas-tik-gaiss.jpg`, name: { lt: "Šviesus tikas", lv: "Gaišs tīkkoks", en: "Light teak" } },
      { image: `${IMG}/decolux-rejas-dub-tumss.jpg`, name: { lt: "Tamsus ąžuolas", lv: "Tumšs ozols", en: "Dark oak" } },
      { image: `${IMG}/decolux-rejas-amerikanu-rieksts.jpg`, name: { lt: "Amerikietiškas riešutas", lv: "Amerikāņu rieksts", en: "American walnut" } },
      { image: `${IMG}/decolux-rejas-betons-gaiss.jpg`, name: { lt: "Šviesus betonas", lv: "Gaišs betons", en: "Light concrete" } },
      { image: `${IMG}/decolux-rejas-zilonkauls.jpg`, name: { lt: "Dramblio kaulas", lv: "Ziloņkauls", en: "Ivory" } },
      { image: `${IMG}/decolux-rejas-balts.jpg`, name: { lt: "Baltas", lv: "Balts", en: "White" } },
    ],
  },
  {
    key: "insert",
    labelKey: "decoluxStyleInsert",
    items: [
      { image: `${IMG}/decolux-insert-tik-gaiss.jpg`, name: { lt: "Šviesus tikas", lv: "Gaišs tīkkoks", en: "Light teak" } },
      { image: `${IMG}/decolux-insert-tik-tumss.jpg`, name: { lt: "Tamsus tikas", lv: "Tumšs tīkkoks", en: "Dark teak" } },
      { image: `${IMG}/decolux-insert-amerikanu-rieksts.jpg`, name: { lt: "Amerikietiškas riešutas", lv: "Amerikāņu rieksts", en: "American walnut" } },
      { image: `${IMG}/decolux-insert-dub-tumss.jpg`, name: { lt: "Tamsus ąžuolas", lv: "Tumšs ozols", en: "Dark oak" } },
      { image: `${IMG}/decolux-insert-betons.jpg`, name: { lt: "Betonas", lv: "Betons", en: "Concrete" } },
      { image: `${IMG}/decolux-insert-betons-tumss.jpg`, name: { lt: "Tamsus betonas", lv: "Tumšs betons", en: "Dark concrete" } },
      { image: `${IMG}/decolux-insert-betons-gaiss.jpg`, name: { lt: "Šviesus betonas", lv: "Gaišs betons", en: "Light concrete" } },
    ],
  },
];
