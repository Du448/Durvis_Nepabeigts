/* The full Boston-series colour palette (source: manufacturer's "BOSTON
   krāsu palete" price list) - every shade the factory can paint any Boston
   door in, shown on the product page as a reference alongside the model's
   own default colour(s). `premium: true` marks the three shades the price
   list itself flags with a 10% surcharge. Hex values are the standard RAL
   Classic swatch for each code (the sheet itself only has RAL codes and
   colour cells, no hex), close enough for an on-screen reference chip. */
export const bostonColorPalette = [
  { ral: "9016", hex: "#F1F0EA", premium: false, name: { lt: "Baltas akmuo", lv: "Balts akmens", en: "Stone white" } },
  { ral: "9001", hex: "#F2E9D8", premium: false, name: { lt: "Dramblio kaulas", lv: "Ziloņkauls", en: "Ivory" } },
  { ral: "5011", hex: "#1B2430", premium: true, name: { lt: "Mirganti vidurnaktis", lv: "Mirdzoša pusnakts", en: "Shimmering midnight" } },
  { ral: "6005", hex: "#0F3D2E", premium: true, name: { lt: "Sodrus smaragdas", lv: "Bagātīgs smaragds", en: "Rich emerald" } },
  { ral: "3005", hex: "#4E1D24", premium: true, name: { lt: "Sodrus rubinas", lv: "Piesātināts Rubīns", en: "Deep ruby" } },
  { ral: "8019", hex: "#3D3635", premium: false, name: { lt: "Karti šokoladas", lv: "Rūgta šokolāde", en: "Bitter chocolate" } },
  { ral: "7021", hex: "#282D2F", premium: false, name: { lt: "Antracitas", lv: "Antracīts", en: "Anthracite" } },
  { ral: "9005", hex: "#0A0A0A", premium: false, name: { lt: "Oniksas", lv: "Oniks", en: "Onyx" } },
  { ral: "7024", hex: "#474A4D", premium: false, name: { lt: "Grafito pilka", lv: "Grafīta pelēks", en: "Graphite grey" } },
];
