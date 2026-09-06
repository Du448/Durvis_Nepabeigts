/* Slēptās iekšdurvis, from the Eirodurvis 2026 price list ("Slēptās
   iekšdurvis - durvis no noliktavas un uz pasūtījumu").

   Only the retail-facing half of that list is here: the six configurations a
   customer actually picks between, what arrives in the box, the stock and
   made-to-order sizes, and the accessories worth choosing. The dealer
   mechanics in the same document are deliberately left out - the base-price
   rules behind the RAL surcharges, the frame reinforcement kit, spacer
   manufacturing, leaves with reduced thickness, sets without the top frame
   member, and the hinge-count matrix. Those belong in a quote, not on a
   product page.

   Photography: the catalogue ships a single room render, so the two stock
   models use the standard-height door cropped from it and the four
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

/* Same leaf widths as the rest of the interior range, so the size filter in
   the catalogue sidebar keeps one set of options rather than two. */
const SIZES = ["600", "700", "800", "900 mm"];

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

function specsFull({ thickness, swing, edge, frame, frameSize, leafSize, opening, stock }) {
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
    ["Pieejamība", stock ? "No noliktavas" : "Pēc pasūtījuma"],
  ];
}

export const hiddenDoors = [
  {
    id: "sleptas-40-grunts",
    name: "Slēptās durvis 40 mm, balta grunts",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 379,
    oldPrice: 419,
    inStock: true,
    sizes: SIZES,
    colors: ["Balta grunts"],
    thermo: false,
    glass: false,
    isNew: false,
    clearance: false,
    images: IMAGES_STOCK,
    short:
      "Slēpto durvju komplekts ar 40 mm gruntētu vērtni, kas veras uz ārpusi. Kārba, vērtne un divas slēptās eņģes vienā cenā, pieejams no noliktavas.",
    specs: {
      "Vērtnes biezums": "40 mm",
      "Vēršanās virziens": "Uz ārpusi",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Furnitūra": "Otlav Invisacta IN300, slēptās eņģes",
      "Apdare": FINISH,
      "Pieejamība": "No noliktavas",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes mala ir gruntēta tāpat kā virsma, tāpēc pēc krāsošanas durvis saplūst ar sienu bez metāla akcenta."
    ),
    specsFull: specsFull({
      thickness: "40 mm",
      swing: "Uz ārpusi",
      edge: "Gruntēta, bez alumīnija apmales",
      frame: "Standarta",
      frameSize: FRAME_40,
      leafSize: LEAF_40,
      opening: OPENING_40,
      stock: true,
    }),
  },
  {
    id: "sleptas-52-revers-grunts",
    name: "Slēptās durvis 52 mm revers, balta grunts",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 399,
    oldPrice: 439,
    inStock: true,
    sizes: SIZES,
    colors: ["Balta grunts"],
    thermo: false,
    glass: false,
    isNew: false,
    clearance: false,
    images: IMAGES_STOCK,
    short:
      "Reversais komplekts ar 52 mm vērtni, kas veras uz telpas iekšpusi. Vērtne pārsedz kārbu, tāpēc no aizvērtās puses kārba nav redzama vispār.",
    specs: {
      "Vērtnes biezums": "52 mm",
      "Vēršanās virziens": "Uz iekšpusi (revers)",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Furnitūra": "Otlav Invisacta IN300, slēptās eņģes",
      "Apdare": FINISH,
      "Pieejamība": "No noliktavas",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Reversajā konstrukcijā vērtnes mala pārsedz kārbu, tāpēc no aizvērtās puses redzama tikai siena un vērtne."
    ),
    specsFull: specsFull({
      thickness: "52 mm",
      swing: "Uz iekšpusi (revers)",
      edge: "Gruntēta, ar pārsegumu pār kārbu",
      frame: "Standarta",
      frameSize: FRAME_52,
      leafSize: LEAF_52,
      opening: OPENING_52,
      stock: true,
    }),
  },
  {
    id: "sleptas-40-alu-mala",
    name: "Slēptās durvis 40 mm ar alumīnija malu",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 499,
    oldPrice: null,
    inStock: false,
    sizes: SIZES,
    colors: ["Balta grunts", "Alumīnijs"],
    thermo: false,
    glass: false,
    isNew: true,
    clearance: false,
    images: IMAGES_ORDER,
    short:
      "40 mm vērtne ar alumīnija apmali pa perimetru. Apmale pasargā malu no sitieniem un veido tīru metāla līniju starp sienu un vērtni.",
    specs: {
      "Vērtnes biezums": "40 mm",
      "Vēršanās virziens": "Uz ārpusi",
      "Vērtnes mala": "Alumīnija apmale",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Apdare": FINISH,
      "Pieejamība": "Pēc pasūtījuma",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes perimetru noslēdz alumīnija apmale: tā pasargā malu no sitieniem un pēc sienas nokrāsošanas paliek kā vienīgā redzamā metāla līnija. Apmali var nokrāsot pēc RAL kataloga par 30 €."
    ),
    specsFull: specsFull({
      thickness: "40 mm",
      swing: "Uz ārpusi",
      edge: "Alumīnija apmale",
      frame: "Standarta",
      frameSize: FRAME_40,
      leafSize: LEAF_40,
      opening: OPENING_40,
      stock: false,
    }),
  },
  {
    id: "sleptas-52-revers-alu-mala",
    name: "Slēptās durvis 52 mm revers ar alumīnija malu",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 539,
    oldPrice: null,
    inStock: false,
    sizes: SIZES,
    colors: ["Balta grunts", "Alumīnijs"],
    thermo: false,
    glass: false,
    isNew: true,
    clearance: false,
    images: IMAGES_ORDER,
    short:
      "Reversā 52 mm vērtne ar alumīnija apmali. Veras uz telpas iekšpusi, pārsedz kārbu un noslēdzas ar metāla malu pa perimetru.",
    specs: {
      "Vērtnes biezums": "52 mm",
      "Vēršanās virziens": "Uz iekšpusi (revers)",
      "Vērtnes mala": "Alumīnija apmale",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Apdare": FINISH,
      "Pieejamība": "Pēc pasūtījuma",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un tās perimetru noslēdz alumīnija apmale, kuru var nokrāsot pēc RAL kataloga par 30 €."
    ),
    specsFull: specsFull({
      thickness: "52 mm",
      swing: "Uz iekšpusi (revers)",
      edge: "Alumīnija apmale",
      frame: "Standarta",
      frameSize: FRAME_52,
      leafSize: LEAF_52,
      opening: OPENING_52,
      stock: false,
    }),
  },
  {
    id: "sleptas-40-melna-mala",
    name: "Slēptās durvis 40 mm, melns rāmis un melna mala",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 579,
    oldPrice: null,
    inStock: false,
    sizes: SIZES,
    colors: ["Balta grunts", "Melns"],
    thermo: false,
    glass: false,
    isNew: true,
    clearance: false,
    images: IMAGES_ORDER,
    short:
      "40 mm vērtne ar melnu alumīnija malu un melnu kārbas rāmi. Ap gaišo vērtni paliek tīra melna kontūra - risinājums, kad durvīm jābūt pamanāmām, nevis paslēptām.",
    specs: {
      "Vērtnes biezums": "40 mm",
      "Vēršanās virziens": "Uz ārpusi",
      "Vērtnes mala": "Melna alumīnija apmale",
      "Rāmja krāsa": "Melns",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Pieejamība": "Pēc pasūtījuma",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Kārbas rāmis un vērtnes apmale ir melnā alumīnija krāsā, tāpēc ap gaišo vērtni paliek plāna melna kontūra un durvis kļūst par grafisku sienas elementu, nevis pazūd tajā."
    ),
    specsFull: specsFull({
      thickness: "40 mm",
      swing: "Uz ārpusi",
      edge: "Melna alumīnija apmale",
      frame: "Melns",
      frameSize: FRAME_40,
      leafSize: LEAF_40,
      opening: OPENING_40,
      stock: false,
    }),
  },
  {
    id: "sleptas-52-revers-melna-mala",
    name: "Slēptās durvis 52 mm revers, melns rāmis un melna mala",
    collection: "EIRODURVIS",
    category: "sleptas-durvis",
    price: 619,
    oldPrice: null,
    inStock: false,
    sizes: SIZES,
    colors: ["Balta grunts", "Melns"],
    thermo: false,
    glass: false,
    isNew: true,
    clearance: false,
    images: IMAGES_ORDER,
    short:
      "Pilnākā konfigurācija: reversā 52 mm vērtne ar melnu alumīnija malu un melnu rāmi. Veras uz telpas iekšpusi un pārsedz kārbu.",
    specs: {
      "Vērtnes biezums": "52 mm",
      "Vēršanās virziens": "Uz iekšpusi (revers)",
      "Vērtnes mala": "Melna alumīnija apmale",
      "Rāmja krāsa": "Melns",
      "Slēdzenes": "Magnētiskā, matēts hroms",
      "Pieejamība": "Pēc pasūtījuma",
    },
    set: SET_CONTENTS,
    description: describe(
      "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un gan rāmis, gan vērtnes apmale ir melnā alumīnija krāsā."
    ),
    specsFull: specsFull({
      thickness: "52 mm",
      swing: "Uz iekšpusi (revers)",
      edge: "Melna alumīnija apmale",
      frame: "Melns",
      frameSize: FRAME_52,
      leafSize: LEAF_52,
      opening: OPENING_52,
      stock: false,
    }),
  },
];
