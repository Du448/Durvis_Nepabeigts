/* Slēptās iekšdurvis, from the Eirodurvis 2026 price list ("Slēptās
   iekšdurvis - durvis no noliktavas un uz pasūtījumu").

   The price list offers the same six configurations twice, and so does the
   catalogue:
   - from stock (p. 2): the two primer models on sale now, and the four
     aluminium / black-edge models marked "drīzumā pieejams" - listed with
     no price and not for sale until they arrive;
   - made to order (p. 3): all six at list price, each with the configurator
     in @/lib/hidden-config (size in 5 mm steps, RAL, mirror, closer, drop
     seal and the rest of pp. 4-7).
   Which list an id is on lives in @/data/hidden-door-options.

   Photography: the catalogue ships a single room render, so the stock
   models use the standard-height door cropped from it and the
   made-to-order ones the full-height door. There is no per-variant
   photography for the aluminium and black edge trims yet. */

const HINGES = "Otlav Invisacta IN300, slēptās, 2 gab. (matēts hroms)";
const LOCK = "Magnētiskā slēdzene ar pretplāksni STV (matēts hroms)";
const FINISH = "Balta grunts, gatava krāsošanai";

const IMAGES_STOCK = [
  "/products/sleptas-durvis-standarta.webp",
  "/products/sleptas-durvis-interjers.webp",
];

const IMAGES_ORDER = [
  "/products/sleptas-durvis-pilna-augstuma.webp",
  "/products/sleptas-durvis-interjers.webp",
];

/* Everything in the box, from the "Pilns standarta durvju komplekts" table. */
const SET_CONTENTS = [
  "Slēptās kārbas profils - 1 gab.",
  "Kārbas stūra savienotāju elementi - 2 gab.",
  "Slēptās eņģes Otlav Invisacta IN300 ar uzlikām (matēts hroms) - 2 eņģes, 8 uzlikas",
  "Īpašs eņģu stiprinājums - 2 gab.",
  "Magnētiskā slēdzene un pretplāksne STV (matēts hroms) - 1 komplekts",
  "Montāžas plāksnes - 6 gab.",
  "Blīvgumijas - 5 tekošie metri",
  "Pašvītņojošās skrūves metālam - 18 gab.",
  "Pašvītņojošās skrūves kokam - 10 gab.",
  "Gruntēta vērtne - 1 gab.",
];

const FRAME_40 = "2034 × 648 / 748 / 848 / 948 mm";
const FRAME_52 = "2044 × 648 / 748 / 848 / 948 mm";
const LEAF_40 = "2000 × 600 / 700 / 800 / 900 mm";
const LEAF_52 = "2010 × 600 / 700 / 800 / 900 mm";
const OPENING_40 = "2055 × 670 / 770 / 870 / 970 mm";
const OPENING_52 = "2065 × 670 / 770 / 870 / 970 mm";

/* Same leaf widths as the rest of the interior range, written width×height
   like every other product's `sizes` - the leaf height is fixed by the
   thickness/swing configuration (2000 mm for the 40 mm outward-opening
   range, 2010 mm for the 52 mm reversed range), not a separate choice. */
const SIZES_40 = ["600×2000", "700×2000", "800×2000", "900×2000"];
const SIZES_52 = ["600×2010", "700×2010", "800×2010", "900×2010"];

/* The written part of the product page. Only the construction paragraph
   changes with the configuration; the rest is the same story every time. */
function describe(construction) {
  return [
    {
      title: "Kas ir slēptās durvis",
      body: [
        "Slēptās durvis iebūvē sienā tā, ka kārba no ārpuses nav redzama: alumīnija profilu iestiprina starpsienā un noslēpj zem apmetuma, bet vērtne aizveras vienā līmenī ar sienu. Redzama paliek tikai plāna ēnu sprauga un rokturis.",
        "Vērtne tiek piegādāta gruntēta, tāpēc to špaktelē, krāso vai tapetē kopā ar sienu. Tā durvis vizuāli pazūd un siena paliek nepārtraukta.",
      ],
    },
    {
      title: "Konstrukcija",
      body: [
        construction,
        "Vērtni tur divas slēptās Otlav Invisacta IN300 eņģes, kuras pēc montāžas var regulēt trīs plaknēs. Aizvēršanu nodrošina magnētiskā slēdzene, tāpēc uz kārbas nav redzamas atslēgas plāksnes un aizverot nav klikšķa.",
      ],
    },
    {
      title: "Izmēri",
      body: [
        "No noliktavas pieejamas četras kārbas: 2034 × 648 / 748 / 848 / 948 mm 40 mm vērtnei un 2044 × 648 / 748 / 848 / 948 mm 52 mm vērtnei. Ieteicamā durvju aile attiecīgi 2055 × 670 / 770 / 870 / 970 mm un 2065 × 670 / 770 / 870 / 970 mm.",
        "Uz pasūtījumu vērtni izgatavo ar 5 mm soli līdz 2700 mm augstumā un 1100 mm platumā. Virs 2300 mm augstuma vērtni izgatavo tikai 52 mm biezumā ar pārfalci.",
      ],
    },
    {
      title: "Nestandarta izmēra piemaksa",
      body: [
        "Platums virs standarta (līdz 1100 mm) vai augstums līdz 2100 mm - piemaksa +10 %. Augstums 2110-2200 mm - +20 %, 2210-2300 mm - +30 %, 2310-2400 mm - +40 %, 2410-2700 mm - +50 %.",
        "Augstākām durvīm nepieciešama trešā vai ceturtā eņģe. Papildu eņģe ar frēzējumu maksā 59 € un procentuālajā piemaksā nav iekļauta.",
      ],
    },
    {
      title: "Papildu aprīkojums",
      body: [
        "Spogulis uz vērtnes - no 210 € par kv.m, grafīta vai bronzas tonī 285 € par kv.m. Slēptais durvju pievilcējs GEZE Boxer - 285 €, iegriešana no 40 €. Krītošais slieksnis CCE (Itālija) skaņas izolācijai un caurvēja novēršanai - no 32 €, iegriešana 25 €.",
        "Durvju atdure NF Stopio Indoor melnā, bronzas vai matēta hroma krāsā - 22 €, iegriešana 10 €. Alumīnija rāmja vai vērtnes malas krāsojums pēc RAL kataloga - 30 €. Urbums rokturim vai cilindra aizgrieznim - 3 €.",
      ],
    },
  ];
}

const AVAILABILITY = {
  stock: "No noliktavas",
  soon: "Drīzumā no noliktavas",
  order: "Pēc pasūtījuma",
};

function specsFull({ thickness, swing, edge, frame, frameSize, leafSize, opening, mode }) {
  return [
    ["Vērtnes biezums", thickness],
    ["Vēršanās virziens", swing],
    ["Kārba", "Slēptā alumīnija kārba"],
    ["Vērtnes mala", edge],
    ["Rāmja krāsa", frame],
    ["Eņģes", HINGES],
    ["Slēdzene", LOCK],
    ["Vērtnes apdare", FINISH],
    ["Standarta kārbas izmērs", frameSize],
    ["Standarta vērtnes izmērs", leafSize],
    ["Ieteicamā durvju aile", opening],
    ["Maksimālais izmērs pēc pasūtījuma", "2700 × 1100 mm"],
    ["Izmēru solis pēc pasūtījuma", "5 mm"],
    ["Pieejamība", AVAILABILITY[mode]],
  ];
}

/* The six configurations of the price list. Each is sold from stock and
   made to order; the entries below are built from these. */
const CONFIGS = {
  "40-grunts": {
    thickness: 40,
    edge: "primer",
    name: "Slēptās durvis 40 mm, balta grunts",
    colors: ["Balta grunts"],
    construction:
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes mala ir gruntēta tāpat kā virsma, tāpēc pēc krāsošanas durvis saplūst ar sienu bez metāla akcenta.",
    specsEdge: null,
    fullEdge: "Gruntēta, bez alumīnija apmales",
    frame: "Standarta",
  },
  "52-revers-grunts": {
    thickness: 52,
    edge: "primer",
    name: "Slēptās durvis 52 mm revers, balta grunts",
    colors: ["Balta grunts"],
    construction:
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Reversajā konstrukcijā vērtnes mala pārsedz kārbu, tāpēc no aizvērtās puses redzama tikai siena un vērtne.",
    specsEdge: null,
    fullEdge: "Gruntēta, ar pārsegumu pār kārbu",
    frame: "Standarta",
  },
  "40-alu-mala": {
    thickness: 40,
    edge: "alu",
    name: "Slēptās durvis 40 mm ar alumīnija malu",
    colors: ["Balta grunts", "Alumīnijs"],
    short:
      "40 mm vērtne ar alumīnija apmali pa perimetru. Apmale pasargā malu no sitieniem un veido tīru metāla līniju starp sienu un vērtni.",
    construction:
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes perimetru noslēdz alumīnija apmale: tā pasargā malu no sitieniem un pēc sienas nokrāsošanas paliek kā vienīgā redzamā metāla līnija. Apmali var nokrāsot pēc RAL kataloga par 30 €.",
    specsEdge: "Alumīnija apmale",
    fullEdge: "Alumīnija apmale",
    frame: "Standarta",
  },
  "52-revers-alu-mala": {
    thickness: 52,
    edge: "alu",
    name: "Slēptās durvis 52 mm revers ar alumīnija malu",
    colors: ["Balta grunts", "Alumīnijs"],
    short:
      "Reversā 52 mm vērtne ar alumīnija apmali. Veras uz telpas iekšpusi, pārsedz kārbu un noslēdzas ar metāla malu pa perimetru.",
    construction:
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un tās perimetru noslēdz alumīnija apmale, kuru var nokrāsot pēc RAL kataloga par 30 €.",
    specsEdge: "Alumīnija apmale",
    fullEdge: "Alumīnija apmale",
    frame: "Standarta",
  },
  "40-melna-mala": {
    thickness: 40,
    edge: "black",
    name: "Slēptās durvis 40 mm, melns rāmis un melna mala",
    colors: ["Balta grunts", "Melns"],
    short:
      "40 mm vērtne ar melnu alumīnija malu un melnu kārbas rāmi. Ap gaišo vērtni paliek tīra melna kontūra - risinājums, kad durvīm jābūt pamanāmām, nevis paslēptām.",
    construction:
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Kārbas rāmis un vērtnes apmale ir melnā alumīnija krāsā, tāpēc ap gaišo vērtni paliek plāna melna kontūra un durvis kļūst par grafisku sienas elementu, nevis pazūd tajā.",
    specsEdge: "Melna alumīnija apmale",
    fullEdge: "Melna alumīnija apmale",
    frame: "Melns",
  },
  "52-revers-melna-mala": {
    thickness: 52,
    edge: "black",
    name: "Slēptās durvis 52 mm revers, melns rāmis un melna mala",
    colors: ["Balta grunts", "Melns"],
    short:
      "Pilnākā konfigurācija: reversā 52 mm vērtne ar melnu alumīnija malu un melnu rāmi. Veras uz telpas iekšpusi un pārsedz kārbu.",
    construction:
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un gan rāmis, gan vērtnes apmale ir melnā alumīnija krāsā.",
    specsEdge: "Melna alumīnija apmale",
    fullEdge: "Melna alumīnija apmale",
    frame: "Melns",
  },
};

const ORDER_SUFFIX = " - uz pasūtījumu";

function hiddenDoor(key, { id, mode, price, oldPrice = null, short, isNew = false }) {
  const cfg = CONFIGS[key];
  const is40 = cfg.thickness === 40;
  return {
    id,
    name: mode === "order" ? `${cfg.name}${ORDER_SUFFIX}` : cfg.name,
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price,
    oldPrice,
    inStock: mode === "stock",
    ...(mode === "order" ? { stockSource: "order" } : {}),
    ...(mode === "soon" ? { comingSoon: true } : {}),
    sizes: is40 ? SIZES_40 : SIZES_52,
    colors: cfg.colors,
    thermo: false,
    glass: false,
    isNew,
    clearance: false,
    images: mode === "order" ? IMAGES_ORDER : IMAGES_STOCK,
    short: short || cfg.short,
    specs: {
      "Vērtnes biezums": `${cfg.thickness} mm`,
      "Vēršanās virziens": is40 ? "Uz ārpusi" : "Uz iekšpusi (revers)",
      ...(cfg.specsEdge ? { "Vērtnes mala": cfg.specsEdge } : {}),
      ...(cfg.frame === "Melns" ? { "Rāmja krāsa": "Melns" } : {}),
      "Slēdzenes": "Magnētiskā, matēts hroms",
      ...(cfg.specsEdge ? {} : { "Furnitūra": "Otlav Invisacta IN300, slēptās eņģes" }),
      ...(cfg.frame === "Melns" ? {} : { "Apdare": FINISH }),
      "Pieejamība": AVAILABILITY[mode],
    },
    set: SET_CONTENTS,
    description: describe(cfg.construction),
    specsFull: specsFull({
      thickness: `${cfg.thickness} mm`,
      swing: is40 ? "Uz ārpusi" : "Uz iekšpusi (revers)",
      edge: cfg.fullEdge,
      frame: cfg.frame,
      frameSize: is40 ? FRAME_40 : FRAME_52,
      leafSize: is40 ? LEAF_40 : LEAF_52,
      opening: is40 ? OPENING_40 : OPENING_52,
      mode,
    }),
  };
}

export const hiddenDoors = [
  // --- No noliktavas (p. 2) --------------------------------------------
  hiddenDoor("40-grunts", {
    id: "sleptas-40-grunts",
    mode: "stock",
    price: 379,
    oldPrice: 419,
    short:
      "Slēpto durvju komplekts ar 40 mm gruntētu vērtni, kas veras uz ārpusi. Kārba, vērtne un divas slēptās eņģes vienā cenā, pieejams no noliktavas.",
  }),
  hiddenDoor("52-revers-grunts", {
    id: "sleptas-52-revers-grunts",
    mode: "stock",
    price: 399,
    oldPrice: 439,
    short:
      "Reversais komplekts ar 52 mm vērtni, kas veras uz telpas iekšpusi. Vērtne pārsedz kārbu, tāpēc no aizvērtās puses kārba nav redzama vispār.",
  }),
  hiddenDoor("40-alu-mala", { id: "sleptas-40-alu-mala-noliktava", mode: "soon", price: null }),
  hiddenDoor("52-revers-alu-mala", { id: "sleptas-52-revers-alu-mala-noliktava", mode: "soon", price: null }),
  hiddenDoor("40-melna-mala", { id: "sleptas-40-melna-mala-noliktava", mode: "soon", price: null }),
  hiddenDoor("52-revers-melna-mala", { id: "sleptas-52-revers-melna-mala-noliktava", mode: "soon", price: null }),

  // --- Uz pasūtījumu (p. 3) --------------------------------------------
  hiddenDoor("40-grunts", {
    id: "sleptas-40-grunts-pasutijums",
    mode: "order",
    price: 419,
    short:
      "40 mm gruntēta vērtne, kas veras uz ārpusi, izgatavota tieši jūsu ailei: izmērs ar 5 mm soli līdz 2300 × 1100 mm, spogulis, slēptais pievilcējs un krītošais slieksnis pēc izvēles.",
  }),
  hiddenDoor("52-revers-grunts", {
    id: "sleptas-52-revers-grunts-pasutijums",
    mode: "order",
    price: 439,
    short:
      "Reversā 52 mm gruntētā vērtne, izgatavota tieši jūsu ailei: izmērs ar 5 mm soli līdz 2700 × 1100 mm, durvīm līdz griestiem arī bez augšējās kārbas daļas.",
  }),
  hiddenDoor("40-alu-mala", { id: "sleptas-40-alu-mala", mode: "order", price: 499, isNew: true }),
  hiddenDoor("52-revers-alu-mala", { id: "sleptas-52-revers-alu-mala", mode: "order", price: 539, isNew: true }),
  hiddenDoor("40-melna-mala", { id: "sleptas-40-melna-mala", mode: "order", price: 579, isNew: true }),
  hiddenDoor("52-revers-melna-mala", { id: "sleptas-52-revers-melna-mala", mode: "order", price: 619, isNew: true }),
];
