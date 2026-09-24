/* Locks and cylinders fitted to the manufacturer's models, shown in the
   "Slēdzenes" tab on the product page: a photo on the left, the lock's
   specification table on the right, and a switch between the locks a door
   has.

   Taken from the "Замки" tab of each model's page on bulat-doors.com.ua and
   translated. To change what a product shows, edit `productLocks` (which
   locks, in which order); to change a lock itself, edit it in `locks` - every
   model that uses it picks the change up. A value is either one string for
   all languages (numbers, brand names) or { lv, lt, en }. */

const YES = { lv: "Ir", lt: "Yra", en: "Yes" };
const NO = { lv: "Nav", lt: "Nėra", en: "No" };
const TURKEY = { lv: "Turcija", lt: "Turkija", en: "Turkey" };
const ITALY = { lv: "Itālija", lt: "Italija", en: "Italy" };
const LEVER = { lv: "Suvaldu", lt: "Sisteminis", en: "Lever" };
const CYLINDER = { lv: "Cilindra", lt: "Cilindrinis", en: "Cylinder" };
const BRASS = { lv: "Misiņš", lt: "Žalvaris", en: "Brass" };
const PERFORATED = { lv: "Perforēta", lt: "Perforuotas", en: "Perforated" };
const WARRANTY_60 = { lv: "60 mēneši", lt: "60 mėnesių", en: "60 months" };
const WITH_CYLINDER = { lv: "Cilindra komplektā", lt: "Su cilindru", en: "Supplied with the cylinder" };
const OPTIONAL = { lv: "Papildu opcija", lt: "Papildoma parinktis", en: "Optional extra" };
const FIVE_PLUS_ONE = { lv: "5 + 1 montāžas", lt: "5 + 1 montavimo", en: "5 + 1 installation" };

export const LOCK_LABELS = {
  model: { lv: "Modelis", lt: "Modelis", en: "Model" },
  manufacturer: { lv: "Ražotājs", lt: "Gamintojas", en: "Manufacturer" },
  country: { lv: "Ražotājvalsts", lt: "Kilmės šalis", en: "Country of origin" },
  mechanism: { lv: "Slēgmehānisms", lt: "Slaptumo mechanizmas", en: "Locking mechanism" },
  securityClass: { lv: "Drošības klase", lt: "Saugumo klasė", en: "Security class" },
  directions: { lv: "Aizslēgšanas virzienu skaits", lt: "Užrakinimo krypčių skaičius", en: "Locking directions" },
  bolts: { lv: "Rīvju skaits", lt: "Skląsčių skaičius", en: "Number of bolts" },
  boltDiameter: { lv: "Rīvja diametrs", lt: "Skląsčio skersmuo", en: "Bolt diameter" },
  boltThrow: { lv: "Rīvja izbīde", lt: "Skląsčio išsikišimas", en: "Bolt throw" },
  keys: { lv: "Atslēgu skaits", lt: "Raktų skaičius", en: "Number of keys" },
  manganese: { lv: "Mangāna plāksne", lt: "Mangano plokštelė", en: "Manganese plate" },
  nightLatch: { lv: "Nakts aizbīdnis", lt: "Naktinė sklendė", en: "Night latch" },
  features: { lv: "Īpašības", lt: "Ypatybės", en: "Features" },
  material: { lv: "Materiāls", lt: "Medžiaga", en: "Material" },
  combinations: { lv: "Kombināciju skaits", lt: "Kombinacijų skaičius", en: "Number of combinations" },
  pins: { lv: "Tapiņu skaits", lt: "Kaiščių skaičius", en: "Number of pins" },
  keyType: { lv: "Atslēgas tips", lt: "Rakto tipas", en: "Key type" },
  antiDrill: { lv: "Pretizurbšanas tapas", lt: "Kaiščiai nuo išgręžimo", en: "Anti-drill pins" },
  bumping: { lv: "Aizsardzība pret bampingu", lt: "Apsauga nuo „bampingo“", en: "Bump protection" },
  copying: { lv: "Aizsardzība pret atslēgu kopēšanu", lt: "Apsauga nuo raktų kopijavimo", en: "Key copy protection" },
  warranty: { lv: "Garantija", lt: "Garantija", en: "Warranty" },
};

export const LOCK_KINDS = {
  upper: { lv: "Augšējā slēdzene", lt: "Viršutinė spyna", en: "Upper lock" },
  lower: { lv: "Apakšējā slēdzene", lt: "Apatinė spyna", en: "Lower lock" },
  cylinder: { lv: "Cilindrs", lt: "Cilindras", en: "Cylinder" },
  monoblock: { lv: "Monobloks", lt: "Monoblokas", en: "Monoblock" },
};

const IMG = "https://www.bulat-doors.com.ua/wp-content/uploads";

export const locks = {
  "kale-257-lever": {
    kind: "upper",
    name: { lv: "KALE 257, suvaldu", lt: "KALE 257, sisteminė", en: "KALE 257, lever" },
    image: `${IMG}/2023/07/zamok-kale-257-vreznoj-suvaldnyj-1024x768.webp`,
    specs: [
      ["model", "257"],
      ["manufacturer", "KALE"],
      ["country", TURKEY],
      ["mechanism", LEVER],
      ["securityClass", "3"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "34 mm"],
      ["keys", "5"],
      ["manganese", YES],
      ["warranty", WARRANTY_60],
    ],
  },
  "kale-257-cylinder": {
    kind: "upper",
    name: { lv: "KALE 257, cilindra", lt: "KALE 257, cilindrinė", en: "KALE 257, cylinder" },
    image: `${IMG}/2023/09/verhniy-zamok-kale-257-pid-cilindr-tovshchina-rigelya-16-mm.jpg`,
    specs: [
      ["model", "257"],
      ["manufacturer", "KALE"],
      ["country", TURKEY],
      ["mechanism", CYLINDER],
      ["securityClass", "4"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "34 mm"],
      ["keys", "5"],
      ["manganese", NO],
      ["warranty", WARRANTY_60],
    ],
  },
  "kale-252": {
    kind: "lower",
    name: { lv: "KALE 252, cilindra", lt: "KALE 252, cilindrinė", en: "KALE 252, cylinder" },
    image: `${IMG}/2023/07/nizhniy-zamok-kale-252-tovshchina-rigelya-16-mm.jpg`,
    specs: [
      ["model", "252"],
      ["manufacturer", "KALE"],
      ["country", TURKEY],
      ["mechanism", CYLINDER],
      ["securityClass", "4"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "34 mm"],
      ["keys", WITH_CYLINDER],
      ["manganese", NO],
      ["warranty", WARRANTY_60],
    ],
  },
  "hisar-tandem": {
    kind: "cylinder",
    name: "Hisar Kilit Tandem",
    image: `${IMG}/2023/09/hisar-kilit-1024x504.jpg`,
    specs: [
      ["model", "Hisar Kilit Tandem"],
      ["manufacturer", "Hisar Kilit"],
      ["country", TURKEY],
      ["material", BRASS],
      ["securityClass", "2"],
      ["combinations", "91 000"],
      ["pins", "5"],
      ["keyType", PERFORATED],
      ["antiDrill", "2"],
      ["bumping", NO],
      ["copying", NO],
      ["keys", "5"],
      ["warranty", WARRANTY_60],
    ],
  },
  "mottura-54797-matic": {
    kind: "monoblock",
    name: "Mottura 54.797 Matic",
    image: `${IMG}/2023/09/monoblok-mottura-54-797-matic-25-key.jpg`,
    specs: [
      [
        "model",
        {
          lv: "54.797 Matic (vienreizēja pārkodēšana)",
          lt: "54.797 Matic (vienkartinis perkodavimas)",
          en: "54.797 Matic (one-time recoding)",
        },
      ],
      ["manufacturer", "Mottura"],
      ["country", ITALY],
      ["mechanism", { lv: "Suvaldu un cilindra", lt: "Sisteminis ir cilindrinis", en: "Lever and cylinder" }],
      ["securityClass", "4"],
      ["directions", "3"],
      ["bolts", "5"],
      ["boltDiameter", "18 mm"],
      ["boltThrow", "36 mm"],
      ["keys", { lv: "5 pamata + 2 montāžas", lt: "5 pagrindiniai + 2 montavimo", en: "5 main + 2 installation" }],
      ["manganese", NO],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-2019": {
    kind: "upper",
    name: { lv: "Securemme 2019, suvaldu", lt: "Securemme 2019, sisteminė", en: "Securemme 2019, lever" },
    image: `${IMG}/2023/09/verhniy-zamok-securemme-2019-suvaldniy-italiya-suvaldniy-tovshchina-rigelya-16-mm.jpg`,
    specs: [
      ["model", "2019"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["mechanism", LEVER],
      ["securityClass", "4"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "36 mm"],
      ["keys", "5"],
      ["manganese", YES],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-2030": {
    kind: "upper",
    name: { lv: "Securemme 2030, suvaldu", lt: "Securemme 2030, sisteminė", en: "Securemme 2030, lever" },
    image: `${IMG}/2023/09/verhniy-zamok-securemme-2030-suvaldniy-tovshchina-rigelya-16-mm.jpg`,
    specs: [
      ["model", "2030"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["mechanism", LEVER],
      ["securityClass", "4"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "36 mm"],
      ["keys", "5"],
      ["manganese", YES],
      ["nightLatch", YES],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-2061": {
    kind: "lower",
    name: { lv: "Securemme 2061, cilindra", lt: "Securemme 2061, cilindrinė", en: "Securemme 2061, cylinder" },
    image: `${IMG}/2023/09/nizhniy-zamok-securemme-2061-pid-cilindr-italiya-cilindroviy-tovshchina-rigelya-16-mm.jpg`,
    specs: [
      ["model", "2061"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["mechanism", CYLINDER],
      ["securityClass", "3"],
      ["directions", "1"],
      ["bolts", "3"],
      ["boltDiameter", "16 mm"],
      ["boltThrow", "34,5 mm"],
      ["keys", WITH_CYLINDER],
      ["manganese", NO],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-2663": {
    kind: "upper",
    name: {
      lv: "Securemme 2663 TOP GEAR, reduktora",
      lt: "Securemme 2663 TOP GEAR, reduktorinė",
      en: "Securemme 2663 TOP GEAR, geared",
    },
    image: `${IMG}/2023/09/verhniy-zamok-securemme-2663-top-gear-reduktorniy-tovshchina-rigelya-18-mm-4-klas-bezpeki.jpg`,
    specs: [
      // The manufacturer's table says "2063"; its heading, photo and our
      // specification all say 2663.
      ["model", "2663"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["mechanism", CYLINDER],
      [
        "securityClass",
        {
          lv: "4 (ar Securemme K-64 cilindru - 5. klase)",
          lt: "4 (su Securemme K-64 cilindru - 5 klasė)",
          en: "4 (class 5 with the Securemme K-64 cylinder)",
        },
      ],
      ["directions", "1"],
      ["bolts", "5"],
      ["boltDiameter", "18 mm"],
      ["boltThrow", "36 mm"],
      ["keys", "5"],
      ["manganese", OPTIONAL],
      [
        "features",
        {
          lv: "Kluss darbs, pastiprināti rīvji, papildu aizsardzība pret uzlaušanu ar spēku, cilindra stiprinājuma sistēma",
          lt: "Tylus veikimas, sustiprinti skląsčiai, papildoma apsauga nuo įsilaužimo jėga, cilindro tvirtinimo sistema",
          en: "Quiet operation, reinforced bolts, extra protection against forced entry, cylinder fixing system",
        },
      ],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-2653": {
    kind: "lower",
    name: {
      lv: "Securemme 2653 TOP GEAR, cilindra",
      lt: "Securemme 2653 TOP GEAR, cilindrinė",
      en: "Securemme 2653 TOP GEAR, cylinder",
    },
    image: `${IMG}/2023/09/nizhniy-zamok-securemme-2653-top-gear-cilindroviy-tovshchina-rigelya-18-mm.jpg`,
    specs: [
      ["model", "2653"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["mechanism", CYLINDER],
      ["securityClass", "4"],
      ["directions", "1"],
      ["bolts", "5"],
      ["boltDiameter", "18 mm"],
      ["boltThrow", "36 mm"],
      ["keys", "5"],
      ["manganese", OPTIONAL],
      [
        "features",
        {
          lv: "Aizsardzība pret uzlaušanu ar spēku",
          lt: "Apsauga nuo įsilaužimo jėga",
          en: "Protection against forced entry",
        },
      ],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-k2": {
    kind: "cylinder",
    name: "Securemme K-2",
    image: `${IMG}/2023/07/cilindr-securemme-k-2.jpg`,
    specs: [
      ["model", "K-2"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["material", BRASS],
      ["securityClass", "2"],
      ["combinations", "200 000"],
      ["pins", "10"],
      ["keyType", PERFORATED],
      ["antiDrill", "2"],
      ["bumping", YES],
      ["copying", YES],
      ["keys", FIVE_PLUS_ONE],
      ["warranty", WARRANTY_60],
    ],
  },
  "securemme-k64": {
    kind: "cylinder",
    name: "Securemme K-64",
    image: `${IMG}/2023/09/cilindr-securemme-k-64.jpg`,
    specs: [
      ["model", "K-64"],
      ["manufacturer", "Securemme"],
      ["country", ITALY],
      ["material", BRASS],
      ["securityClass", "4"],
      ["combinations", "4 500 000"],
      ["pins", "11"],
      ["keyType", PERFORATED],
      ["antiDrill", "3"],
      ["bumping", YES],
      ["copying", YES],
      ["keys", FIVE_PLUS_ONE],
      ["warranty", WARRANTY_60],
    ],
  },
};

// Product id -> its locks, in the order the tab lists them.
export const productLocks = {
  // KALE 257 lever + KALE 252 + Hisar Kilit Tandem
  "ultra-kale-547-251-ardenu-rieksts-rustic-avignon-blanc": ["kale-257-lever", "kale-252", "hisar-tandem"],
  "citadel-b-83-kale-554-oksids-tumss-oksids-gaiss": ["kale-257-lever", "kale-252", "hisar-tandem"],
  "citadel-b-83-kale-584-589-ozols-tabakas-ozols-nemo-latte": ["kale-257-lever", "kale-252", "hisar-tandem"],
  "citadel-b-83-kale-593-248-venge-horizonts-peleks-balts-sagre": ["kale-257-lever", "kale-252", "hisar-tandem"],
  "citadel-b-83-kale-594-605-spogulis-oksids-melns-viss-dekors-": ["kale-257-lever", "kale-252", "hisar-tandem"],
  "termo-ultra-kale-567-gluds-hroms-balts-matets": ["kale-257-lever", "kale-252", "hisar-tandem"],
  // KALE 257 cylinder + KALE 252 + Hisar Kilit Tandem
  "termo-house-706-431-1200-mm-ozols-bronza-rieksts-naturals": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "cottage-710-265-metalic-anthracite-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "cottage-705-431-metalic-anthracite-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "cottage-710-265-metalic-anthracite-antracits-peleks": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "cottage-705-431-metalic-anthracite-antracits-peleks": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200-mm-ozols-bronza-piena-krasa": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-tumss-antracits-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-ozols-bronza-piena-krasa": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-ozols-bronza-rieksts-naturals": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-tumss-antracits-antracits-peleks": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-tumss-antracits-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-venge-tumss-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-706-431-1200mm-tumss-antracits-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-706-431-1200mm-tumss-antracits-antracits-peleks": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-706-431-1200-mm-venge-tumss-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "th-710-antracits": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "th-710-venge": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "th-705-431-antracits": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "th-705-431-balts": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "th-705-431-venge-balts": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  // Mottura 54.797 Matic monoblock + Securemme K-2
  "expert-mottura-570-568-ozols-dorato-tumss-alva-supermatets": ["mottura-54797-matic", "securemme-k2"],
  "termo-expert-mottura-550-253-roxy-antracits-peleks-balts-mat": ["mottura-54797-matic", "securemme-k2"],
  // Securemme 2030 + 2061 + K-2
  "termo-status-securemme-269-263-hroms-balts-matets": ["securemme-2030", "securemme-2061", "securemme-k2"],
  // Securemme 2019 + 2061 (cylinder not listed by the manufacturer)
  "ultra-securemme-557-607-spogulis-pelnu-metalika": ["securemme-2019", "securemme-2061"],
  "ultra-securemme-540-249-akmens-grieziens-balts-matets-gluds": ["securemme-2019", "securemme-2061"],
  "ultra-546-spogulis": ["securemme-2019", "securemme-2061"],
  // Securemme 2663 + 2653 TOP GEAR + K-64
  "fortezza-securemme-563-556-akmens-grieziens-peleks-siferis": ["securemme-2663", "securemme-2653", "securemme-k64"],

  /* Models the manufacturer has no locks tab for. Matched by their own
     specification rows (Augšējā / Apakšējā slēdzene, Cilindra mehānisms)
     against the rows of the models above; locks we have no data for (ARIKO,
     PES Monoblok, Mottura 54.797 without Matic, the 40×30 cylinder) are left
     out, so some of these show only part of the door's locks. */
  // kale-257-cylinder,kale-252,hisar-tandem
  "termo-house-706-431-1200-mm-venge-tumss-venge-tumss": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "tandem-kale-276-dreamwood-tumss": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "tandem-kale-586-gluds-oksids-melns-viss-dekors-balts-matets-": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-ozols-bronza-piena-krasa": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-ozols-bronza-piena-krasa": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-ozols-bronza-rieksts-naturals": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-ozols-bronza-rieksts-naturals": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200mm-tumss-antracits-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-1200-mm-venge-tumss-venge-tumss": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-705-431-venge-tumss-venge-tumss": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200mm-venge-tumss-venge-tumss": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200mm-ozols-bronza-rieksts-naturals": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-venge-tumss-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-706-431-1200mm-ozols-bronza-piena-krasa": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200mm-tumss-antracits-antracits-peleks": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  "termo-house-710-265-1200mm-venge-tumss-balts-satins": ["kale-257-cylinder", "kale-252", "hisar-tandem"],
  // securemme-2019,securemme-2061 (same specification as the Ultra Securemme models above)
  "ultra-securemme-587-276-musona-koks-alva-supermatets": ["securemme-2019", "securemme-2061"],
  // securemme-k2
  "olimp-mottura-589-oksids-tumss": ["securemme-k2"],
  "termo-olimp-mottura-575-568-oksids-melns-balts-matets": ["securemme-k2"],
  "olimp-mottura-571-238-dreamwood-tumss-alva-supermatets": ["securemme-k2"],
  // kale-252
  "citadel-b-606-kale-580-543-betons-antracits-oksids-balts": ["kale-252"],
  "citadel-b-606-kale-229-dreamwood-tumss-dreamwood-gaiss": ["kale-252"],
  // kale-252,hisar-tandem
  "citadel-b-85-kale-591-antracits-balts-sagrens": ["kale-252", "hisar-tandem"],
  "citadel-b-85-kale-559-191-akmens-grieziens-balts-matets-glud": ["kale-252", "hisar-tandem"],
  "citadel-b-85-kale-544-ozols-nemo-karbons-ozols-nemo-sudraba": ["kale-252", "hisar-tandem"],
  "citadel-b-85-kale-535-dreamwood-tumss": ["kale-252", "hisar-tandem"],
  // kale-257-lever,hisar-tandem
  "termo-tandem-elektro-kale-590-gluds-akmens-grieziens-bezatsl": ["kale-257-lever", "hisar-tandem"],
  "tandem-elektro-kale-566-bezatslegas-piekluve": ["kale-257-lever", "hisar-tandem"],
  // kale-257-cylinder,hisar-tandem
  "termo-house-elektro-706-431-1200-mm-venge-tumss-balts-satins": ["kale-257-cylinder", "hisar-tandem"],
  "termo-house-elektro-705-431-venge-tumss-balts-satins": ["kale-257-cylinder", "hisar-tandem"],
  "termo-house-elektro-706-431-1200-mm-balts-satins": ["kale-257-cylinder", "hisar-tandem"],
  "termo-house-elektro-705-431-balts-satins": ["kale-257-cylinder", "hisar-tandem"],
};

const pick = (value, locale) => (typeof value === "string" ? value : value?.[locale] ?? value?.lv ?? "");

/* The product's locks in one language, ready for the page: kind, name, photo
   and [label, value] rows. Empty when the product has none. */
export function locksFor(productId, locale) {
  return (productLocks[productId] || [])
    .map((id) => {
      const lock = locks[id];
      if (!lock) return null;
      return {
        id,
        kind: pick(LOCK_KINDS[lock.kind], locale),
        name: pick(lock.name, locale),
        image: lock.image,
        rows: lock.specs.map(([key, value]) => [pick(LOCK_LABELS[key], locale) || key, pick(value, locale)]),
      };
    })
    .filter(Boolean);
}
