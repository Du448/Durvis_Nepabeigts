/* English for catalogue strings that no other dictionary covers - mostly the
   Boston aluminium doors' specification rows (lock system, glass unit,
   finish, design codes) and a few product names and blurbs. Keys are the
   Latvian source strings exactly as in products.js / catalog-specs.js, and
   mirror ru/boston.js one for one. */

// "M16 (ārpusē); M17 (iekšpusē)" - the manufacturer's design codes for the
// outside and inside of the leaf, only the two words translated.
const DESIGN_CODES = [
  "SU4 (ārpusē); SU4 (iekšpusē)",
  "SU4 (ārpusē); M0 (iekšpusē)",
  "M (ārpusē); M0 (iekšpusē)",
  "M (ārpusē); M (iekšpusē)",
  "M16 (ārpusē); M17 (iekšpusē)",
  "SU1 (ārpusē); SU1 (iekšpusē)",
  "M8 (ārpusē); M26 (iekšpusē)",
  "M4 (ārpusē); M5 (iekšpusē)",
  "M1 (ārpusē); M19 (iekšpusē)",
  "SU5 (ārpusē); SU5 (iekšpusē)",
  "M5 (ārpusē); M5 (iekšpusē)",
  "M0 (ārpusē); M0 (iekšpusē)",
  "M28 (ārpusē); M28 (iekšpusē)",
  "M21 (ārpusē); M21 (iekšpusē)",
  "M9 (ārpusē); M9 (iekšpusē)",
  "M32 (ārpusē); M32 (iekšpusē)",
  "SU5 (ārpusē); M (iekšpusē)",
  "SU2 (ārpusē); SU2 (iekšpusē)",
  "M31 (ārpusē); M32 (iekšpusē)",
  "M9 (ārpusē); M13 (iekšpusē)",
  "M14 (ārpusē); M14 (iekšpusē)",
  "M13 (ārpusē); M13 (iekšpusē)",
  "M (ārpusē);  M(iekšpusē)",
  "M (ārpusē);  M(iekšpusē)",
  "M2 (ārpusē); M2 (iekšpusē)",
  "M11neo (ārpusē); M11neo (iekšpusē)",
  "M12 (ārpusē); M12 (iekšpusē)",
  "M18 (ārpusē); M18 (iekšpusē)",
  "M34 (ārpusē); M32 (iekšpusē)",
  "M35 (ārpusē); M (iekšpusē)",
  "M6 (ārpusē); M27 (iekšpusē)",
  "M7neo (ārpusē); M3neo (iekšpusē)",
  "M7neo (ārpusē); M10neo (iekšpusē)",
  "M3neo (ārpusē); M3neo (iekšpusē)",
  "M10neo (ārpusē); M10neo (iekšpusē)",
  "M0ārpusē); M0 (iekšpusē)",
  "M7 (ārpusē); M3 (iekšpusē)",
  "M10 (ārpusē); M10 (iekšpusē)",
  "M32+L (ārpusē); M32 (iekšpusē)",
  "M31+L (ārpusē); M32 (iekšpusē)",
];
const designCodes = Object.fromEntries(
  DESIGN_CODES.map((s) => [
    s,
    s.replace(/^(\S+?)\s*\(?ārpusē\)/, "$1 (outside)").replace(/;[\s ]*(\S+?)\s*\(?iekšpusē\)/, "; $1 (inside)"),
  ]),
);

// The CBA lock-system rows of the Boston models.
const CBA = "slēdzeņu sistēma «CBA»";
const CBA_EN = "«CBA» lock system";
const KD1 = `${CBA} KD-6085 (1 cilindra tipa slēdzene); cilindrs «CBA» ar termostieni aizgrieznim; mehāniskais sprūds ar dienas-nakts funkciju; `;
const KD1_EN = `${CBA_EN} KD-6085 (1 cylinder lock); «CBA» cylinder with thermal rod and thumbturn; mechanical latch with day/night function; `;
const KDL = (cyl) => `${CBA} KDL-6085 (2 ${cyl} tipa slēdzenes uz vienas plāksnes); cilindrs «CBA» ar termostieni aizgrieznim; `;
const KDL_EN = `${CBA_EN} KDL-6085 (2 cylinder locks on one faceplate); «CBA» cylinder with thermal rod and thumbturn; `;
const LATCH = "mehāniskais sprūds ar dienas-nakts funkciju; ";
const LATCH_EN = "mechanical latch with day/night function; ";
const BAR_CBA = (mm) =>
  `skavas tipa rokturis «CBA» (${mm} mm), uzlikas taisnstūrformas, nerūsejošais tērauds, krāsa nerūsējošs tērauds/melna`;
const BAR_CBA_EN = (mm) =>
  `«CBA» pull bar (${mm} mm), rectangular escutcheons, stainless steel, colour stainless steel/black`;
const BAR_LOFT = (mm) => `skavas tipa rokturis “Loft” (${mm}mm), kvadrātformas uzlikas “Loft”, krāsa: melna`;
const BAR_LOFT_EN = (mm) => `«Loft» pull bar (${mm} mm), square «Loft» escutcheons, colour: black`;
const SET_LOFT_ALL = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna/bronza/zelta";
const SET_LOFT_ALL_EN = "«Loft» hardware set, square escutcheons, colour: stainless steel/black/bronze/gold";
const SET_LOFT_2 = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna";
const SET_LOFT_2_EN = "«Loft» hardware set, square escutcheons, colour: stainless steel/black";
const SET_PAVA = "furnitūras komplekts “Pava”, ovālas formas uzlikas, krāsa: hroma/zelta/melna";
const SET_PAVA_EN = "«Pava» hardware set, oval escutcheons, colour: chrome/gold/black";

const lockRows = {
  [KD1 + BAR_CBA("1200")]: KD1_EN + BAR_CBA_EN("1200"),
  [KD1 + BAR_CBA("1800")]: KD1_EN + BAR_CBA_EN("1800"),
};
for (const cyl of ["cilindra", "cilindru"]) {
  Object.assign(lockRows, {
    [KDL(cyl) + LATCH + BAR_CBA("1200")]: KDL_EN + LATCH_EN + BAR_CBA_EN("1200"),
    [KDL(cyl) + LATCH + BAR_CBA("1800")]: KDL_EN + LATCH_EN + BAR_CBA_EN("1800"),
    [KDL(cyl) + SET_LOFT_ALL]: KDL_EN + SET_LOFT_ALL_EN,
    [KDL(cyl) + LATCH + BAR_LOFT("1200")]: KDL_EN + LATCH_EN + BAR_LOFT_EN("1200"),
    [KDL(cyl) + LATCH + BAR_LOFT("1800")]: KDL_EN + LATCH_EN + BAR_LOFT_EN("1800"),
  });
}
lockRows[KDL("cilindra") + SET_LOFT_2] = KDL_EN + SET_LOFT_2_EN;
lockRows[KDL("cilindra") + SET_PAVA] = KDL_EN + SET_PAVA_EN;

// Repeated finish phrases.
const GALV = "Galvanised steel, weather-resistant powder coating (shade of your choice)";
const STEEL = "Steel, weather-resistant powder coating (shade of your choice).";
const BOTH_CLASSIC = "Decorative aluminium glazing bead on the outside and inside (classic design)";

export const enBoston = {
  ...designCodes,
  ...lockRows,

  // Names and blurbs
  "Boston AG4-6010 Antracīts/Balts akmens": "Boston AG4-6010 anthracite / white stone",
  "Boston Smart AG652 Balts soft velvet": "Boston Smart AG652 white soft velvet",
  "Alumīnija durvis ar termopārrāvumu, stikla paketi, antracīts/balts akmens.":
    "Aluminium door with a thermal break and a glass unit, anthracite / white stone.",
  "Alumīnija durvis ar termopārrāvumu.": "Aluminium door with a thermal break.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni, balts soft velvet.":
    "Metal apartment door with a smart lock, white soft velvet.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni.": "Metal apartment door with a smart lock.",

  // Specification labels
  "Slēdzeņu sistēma": "Lock system",
  "Uzlikas slēdzenēm": "Lock escutcheons",
  "Tips 10 (uz pasūtījumu)": "Type 10 (to order)",
  "Tips 11 (uz pasūtījumu)": "Type 11 (to order)",
  "Vērtnes apdare no ārpuses": "Leaf finish, outside",
  "Vērtnes apdare no iekšpuses": "Leaf finish, inside",
  "Kārba krāsota divās krāsās": "Two-tone painted frame",
  "Fornitūra": "Hardware",

  // Specification values
  "vērtne – 97mm, kārba – 100mm": "leaf – 97 mm, frame – 100 mm",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» with thermal rod, «5 keys»",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» with thermal rod, «5 keys»",
  "76mm Trīskameru": "76 mm, three-chamber",
  "«CBA» ar termostieni aizgrieznim": "«CBA» with thermal rod and thumbturn",
  "«CBA» ar termostieni aizgrieznim": "«CBA» with thermal rod and thumbturn",
  "Divsekcionālas uzliekamas eņģes, 3D eņģu regulēšana visos virzienos, 2 gb.":
    "Two-part surface-mounted hinges, 3D adjustment in all directions, 2 pcs.",
  "«CBA» ar aizgriezni no iekšpuses": "«CBA» with thumbturn on the inside",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 pcs. with 3D adjustment in all directions",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 pcs. with 3D adjustment in all directions",
  "«CBA» Biometriskā slēdzene CBA PSL2 ar Face ID": "«CBA» CBA PSL2 biometric lock with Face ID",
  "Biometriskās slēdzenes komplekta cilindrs, cilindrs papildus slēdzenei “CBA” ar termostieni":
    "Cylinder from the biometric lock set; cylinder for the extra «CBA» lock with thermal rod",
  "2 × CBA (cilindriskās) ar termostieni": "2 × CBA (cylinder) with thermal rod",
  "WALA (Polija), 3D regulācija": "WALA (Poland), 3D adjustment",
  "Tērauds 1mm, Antracīts": "Steel 1 mm, anthracite",
  "Tērauds 1mm, Rūgta šokolāde": "Steel 1 mm, bitter chocolate",
  "Tērauds 1mm, Ziloņkauls": "Steel 1 mm, ivory",
  "ARIKO (suvaldu) + Kale 252 (cilindriskā)": "ARIKO (lever) + Kale 252 (cylinder)",
  "Hisar Kilit 50×30 (Turcija), aizsardzība pret izurbšanu": "Hisar Kilit 50×30 (Turkey), anti-drill protection",
  "MDF 10mm, Tabakas ozols": "MDF 10 mm, tobacco oak",
  "MDF 10mm, Ozols Nemo Late": "MDF 10 mm, oak nemo latte",
  "MDF 10mm, Ozols Nemo Karbon": "MDF 10 mm, oak nemo carbon",
  "MDF 10mm, Ozols Nemo Sudrabs": "MDF 10 mm, oak nemo silver",
  "Kale 257 + Kale 252 (cilindriskās)": "Kale 257 + Kale 252 (cylinder)",
  "MDF 10mm, Venge Horizontāls Pelēks": "MDF 10 mm, wenge horizontal grey",
  "MDF 10mm, Balts Šagreņ": "MDF 10 mm, white shagreen",
  "Balts Akmens": "White stone",
  "«Securemme 2061» (cilindriskā), Itālija": "«Securemme 2061» (cylinder), Italy",
  "krāsa Melna": "colour black",
  "«Securemme 2019» (suvaldu, 5 atslēgas), Itālija": "«Securemme 2019» (lever, 5 keys), Italy",
  "suvaldu tipa, forma kradrātveida, krāsa Melna": "lever type, square shape, colour black",
  "Saskaņā ar komplektāciju (pēc izvēles), 2gb.": "According to the chosen configuration, 2 pcs.",
  "3 blīvējuma kontūru konstrukcija ar 2 blīvgumijām": "3-contour sealing design with 2 gaskets",
  "Monolītas": "One-piece",
  "Monolīta": "One-piece",
  "97mm alumīnija kārba ar termopārrāvumu": "97 mm aluminium frame with thermal break",
  "MDF 12mm krāsa – «Madeiras Ozols ar melnu patinu» Nr.96 / «Melns» Nr.97":
    "MDF 12 mm, colour – «Madeira oak with black patina» No. 96 / «Black» No. 97",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17": "MDF 12 mm, colour – «White soft velvet» No. 17",
  "«Melna» no ārpuses / «Balta» no iekšpuses": "«Black» outside / «White» inside",
  "1 uz vērtnes / 1 uz kārbas": "1 on the leaf / 1 on the frame",
  "Pretuzlaužama «CBA»(cilindriska) ar krabja sistēmu": "Burglar-resistant «CBA» (cylinder) with crab system",
  "«SL 2» (viedā – pirkstu nospieduma nolasītājs, Wi-Fi un bluetooth, aplikācija)":
    "«SL 2» (smart – fingerprint reader, Wi-Fi and Bluetooth, app)",
  "Ar pirksta nospieduma nolasītāju no ārpuses": "With a fingerprint reader on the outside",
  "Nav (augšējai slēdzenei ir aizgrieznis no iekšpuses)": "No (the upper lock has a thumbturn on the inside)",
  "Alumīnija bez krāsas": "Aluminium, unpainted",
  "MDF 12mm krāsa – «Loft Melns» Nr.83 / Melna glancēta stikla ieliktnis":
    "MDF 12 mm, colour – «Loft Black» No. 83 / black gloss glass insert",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17 / Melna glancēta stikla ieliktnis":
    "MDF 12 mm, colour – «White soft velvet» No. 17 / black gloss glass insert",
  "«PSL 1» (viedā – pirkstu nospieduma nolasītājs, FACE ID kamera, Wi-Fi un bluetooth, aplikācija)":
    "«PSL 1» (smart – fingerprint reader, FACE ID camera, Wi-Fi and Bluetooth, app)",
  "Ir (iestrādāts viedajā slēdzenē)": "Yes (built into the smart lock)",
  "Viedās slēdzenes uzlika, kvadrāta uzlika “LOFT” krāsa melna": "Smart-lock escutcheon, square «LOFT» escutcheon, colour black",
  "Rokturis ar pirkstu nospieduma skeneri": "Handle with fingerprint scanner",

  // Leaf finish (galvanised steel, powder coating, decor)
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles)": GALV,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).": `${GALV}.`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā)":
    `${GALV}, decorative aluminium strips (leaf colour)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūsējošais tērauds)":
    `${GALV}, decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, decorative slats (shade of your choice), decorative insert (black), Lacobel glass`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, decorative slats (shade of your choice), decorative insert (black), Lacobel glass`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    "Galvanised steel, outside shade from the DECOLUX palette, decorative aluminium glazing bead (classic design), capital",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), alumīnija štapiks (klasiskais dizains)":
    `${GALV}, aluminium glazing bead (classic design)`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    "Galvanised steel, outside shade from the DECOLUX palette, decorative insert (black/stainless steel)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna/ner. tērauds)":
    `${GALV}, decorative aluminium strips (leaf colour), decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    `${GALV}, decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    `${GALV}, decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    `${GALV}, decorative slats (shade of your choice), decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, decorative aluminium strips (leaf colour), decorative insert (black), Lacobel glass`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX": "Galvanised steel, outside shade from the DECOLUX palette",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes no ārpuses (vērtnes krāsā), iekšpusē spogulis":
    `${GALV}, decorative aluminium strips on the outside (leaf colour), mirror on the inside`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā) dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    `${GALV}, decorative aluminium strips (leaf colour), decorative insert (black/stainless steel)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles)":
    `${GALV}, decorative slats (shade of your choice)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), spogulis":
    `${GALV}, decorative slats (shade of your choice), mirror`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasisks dizains), kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs ieliktnis (krāsa:melna/nerūsējoša tērauda), kapitēlija":
    `${STEEL} Decorative insert on the outside and inside (black/stainless steel), capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasisks dizains), kapitēlija":
    `${STEEL} Decorative aluminium glazing bead on the outside and inside (neoclassical design), capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasiskais dizains), kapitēlija":
    `${STEEL} Decorative aluminium glazing bead on the outside and inside (neoclassical design), capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    `${STEEL} ${BOTH_CLASSIC}, mirror, capital, «Lion» door knocker (black), decorative letterbox (black/stainless steel)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis melns stikls Lakobel":
    `${STEEL} Decorative insert - black Lacobel glass`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), atdure (krāsa melna), dekoratīva pastkastīte (krāsa melna)":
    `${STEEL} ${BOTH_CLASSIC}, capital, «Lion» door knocker (black), door stop (black), decorative letterbox (black)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna, zelta, bronza)":
    `${STEEL} ${BOTH_CLASSIC}, capital, «Lion» door knocker (black, gold, bronze)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, knob":
    `${STEEL} ${BOTH_CLASSIC}, mirror, capital, knob`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    `${STEEL} Decorative aluminium glazing bead on the outside (classic design), capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, knob":
    `${STEEL} ${BOTH_CLASSIC}, capital, knob`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    `${STEEL} ${BOTH_CLASSIC}, capital, «Lion» door knocker (black), decorative letterbox (black/stainless steel)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, mirror, capital`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis": `${STEEL} Decorative insert`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).": STEEL,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas alumīnija līstes, ieliktnis":
    `${STEEL} Decorative aluminium strips, insert`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvas alumīnija līstes (krāsa pēc izvēles)":
    `${STEEL} Decorative aluminium strips on the outside (colour of your choice)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna)":
    `${STEEL} Decorative aluminium glazing bead on the outside (classic design), capital, «Lion» door knocker (black)`,

  // Glass units (manufacturer code, chambers, tint)
  "DG49, četrkameru, grafīts/bronza (pēc izvēles)": "DG49, four-chamber, graphite/bronze (your choice)",
  "DG51, trīskameru, bronza/hroms (pēc izvēles) ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, three-chamber, bronze/chrome (your choice) with a black inset decorative grille",
  "DG58, četrkameru, grafīts": "DG58, four-chamber, graphite",
  "DG295, četrkameru, grafīts/bronza (pēc izvēles)": "DG295, four-chamber, graphite/bronze (your choice)",
  "DG44, četrkameru, bronza/hroms": "DG44, four-chamber, bronze/chrome",
  "DG196, četrkameru, grafīts/bronza (pēc izvēles)": "DG196, four-chamber, graphite/bronze (your choice)",
  "DG22, trīskameru, grafīts/bronza (pēc izvēles) ar ieliekamu melnu resti krāsa melna":
    "DG22, three-chamber, graphite/bronze (your choice) with a black inset grille",
  "DG25, četrkameru, grafīts/bronza (pēc izvēles)": "DG25, four-chamber, graphite/bronze (your choice)",
  "DG35, četrkameru, grafīts/bronza pēc izvēles": "DG35, four-chamber, graphite/bronze, your choice",
  "DG26, četrkameru, grafīts/bronza (pēc izvēles)": "DG26, four-chamber, graphite/bronze (your choice)",
  "DG35, četrkameru, grafīts/bronza (pēc izvēles)": "DG35, four-chamber, graphite/bronze (your choice)",
  "DG, četrkameru, grafīts/bronza (pēc izvēles)": "DG, four-chamber, graphite/bronze (your choice)",
  "DG40, četrkameru, bronza/hroms, uzliekams dekoratīvs kalums (krāsa pēc izvēles)":
    "DG40, four-chamber, bronze/chrome, applied decorative wrought iron (colour of your choice)",
  "DG67, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG67, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG25, četrkameru, satīns": "DG25, four-chamber, satin",
  "DG34, četrkameru, UV-zīmogs": "DG34, four-chamber, UV print",
  "DG196, četrkameru, grafīts": "DG196, four-chamber, graphite",
  "DG45, četrkameru, grafīts/bronza pēc izvēles": "DG45, four-chamber, graphite/bronze, your choice",
  "DG45, četrkameru, grafīts/bronza (pēc izvēles)": "DG45, four-chamber, graphite/bronze (your choice)",
  "DG66, četrkameru, grafīts/bronza pēc izvēles": "DG66, four-chamber, graphite/bronze, your choice",
  "DG264, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG264, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG261, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG261, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG298, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG298, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG46, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG46, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG40, trīskameru": "DG40, three-chamber",
  "DG51, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG44, četrkameru, bronza/grafīts pēc izvēles": "DG44, four-chamber, bronze/graphite, your choice",
  "DG43, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG43, three-chamber, bronze/chrome of your choice with a black inset decorative grille",
  "DG50, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG50, three-chamber, mirrored bronze/chrome of your choice (with a black inset decorative grille)",
  "DG, četrkameru, grafīts/bronza (pēc izveles)": "DG, four-chamber, graphite/bronze (your choice)",
  "DG, četrkameru, UV zīmogs gradient": "DG, four-chamber, UV gradient print",
  "DG, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna/zelta":
    "DG, three-chamber, bronze/chrome of your choice with a black/gold inset decorative grille",
  "DG22, trīskameru, bronza/hroms pēc izvēles, ar melnu ieliekamu dekoratīvo resti":
    "DG22, three-chamber, bronze/chrome of your choice, with a black inset decorative grille",
  "DG, četrkameru, grafīts": "DG, four-chamber, graphite",
  "DG67, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG67, three-chamber, mirrored bronze/chrome of your choice (with a black inset decorative grille)",
  "DG51, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG51, three-chamber, mirrored bronze/chrome of your choice (with a black inset decorative grille)",
  "DG40, četrkameru, bronza/hroms, uzliekams kalums (krāsa pēc izvēles)":
    "DG40, four-chamber, bronze/chrome, applied wrought iron (colour of your choice)",
};
