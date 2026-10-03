/* Russian for the one-line product blurbs (product.short) shown on the
   cards and above the fold on a product page. The Termo House / Citadel
   blurbs repeat one template per article number, so those entries are built
   from the template (the Latvian key is reproduced exactly) instead of being
   written out dozens of times. */

const TH_INTRO_LV = "laba izvēle tiem, kas meklē uzticamas ārdurvis";
const TH_BODY_LV =
  "Termopārrāvuma tehnoloģija pasargā durvis no aukstuma un novērš kondensāta veidošanos, tādējādi pasargājot izstrādājumu no korozijas.";
const TH_BODY_RU =
  "Технология терморазрыва защищает дверь от холода и предотвращает образование конденсата, тем самым защищая изделие от коррозии.";
const TH_EXTRA = {
  none: ["", ""],
  threshold: [" Durvis ir aprīkotas ar nerūsējošā tērauda slieksni.", " Дверь оснащена порогом из нержавеющей стали."],
  glass: [
    " Durvis ir aprīkotas ar tonētu divkameru energotaupošu stikla paketi un nerūsējošā tērauda slieksni.",
    " Дверь оснащена тонированным двухкамерным энергосберегающим стеклопакетом и порогом из нержавеющей стали.",
  ],
  glass2: [
    " Durvis ir aprīkotas ar divām tonētām divkameru energotaupošām stikla paketēm un nerūsējošā tērauda slieksni.",
    " Дверь оснащена двумя тонированными двухкамерными энергосберегающими стеклопакетами и порогом из нержавеющей стали.",
  ],
};

// "<model>, artikuls: <art> - laba izvēle ... ar [stiklu un ]termopārrāvumu. <body><extra>"
function termoHouse(model, art, withGlass, extra) {
  const [extraLv, extraRu] = TH_EXTRA[extra];
  const lv = `${model}, artikuls: ${art} - ${TH_INTRO_LV} ar ${withGlass ? "stiklu un " : ""}termopārrāvumu. ${TH_BODY_LV}${extraLv}`;
  const ru = `${model.replace(" - 1200 mm", " - 1200 мм")}, арт. ${art} - хороший выбор для тех, кто ищет надёжные входные двери ${
    withGlass ? "со стеклом и терморазрывом" : "с терморазрывом"
  }. ${TH_BODY_RU}${extraRu}`;
  return [lv, ru];
}

const KALE_NIGHT_LV =
  "uzticamības un mūsdienīga dizaina apvienojums. Durvis ir aprīkotas ar Turcijas slēdzenēm Kale 257 (suvaldu) un Kale 252 (cilindra), kā arī ar Itālijā ražotu Securemme nakts aizbīdni, kas pieejams tikai no iekšpuses.";
const KALE_NIGHT_RU =
  "сочетание надёжности и современного дизайна. Дверь оснащена турецкими замками Kale 257 (сувальдный) и Kale 252 (цилиндровый), а также итальянской ночной задвижкой Securemme, доступной только изнутри.";
const ARIKO_LV =
  "kvalitātes un mūsdienīguma apvienojums. Durvīm ir uzstādītas divas slēdzenes: ARIKO suvaldu tipa un Kale 252 cilindra tipa, kā arī nakts aizbīdnis.";
const ARIKO_RU =
  "сочетание качества и современности. На двери установлены два замка: сувальдный ARIKO и цилиндровый Kale 252, а также ночная задвижка.";
const OLIMP_LV =
  "drošības un mūsdienīga dizaina apvienojums. Durvīm ir 4. pretuzlaušanas klase, jo tās ir aprīkotas ar itāļu Mottura un Securemme slēdzenēm, kas garantē uzticamību un aizsardzību.";
const OLIMP_RU =
  "сочетание безопасности и современного дизайна. Дверь имеет 4 класс взломостойкости, так как оснащена итальянскими замками Mottura и Securemme, гарантирующими надёжность и защиту.";
const COTTAGE_GLASS_LV = "variants tiem, kas meklē uzticamas ārdurvis ar stiklu.";
const COTTAGE_GLASS_RU = "вариант для тех, кто ищет надёжные входные двери со стеклом.";
const COTTAGE_LV =
  "ideāls variants tiem, kas meklē uzticamas un stilīgas ārdurvis. Neatkarīgi no laikapstākļiem šīs durvis ir gatavas sargāt jūsu mājokli.";
const COTTAGE_RU =
  "идеальный вариант для тех, кто ищет надёжные и стильные входные двери. В любую погоду эти двери готовы защищать ваш дом.";
const B606_LV = "kvalitatīvs produkts savā segmentā, kas apvieno stilu un uzticamību.";
const B606_RU = "качественный продукт в своём сегменте, сочетающий стиль и надёжность.";
const SECUREMME_APT_LV =
  "atbilst augstākajiem kvalitātes standartiem. Tās ir aprīkotas ar itāļu slēdzenēm, kas garantē jūsu telpu drošību: augšējā slēdzene - Securemme 2019 suvaldu tipa, apakšējā - cilindra Securemme 2061, un Securemme nakts aizbīdnis, kas pieejams tikai no iekšpuses.";
const SECUREMME_APT_RU =
  "соответствует высочайшим стандартам качества. Оснащена итальянскими замками, гарантирующими безопасность вашего помещения: верхний замок - сувальдный Securemme 2019, нижний - цилиндровый Securemme 2061, а также ночная задвижка Securemme, доступная только изнутри.";
const TANDEM_LV = (model, art) =>
  `Durvis Tandem (kvadro) Kale, modelis ${model}, artikuls: ${art}. Izgatavotas no 1,2 mm bieza auksti velmēta tērauda. Rāmis un vērtne krāsoti ar pulverkrāsu 180° temperatūrā. Vērtnes biezums ir 105 mm. Durvju svars var sasniegt 103 kg.`;
const TANDEM_RU = (model, art) =>
  `Дверь Tandem (kvadro) Kale, модель ${model}, арт. ${art}. Изготовлена из холоднокатаной стали толщиной 1,2 мм. Коробка и полотно окрашены порошковой краской при температуре 180°. Толщина полотна - 105 мм. Вес двери может достигать 103 кг.`;

export const ruShorts = {
  "40 mm vērtne ar alumīnija apmali pa perimetru. Apmale pasargā malu no sitieniem un veido tīru metāla līniju starp sienu un vērtni.":
    "Полотно 40 мм с алюминиевым обрамлением по периметру. Обрамление защищает кромку от ударов и создаёт чистую металлическую линию между стеной и полотном.",
  "40 mm vērtne ar melnu alumīnija malu un melnu kārbas rāmi. Ap gaišo vērtni paliek tīra melna kontūra - risinājums, kad durvīm jābūt pamanāmām, nevis paslēptām.":
    "Полотно 40 мм с чёрной алюминиевой кромкой и чёрной рамой коробки. Вокруг светлого полотна остаётся чистый чёрный контур - решение для случаев, когда дверь должна быть заметной, а не скрытой.",
  "Alumīnija durvis ar 2 CBA slēdzenēm, stikla paketi un iespēju sānu/virsgaismām.":
    "Алюминиевая дверь с 2 замками CBA, стеклопакетом и возможностью боковых / верхних фрамуг.",
  "Alumīnija durvis ar baltu iekšpusi un četrkameru stikla paketi.":
    "Алюминиевая дверь с белой внутренней стороной и четырёхкамерным стеклопакетом.",
  "Alumīnija durvis ar termopārrāvumu, stikla paketi un WALA eņģēm (Uw 1.1).":
    "Алюминиевая дверь с терморазрывом, стеклопакетом и петлями WALA (Uw 1.1).",
  "Alumīnija durvis šokolādes/ziloņkaula tonī ar stikla paketi.":
    "Алюминиевая дверь в тоне шоколад / слоновая кость со стеклопакетом.",
  "Alumīnija hibrīda durvis privātmājai ar slēptu termopārrāvumu un divām CBA slēdzenēm ar termostieni.":
    "Алюминиевая гибридная дверь для частного дома со скрытым терморазрывом и двумя замками CBA с термостержнем.",
  "Alumīnija hibrīda durvis privātmājai ar divtoņu apdari un slēptu termopārrāvumu.":
    "Алюминиевая гибридная дверь для частного дома с двухцветной отделкой и скрытым терморазрывом.",
  "Alumīnija termo durvis ar minimālistisku antracīta paneli.":
    "Алюминиевая термодверь с минималистичной панелью цвета антрацит.",
  "Alumīnija termo durvis ar slaidu stikla joslu, antracīts.":
    "Алюминиевая термодверь с узкой стеклянной полосой, антрацит.",
  "Alumīnija termo durvis ar vertikālu stikla joslu.": "Алюминиевая термодверь с вертикальной стеклянной полосой.",
  "Alumīnija termo durvis šokolādes tonī ar garu stikla joslu.":
    "Алюминиевая термодверь в шоколадном тоне с длинной стеклянной полосой.",
  "Alumīnija termo durvis šokolādes tonī ar paneļu dizainu.":
    "Алюминиевая термодверь в шоколадном тоне с филёнчатым дизайном.",
  "Antracīts no ārpuses, balts satīns no iekšpuses, ar termopārrāvumu.":
    "Антрацит снаружи, белый сатин внутри, с терморазрывом.",
  "Augstākās klases termo durvis ar Mottura monobloka slēdzeni.":
    "Термодверь высшего класса с моноблочным замком Mottura.",
  "Betona faktūra ar baltu iekšpusi, KALE slēdzenes.": "Фактура бетона с белой внутренней стороной, замки KALE.",

  "Expert (kvadro) Mottura, artikuls: 0085. Izgatavotas no 2 mm bieza auksti velmēta tērauda. Rāmis un vērtne krāsoti ar pulverkrāsu 180° temperatūrā. Vērtnes biezums ir 105 mm. Durvju svars 142-152 kg.":
    "Expert (kvadro) Mottura, арт. 0085. Изготовлена из холоднокатаной стали толщиной 2 мм. Коробка и полотно окрашены порошковой краской при температуре 180°. Толщина полотна - 105 мм. Вес двери 142-152 кг.",
  "Fortezza (kvadro) Securemme, modelis 563/556, artikuls: 0055 - drošības un stila apvienojums. Durvīm ir 4. pretuzlaušanas klase. Tās ir aprīkotas ar itāļu reduktora tipa slēdzenēm Securemme 2663 un 2653 ar TOP GEAR sistēmu un Securemme K-64 Tandem cilindru, kas ļauj ar vienu atslēgu atslēgt gan augšējo, gan apakšējo slēdzeni.":
    "Fortezza (kvadro) Securemme, модель 563/556, арт. 0055 - сочетание безопасности и стиля. Дверь имеет 4 класс взломостойкости. Она оснащена итальянскими редукторными замками Securemme 2663 и 2653 с системой TOP GEAR и цилиндром Securemme K-64 Tandem, который позволяет одним ключом открывать и верхний, и нижний замок.",
  ["Kotedž 705/431, artikuls: 0128 - " + COTTAGE_GLASS_LV]: "Cottage 705/431, арт. 0128 - " + COTTAGE_GLASS_RU,
  ["Kotedž 705/431, artikuls: 0130 - " + COTTAGE_GLASS_LV]: "Cottage 705/431, арт. 0130 - " + COTTAGE_GLASS_RU,
  ["Kotedž, modelis 710/265, artikuls: 0129 - " + COTTAGE_LV]: "Cottage, модель 710/265, арт. 0129 - " + COTTAGE_RU,
  ["Kotedž, modelis 710/265, artikuls: 0131 - " + COTTAGE_LV]: "Cottage, модель 710/265, арт. 0131 - " + COTTAGE_RU,
  ["Olimp (kvadro) Mottura, modelis 571/238, artikuls: 0083 - " + OLIMP_LV]:
    "Olimp (kvadro) Mottura, модель 571/238, арт. 0083 - " + OLIMP_RU,
  ["Olimp (kvadro) Mottura, modelis 589, artikuls: 0127 - " + OLIMP_LV]:
    "Olimp (kvadro) Mottura, модель 589, арт. 0127 - " + OLIMP_RU,
  "Tandem Elektro (kvadro) Kale, artikuls: 0087. Izgatavotas no 1,2 mm bieza auksti velmēta tērauda. Rāmis un vērtne krāsoti ar pulverkrāsu 180° temperatūrā Metallic Black - melnā krāsā. Vērtnes biezums ir 105 mm. Durvju svars 98-102 kg. Uzstādīts nerūsējošā tērauda slieksnis aizsardzībai pret bojājumiem.":
    "Tandem Elektro (kvadro) Kale, арт. 0087. Изготовлена из холоднокатаной стали толщиной 1,2 мм. Коробка и полотно окрашены порошковой краской при температуре 180° в цвет Metallic Black - чёрный. Толщина полотна - 105 мм. Вес двери 98-102 кг. Установлен порог из нержавеющей стали для защиты от повреждений.",
  "Termo Expert (kvadro) Mottura, modelis 550/253, artikuls: 0028 - radītas tiem, kas novērtē drošību. Durvis ir aprīkotas ar itāļu suvaldu tipa slēdzeni Mottura 54.797 MATIC un Securemme K-2 cilindru, kas garantē 4. aizsardzības līmeni.":
    "Termo Expert (kvadro) Mottura, модель 550/253, арт. 0028 - создана для тех, кто ценит безопасность. Дверь оснащена итальянским сувальдным замком Mottura 54.797 MATIC и цилиндром Securemme K-2, которые гарантируют 4 уровень защиты.",

  ...Object.fromEntries([
    termoHouse("Termo House 705/431 - 1200 mm", "0074", true, "threshold"),
    termoHouse("Termo House 705/431 - 1200 mm", "0075", true, "glass"),
    termoHouse("Termo House 705/431 - 1200 mm", "0076", true, "glass"),
    termoHouse("Termo House 705/431 - 1200 mm", "0105", true, "glass"),
    termoHouse("Termo House 705/431 - 1200 mm", "0108", true, "glass"),
    termoHouse("Termo House 705/431 - 1200 mm", "0110", true, "glass"),
    termoHouse("Termo House 705/431", "0104", true, "glass"),
    termoHouse("Termo House 705/431", "0107", true, "glass"),
    termoHouse("Termo House 705/431", "0109", true, "glass"),
    termoHouse("Termo House 706/431 - 1200 mm", "0047", true, "glass"),
    termoHouse("Termo House 706/431 - 1200 mm", "0059", true, "glass2"),
    termoHouse("Termo House 706/431 - 1200 mm", "0060", true, "glass2"),
    termoHouse("Termo House 706/431 - 1200 mm", "0099", true, "glass2"),
    termoHouse("Termo House 706/431 - 1200 mm", "0134", true, "glass2"),
    termoHouse("Termo House 706/431 - 1200 mm", "0135", true, "glass2"),
    termoHouse("Termo House 710/265 - 1200 mm", "0093", false, "none"),
    termoHouse("Termo House 710/265 - 1200 mm", "0098", false, "none"),
    termoHouse("Termo House 710/265 - 1200 mm", "0102", false, "none"),
    termoHouse("Termo House 710/265 - 1200 mm", "0103", false, "none"),
    termoHouse("Termo House 710/265 - 1200 mm", "0106", false, "none"),
    termoHouse("Termo House 710/265", "0089", false, "none"),
    termoHouse("Termo House 710/265", "0090", false, "none"),
    termoHouse("Termo House 710/265", "0092", false, "none"),
    termoHouse("Termo House 710/265", "0097", true, "threshold"),
    termoHouse("Termo House 710/265", "0101", true, "threshold"),
    termoHouse("Termo House Elektro 705/431", "0112", true, "glass"),
    termoHouse("Termo House Elektro 705/431", "0114", true, "glass"),
    termoHouse("Termo House Elektro 706/431 - 1200 mm", "0113", true, "glass"),
    termoHouse("Termo House Elektro 706/431 - 1200 mm", "0115", true, "glass"),
  ]),

  ["Termo Olimp (kvadro) Mottura, modelis 575/568, artikuls: 0084 - " + OLIMP_LV]:
    "Termo Olimp (kvadro) Mottura, модель 575/568, арт. 0084 - " + OLIMP_RU,
  "Termo Status (kvadro) Securemme, modelis 269/263, artikuls: 0081 - stilīgs akcents un uzticams jūsu mājokļa sargs. Durvis ir aprīkotas ar divām itāļu slēdzenēm. Augšējā slēdzene - Securemme 2019 suvaldu tipa ar nakts aizbīdni un patentētu SecureMap aizsardzības sistēmu. Apakšējā slēdzene - Securemme 2061 cilindra tipa ar Securemme cilindra mehānismu, kam ir rūdīta tērauda aizsargtapas pret uzlaušanu.":
    "Termo Status (kvadro) Securemme, модель 269/263, арт. 0081 - стильный акцент и надёжный страж вашего дома. Дверь оснащена двумя итальянскими замками. Верхний замок - сувальдный Securemme 2019 с ночной задвижкой и запатентованной системой защиты SecureMap. Нижний замок - цилиндровый Securemme 2061 с цилиндровым механизмом Securemme, имеющим штифты из закалённой стали против взлома.",
  "Termo Tandem Elektro (kvadro) Kale, modelis 590/gluds, artikuls: 0120. Izgatavotas no 1,2 mm bieza auksti velmēta tērauda. Rāmis un vērtne krāsoti ar pulverkrāsu 180° temperatūrā Metallic Black/White - melnā/baltā krāsā. Vērtnes biezums ir 105 mm. Durvju svars 104-108 kg. Uzstādīts nerūsējošā tērauda slieksnis aizsardzībai pret bojājumiem.":
    "Termo Tandem Elektro (kvadro) Kale, модель 590/гладкая, арт. 0120. Изготовлена из холоднокатаной стали толщиной 1,2 мм. Коробка и полотно окрашены порошковой краской при температуре 180° в цвет Metallic Black/White - чёрный/белый. Толщина полотна - 105 мм. Вес двери 104-108 кг. Установлен порог из нержавеющей стали для защиты от повреждений.",
  "Ultra (kvadro) Kale, modelis 547/251, artikuls: 0136 - dizaina un uzticamības iemiesojums. Šīs durvis ir aprīkotas ar Turcijas slēdzenēm KALE 257 (suvaldu) un KALE 252 (cilindra).":
    "Ultra (kvadro) Kale, модель 547/251, арт. 0136 - воплощение дизайна и надёжности. Эта дверь оснащена турецкими замками KALE 257 (сувальдный) и KALE 252 (цилиндровый).",
  ["Ultra (kvadro) Kale, modelis 567, artikuls: 0082 - " + KALE_NIGHT_LV]:
    "Ultra (kvadro) Kale, модель 567, арт. 0082 - " + KALE_NIGHT_RU,
  "Ultra (kvadro) Securemme, modelis 557/607, artikuls: 0056 - uzticamas un stilīgas durvis ar spoguli. Tās vizuāli paplašina telpu gaitenī. Pateicoties spoguļa ielaidumam, telpa piepildās ar gaismu, un pirms iziešanas var sakārtot frizūru.":
    "Ultra (kvadro) Securemme, модель 557/607, арт. 0056 - надёжная и стильная дверь с зеркалом. Она визуально расширяет пространство прихожей. Благодаря зеркальной вставке помещение наполняется светом, а перед выходом можно поправить причёску.",

  "Citadel B-434 (kvadro), modelis 155, artikuls: 0049 - kvalitātes un mūsdienīguma apvienojums. Tās noderēs tiem, kas meklē nedārgas durvis dzīvoklim.":
    "Citadel B-434 (kvadro), модель 155, арт. 0049 - сочетание качества и современности. Подойдёт тем, кто ищет недорогую дверь в квартиру.",
  ["Citadel B-606 (kvadro) Kale, modelis 229, artikuls: 0125 - " + B606_LV]:
    "Citadel B-606 (kvadro) Kale, модель 229, арт. 0125 - " + B606_RU,
  ["Citadel B-606 (kvadro) Kale, modelis 580/543, artikuls: 0126 - " + B606_LV]:
    "Citadel B-606 (kvadro) Kale, модель 580/543, арт. 0126 - " + B606_RU,
  ["Citadel B-83 (kvadro) Kale, modelis 544, artikuls: 0124 - " + KALE_NIGHT_LV]:
    "Citadel B-83 (kvadro) Kale, модель 544, арт. 0124 - " + KALE_NIGHT_RU,
  ["Citadel B-83 (kvadro) Kale, modelis 584/589, artikuls: 0118 - " + KALE_NIGHT_LV]:
    "Citadel B-83 (kvadro) Kale, модель 584/589, арт. 0118 - " + KALE_NIGHT_RU,
  ["Citadel B-83 (kvadro) Kale, modelis 593/248, artikuls: 0117 - " + KALE_NIGHT_LV]:
    "Citadel B-83 (kvadro) Kale, модель 593/248, арт. 0117 - " + KALE_NIGHT_RU,
  ["Citadel B-83 (kvadro) Kale, modelis 594/605 ar spoguli, artikuls: 0116 - " + KALE_NIGHT_LV]:
    "Citadel B-83 (kvadro) Kale, модель 594/605 с зеркалом, арт. 0116 - " + KALE_NIGHT_RU,
  ["Citadel B-85 (kvadro) Kale, modelis 535, artikuls: 0111 - " + ARIKO_LV]:
    "Citadel B-85 (kvadro) Kale, модель 535, арт. 0111 - " + ARIKO_RU,
  ["Citadel B-85 (kvadro) Kale, modelis 544, artikuls: 0121 - " + ARIKO_LV]:
    "Citadel B-85 (kvadro) Kale, модель 544, арт. 0121 - " + ARIKO_RU,
  ["Citadel B-85 (kvadro) Kale, modelis 559/191, artikuls: 0122 - " + ARIKO_LV]:
    "Citadel B-85 (kvadro) Kale, модель 559/191, арт. 0122 - " + ARIKO_RU,
  ["Citadel B-85 (kvadro) Kale, modelis 591, artikuls: 0123 - " + ARIKO_LV]:
    "Citadel B-85 (kvadro) Kale, модель 591, арт. 0123 - " + ARIKO_RU,

  "Durvis ar 128 mm kārbu, termopārrāvumu un Securemme blīvējuma regulatoru.":
    "Дверь с коробкой 128 мм, терморазрывом и регулятором прижима Securemme.",
  "Durvis ar antracīta metāla ārpusi un laminētu iekšpusi.":
    "Дверь с металлической наружной стороной цвета антрацит и ламинированной внутренней стороной.",
  "Durvis ar energoefektīvu stikla paketi (argons) un termopārrāvumu.":
    "Дверь с энергоэффективным стеклопакетом (аргон) и терморазрывом.",
  "Durvis ar KALE slēdzenēm, nakts aizbīdni un nerūsējošā tērauda slieksni.":
    "Дверь с замками KALE, ночной задвижкой и порогом из нержавеющей стали.",
  "Durvis ar pulverkrāsotu metālu un AVERS slēdzenēm, 3 blīvējuma kontūri.":
    "Дверь с порошковой окраской металла и замками AVERS, 3 контура уплотнения.",
  "Durvis ar tumšu Dreamwood koka tekstūru abās pusēs.":
    "Дверь с тёмной текстурой дерева Dreamwood с обеих сторон.",
  [TANDEM_LV("276", "0132")]: TANDEM_RU("276", "0132"),
  [TANDEM_LV("586/gluds", "0119")]: TANDEM_RU("586/гладкая", "0119"),
  ["Dzīvokļa durvis Ultra (kvadro) Securemme, modelis 540/249, artikuls: 0048 - " + SECUREMME_APT_LV]:
    "Квартирная дверь Ultra (kvadro) Securemme, модель 540/249, арт. 0048 - " + SECUREMME_APT_RU,
  ["Dzīvokļa durvis Ultra (kvadro) Securemme, modelis 587/276, artikuls: 0133 - " + SECUREMME_APT_LV]:
    "Квартирная дверь Ultra (kvadro) Securemme, модель 587/276, арт. 0133 - " + SECUREMME_APT_RU,

  "Ekonomiskās metāla durvis dzīvoklim ar minerālvates pildījumu.":
    "Эконом-дверь металлическая для квартиры с наполнением из минеральной ваты.",
  "Klasiska dizaina dzīvokļa durvis ar koka tekstūru.": "Квартирная дверь классического дизайна с текстурой дерева.",
  "Klasiskas budžeta klases durvis ar paneļu dizainu.": "Классическая дверь бюджетного класса с филёнчатым дизайном.",
  "Koka toņu durvis ar 100 mm kārbu un hroma furnitūru.":
    "Дверь в древесных тонах с коробкой 100 мм и хромированной фурнитурой.",
  "Koka toņu durvis ar KALE slēdzenēm un Schlegel blīvgumijām.":
    "Дверь в древесных тонах с замками KALE и уплотнителями Schlegel.",
  "Metāla durvis dzīvoklim ar Dienvidu Venge MDF apdari un slēptu kārbas montāžu.":
    "Металлическая дверь для квартиры с отделкой МДФ «южный венге» и скрытым монтажом коробки.",
  "Metāla durvis dzīvoklim ar divtoņu MDF apdari un aizsardzību pret cilindra izurbšanu.":
    "Металлическая дверь для квартиры с двухцветной отделкой МДФ и защитой цилиндра от высверливания.",
  "Metāla durvis dzīvoklim ar MDF apdari abās pusēs un divām ARIKO slēdzenēm.":
    "Металлическая дверь для квартиры с отделкой МДФ с обеих сторон и двумя замками ARIKO.",
  "Metāla durvis dzīvoklim ar Ozola Nemo faktūras MDF apdari abās pusēs.":
    "Металлическая дверь для квартиры с отделкой МДФ фактуры «дуб немо» с обеих сторон.",
  "ML-01 modelis rustik blan tonī ar satīna stikla ielaidumu.":
    "Модель ML-01 в тоне рустик блан со вставкой из сатинированного стекла.",
  "ML-01 modelis stoun ozola tonī ar melnu stikla ielaidumu.":
    "Модель ML-01 в тоне дуб стоун со вставкой из чёрного стекла.",
  "Moderna betona faktūra no ārpuses, balta no iekšpuses.":
    "Современная фактура бетона снаружи, белая внутри.",
  "Moderns betona dizains ar pastiprinātu konstrukciju un 3 blīvējuma kontūriem.":
    "Современный дизайн под бетон с усиленной конструкцией и 3 контурами уплотнения.",
  "Pastiprinātas durvis (svars līdz 115 kg) ar KALE slēdzenēm un nakts aizbīdni.":
    "Усиленная дверь (вес до 115 кг) с замками KALE и ночной задвижкой.",
  "Pastiprinātas metāla durvis dzīvoklim ar 3 blīvējuma kontūriem un nerūsējošā tērauda slieksni.":
    "Усиленная металлическая дверь для квартиры с 3 контурами уплотнения и порогом из нержавеющей стали.",
  "Pilnākā konfigurācija: reversā 52 mm vērtne ar melnu alumīnija malu un melnu rāmi. Veras uz telpas iekšpusi un pārsedz kārbu.":
    "Самая полная комплектация: реверсное полотно 52 мм с чёрной алюминиевой кромкой и чёрной рамой. Открывается внутрь помещения и перекрывает коробку.",
  "Premium alumīnija durvis ar dekoratīvo kapiteli un bronzas furnitūru.":
    "Алюминиевая дверь премиум-класса с декоративной капителью и бронзовой фурнитурой.",
  "Premium durvis ar Itālijas Securemme slēdzenēm un nerūsējošā tērauda slieksni.":
    "Дверь премиум-класса с итальянскими замками Securemme и порогом из нержавеющей стали.",
  "Premium durvis ar KALE slēdzenēm un Itālijas Securemme aktiņu.":
    "Дверь премиум-класса с замками KALE и итальянским глазком Securemme.",
  "Reversais komplekts ar 52 mm vērtni, kas veras uz telpas iekšpusi. Vērtne pārsedz kārbu, tāpēc no aizvērtās puses kārba nav redzama vispār.":
    "Реверсный комплект с полотном 52 мм, открывающимся внутрь помещения. Полотно перекрывает коробку, поэтому с закрытой стороны коробку совсем не видно.",
  "Reversā 52 mm vērtne ar alumīnija apmali. Veras uz telpas iekšpusi, pārsedz kārbu un noslēdzas ar metāla malu pa perimetru.":
    "Реверсное полотно 52 мм с алюминиевым обрамлением. Открывается внутрь помещения, перекрывает коробку и завершается металлической кромкой по периметру.",
  "RV-06 modelis baltā ultramatā tonī ar melniem akcentiem.":
    "Модель RV-06 в белом ультраматовом тоне с чёрными акцентами.",
  "RV-06 modelis pelēkā ultramatā tonī ar melniem akcentiem.":
    "Модель RV-06 в сером ультраматовом тоне с чёрными акцентами.",
  "Stockholm modelis baltā ultramatā tonī ar klasisku frēzētu paneli.":
    "Модель Stockholm в белом ультраматовом тоне с классической фрезерованной филёнкой.",
  "RV-10 modelis itāļu rieksta tonī ar satīna stikla ielaidumiem.":
    "Модель RV-10 в тоне итальянский орех со вставками из сатинированного стекла.",
  "RV-10 modelis zelta rustik tonī ar melniem akcentiem.":
    "Модель RV-10 в тоне золотой рустик с чёрными акцентами.",
  "Siltinātas antracīta durvis ar termopārrāvumu un RAL krāsu maiņu.":
    "Утеплённая дверь цвета антрацит с терморазрывом и возможностью смены цвета RAL.",
  "Siltinātas durvis ar dekoratīvu līniju dizainu un termopārrāvumu.":
    "Утеплённая дверь с декоративными линиями и терморазрывом.",
  "Siltinātas durvis privātmājai ar termopārrāvumu un metāla sendvičpaneli.":
    "Утеплённая дверь для частного дома с терморазрывом и металлической сэндвич-панелью.",
  "Slēpto durvju komplekts ar 40 mm gruntētu vērtni, kas veras uz ārpusi. Kārba, vērtne un divas slēptās eņģes vienā cenā, pieejams no noliktavas.":
    "Комплект скрытой двери с загрунтованным полотном 40 мм, открывающимся наружу. Коробка, полотно и две скрытые петли по одной цене, в наличии на складе.",
  "Tehniskās metāla durvis saimniecības un palīgtelpām.":
    "Техническая металлическая дверь для хозяйственных и подсобных помещений.",
  "Termix durvis ar 2 kameru reflektoro stikla paketi un nakts aizbīdni.":
    "Дверь Termix с 2-камерным стеклопакетом с рефлектором и ночной задвижкой.",
  "Termix durvis ar Lampre apdari un reflektoro stikla paketi.":
    "Дверь Termix с отделкой Lampre и стеклопакетом с рефлектором.",
  "Termo durvis ar spoguli no iekšpuses un Securemme furnitūru.":
    "Термодверь с зеркалом изнутри и фурнитурой Securemme.",
  "Tīka koka faktūra ar spoguli no iekšpuses un KALE Tandem cilindru.":
    "Фактура тика с зеркалом изнутри и цилиндром KALE Tandem.",
  "Venge no ārpuses, balts satīns no iekšpuses, ar termopārrāvumu.":
    "Венге снаружи, белый сатин внутри, с терморазрывом.",

  "40 mm gruntēta vērtne, kas veras uz ārpusi, izgatavota tieši jūsu ailei: izmērs ar 5 mm soli līdz 2300 × 1100 mm, spogulis, slēptais pievilcējs un krītošais slieksnis pēc izvēles.":
    "Загрунтованное полотно 40 мм, открывающееся наружу, изготовленное точно под ваш проём: размер с шагом 5 мм до 2300 × 1100 мм, зеркало, скрытый доводчик и выпадающий порог по выбору.",
  "Reversā 52 mm gruntētā vērtne, izgatavota tieši jūsu ailei: izmērs ar 5 mm soli līdz 2700 × 1100 mm, durvīm līdz griestiem arī bez augšējās kārbas daļas.":
    "Реверсное загрунтованное полотно 52 мм, изготовленное точно под ваш проём: размер с шагом 5 мм до 2700 × 1100 мм, для дверей до потолка - даже без верхней части коробки.",
};
