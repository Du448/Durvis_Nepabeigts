/* Lithuanian for catalogue strings that no other dictionary covers - mostly
   the Boston aluminium doors' specification rows (lock system, glass unit,
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
    s.replace(/^(\S+?)\s*\(?ārpusē\)/, "$1 (išorėje)").replace(/;[\s ]*(\S+?)\s*\(?iekšpusē\)/, "; $1 (viduje)"),
  ]),
);

// The CBA lock-system rows of the Boston models.
const CBA = "slēdzeņu sistēma «CBA»";
const CBA_LT = "spynų sistema «CBA»";
const KD1 = `${CBA} KD-6085 (1 cilindra tipa slēdzene); cilindrs «CBA» ar termostieni aizgrieznim; mehāniskais sprūds ar dienas-nakts funkciju; `;
const KD1_LT = `${CBA_LT} KD-6085 (1 cilindrinė spyna); cilindras «CBA» su termostrypu ir sukute; mechaninis skląstis su dienos-nakties funkcija; `;
const KDL = (cyl) => `${CBA} KDL-6085 (2 ${cyl} tipa slēdzenes uz vienas plāksnes); cilindrs «CBA» ar termostieni aizgrieznim; `;
const KDL_LT = `${CBA_LT} KDL-6085 (2 cilindrinės spynos ant vienos plokštės); cilindras «CBA» su termostrypu ir sukute; `;
const LATCH = "mehāniskais sprūds ar dienas-nakts funkciju; ";
const LATCH_LT = "mechaninis skląstis su dienos-nakties funkcija; ";
const BAR_CBA = (mm) =>
  `skavas tipa rokturis «CBA» (${mm} mm), uzlikas taisnstūrformas, nerūsejošais tērauds, krāsa nerūsējošs tērauds/melna`;
const BAR_CBA_LT = (mm) =>
  `rankena-skoba «CBA» (${mm} mm), stačiakampiai antdėklai, nerūdijantis plienas, spalva nerūdijantis plienas/juoda`;
const BAR_LOFT = (mm) => `skavas tipa rokturis “Loft” (${mm}mm), kvadrātformas uzlikas “Loft”, krāsa: melna`;
const BAR_LOFT_LT = (mm) => `rankena-skoba «Loft» (${mm} mm), kvadratiniai antdėklai «Loft», spalva: juoda`;
const SET_LOFT_ALL = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna/bronza/zelta";
const SET_LOFT_ALL_LT = "furnitūros komplektas «Loft», kvadratiniai antdėklai, spalva: nerūdijantis plienas/juoda/bronza/auksas";
const SET_LOFT_2 = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna";
const SET_LOFT_2_LT = "furnitūros komplektas «Loft», kvadratiniai antdėklai, spalva: nerūdijantis plienas/juoda";
const SET_PAVA = "furnitūras komplekts “Pava”, ovālas formas uzlikas, krāsa: hroma/zelta/melna";
const SET_PAVA_LT = "furnitūros komplektas «Pava», ovalūs antdėklai, spalva: chromas/auksas/juoda";

const lockRows = {
  [KD1 + BAR_CBA("1200")]: KD1_LT + BAR_CBA_LT("1200"),
  [KD1 + BAR_CBA("1800")]: KD1_LT + BAR_CBA_LT("1800"),
};
for (const cyl of ["cilindra", "cilindru"]) {
  Object.assign(lockRows, {
    [KDL(cyl) + LATCH + BAR_CBA("1200")]: KDL_LT + LATCH_LT + BAR_CBA_LT("1200"),
    [KDL(cyl) + LATCH + BAR_CBA("1800")]: KDL_LT + LATCH_LT + BAR_CBA_LT("1800"),
    [KDL(cyl) + SET_LOFT_ALL]: KDL_LT + SET_LOFT_ALL_LT,
    [KDL(cyl) + LATCH + BAR_LOFT("1200")]: KDL_LT + LATCH_LT + BAR_LOFT_LT("1200"),
    [KDL(cyl) + LATCH + BAR_LOFT("1800")]: KDL_LT + LATCH_LT + BAR_LOFT_LT("1800"),
  });
}
lockRows[KDL("cilindra") + SET_LOFT_2] = KDL_LT + SET_LOFT_2_LT;
lockRows[KDL("cilindra") + SET_PAVA] = KDL_LT + SET_PAVA_LT;

// Repeated finish phrases.
const GALV = "Cinkuotas plienas, atsparūs oro sąlygoms milteliniai dažai (atspalvis pasirinktinai)";
const STEEL = "Plienas, atsparūs oro sąlygoms milteliniai dažai (atspalvis pasirinktinai).";
const BOTH_CLASSIC = "Iš išorės ir vidaus dekoratyvinis aliuminio glapitis (klasikinis dizainas)";
const KNOCKER = "durų beldiklis-dekoras «Liūtas»";
const LETTERBOX = "dekoratyvinė pašto dėžutė";

export const ltBoston = {
  ...designCodes,
  ...lockRows,

  // Names and blurbs
  "Boston AG4-6010 Antracīts/Balts akmens": "Boston AG4-6010 antracitas / baltas akmuo",
  "Boston Smart AG652 Balts soft velvet": "Boston Smart AG652 balta soft velvet",
  "Alumīnija durvis ar termopārrāvumu, stikla paketi, antracīts/balts akmens.":
    "Aliuminio durys su terminiu barjeru ir stiklo paketu, antracitas / baltas akmuo.",
  "Alumīnija durvis ar termopārrāvumu.": "Aliuminio durys su terminiu barjeru.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni, balts soft velvet.":
    "Metalinės buto durys su išmaniąja spyna, balta soft velvet.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni.": "Metalinės buto durys su išmaniąja spyna.",

  // Specification labels
  "Slēdzeņu sistēma": "Spynų sistema",
  "Uzlikas slēdzenēm": "Spynų antdėklai",
  "Tips 10 (uz pasūtījumu)": "Tipas 10 (pagal užsakymą)",
  "Tips 11 (uz pasūtījumu)": "Tipas 11 (pagal užsakymą)",
  "Vērtnes apdare no ārpuses": "Varčios apdaila iš išorės",
  "Vērtnes apdare no iekšpuses": "Varčios apdaila iš vidaus",
  "Kārba krāsota divās krāsās": "Stakta dažyta dviem spalvomis",
  "Fornitūra": "Furnitūra",

  // Specification values
  "vērtne – 97mm, kārba – 100mm": "varčia – 97 mm, stakta – 100 mm",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» su termostrypu, «5 raktai»",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» su termostrypu, «5 raktai»",
  "76mm Trīskameru": "76 mm, trijų kamerų",
  "«CBA» ar termostieni aizgrieznim": "«CBA» su termostrypu ir sukute",
  "«CBA» ar termostieni aizgrieznim": "«CBA» su termostrypu ir sukute",
  "Divsekcionālas uzliekamas eņģes, 3D eņģu regulēšana visos virzienos, 2 gb.":
    "Dviejų dalių užleidžiami vyriai, 3D reguliavimas visomis kryptimis, 2 vnt.",
  "«CBA» ar aizgriezni no iekšpuses": "«CBA» su sukute iš vidaus",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 vnt. su 3D reguliavimu visomis kryptimis",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 vnt. su 3D reguliavimu visomis kryptimis",
  "«CBA» Biometriskā slēdzene CBA PSL2 ar Face ID": "«CBA» biometrinė spyna CBA PSL2 su Face ID",
  "Biometriskās slēdzenes komplekta cilindrs, cilindrs papildus slēdzenei “CBA” ar termostieni":
    "Biometrinės spynos komplekto cilindras; papildomos spynos «CBA» cilindras su termostrypu",
  "2 × CBA (cilindriskās) ar termostieni": "2 × CBA (cilindrinės) su termostrypu",
  "WALA (Polija), 3D regulācija": "WALA (Lenkija), 3D reguliavimas",
  "Tērauds 1mm, Antracīts": "Plienas 1 mm, antracitas",
  "Tērauds 1mm, Rūgta šokolāde": "Plienas 1 mm, kartusis šokoladas",
  "Tērauds 1mm, Ziloņkauls": "Plienas 1 mm, dramblio kaulas",
  "ARIKO (suvaldu) + Kale 252 (cilindriskā)": "ARIKO (sisteminė) + Kale 252 (cilindrinė)",
  "Hisar Kilit 50×30 (Turcija), aizsardzība pret izurbšanu": "Hisar Kilit 50×30 (Turkija), apsauga nuo išgręžimo",
  "MDF 10mm, Tabakas ozols": "MDF 10 mm, tabako ąžuolas",
  "MDF 10mm, Ozols Nemo Late": "MDF 10 mm, ąžuolas nemo latte",
  "MDF 10mm, Ozols Nemo Karbon": "MDF 10 mm, ąžuolas nemo carbon",
  "MDF 10mm, Ozols Nemo Sudrabs": "MDF 10 mm, ąžuolas nemo sidabrinis",
  "Kale 257 + Kale 252 (cilindriskās)": "Kale 257 + Kale 252 (cilindrinės)",
  "MDF 10mm, Venge Horizontāls Pelēks": "MDF 10 mm, vengė horizontali pilka",
  "MDF 10mm, Balts Šagreņ": "MDF 10 mm, baltas šagrenas",
  "Balts Akmens": "Baltas akmuo",
  "«Securemme 2061» (cilindriskā), Itālija": "«Securemme 2061» (cilindrinė), Italija",
  "krāsa Melna": "spalva juoda",
  "«Securemme 2019» (suvaldu, 5 atslēgas), Itālija": "«Securemme 2019» (sisteminė, 5 raktai), Italija",
  "suvaldu tipa, forma kradrātveida, krāsa Melna": "sisteminei spynai, kvadratinės formos, spalva juoda",
  "Saskaņā ar komplektāciju (pēc izvēles), 2gb.": "Pagal komplektaciją (pasirinktinai), 2 vnt.",
  "3 blīvējuma kontūru konstrukcija ar 2 blīvgumijām": "3 sandarinimo kontūrų konstrukcija su 2 tarpinėmis",
  "Monolītas": "Vientisi",
  "Monolīta": "Vientisa",
  "97mm alumīnija kārba ar termopārrāvumu": "97 mm aliuminio stakta su terminiu barjeru",
  "MDF 12mm krāsa – «Madeiras Ozols ar melnu patinu» Nr.96 / «Melns» Nr.97":
    "MDF 12 mm, spalva – «Madeiros ąžuolas su juoda patina» Nr. 96 / «Juoda» Nr. 97",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17": "MDF 12 mm, spalva – «Balta soft velvet» Nr. 17",
  "«Melna» no ārpuses / «Balta» no iekšpuses": "«Juoda» iš išorės / «Balta» iš vidaus",
  "1 uz vērtnes / 1 uz kārbas": "1 ant varčios / 1 ant staktos",
  "Pretuzlaužama «CBA»(cilindriska) ar krabja sistēmu": "Atspari įsilaužimui «CBA» (cilindrinė) su krabo sistema",
  "«SL 2» (viedā – pirkstu nospieduma nolasītājs, Wi-Fi un bluetooth, aplikācija)":
    "«SL 2» (išmanioji – piršto atspaudo skaitytuvas, Wi-Fi ir Bluetooth, programėlė)",
  "Ar pirksta nospieduma nolasītāju no ārpuses": "Su piršto atspaudo skaitytuvu iš išorės",
  "Nav (augšējai slēdzenei ir aizgrieznis no iekšpuses)": "Nėra (viršutinė spyna turi sukutę iš vidaus)",
  "Alumīnija bez krāsas": "Aliuminio, nedažytas",
  "MDF 12mm krāsa – «Loft Melns» Nr.83 / Melna glancēta stikla ieliktnis":
    "MDF 12 mm, spalva – «Loft juoda» Nr. 83 / juodo blizgaus stiklo intarpas",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17 / Melna glancēta stikla ieliktnis":
    "MDF 12 mm, spalva – «Balta soft velvet» Nr. 17 / juodo blizgaus stiklo intarpas",
  "«PSL 1» (viedā – pirkstu nospieduma nolasītājs, FACE ID kamera, Wi-Fi un bluetooth, aplikācija)":
    "«PSL 1» (išmanioji – piršto atspaudo skaitytuvas, FACE ID kamera, Wi-Fi ir Bluetooth, programėlė)",
  "Ir (iestrādāts viedajā slēdzenē)": "Yra (integruota į išmaniąją spyną)",
  "Viedās slēdzenes uzlika, kvadrāta uzlika “LOFT” krāsa melna": "Išmaniosios spynos antdėklas, kvadratinis antdėklas «LOFT», spalva juoda",
  "Rokturis ar pirkstu nospieduma skeneri": "Rankena su piršto atspaudo skaitytuvu",

  // Leaf finish (galvanised steel, powder coating, decor)
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles)": GALV,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).": `${GALV}.`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā)":
    `${GALV}, dekoratyvinės aliuminio juostelės (varčios spalvos)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūsējošais tērauds)":
    `${GALV}, dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, dekoratyvinės lamelės (atspalvis pasirinktinai), dekoratyvinis intarpas (juodas), stiklas Lacobel`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, dekoratyvinės lamelės (atspalvis pasirinktinai), dekoratyvinis intarpas (juodas), stiklas Lacobel`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    "Cinkuotas plienas, išorės atspalvis iš DECOLUX paletės, dekoratyvinis aliuminio glapitis (klasikinis dizainas), kapitelis",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), alumīnija štapiks (klasiskais dizains)":
    `${GALV}, aliuminio glapitis (klasikinis dizainas)`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    "Cinkuotas plienas, išorės atspalvis iš DECOLUX paletės, dekoratyvinis intarpas (juodas/nerūdijantis plienas)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna/ner. tērauds)":
    `${GALV}, dekoratyvinės aliuminio juostelės (varčios spalvos), dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    `${GALV}, dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    `${GALV}, dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    `${GALV}, dekoratyvinės lamelės (atspalvis pasirinktinai), dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna), stikls Lakobel":
    `${GALV}, dekoratyvinės aliuminio juostelės (varčios spalvos), dekoratyvinis intarpas (juodas), stiklas Lacobel`,
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX": "Cinkuotas plienas, išorės atspalvis iš DECOLUX paletės",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes no ārpuses (vērtnes krāsā), iekšpusē spogulis":
    `${GALV}, dekoratyvinės aliuminio juostelės iš išorės (varčios spalvos), viduje veidrodis`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā) dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    `${GALV}, dekoratyvinės aliuminio juostelės (varčios spalvos), dekoratyvinis intarpas (juodas/nerūdijantis plienas)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles)":
    `${GALV}, dekoratyvinės lamelės (atspalvis pasirinktinai)`,
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), spogulis":
    `${GALV}, dekoratyvinės lamelės (atspalvis pasirinktinai), veidrodis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasisks dizains), kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs ieliktnis (krāsa:melna/nerūsējoša tērauda), kapitēlija":
    `${STEEL} Iš išorės ir vidaus dekoratyvinis intarpas (juodas/nerūdijantis plienas), kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasisks dizains), kapitēlija":
    `${STEEL} Iš išorės ir vidaus dekoratyvinis aliuminio glapitis (neoklasikinis dizainas), kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasiskais dizains), kapitēlija":
    `${STEEL} Iš išorės ir vidaus dekoratyvinis aliuminio glapitis (neoklasikinis dizainas), kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    `${STEEL} ${BOTH_CLASSIC}, veidrodis, kapitelis, ${KNOCKER} (juodas), ${LETTERBOX} (juoda/nerūdijantis plienas)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis melns stikls Lakobel":
    `${STEEL} Dekoratyvinis intarpas - juodas stiklas Lacobel`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), atdure (krāsa melna), dekoratīva pastkastīte (krāsa melna)":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis, ${KNOCKER} (juodas), atrama (juoda), ${LETTERBOX} (juoda)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna, zelta, bronza)":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis, ${KNOCKER} (juodas, auksinis, bronzinis)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, knob":
    `${STEEL} ${BOTH_CLASSIC}, veidrodis, kapitelis, rankenėlė (knob)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    `${STEEL} Iš išorės dekoratyvinis aliuminio glapitis (klasikinis dizainas), kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, knob":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis, rankenėlė (knob)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    `${STEEL} ${BOTH_CLASSIC}, kapitelis, ${KNOCKER} (juodas), ${LETTERBOX} (juoda/nerūdijantis plienas)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija":
    `${STEEL} ${BOTH_CLASSIC}, veidrodis, kapitelis`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis": `${STEEL} Dekoratyvinis intarpas`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).": STEEL,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas alumīnija līstes, ieliktnis":
    `${STEEL} Dekoratyvinės aliuminio juostelės, intarpas`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvas alumīnija līstes (krāsa pēc izvēles)":
    `${STEEL} Iš išorės dekoratyvinės aliuminio juostelės (spalva pasirinktinai)`,
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna)":
    `${STEEL} Iš išorės dekoratyvinis aliuminio glapitis (klasikinis dizainas), kapitelis, ${KNOCKER} (juodas)`,

  // Glass units (manufacturer code, chambers, tint)
  "DG49, četrkameru, grafīts/bronza (pēc izvēles)": "DG49, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG51, trīskameru, bronza/hroms (pēc izvēles) ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, trijų kamerų, bronza/chromas (pasirinktinai) su įstatoma juoda dekoratyvine grotele",
  "DG58, četrkameru, grafīts": "DG58, keturių kamerų, grafitas",
  "DG295, četrkameru, grafīts/bronza (pēc izvēles)": "DG295, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG44, četrkameru, bronza/hroms": "DG44, keturių kamerų, bronza/chromas",
  "DG196, četrkameru, grafīts/bronza (pēc izvēles)": "DG196, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG22, trīskameru, grafīts/bronza (pēc izvēles) ar ieliekamu melnu resti krāsa melna":
    "DG22, trijų kamerų, grafitas/bronza (pasirinktinai) su įstatoma juoda grotele",
  "DG25, četrkameru, grafīts/bronza (pēc izvēles)": "DG25, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG35, četrkameru, grafīts/bronza pēc izvēles": "DG35, keturių kamerų, grafitas/bronza pasirinktinai",
  "DG26, četrkameru, grafīts/bronza (pēc izvēles)": "DG26, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG35, četrkameru, grafīts/bronza (pēc izvēles)": "DG35, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG, četrkameru, grafīts/bronza (pēc izvēles)": "DG, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG40, četrkameru, bronza/hroms, uzliekams dekoratīvs kalums (krāsa pēc izvēles)":
    "DG40, keturių kamerų, bronza/chromas, užleidžiamas dekoratyvinis kalinys (spalva pasirinktinai)",
  "DG67, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG67, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG25, četrkameru, satīns": "DG25, keturių kamerų, satinas",
  "DG34, četrkameru, UV-zīmogs": "DG34, keturių kamerų, UV spauda",
  "DG196, četrkameru, grafīts": "DG196, keturių kamerų, grafitas",
  "DG45, četrkameru, grafīts/bronza pēc izvēles": "DG45, keturių kamerų, grafitas/bronza pasirinktinai",
  "DG45, četrkameru, grafīts/bronza (pēc izvēles)": "DG45, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG66, četrkameru, grafīts/bronza pēc izvēles": "DG66, keturių kamerų, grafitas/bronza pasirinktinai",
  "DG264, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG264, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG261, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG261, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG298, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG298, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG46, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG46, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG40, trīskameru": "DG40, trijų kamerų",
  "DG51, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG44, četrkameru, bronza/grafīts pēc izvēles": "DG44, keturių kamerų, bronza/grafitas pasirinktinai",
  "DG43, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG43, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda dekoratyvine grotele",
  "DG50, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG50, trijų kamerų, veidrodinis, bronza/chromas pasirinktinai (su įstatoma juoda dekoratyvine grotele)",
  "DG, četrkameru, grafīts/bronza (pēc izveles)": "DG, keturių kamerų, grafitas/bronza (pasirinktinai)",
  "DG, četrkameru, UV zīmogs gradient": "DG, keturių kamerų, UV spauda su gradientu",
  "DG, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna/zelta":
    "DG, trijų kamerų, bronza/chromas pasirinktinai su įstatoma juoda/auksine dekoratyvine grotele",
  "DG22, trīskameru, bronza/hroms pēc izvēles, ar melnu ieliekamu dekoratīvo resti":
    "DG22, trijų kamerų, bronza/chromas pasirinktinai, su juoda įstatoma dekoratyvine grotele",
  "DG, četrkameru, grafīts": "DG, keturių kamerų, grafitas",
  "DG67, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG67, trijų kamerų, veidrodinis, bronza/chromas pasirinktinai (su įstatoma juoda dekoratyvine grotele)",
  "DG51, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG51, trijų kamerų, veidrodinis, bronza/chromas pasirinktinai (su įstatoma juoda dekoratyvine grotele)",
  "DG40, četrkameru, bronza/hroms, uzliekams kalums (krāsa pēc izvēles)":
    "DG40, keturių kamerų, bronza/chromas, užleidžiamas kalinys (spalva pasirinktinai)",
};
