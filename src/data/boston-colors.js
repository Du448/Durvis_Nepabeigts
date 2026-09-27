/* The full Boston-series colour palette - every shade the factory can paint
   any Boston door in, shown on the product page as a reference alongside the
   model's own default colour(s). Hex values are sampled directly from the
   manufacturer's own "BOSTON Prezentācija" catalogue (the ПОКРАСКА / paint
   page's 9 swatch photos), not a guessed RAL-chart approximation, and the
   order matches that page's own 3x3 layout. `premium: true` marks the three
   shades a separate price list flags with a 10% surcharge. */
export const bostonColorPalette = [
  { ral: "7021", hex: "#3A4149", premium: false, name: { lt: "Antracitas", lv: "Antracīts", en: "Anthracite" } },
  { ral: "7024", hex: "#44484C", premium: false, name: { lt: "Grafito pilka", lv: "Grafīta pelēks", en: "Graphite grey" } },
  { ral: "8019", hex: "#3D3737", premium: false, name: { lt: "Karti šokoladas", lv: "Rūgta šokolāde", en: "Bitter chocolate" } },
  { ral: "9005", hex: "#1D1E1E", premium: false, name: { lt: "Oniksas", lv: "Oniks", en: "Onyx" } },
  { ral: "5011", hex: "#1D213E", premium: true, name: { lt: "Mirganti vidurnaktis", lv: "Mirdzoša pusnakts", en: "Shimmering midnight" } },
  { ral: "6005", hex: "#174334", premium: true, name: { lt: "Sodrus smaragdas", lv: "Bagātīgs smaragds", en: "Rich emerald" } },
  { ral: "3005", hex: "#5D2B2F", premium: true, name: { lt: "Sodrus rubinas", lv: "Piesātināts Rubīns", en: "Deep ruby" } },
  { ral: "9001", hex: "#E3E0D1", premium: false, name: { lt: "Dramblio kaulas", lv: "Ziloņkauls", en: "Ivory" } },
  { ral: "9016", hex: "#E1E2DC", premium: false, name: { lt: "Baltas akmuo", lv: "Balts akmens", en: "Stone white" } },
];
