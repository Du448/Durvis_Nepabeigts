/* Everything the Boston configurator can offer, independent of any one model:
   the palettes, hardware TYPEs, glazing layouts and the pricing rules from the
   manufacturer's LV retail workbook (tabs "Krāsu palete", "Komplektācija",
   "Nestandarta izmēri"). Which of these a given model actually gets is decided
   in @/lib/boston-config. All swatch/hardware photos are cropped from that
   workbook or the LUMMAS BOSTON catalogue. */

const IMG = "/images/boston-config";

/* Powder-coat palette for the leaf, frame and slats. "Grafīta pelēks" is on
   the plain-model order sheet only, not the SU / P-SU one (`plainOnly`). */
export const BOSTON_PAINT = [
  { key: "7024", hex: "#44484C", image: `${IMG}/boston-7024.jpg`, plainOnly: true, name: { lv: "Grafīta pelēks", lt: "Grafito pilka", en: "Graphite grey", ru: "Графитовый серый" } },
  { key: "9016", hex: "#E1E2DC", image: `${IMG}/boston-9016.jpg`, name: { lv: "Balts akmens", lt: "Baltas akmuo", en: "Stone white", ru: "Белый камень" } },
  { key: "9001", hex: "#E3E0D1", image: `${IMG}/boston-9001.jpg`, name: { lv: "Ziloņkauls", lt: "Dramblio kaulas", en: "Ivory", ru: "Слоновая кость" } },
  { key: "8019", hex: "#3D3737", image: `${IMG}/boston-8019.jpg`, name: { lv: "Rūgta šokolāde", lt: "Karti šokoladas", en: "Bitter chocolate", ru: "Горький шоколад" } },
  { key: "7021", hex: "#3A4149", image: `${IMG}/boston-7021.jpg`, name: { lv: "Antracīts", lt: "Antracitas", en: "Anthracite", ru: "Антрацит" } },
  { key: "9005", hex: "#1D1E1E", image: `${IMG}/boston-9005.jpg`, name: { lv: "Oniks", lt: "Oniksas", en: "Onyx", ru: "Оникс" } },
  { key: "5011", hex: "#1D213E", image: `${IMG}/boston-5011.jpg`, premium: true, name: { lv: "Mirdzoša pusnakts", lt: "Mirganti vidurnaktis", en: "Shimmering midnight", ru: "Мерцающая полночь" } },
  { key: "6005", hex: "#174334", image: `${IMG}/boston-6005.jpg`, premium: true, name: { lv: "Bagātīgs smaragds", lt: "Sodrus smaragdas", en: "Rich emerald", ru: "Насыщенный изумруд" } },
  { key: "3005", hex: "#5D2B2F", image: `${IMG}/boston-3005.jpg`, premium: true, name: { lv: "Piesātināts rubīns", lt: "Sodrus rubinas", en: "Deep ruby", ru: "Глубокий рубин" } },
];

// Nature (P-SU) leaves: printed wood/stone finish, outside only.
export const DECOLUX_FULL = [
  { key: "tik-tumss", image: `${IMG}/decolux-tik-tumss.jpg`, name: { lv: "Tumšs tīkkoks", lt: "Tamsus tikas", en: "Dark teak", ru: "Тёмный тик" } },
  { key: "ozols-tumss", image: `${IMG}/decolux-ozols-tumss.jpg`, name: { lv: "Tumšs ozols", lt: "Tamsus ąžuolas", en: "Dark oak", ru: "Тёмный дуб" } },
  { key: "betons-tumss", image: `${IMG}/decolux-betons-tumss.jpg`, name: { lv: "Tumšs betons", lt: "Tamsus betonas", en: "Dark concrete", ru: "Тёмный бетон" } },
];

export const DECOLUX_INSERTS = [
  { key: "tik-gaiss", image: `${IMG}/insert-tik-gaiss.jpg`, name: { lv: "Gaišs tīkkoks", lt: "Šviesus tikas", en: "Light teak", ru: "Светлый тик" } },
  { key: "tik-tumss", image: `${IMG}/insert-tik-tumss.jpg`, name: { lv: "Tumšs tīkkoks", lt: "Tamsus tikas", en: "Dark teak", ru: "Тёмный тик" } },
  { key: "rieksts", image: `${IMG}/insert-rieksts.jpg`, name: { lv: "Amerikāņu rieksts", lt: "Amerikietiškas riešutas", en: "American walnut", ru: "Американский орех" } },
  { key: "ozols-tumss", image: `${IMG}/insert-ozols-tumss.jpg`, name: { lv: "Tumšs ozols", lt: "Tamsus ąžuolas", en: "Dark oak", ru: "Тёмный дуб" } },
  { key: "betons-gaiss", image: `${IMG}/insert-betons-gaiss.jpg`, name: { lv: "Gaišs betons", lt: "Šviesus betonas", en: "Light concrete", ru: "Светлый бетон" } },
  { key: "betons", image: `${IMG}/insert-betons.jpg`, name: { lv: "Betons", lt: "Betonas", en: "Concrete", ru: "Бетон" } },
  { key: "betons-tumss", image: `${IMG}/insert-betons-tumss.jpg`, name: { lv: "Tumšs betons", lt: "Tamsus betonas", en: "Dark concrete", ru: "Тёмный бетон" } },
];

/* Slats come in their own 6 tones, or ("paint:<key>") in any Boston paint
   shade - e.g. slats in the leaf's own colour. */
export const SLAT_TONES = [
  { key: "balts-akmens", image: `${IMG}/slat-balts-akmens.jpg`, name: { lv: "Balts akmens", lt: "Baltas akmuo", en: "Stone white", ru: "Белый камень" } },
  { key: "zilonkauls", image: `${IMG}/slat-zilonkauls.jpg`, name: { lv: "Ziloņkauls", lt: "Dramblio kaulas", en: "Ivory", ru: "Слоновая кость" } },
  { key: "tik-gaiss", image: `${IMG}/slat-tik-gaiss.jpg`, name: { lv: "Gaišs tīkkoks", lt: "Šviesus tikas", en: "Light teak", ru: "Светлый тик" } },
  { key: "ozols-tumss", image: `${IMG}/slat-ozols-tumss.jpg`, name: { lv: "Tumšs ozols", lt: "Tamsus ąžuolas", en: "Dark oak", ru: "Тёмный дуб" } },
  { key: "rieksts", image: `${IMG}/slat-rieksts.jpg`, name: { lv: "Amerikāņu rieksts", lt: "Amerikietiškas riešutas", en: "American walnut", ru: "Американский орех" } },
  { key: "betons-gaiss", image: `${IMG}/slat-betons-gaiss.jpg`, name: { lv: "Gaišs betons", lt: "Šviesus betonas", en: "Light concrete", ru: "Светлый бетон" } },
];

export const METAL_FINISHES = {
  steel: { hex: "#B9BCBF", name: { lv: "Nerūsējošais tērauds", lt: "Nerūdijantis plienas", en: "Stainless steel", ru: "Нержавеющая сталь" } },
  black: { hex: "#1E1E1E", name: { lv: "Melns", lt: "Juoda", en: "Black", ru: "Чёрный" } },
  chrome: { hex: "#D5D8DB", name: { lv: "Hroms", lt: "Chromas", en: "Chrome", ru: "Хром" } },
  gold: { hex: "#C9A34A", name: { lv: "Zelts", lt: "Auksas", en: "Gold", ru: "Золото" } },
  bronze: { hex: "#7A6A4F", name: { lv: "Bronza", lt: "Bronza", en: "Bronze", ru: "Бронза" } },
};

/* Hardware TYPEs from the "Komplektācija" tab. `cylinders` drives the
   Guardian surcharge for inward-opening doors; `latch` marks the TYPEs whose
   mechanical day/night latch can be swapped for a Fuhr electric strike. */
export const HARDWARE_TYPES = {
  t8: {
    label: "TYPE 8",
    cylinders: 2,
    lock: "double",
    images: { chrome: `${IMG}/hw-t8-chrome.jpg`, gold: `${IMG}/hw-t8-gold.jpg`, black: `${IMG}/hw-t8-black.jpg` },
    desc: {
      lv: "«Pava» ovālas formas rokturis ar uzlikām, 2 cilindru slēdzenes uz vienas plāksnes",
      lt: "Ovali rankena «Pava» su antdėklais, 2 cilindrinės spynos ant vienos plokštės",
      en: "Oval «Pava» lever with escutcheons, 2 cylinder locks on one faceplate",
      ru: "Овальная ручка «Pava» с накладками, 2 цилиндровых замка на одной планке",
    },
  },
  t10: {
    label: "TYPE 10",
    cylinders: 1,
    lock: "single",
    latch: true,
    onOrder: true,
    images: { steel: `${IMG}/hw-t10-steel.png`, black: `${IMG}/hw-t10-black.png` },
    desc: {
      lv: "Skavas rokturis 1200 mm, 1 cilindra slēdzene + mehānisks dienas/nakts sprūds",
      lt: "Rankena-skoba 1200 mm, 1 cilindrinė spyna + mechaninis dienos/nakties skląstis",
      en: "1200 mm pull bar, 1 cylinder lock + mechanical day/night latch",
      ru: "Ручка-скоба 1200 мм, 1 цилиндровый замок + механическая защёлка день/ночь",
    },
  },
  t11: {
    label: "TYPE 11",
    cylinders: 1,
    lock: "single",
    latch: true,
    onOrder: true,
    images: { steel: `${IMG}/hw-t11-steel.png`, black: `${IMG}/hw-t11-black.png` },
    desc: {
      lv: "Skavas rokturis 1800 mm, 1 cilindra slēdzene + mehānisks dienas/nakts sprūds",
      lt: "Rankena-skoba 1800 mm, 1 cilindrinė spyna + mechaninis dienos/nakties skląstis",
      en: "1800 mm pull bar, 1 cylinder lock + mechanical day/night latch",
      ru: "Ручка-скоба 1800 мм, 1 цилиндровый замок + механическая защёлка день/ночь",
    },
  },
  t12: {
    label: "TYPE 12",
    cylinders: 2,
    lock: "double",
    latch: true,
    images: { steel: `${IMG}/hw-t12-steel.png`, black: `${IMG}/hw-t12-black.png` },
    desc: {
      lv: "Skavas rokturis 1200 mm, 2 cilindru slēdzenes + mehānisks dienas/nakts sprūds",
      lt: "Rankena-skoba 1200 mm, 2 cilindrinės spynos + mechaninis dienos/nakties skląstis",
      en: "1200 mm pull bar, 2 cylinder locks + mechanical day/night latch",
      ru: "Ручка-скоба 1200 мм, 2 цилиндровых замка + механическая защёлка день/ночь",
    },
  },
  t13: {
    label: "TYPE 13",
    cylinders: 2,
    lock: "double",
    latch: true,
    images: { steel: `${IMG}/hw-t13-steel.png`, black: `${IMG}/hw-t13-black.png` },
    desc: {
      lv: "Skavas rokturis 1800 mm, 2 cilindru slēdzenes + mehānisks dienas/nakts sprūds",
      lt: "Rankena-skoba 1800 mm, 2 cilindrinės spynos + mechaninis dienos/nakties skląstis",
      en: "1800 mm pull bar, 2 cylinder locks + mechanical day/night latch",
      ru: "Ручка-скоба 1800 мм, 2 цилиндровых замка + механическая защёлка день/ночь",
    },
  },
  t14: {
    label: "TYPE 14",
    cylinders: 2,
    lock: "double",
    images: { steel: `${IMG}/hw-t14-steel.jpg`, black: `${IMG}/hw-t14-black.jpg`, gold: `${IMG}/hw-t14-gold.jpg`, bronze: `${IMG}/hw-t14-bronze.jpg` },
    desc: {
      lv: "«Loft» kvadrātveida rokturis ar uzlikām, 2 cilindru slēdzenes uz vienas plāksnes",
      lt: "Kvadratinė rankena «Loft» su antdėklais, 2 cilindrinės spynos ant vienos plokštės",
      en: "Square «Loft» lever with escutcheons, 2 cylinder locks on one faceplate",
      ru: "Квадратная ручка «Loft» с накладками, 2 цилиндровых замка на одной планке",
    },
  },
  t15: {
    label: "TYPE 15",
    cylinders: 2,
    lock: "double",
    latch: true,
    images: { black: `${IMG}/hw-t15-black.png` },
    desc: {
      lv: "«Loft» skavas rokturis 1200 mm ar apaļām uzlikām, 2 cilindru slēdzenes",
      lt: "Rankena-skoba «Loft» 1200 mm su apvaliais antdėklais, 2 cilindrinės spynos",
      en: "«Loft» 1200 mm pull bar with round escutcheons, 2 cylinder locks",
      ru: "Ручка-скоба «Loft» 1200 мм с круглыми накладками, 2 цилиндровых замка",
    },
  },
  t16: {
    label: "TYPE 16",
    cylinders: 2,
    lock: "double",
    latch: true,
    images: { black: `${IMG}/hw-t16-black.png` },
    desc: {
      lv: "«Loft» skavas rokturis 1800 mm, 2 cilindru slēdzenes",
      lt: "Rankena-skoba «Loft» 1800 mm, 2 cilindrinės spynos",
      en: "«Loft» 1800 mm pull bar, 2 cylinder locks",
      ru: "Ручка-скоба «Loft» 1800 мм, 2 цилиндровых замка",
    },
  },
  // Smart Lux models only - fixed set, nothing to choose.
  smart: {
    label: "CBA PSL2 Face ID",
    cylinders: 2,
    lock: "double",
    images: { black: `${IMG}/hw-smart-black.png` },
    desc: {
      lv: "Biometriskā slēdzene ar Face ID, pirkstu nospiedumu, čipkarti, atslēgu un USmartGo aplikāciju, video actiņa; augšējā cilindra slēdzene ar «Loft» uzliku",
      lt: "Biometrinė spyna su Face ID, piršto atspaudu, kortele, raktu ir USmartGo programėle, vaizdo akutė; viršutinė cilindrinė spyna su «Loft» antdėklu",
      en: "Biometric lock with Face ID, fingerprint, card, key and the USmartGo app, video peephole; upper cylinder lock with «Loft» escutcheon",
      ru: "Биометрический замок с Face ID, отпечатком пальца, картой, ключом и приложением USmartGo, видеоглазок; верхний цилиндровый замок с накладкой «Loft»",
    },
  },
};

export const HARDWARE_PARTS = {
  lockDouble: `${IMG}/hw-lock-double.png`,
  lockSingle: `${IMG}/hw-lock-single.png`,
  cylinder: `${IMG}/hw-cylinder.png`,
  latch: `${IMG}/hw-latch.png`,
};

/* Leaf glass tints (per model, see @/data/boston-models) and the tints for
   side-lights / toplights. */
export const GLASS_TINTS = {
  satins: { image: `${IMG}/pano-satins.jpg`, name: { lv: "Satīns (matēts)", lt: "Satinas (matinis)", en: "Satin (frosted)", ru: "Сатин (матовое)" } },
  bronza: { image: `${IMG}/pano-bronza.jpg`, name: { lv: "Bronza", lt: "Bronza", en: "Bronze", ru: "Бронза" } },
  grafits: { image: `${IMG}/pano-grafits.jpg`, name: { lv: "Grafīts", lt: "Grafitas", en: "Graphite", ru: "Графит" } },
  hroms: { image: `${IMG}/pano-hroms.jpg`, name: { lv: "Hroms", lt: "Chromas", en: "Chrome", ru: "Хром" } },
  uv: { image: null, name: { lv: "UV krāsas apdruka", lt: "UV dažų spauda", en: "UV-ink print", ru: "УФ-печать" } },
};
export const PANORAMIC_TINTS = ["satins", "bronza", "grafits", "hroms"];

// The price sheets offer the inset grille only on bronze and chrome panoramic glass.
export const GRILLE_TINTS = {
  bronza: "/images/boston-construction/glass-bronza-restots.jpg",
  hroms: "/images/boston-construction/glass-hroms-restots.jpg",
};

/* Glazing layouts ("TIPS 1-6"): how many side-lights and whether there's a
   toplight above the whole block. */
export const LAYOUTS = [
  { key: "1", sides: 0, top: false, image: `${IMG}/layout-1.png` },
  { key: "2", sides: 1, top: false, image: `${IMG}/layout-2.png` },
  { key: "3", sides: 2, top: false, image: `${IMG}/layout-3.png` },
  { key: "4", sides: 0, top: true, image: `${IMG}/layout-4.png` },
  { key: "5", sides: 1, top: true, image: `${IMG}/layout-5.png` },
  { key: "6", sides: 2, top: true, image: `${IMG}/layout-6.png` },
];
export const DOUBLE_LEAF_SCHEME = `${IMG}/layout-double.png`;

/* Non-standard size and add-on pricing. The two workbooks differ, so each
   model is priced by the rules of the workbook it comes from. Surcharges are
   compounded in the sheets' own order - height, then width (then colour) -
   matching the plain workbook's worked examples (999 € × 1.30 × 1.10 = 1429 €;
   999 € × 1.20 × 1.85 = 2218 €). Tables are [upper bound mm, % surcharge]. */
const HEIGHT_PCT = [
  [2050, 0],
  [2200, 20],
  [2300, 25],
  [2400, 30],
  [2500, 35],
];
const COMMON = {
  stdH: 2050,
  sizeStep: 50,
  glazingMin: 290,
  glazingMax: 1000,
  capitalPerM: 60,
  thirdHingeFrom: 2100,
  twoKFrom: 2200,
  guardianPerCylinder: 45,
};

// Nature / Dēlīši / Ieliktņi workbook (SU and P-SU models).
export const RULES_SU = {
  ...COMMON,
  id: "su",
  customSize: true,
  glazing: true,
  premiumPct: 20,
  single: { minW: 860, maxW: 1000, minH: 2050, maxH: 2500, customWidthPct: 15 },
  double: { minW: 1200, maxW: 1800, minH: 2050, maxH: 2200, stdW: 1250, widthPct: [[1250, 40], [1550, 80], [1800, 100]] },
  heightPct: HEIGHT_PCT,
  glazingRate: (kind, area) => (area < 0.6 ? 950 : 850),
  grilleOnRequest: true,
  casings: [{ key: "alu", perM: 20 }],
  bottomPlatePerM: null,
  castCasingUpTo: 2200,
};

// "BOSTON mazumcenas LV" workbook (plain AG models).
export const RULES_PLAIN = {
  ...COMMON,
  id: "plain",
  customSize: true,
  glazing: true,
  premiumPct: 10,
  single: { minW: 860, maxW: 1050, minH: 2000, maxH: 2500, widths: [[860, 0], [960, 0], [1000, 10], [1050, 10]] },
  double: { minW: 1200, maxW: 1800, minH: 2000, maxH: 2200, stdW: 1250, widthPct: [[1250, 45], [1550, 85], [1800, 105]] },
  heightPct: HEIGHT_PCT,
  // A toplight under 0.6 m² has its own, higher rate; side-lights never do.
  glazingRate: (kind, area, grille) => (kind === "top" && area < 0.6 ? (grille ? 1100 : 1015) : grille ? 850 : 790),
  grilleOnRequest: false,
  casings: [
    { key: "mono", perM: 25 },
    { key: "figured", perM: 35 },
  ],
  bottomPlatePerM: 55,
  castCasingUpTo: null,
};

/* "EURO MODELS" Smart Lux workbook: standard sizes only (860/960x2050 and
   the 1250x2050 door-and-a-half, each priced in the sheet), colours with the
   plain workbook's +10% premium, no side-/toplights, casings or plate. */
export const RULES_SMART = {
  ...RULES_PLAIN,
  id: "smart",
  customSize: false,
  glazing: false,
  casings: [],
  bottomPlatePerM: null,
};
