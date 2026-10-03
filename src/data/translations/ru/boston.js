/* Russian for catalogue strings that no other dictionary covers - mostly the
   Boston aluminium doors' specification rows (lock system, glass unit,
   finish, design codes) and a few product names and blurbs. Keys are the
   Latvian source strings exactly as in products.js / catalog-specs.js. */

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
    s
      .replace(/^(\S+?)\s*\(?ārpusē\)/, "$1 (снаружи)")
      .replace(/;[\s ]*(\S+?)\s*\(?iekšpusē\)/, "; $1 (внутри)"),
  ]),
);

// The CBA lock-system rows of the Boston models.
const CBA = "slēdzeņu sistēma «CBA»";
const CBA_RU = "система замков «CBA»";
const KD1 = `${CBA} KD-6085 (1 cilindra tipa slēdzene); cilindrs «CBA» ar termostieni aizgrieznim; mehāniskais sprūds ar dienas-nakts funkciju; `;
const KD1_RU = `${CBA_RU} KD-6085 (1 цилиндровый замок); цилиндр «CBA» с термостержнем под вертушку; механическая защёлка с функцией день-ночь; `;
const KDL = (cyl) => `${CBA} KDL-6085 (2 ${cyl} tipa slēdzenes uz vienas plāksnes); cilindrs «CBA» ar termostieni aizgrieznim; `;
const KDL_RU = `${CBA_RU} KDL-6085 (2 цилиндровых замка на одной планке); цилиндр «CBA» с термостержнем под вертушку; `;
const LATCH = "mehāniskais sprūds ar dienas-nakts funkciju; ";
const LATCH_RU = "механическая защёлка с функцией день-ночь; ";
const BAR_CBA = (mm) =>
  `skavas tipa rokturis «CBA» (${mm} mm), uzlikas taisnstūrformas, nerūsejošais tērauds, krāsa nerūsējošs tērauds/melna`;
const BAR_CBA_RU = (mm) =>
  `ручка-скоба «CBA» (${mm} мм), накладки прямоугольные, нержавеющая сталь, цвет нержавеющая сталь/чёрный`;
const BAR_LOFT = (mm) => `skavas tipa rokturis “Loft” (${mm}mm), kvadrātformas uzlikas “Loft”, krāsa: melna`;
const BAR_LOFT_RU = (mm) => `ручка-скоба «Loft» (${mm} мм), квадратные накладки «Loft», цвет: чёрный`;
const SET_LOFT_ALL = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna/bronza/zelta";
const SET_LOFT_ALL_RU = "комплект фурнитуры «Loft», квадратные накладки, цвет: нержавеющая сталь/чёрный/бронза/золото";
const SET_LOFT_2 = "furnitūras komplekts “Loft”, kvadrātformas uzlikas, krāsa: nerūsējoša tērauda/melna";
const SET_LOFT_2_RU = "комплект фурнитуры «Loft», квадратные накладки, цвет: нержавеющая сталь/чёрный";
const SET_PAVA = "furnitūras komplekts “Pava”, ovālas formas uzlikas, krāsa: hroma/zelta/melna";
const SET_PAVA_RU = "комплект фурнитуры «Pava», овальные накладки, цвет: хром/золото/чёрный";

const lockRows = {
  [KD1 + BAR_CBA("1200")]: KD1_RU + BAR_CBA_RU("1200"),
  [KD1 + BAR_CBA("1800")]: KD1_RU + BAR_CBA_RU("1800"),
};
for (const cyl of ["cilindra", "cilindru"]) {
  Object.assign(lockRows, {
    [KDL(cyl) + LATCH + BAR_CBA("1200")]: KDL_RU + LATCH_RU + BAR_CBA_RU("1200"),
    [KDL(cyl) + LATCH + BAR_CBA("1800")]: KDL_RU + LATCH_RU + BAR_CBA_RU("1800"),
    [KDL(cyl) + SET_LOFT_ALL]: KDL_RU + SET_LOFT_ALL_RU,
    [KDL(cyl) + LATCH + BAR_LOFT("1200")]: KDL_RU + LATCH_RU + BAR_LOFT_RU("1200"),
    [KDL(cyl) + LATCH + BAR_LOFT("1800")]: KDL_RU + LATCH_RU + BAR_LOFT_RU("1800"),
  });
}
lockRows[KDL("cilindra") + SET_LOFT_2] = KDL_RU + SET_LOFT_2_RU;
lockRows[KDL("cilindra") + SET_PAVA] = KDL_RU + SET_PAVA_RU;

export const ruBoston = {
  ...designCodes,
  ...lockRows,

  // Names and blurbs
  "Boston AG4-6010 Antracīts/Balts akmens": "Boston AG4-6010 антрацит / белый камень",
  "Boston Smart AG652 Balts soft velvet": "Boston Smart AG652 белый soft velvet",
  "Alumīnija durvis ar termopārrāvumu, stikla paketi, antracīts/balts akmens.":
    "Алюминиевая дверь с терморазрывом и стеклопакетом, антрацит / белый камень.",
  "Alumīnija durvis ar termopārrāvumu.": "Алюминиевая дверь с терморазрывом.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni, balts soft velvet.":
    "Металлическая дверь для квартиры с умным замком, белый soft velvet.",
  "Metāla durvis dzīvoklim ar viedo slēdzeni.": "Металлическая дверь для квартиры с умным замком.",

  // Specification labels
  "Slēdzeņu sistēma": "Система замков",
  "Uzlikas slēdzenēm": "Накладки для замков",
  "Tips 10 (uz pasūtījumu)": "Тип 10 (под заказ)",
  "Tips 11 (uz pasūtījumu)": "Тип 11 (под заказ)",
  "Vērtnes apdare no ārpuses": "Отделка полотна снаружи",
  "Vērtnes apdare no iekšpuses": "Отделка полотна изнутри",
  "Kārba krāsota divās krāsās": "Коробка окрашена в два цвета",
  "Fornitūra": "Фурнитура",

  // Specification values
  "vērtne – 97mm, kārba – 100mm": "полотно – 97 мм, коробка – 100 мм",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» с термостержнем, «5 ключей»",
  "«Guardian Basic Termo» ar Termostieni «5 atslēgas»": "«Guardian Basic Termo» с термостержнем, «5 ключей»",
  "76mm Trīskameru": "76 мм, трёхкамерный",
  "«CBA» ar termostieni aizgrieznim": "«CBA» с термостержнем под вертушку",
  "«CBA» ar termostieni aizgrieznim": "«CBA» с термостержнем под вертушку",
  "Divsekcionālas uzliekamas eņģes, 3D eņģu regulēšana visos virzienos, 2 gb.":
    "Двухсекционные накладные петли, 3D-регулировка во всех направлениях, 2 шт.",
  "«CBA» ar aizgriezni no iekšpuses": "«CBA» с вертушкой изнутри",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 шт. с 3D-регулировкой во всех направлениях",
  "2gb.  ar 3D regulēšanu visos virzienos": "2 шт. с 3D-регулировкой во всех направлениях",
  "«CBA» Biometriskā slēdzene CBA PSL2 ar Face ID": "«CBA» биометрический замок CBA PSL2 с Face ID",
  "Biometriskās slēdzenes komplekta cilindrs, cilindrs papildus slēdzenei “CBA” ar termostieni":
    "Цилиндр из комплекта биометрического замка, цилиндр дополнительного замка «CBA» с термостержнем",
  "2 × CBA (cilindriskās) ar termostieni": "2 × CBA (цилиндровые) с термостержнем",
  "WALA (Polija), 3D regulācija": "WALA (Польша), 3D-регулировка",
  "Tērauds 1mm, Antracīts": "Сталь 1 мм, антрацит",
  "Tērauds 1mm, Rūgta šokolāde": "Сталь 1 мм, горький шоколад",
  "Tērauds 1mm, Ziloņkauls": "Сталь 1 мм, слоновая кость",
  "ARIKO (suvaldu) + Kale 252 (cilindriskā)": "ARIKO (сувальдный) + Kale 252 (цилиндровый)",
  "Hisar Kilit 50×30 (Turcija), aizsardzība pret izurbšanu": "Hisar Kilit 50×30 (Турция), защита от высверливания",
  "MDF 10mm, Tabakas ozols": "МДФ 10 мм, дуб табачный",
  "MDF 10mm, Ozols Nemo Late": "МДФ 10 мм, дуб немо латте",
  "MDF 10mm, Ozols Nemo Karbon": "МДФ 10 мм, дуб немо карбон",
  "MDF 10mm, Ozols Nemo Sudrabs": "МДФ 10 мм, дуб немо серебро",
  "Kale 257 + Kale 252 (cilindriskās)": "Kale 257 + Kale 252 (цилиндровые)",
  "MDF 10mm, Venge Horizontāls Pelēks": "МДФ 10 мм, венге горизонтальный серый",
  "MDF 10mm, Balts Šagreņ": "МДФ 10 мм, белый шагрень",
  "Balts Akmens": "Белый камень",
  "«Securemme 2061» (cilindriskā), Itālija": "«Securemme 2061» (цилиндровый), Италия",
  "krāsa Melna": "цвет чёрный",
  "«Securemme 2019» (suvaldu, 5 atslēgas), Itālija": "«Securemme 2019» (сувальдный, 5 ключей), Италия",
  "suvaldu tipa, forma kradrātveida, krāsa Melna": "для сувальдного замка, квадратной формы, цвет чёрный",
  "Saskaņā ar komplektāciju (pēc izvēles), 2gb.": "В соответствии с комплектацией (по выбору), 2 шт.",
  "3 blīvējuma kontūru konstrukcija ar 2 blīvgumijām": "Конструкция с 3 контурами уплотнения и 2 уплотнителями",
  "Monolītas": "Монолитные",
  "Monolīta": "Монолитная",
  "97mm alumīnija kārba ar termopārrāvumu": "Алюминиевая коробка 97 мм с терморазрывом",
  "MDF 12mm krāsa – «Madeiras Ozols ar melnu patinu» Nr.96 / «Melns» Nr.97":
    "МДФ 12 мм, цвет – «Дуб мадейра с чёрной патиной» № 96 / «Чёрный» № 97",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17": "МДФ 12 мм, цвет – «Белый soft velvet» № 17",
  "«Melna» no ārpuses / «Balta» no iekšpuses": "«Чёрная» снаружи / «Белая» изнутри",
  "1 uz vērtnes / 1 uz kārbas": "1 на полотне / 1 на коробке",
  "Pretuzlaužama «CBA»(cilindriska) ar krabja sistēmu": "Взломостойкий «CBA» (цилиндровый) с крабовой системой",
  "«SL 2» (viedā – pirkstu nospieduma nolasītājs, Wi-Fi un bluetooth, aplikācija)":
    "«SL 2» (умный – сканер отпечатка пальца, Wi-Fi и Bluetooth, приложение)",
  "Ar pirksta nospieduma nolasītāju no ārpuses": "Со сканером отпечатка пальца снаружи",
  "Nav (augšējai slēdzenei ir aizgrieznis no iekšpuses)": "Нет (у верхнего замка есть вертушка изнутри)",
  "Alumīnija bez krāsas": "Алюминиевая, неокрашенная",
  "MDF 12mm krāsa – «Loft Melns» Nr.83 / Melna glancēta stikla ieliktnis":
    "МДФ 12 мм, цвет – «Loft чёрный» № 83 / вставка из чёрного глянцевого стекла",
  "MDF 12mm krāsa – «Balts soft velvet» Nr.17 / Melna glancēta stikla ieliktnis":
    "МДФ 12 мм, цвет – «Белый soft velvet» № 17 / вставка из чёрного глянцевого стекла",
  "«PSL 1» (viedā – pirkstu nospieduma nolasītājs, FACE ID kamera, Wi-Fi un bluetooth, aplikācija)":
    "«PSL 1» (умный – сканер отпечатка пальца, камера FACE ID, Wi-Fi и Bluetooth, приложение)",
  "Ir (iestrādāts viedajā slēdzenē)": "Есть (встроен в умный замок)",
  "Viedās slēdzenes uzlika, kvadrāta uzlika “LOFT” krāsa melna": "Накладка умного замка, квадратная накладка «LOFT», цвет чёрный",
  "Rokturis ar pirkstu nospieduma skeneri": "Ручка со сканером отпечатка пальца",

  // Leaf finish (galvanised steel, powder coating, decor)
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору).",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные алюминиевые планки (в цвет полотна)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūsējošais tērauds)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративная вставка (цвет чёрный/нержавеющая сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные ламели (оттенок по выбору), декоративная вставка (цвет чёрный), стекло Lacobel",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna), stikls Lakobel":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные ламели (оттенок по выбору), декоративная вставка (цвет чёрный), стекло Lacobel",
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    "Оцинкованная сталь, оттенок снаружи из палитры DECOLUX, декоративный алюминиевый штапик (классический дизайн), капитель",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), alumīnija štapiks (klasiskais dizains)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), алюминиевый штапик (классический дизайн)",
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX, dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    "Оцинкованная сталь, оттенок снаружи из палитры DECOLUX, декоративная вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna/ner. tērauds)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные алюминиевые планки (в цвет полотна), декор. вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративная вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративная вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), dekoratīvs ieliktnis (krāsa melns/nerūs.tērauds)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные ламели (оттенок по выбору), декоративная вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krasā), dekor. ieliktnis (krāsa melna), stikls Lakobel":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные алюминиевые планки (в цвет полотна), декор. вставка (цвет чёрный), стекло Lacobel",
  "Cinkots tērauds, tonis no ārpuses no krāsu paletes DECOLUX": "Оцинкованная сталь, оттенок снаружи из палитры DECOLUX",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes no ārpuses (vērtnes krāsā), iekšpusē spogulis":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные алюминиевые планки снаружи (в цвет полотна), внутри зеркало",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvas alumīnija līstes (vērtnes krāsā) dekoratīvs ieliktnis (krāsa melna/nerūs.t.)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные алюминиевые планки (в цвет полотна), декоративная вставка (цвет чёрный/нерж. сталь)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles)":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные ламели (оттенок по выбору)",
  "Cinkots tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles), dekoratīvie dēlīši (tonis pēc izvēles), spogulis":
    "Оцинкованная сталь, атмосферостойкая порошковая окраска (оттенок по выбору), декоративные ламели (оттенок по выбору), зеркало",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasisks dizains), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs ieliktnis (krāsa:melna/nerūsējoša tērauda), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративная вставка (цвет: чёрный/нержавеющая сталь), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasisks dizains), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (неоклассический дизайн), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (neoklasiskais dizains), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (неоклассический дизайн), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), зеркало, капитель, дверной молоток-декор «Лев» (цвет чёрный), декоративный почтовый ящик (цвет чёрный/нержавеющая сталь)",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis melns stikls Lakobel":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Декоративная вставка - чёрное стекло Lacobel",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), atdure (krāsa melna), dekoratīva pastkastīte (krāsa melna)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель, дверной молоток-декор «Лев» (цвет чёрный), стопор (цвет чёрный), декоративный почтовый ящик (цвет чёрный)",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna, zelta, bronza)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель, дверной молоток-декор «Лев» (цвет чёрный, золото, бронза)",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija, knob":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), зеркало, капитель, ручка-кноб",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи декоративный алюминиевый штапик (классический дизайн), капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, knob":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель, ручка-кноб",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna), dekoratīva pastkastīte (krāsa melna/nerūsējošais tērauds)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), капитель, дверной молоток-декор «Лев» (цвет чёрный), декоративный почтовый ящик (цвет чёрный/нержавеющая сталь)",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses un iekšpuses dekoratīvs alumīnija štapiks (klasiskais dizains), spogulis, kapitēlija":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи и изнутри декоративный алюминиевый штапик (классический дизайн), зеркало, капитель",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas ieliktnis":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Декоративная вставка",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles).": "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору).",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). Dekoratīvas alumīnija līstes, ieliktnis":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Декоративные алюминиевые планки, вставка",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvas alumīnija līstes (krāsa pēc izvēles)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи декоративные алюминиевые планки (цвет по выбору)",
  "Tērauds, atmosfērizturīgs pulverkrāsojums (tonis pēc izvēles). No ārpuses dekoratīvs alumīnija štapiks (klasiskais dizains), kapitēlija, dekors “Lauva” klauvēt durvis (krāsa melna)":
    "Сталь, атмосферостойкая порошковая окраска (оттенок по выбору). Снаружи декоративный алюминиевый штапик (классический дизайн), капитель, дверной молоток-декор «Лев» (цвет чёрный)",

  // Glass units (manufacturer code, chambers, tint)
  "DG49, četrkameru, grafīts/bronza (pēc izvēles)": "DG49, четырёхкамерный, графит/бронза (по выбору)",
  "DG51, trīskameru, bronza/hroms (pēc izvēles) ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, трёхкамерный, бронза/хром (по выбору) со вставной декоративной решёткой чёрного цвета",
  "DG58, četrkameru, grafīts": "DG58, четырёхкамерный, графит",
  "DG295, četrkameru, grafīts/bronza (pēc izvēles)": "DG295, четырёхкамерный, графит/бронза (по выбору)",
  "DG44, četrkameru, bronza/hroms": "DG44, четырёхкамерный, бронза/хром",
  "DG196, četrkameru, grafīts/bronza (pēc izvēles)": "DG196, четырёхкамерный, графит/бронза (по выбору)",
  "DG22, trīskameru, grafīts/bronza (pēc izvēles) ar ieliekamu melnu resti krāsa melna":
    "DG22, трёхкамерный, графит/бронза (по выбору) со вставной чёрной решёткой",
  "DG25, četrkameru, grafīts/bronza (pēc izvēles)": "DG25, четырёхкамерный, графит/бронза (по выбору)",
  "DG35, četrkameru, grafīts/bronza pēc izvēles": "DG35, четырёхкамерный, графит/бронза по выбору",
  "DG26, četrkameru, grafīts/bronza (pēc izvēles)": "DG26, четырёхкамерный, графит/бронза (по выбору)",
  "DG35, četrkameru, grafīts/bronza (pēc izvēles)": "DG35, четырёхкамерный, графит/бронза (по выбору)",
  "DG, četrkameru, grafīts/bronza (pēc izvēles)": "DG, четырёхкамерный, графит/бронза (по выбору)",
  "DG40, četrkameru, bronza/hroms, uzliekams dekoratīvs kalums (krāsa pēc izvēles)":
    "DG40, четырёхкамерный, бронза/хром, накладная декоративная ковка (цвет по выбору)",
  "DG67, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG67, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG25, četrkameru, satīns": "DG25, четырёхкамерный, сатин",
  "DG34, četrkameru, UV-zīmogs": "DG34, четырёхкамерный, УФ-печать",
  "DG196, četrkameru, grafīts": "DG196, четырёхкамерный, графит",
  "DG45, četrkameru, grafīts/bronza pēc izvēles": "DG45, четырёхкамерный, графит/бронза по выбору",
  "DG45, četrkameru, grafīts/bronza (pēc izvēles)": "DG45, четырёхкамерный, графит/бронза (по выбору)",
  "DG66, četrkameru, grafīts/bronza pēc izvēles": "DG66, четырёхкамерный, графит/бронза по выбору",
  "DG264, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG264, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG261, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG261, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG298, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG298, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG46, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG46, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG40, trīskameru": "DG40, трёхкамерный",
  "DG51, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG51, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG44, četrkameru, bronza/grafīts pēc izvēles": "DG44, четырёхкамерный, бронза/графит по выбору",
  "DG43, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna":
    "DG43, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой чёрного цвета",
  "DG50, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG50, трёхкамерный, зеркальный, бронза/хром по выбору (со вставной чёрной декоративной решёткой)",
  "DG, četrkameru, grafīts/bronza (pēc izveles)": "DG, четырёхкамерный, графит/бронза (по выбору)",
  "DG, četrkameru, UV zīmogs gradient": "DG, четырёхкамерный, УФ-печать с градиентом",
  "DG, trīskameru, bronza/hroms pēc izvēles ar ieliekamu dekoratīvu resti krāsa melna/zelta":
    "DG, трёхкамерный, бронза/хром по выбору со вставной декоративной решёткой цвета чёрный/золото",
  "DG22, trīskameru, bronza/hroms pēc izvēles, ar melnu ieliekamu dekoratīvo resti":
    "DG22, трёхкамерный, бронза/хром по выбору, с чёрной вставной декоративной решёткой",
  "DG, četrkameru, grafīts": "DG, четырёхкамерный, графит",
  "DG67, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG67, трёхкамерный, зеркальный, бронза/хром по выбору (со вставной чёрной декоративной решёткой)",
  "DG51, trīskameru, spoguļ bronza/hroms pēc izvēles (ar ieliekamu melnu ieliktni dekoratīvu resti)":
    "DG51, трёхкамерный, зеркальный, бронза/хром по выбору (со вставной чёрной декоративной решёткой)",
  "DG40, četrkameru, bronza/hroms, uzliekams kalums (krāsa pēc izvēles)":
    "DG40, четырёхкамерный, бронза/хром, накладная ковка (цвет по выбору)",
};
