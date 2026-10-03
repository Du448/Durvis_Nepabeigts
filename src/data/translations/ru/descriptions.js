/* Russian for the long-form description sections shown in the product
   "Aprašymas" tab (section headings and their paragraphs), plus the Stronwood
   facing write-up carried on the Termix models. */

export const ruDescTitles = {
  "Bāzes slānis (Kompozīta pamatne)": "Базовый слой (композитная основа)",
  "Dekoratīvais un aizsargslānis": "Декоративный и защитный слой",
  "Durvju izmērs": "Размер двери",
  "Durvju kārba": "Дверная коробка",
  "Durvju siltināšana": "Утепление двери",
  "Durvju svars": "Вес двери",
  "Durvju vērtne": "Дверное полотно",
  "Furnitūra": "Фурнитура",
  "Izmēri": "Размеры",
  "Kas ir slēptās durvis": "Что такое скрытые двери",
  "Kas ir Stronwood un kā tas ir uzbūvēts?": "Что такое Stronwood и как он устроен?",
  "Konstrukcija": "Конструкция",
  "Metāla apmale": "Металлическое обрамление",
  "Nakts aizbīdnis": "Ночная задвижка",
  "Nestandarta izmēra piemaksa": "Доплата за нестандартный размер",
  "Papildu aprīkojums": "Дополнительное оснащение",
  "Piespiedes regulators": "Регулятор прижима",
  "Pretnoņemšanas rīvji": "Противосъёмные ригели",
  "Slēdzenes": "Замки",
  "Slēptās montāžas apmale": "Наличник скрытого монтажа",
  "Stikla pakete": "Стеклопакет",
  "Termopārrāvums": "Терморазрыв",
  "UV un termo-aizsardzība": "УФ- и термозащита",
};

// Repeated tails of the generated description paragraphs.
const WEIGHT_TAIL_LV =
  "Tas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.";
const WEIGHT_TAIL_RU =
  "Это подтверждает их прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.";
const ARMORED_LV = " Pasūtiet bruņotās durvis jau tagad un radiet mājīgu un aizsargātu telpu savā dzīvoklī!";
const ARMORED_RU = " Закажите бронированную дверь уже сейчас и создайте уютное и защищённое пространство в своей квартире!";
const DSTU_LV =
  "Durvis ir sertificētas atbilstoši DSTU standartiem, un tām ir kvalitātes sertifikāts, kas apliecina to kvalitāti. Garantija izstrādājumam (karkass, eņģes, MDF apdare, moldingi, PVC pārklājums u.c.) - 25 gadi, kalpošanas laiks - 50 gadi.";
const DSTU_RU =
  "Дверь сертифицирована по стандартам ДСТУ и имеет сертификат качества, подтверждающий её качество. Гарантия на изделие (каркас, петли, отделка МДФ, молдинги, ПВХ-покрытие и т. д.) - 25 лет, срок службы - 50 лет.";
const LOCKS5_LV = " Garantija slēdzenēm - 5 gadi. Garantija rokturim - 1 gads.";
const LOCKS5_RU = " Гарантия на замки - 5 лет. Гарантия на ручку - 1 год.";
const HW3_LV = " Garantija furnitūrai - 3 gadi.";
const HW3_RU = " Гарантия на фурнитуру - 3 года.";
const KVADRO_LV = "Durvju furnitūras forma ir kvadrātveida, kas durvīm piešķir eleganci un stilu. Durvis ir komplektētas ar ";
const KVADRO_RU = "Фурнитура двери квадратной формы, что придаёт двери элегантность и стиль. Дверь комплектуется ";
const ROSE_GALV_LV =
  " tipa rokturi uz rozetes ar galvanisku pārklājumu, kas pasargā izstrādājumu no ultravioletā starojuma un laikapstākļu iedarbības.";
const ROSE_GALV_RU =
  " на розетке с гальваническим покрытием, которое защищает изделие от ультрафиолета и воздействия погодных условий.";
const FRAME_LV = (w, t, ribs) =>
  `Durvju kārba ir izgatavota no auksti velmēta tērauda liekta profila, kura platums ir ${w} mm.${
    ribs ? " Papildu izturībai un noturībai pret slodzēm kārba ir pastiprināta ar 6 stingruma ribām." : ""
  } Metāla loksnes biezums kārbā ir ${t} mm, kas garantē konstrukcijas ilgmūžību un uzticamību. Atveres slēdzeņu rīvjiem ir pastiprinātas ar papildu metāla loksni, kas paaugstina drošības līmeni.`;
const FRAME_RU = (w, t, ribs) =>
  `Дверная коробка изготовлена из гнутого профиля холоднокатаной стали шириной ${w} мм.${
    ribs ? " Для дополнительной прочности и устойчивости к нагрузкам коробка усилена 6 рёбрами жёсткости." : ""
  } Толщина металлического листа в коробке - ${t.replace(".", ",")} мм, что гарантирует долговечность и надёжность конструкции. Отверстия для ригелей замков усилены дополнительным металлическим листом, что повышает уровень безопасности.`;

export const ruDescParas = {
  '* Informācija par šīm slēdzenēm ir sadaļā "Slēdzenes"': '* Информация об этих замках - в разделе «Замки»',
  "Apakšējā - KALE 252 (Turcija) ar Turcijā ražotu cilindra mehānismu stieņa tipa izmērā 40×30":
    "Нижний - KALE 252 (Турция) с турецким штоковым цилиндровым механизмом размером 40×30",
  "Augstākām durvīm nepieciešama trešā vai ceturtā eņģe. Papildu eņģe ar frēzējumu maksā 59 € un procentuālajā piemaksā nav iekļauta.":
    "Для более высоких дверей нужна третья или четвёртая петля. Дополнительная петля с фрезеровкой стоит 59 € и в процентную доплату не входит.",
  "Augšējā - ARIKO suvaldu slēdzene (Ukraina)": "Верхний - сувальдный замок ARIKO (Украина)",
  "Augšējā seifa tipa slēdzene - KALE 257 (Turcija), apakšējā cilindra slēdzene - KALE 252 (Turcija) ar Turcijas cilindra mehānismu 50×30 stieņa tipa. Papildus ir uzstādīts arī Securemme (Itālija) ražots nakts aizbīdnis.":
    "Верхний замок сейфового типа - KALE 257 (Турция), нижний цилиндровый замок - KALE 252 (Турция) с турецким штоковым цилиндровым механизмом 50×30. Дополнительно установлена ночная задвижка производства Securemme (Италия).",
  "Augšējā seifa tipa slēdzene Class 88D. Slēdzenes rīvja diametrs - 14 mm, izbīde - 34 mm.":
    "Верхний замок сейфового типа Class 88D. Диаметр ригеля - 14 мм, вылет - 34 мм.",
  "Augšējo Turcijā ražoto cilindra slēdzeni Kale 257, kuras komplektā ir 5 atslēgas. Slēdzenes rīvja diametrs ir 16 mm, izbīde - 34 mm. Un apakšējo slēdzeni Kale 252 ar Turcijā ražotu cilindra mehānismu 50×30 stieņa tipa. Tai ir trīs rīvji ar 16 mm diametru un 34 mm izbīdi.":
    "Верхний цилиндровый замок турецкого производства Kale 257 с 5 ключами в комплекте. Диаметр ригеля - 16 мм, вылет - 34 мм. И нижний замок Kale 252 с турецким штоковым цилиндровым механизмом 50×30. У него три ригеля диаметром 16 мм с вылетом 34 мм.",
  "Ārējā MDF apmale 22 mm biezumā un 80 mm platumā piešķirs jūsu durvīm pabeigtību un estētisku pievilcību.":
    "Наружный наличник МДФ толщиной 22 мм и шириной 80 мм придаст вашей двери завершённость и эстетическую привлекательность.",
  "Ārējā MDF apmale 80 mm platumā piešķirs jūsu durvīm pabeigtību un estētisku pievilcību.":
    "Наружный наличник МДФ шириной 80 мм придаст вашей двери завершённость и эстетическую привлекательность.",
  "Ārējie vertikālie melnā kompozīta ielaidumi šīm durvīm piešķir mūsdienīgu izskatu. Plēve ar vertikālu struktūru pievieno stilu un eleganci.":
    "Наружные вертикальные вставки из чёрного композита придают этой двери современный вид. Плёнка с вертикальной структурой добавляет стиль и элегантность.",
  "Expert durvis ir komplektētas ar itāļu slēdzeni Mottura 54.797 MATIC, Securemme nakts aizbīdni, Securemme actiņu ar stikla optiku, cinka sakausējuma Smart Kvadro rokturi ar galvanisku pārklājumu un kvadrātveida melnu furnitūru.":
    "Дверь Expert комплектуется итальянским замком Mottura 54.797 MATIC, ночной задвижкой Securemme, глазком Securemme со стеклянной оптикой, ручкой Smart Kvadro из цинкового сплава с гальваническим покрытием и квадратной чёрной фурнитурой.",
  "Cilindra mehānisms Securemme K-2, izmērs 50×50T.": "Цилиндровый механизм Securemme K-2, размер 50×50T.",
  "Durvis atbilst DSTU standartiem, un tām ir kvalitātes sertifikāts. Garantija izstrādājumam - 5 gadi, kalpošanas laiks - 25 gadi. Pasūtiet Termo House - tā ir labākā durvju izvēle privātmājai.":
    "Дверь соответствует стандартам ДСТУ и имеет сертификат качества. Гарантия на изделие - 5 лет, срок службы - 25 лет. Закажите Termo House - это лучший выбор двери для частного дома.",
  "Durvis ir aprīkotas ar divām divkameru energotaupošām tonētām stikla paketēm, katras gaismas ailas izmērs - 1233×88 mm.":
    "Дверь оснащена двумя двухкамерными энергосберегающими тонированными стеклопакетами, размер каждого светового проёма - 1233×88 мм.",
  "Durvis ir aprīkotas ar divkameru energotaupošu tonētu stikla paketi, gaismas ailas izmērs - 1233×88 mm.":
    "Дверь оснащена двухкамерным энергосберегающим тонированным стеклопакетом, размер светового проёма - 1233×88 мм.",
  "Durvis ir aprīkotas ar Mottura 54.797 monobloku, kurā apvienota cilindra un suvaldu slēdzene. Slēdzenes rīvja diametrs - 18 mm, izbīde - 36 mm.":
    "Дверь оснащена моноблоком Mottura 54.797, объединяющим цилиндровый и сувальдный замок. Диаметр ригеля - 18 мм, вылет - 36 мм.",
  "Durvis ir aprīkotas ar šādām slēdzenēm:": "Дверь оснащена следующими замками:",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējā seifa tipa - KALE 257 (Turcija), apakšējā cilindra - KALE 252 (Turcija) ar Turcijas cilindra mehānismu 50×30 stieņa tipa. Papildus ir uzstādīts arī Securemme (Itālija) ražots nakts aizbīdnis.":
    "Дверь оснащена следующими замками: верхний сейфового типа - KALE 257 (Турция), нижний цилиндровый - KALE 252 (Турция) с турецким штоковым цилиндровым механизмом 50×30. Дополнительно установлена ночная задвижка производства Securemme (Италия).",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējo ARIKO suvaldu slēdzeni (Ukraina), slēdzenes rīvja diametrs - 14 mm, izbīde - 34 mm; apakšējo cilindra slēdzeni KALE 252 (Turcija) ar cilindra mehānismu 40×50 atslēga/kloķis.":
    "Дверь оснащена следующими замками: верхний сувальдный замок ARIKO (Украина), диаметр ригеля - 14 мм, вылет - 34 мм; нижний цилиндровый замок KALE 252 (Турция) с цилиндровым механизмом 40×50 ключ/вертушка.",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējo Itālijas reduktora slēdzeni Securemme 2663 TOP GEAR. Slēdzenes rīvja diametrs - 18 mm, izbīde - 36 mm. Un apakšējo reduktora slēdzeni Securemme 2653 TOP GEAR ar ceturtās drošības klases cilindra mehānismu Securemme K-64, dueta sistēma 50×30 stieņa tipa. Tai ir trīs rīvji ar 18 mm diametru un 36 mm izbīdi.":
    "Дверь оснащена следующими замками: верхний итальянский редукторный замок Securemme 2663 TOP GEAR. Диаметр ригеля - 18 мм, вылет - 36 мм. И нижний редукторный замок Securemme 2653 TOP GEAR с цилиндровым механизмом четвёртого класса защиты Securemme K-64, система дуэт, штоковый 50×30. У него три ригеля диаметром 18 мм с вылетом 36 мм.",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējo Itālijā ražoto suvaldu slēdzeni Securemme 2019 ar mangāna plāksni atslēgas atveres zonā. Slēdzenes rīvja diametrs ir 16 mm, izbīde - 36 mm. Un apakšējo slēdzeni Securemme 2061 ar cilindra mehānismu 50×30 stieņa tipa (Turcija), kurai ir trīs rīvji ar 16 mm diametru un 34,5 mm izbīdi.":
    "Дверь оснащена следующими замками: верхний сувальдный замок итальянского производства Securemme 2019 с марганцевой пластиной в зоне замочной скважины. Диаметр ригеля - 16 мм, вылет - 36 мм. И нижний замок Securemme 2061 со штоковым цилиндровым механизмом 50×30 (Турция), у которого три ригеля диаметром 16 мм с вылетом 34,5 мм.",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējo Turcijā ražoto suvaldu slēdzeni Kale 257, kuras komplektā ir 5 atslēgas. Tā aizslēdzas ar diviem pusapgriezieniem. Slēdzenes rīvja diametrs - 16 mm, izbīde - 34 mm. Un apakšējo slēdzeni Kale 252 ar Kale cilindra mehānismu 50×50T. Tai ir trīs rīvji ar 16 mm diametru un 34 mm izbīdi. Garantija slēdzenēm un cilindram - 5 gadi.":
    "Дверь оснащена следующими замками: верхний сувальдный замок турецкого производства Kale 257 с 5 ключами в комплекте. Запирается на два полуоборота. Диаметр ригеля - 16 мм, вылет - 34 мм. И нижний замок Kale 252 с цилиндровым механизмом Kale 50×50T. У него три ригеля диаметром 16 мм с вылетом 34 мм. Гарантия на замки и цилиндр - 5 лет.",
  "Durvis ir aprīkotas ar šādām slēdzenēm: augšējo Turcijā ražoto suvaldu slēdzeni KALE 257. Slēdzenes rīvja diametrs - 16 mm, izbīde - 36 mm. Un apakšējo Turcijā ražoto slēdzeni KALE 252, kurai ir trīs rīvji ar 16 mm diametru un 36 mm izbīdi. Slēdzenes papildina Turcijā ražotā Tandēma sistēma ar cilindra mehānisma izmēru 50×30 stieņa tipa.":
    "Дверь оснащена следующими замками: верхний сувальдный замок турецкого производства KALE 257. Диаметр ригеля - 16 мм, вылет - 36 мм. И нижний замок турецкого производства KALE 252 с тремя ригелями диаметром 16 мм и вылетом 36 мм. Замки дополняет система Тандем турецкого производства со штоковым цилиндровым механизмом размером 50×30.",
  "Durvis ir aprīkotas ar trim blīvējuma kontūriem. Tās ir siltinātas ar minerālvati un folijas siltinājumu, kas uzlabo siltumizolāciju un neļauj svešām smakām un troksnim iekļūt jūsu mājoklī.":
    "Дверь оснащена тремя контурами уплотнения. Она утеплена минеральной ватой и фольгированным утеплителем, что улучшает теплоизоляцию и не пропускает посторонние запахи и шум в ваш дом.",
  "Durvis ir aprīkotas ar trim pretuzlaušanas rīvjiem, kuru diametrs ir 14 mm; tos sauc arī par pretnoņemšanas rīvjiem. Tie pasargā mājokli no zagļu iekļūšanas. Ja durvju eņģes tiek nozāģētas ar leņķa slīpmašīnu, durvis pateicoties šiem rīvjiem paliek nofiksētas kārbā.":
    "Дверь оснащена тремя противовзломными ригелями диаметром 14 мм; их также называют противосъёмными. Они защищают дом от проникновения воров. Если петли двери срезать болгаркой, благодаря этим ригелям дверь остаётся зафиксированной в коробке.",
  "Durvis ir aprīkotas ar Turcijas cilindra tipa slēdzeni Kale 257 un Turcijas cilindra mehānismu 50×30 stieņa tipa, bet apakšējās slēdzenes lomu pilda elektroniskā slēdzene PES Monoblok. Durvis ir komplektētas arī ar Securemme nakts aizbīdni. Melnā furnitūra ar pretkorozijas pārklājumu nebaidās no mitruma un ultravioletā starojuma. Durvju rokturis ir izgatavots no cinka maksimālai izturībai.":
    "Дверь оснащена турецким цилиндровым замком Kale 257 и турецким штоковым цилиндровым механизмом 50×30, а роль нижнего замка выполняет электронный замок PES Monoblok. Дверь также комплектуется ночной задвижкой Securemme. Чёрная фурнитура с антикоррозийным покрытием не боится влаги и ультрафиолета. Ручка двери изготовлена из цинка для максимальной прочности.",
  'Durvis ir aprīkotas ar Turcijā ražotām "KALE KILIT" slēdzenēm. Augšējai slēdzenei Kale 257 ir masīvs rīvis ar 16 mm diametru un 34 mm izbīdi. Apakšējā slēdzene Kale 252 ir aprīkota ar trim tāda paša diametra rīvjiem, kas izbīdās par 34 mm, radot papildu fiksācijas punktus un paaugstinot kopējo drošības līmeni. Abas slēdzenes ir komplektētas ar Turcijas cilindra mehānismiem izmērā 50×50T un "Tandēma" sistēmu, kas ļauj abas slēdzenes atslēgt ar vienu atslēgu. Tas ir ērti ikdienas lietošanā un pievieno komfortu, nezaudējot drošību.':
    "Дверь оснащена замками турецкого производства «KALE KILIT». У верхнего замка Kale 257 массивный ригель диаметром 16 мм с вылетом 34 мм. Нижний замок Kale 252 оснащён тремя ригелями того же диаметра с вылетом 34 мм, создающими дополнительные точки фиксации и повышающими общий уровень безопасности. Оба замка комплектуются турецкими цилиндровыми механизмами размером 50×50T и системой «Тандем», позволяющей открывать оба замка одним ключом. Это удобно в повседневном использовании и добавляет комфорта без ущерба для безопасности.",
  "Durvis ir izgatavotas no auksti velmēta tērauda. Ārējā apdare, kārba un rāmis ir krāsoti ar pulverkrāsu un tiem ir pretkorozijas pārklājums, kas pasargā izstrādājumu no mitruma un ultravioletā starojuma, tādējādi pagarinot tā kalpošanas laiku.":
    "Дверь изготовлена из холоднокатаной стали. Наружная отделка, коробка и рама окрашены порошковой краской и имеют антикоррозийное покрытие, которое защищает изделие от влаги и ультрафиолета, тем самым продлевая срок его службы.",
  "Durvis ir izgatavotas no auksti velmēta tērauda. Metāla biezums kārbā - 1,2 mm, metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm. Vērtnē ir uzstādīti trīs pretnoņemšanas rīvji, kas pasargā eņģes no nozāģēšanas.":
    "Дверь изготовлена из холоднокатаной стали. Толщина металла в коробке - 1,2 мм, толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм. В полотне установлены три противосъёмных ригеля, защищающих от срезания петель.",
  "Durvis ir sertificētas atbilstoši DSTU standartiem, kas apliecina to kvalitāti. Garantija izstrādājumam (karkass, eņģes, MDF apdare, moldingi, PVC pārklājums u.c.) - 25 gadi, kalpošanas laiks - 50 gadi. Garantija slēdzenēm - 5 gadi. Garantija rokturim - 1 gads. Pasūtiet Citadel durvis, jo tā ir labākā izvēle nedārgām kāpņu telpas durvīm!":
    "Дверь сертифицирована по стандартам ДСТУ, что подтверждает её качество. Гарантия на изделие (каркас, петли, отделка МДФ, молдинги, ПВХ-покрытие и т. д.) - 25 лет, срок службы - 50 лет. Гарантия на замки - 5 лет. Гарантия на ручку - 1 год. Закажите дверь Citadel - это лучший выбор недорогой двери на лестничную площадку!",
  [DSTU_LV + HW3_LV + " Pasūtiet Elektro durvis, jo tā ir labākā izvēle bezatslēgas piekļuves durvīm, kas ir pieejamas noliktavā!"]:
    DSTU_RU + HW3_RU + " Закажите дверь Elektro - это лучший выбор двери с бесключевым доступом из наличия на складе!",
  [DSTU_LV + HW3_LV + " Pasūtiet Termo Tandem Elektro durvis, jo tā ir labākā izvēle bezatslēgas piekļuves durvīm, kas ir pieejamas noliktavā!"]:
    DSTU_RU + HW3_RU + " Закажите дверь Termo Tandem Elektro - это лучший выбор двери с бесключевым доступом из наличия на складе!",
  [DSTU_LV + LOCKS5_LV + " Nepiekāpieties kvalitātē, izvēloties durvis savam mājoklim - pasūtiet Ultra (kvadro) Kale."]:
    DSTU_RU + LOCKS5_RU + " Не идите на компромисс с качеством, выбирая дверь для своего дома, - закажите Ultra (kvadro) Kale.",
  [DSTU_LV + LOCKS5_LV + " Pasūtiet Olimp durvis, jo tā ir labākā izvēle kāpņu telpas durvīm!"]:
    DSTU_RU + LOCKS5_RU + " Закажите дверь Olimp - это лучший выбор двери на лестничную площадку!",
  [DSTU_LV + LOCKS5_LV + " Pasūtiet Termo Status - izvēlieties drošību un stilu savam mājoklim."]:
    DSTU_RU + LOCKS5_RU + " Закажите Termo Status - выберите безопасность и стиль для своего дома.",
  "Durvīm ir divi standarta izmēru varianti: 840×2040 mm un 940×2040 mm.":
    "У двери два варианта стандартного размера: 840×2040 мм и 940×2040 мм.",
  "Durvīm ir divi standarta izmēru varianti: 850×2050 mm un 950×2050 mm.":
    "У двери два варианта стандартного размера: 850×2050 мм и 950×2050 мм.",
  "Durvīm ir RC4 pretuzlaušanas klase, tās ir sertificētas atbilstoši DSTU standartiem, un tām ir kvalitātes sertifikāts, kas apliecina to kvalitāti. Garantija izstrādājumam (karkass, eņģes, MDF apdare, moldingi, PVC pārklājums u.c.) - 25 gadi, kalpošanas laiks - 50 gadi. Garantija slēdzenēm - 5 gadi. Garantija rokturim - 1 gads. Pasūtiet Expert durvis, jo tā ir labākā izvēle kāpņu telpas durvīm!":
    "Дверь имеет класс взломостойкости RC4, сертифицирована по стандартам ДСТУ и имеет сертификат качества, подтверждающий её качество. Гарантия на изделие (каркас, петли, отделка МДФ, молдинги, ПВХ-покрытие и т. д.) - 25 лет, срок службы - 50 лет. Гарантия на замки - 5 лет. Гарантия на ручку - 1 год. Закажите дверь Expert - это лучший выбор двери на лестничную площадку!",
  "Durvīm ir standarta izmēri 850×2050 mm un 950×2050 mm": "Стандартные размеры двери - 850×2050 мм и 950×2050 мм",
  "Durvīm ir standarta izmēri 850×2050 mm un 950×2050 mm.": "Стандартные размеры двери - 850×2050 мм и 950×2050 мм.",
  "Durvīm ir standarta izmēri 850×2050 un 950×2050 mm": "Стандартные размеры двери - 850×2050 и 950×2050 мм",
  "Durvīm ir standarta izmērs 1200×2050 mm": "Стандартный размер двери - 1200×2050 мм",
  "Durvīm ir standarta izmērs 1200×2050 mm.": "Стандартный размер двери - 1200×2050 мм.",
  "Durvīm ir standarta izmērs 950×2050 mm": "Стандартный размер двери - 950×2050 мм",
  "Durvīm ir standarta izmērs 950×2050 mm.": "Стандартный размер двери - 950×2050 мм.",
  "Durvīm ir uzstādīts Securemme (Itālija) piespiedes regulators, kas regulē vērtnes piespiešanos kārbai un padara to ciešāku, kā arī nodrošina plūdenu durvju aizvēršanos. Pateicoties maksimālai vērtnes piespiedei pie kārbas un blīvējuma kontūrām, jūsu mājoklis būs pasargāts no trokšņa un nepatīkamām smakām no kāpņu telpas.":
    "На двери установлен регулятор прижима Securemme (Италия), который регулирует прижим полотна к коробке, делая его плотнее, а также обеспечивает плавное закрывание двери. Благодаря максимальному прижиму полотна к коробке и контурам уплотнения ваш дом будет защищён от шума и неприятных запахов с лестничной площадки.",
  "Durvju atdure NF Stopio Indoor melnā, bronzas vai matēta hroma krāsā - 22 €, iegriešana 10 €. Alumīnija rāmja vai vērtnes malas krāsojums pēc RAL kataloga - 30 €. Urbums rokturim vai cilindra aizgrieznim - 3 €.":
    "Дверной стопор NF Stopio Indoor в чёрном, бронзовом или матово-хромовом цвете - 22 €, врезка 10 €. Окраска алюминиевой рамы или кромки полотна по каталогу RAL - 30 €. Отверстие под ручку или вертушку цилиндра - 3 €.",
  "Durvju dizains pārsteidz ar eleganci - tajā ietilpst melna kompozīta moldingi un vertikāla frēzēšana uz iekšējās un ārējās apdares.":
    "Дизайн двери поражает элегантностью - в него входят молдинги из чёрного композита и вертикальная фрезеровка на внутренней и наружной отделке.",
  "Durvju dizainu papildina melna kompozīta uzliktņi, kas tām piešķir mūsdienīgu izskatu. Durvju krāsa ir brūna, bet iekšpusē tās ir gaišas, kas padara tās universālas dažādiem interjeriem.":
    "Дизайн двери дополняют накладки из чёрного композита, придающие ей современный вид. Цвет двери коричневый, а внутри она светлая, что делает её универсальной для разных интерьеров.",
  "Durvju dizainu papildina melna kompozīta uzliktņi, kas tām piešķir mūsdienīgu izskatu. Durvju krāsa ir pelēka gan no ārpuses, gan no iekšpuses, kas padara tās universālas dažādiem interjeriem.":
    "Дизайн двери дополняют накладки из чёрного композита, придающие ей современный вид. Цвет двери серый и снаружи, и внутри, что делает её универсальной для разных интерьеров.",
  "Durvju furnitūra ir veidota stilīgā kvadrātveida dizainā melnā krāsā.":
    "Фурнитура двери выполнена в стильном квадратном дизайне чёрного цвета.",
  "Durvju furnitūra ir veidota stilīgā kvadrātveida dizainā, kas durvīm piešķir eleganci un oriģinalitāti. Durvis ir aprīkotas ar pastiprinātu cinka rokturi ar pretkorozijas pārklājumu.":
    "Фурнитура двери выполнена в стильном квадратном дизайне, придающем двери элегантность и оригинальность. Дверь оснащена усиленной цинковой ручкой с антикоррозийным покрытием.",
  "Durvju furnitūras forma ir kvadrātveida melnā krāsā, kas durvīm piešķir eleganci un stilu. Durvis ir komplektētas ar cinka sakausējuma Smart Kvadro tipa rokturi uz rozetes ar galvanisku pārklājumu, kas pasargā izstrādājumu no ultravioletā starojuma un laikapstākļu iedarbības.":
    "Фурнитура двери квадратной формы чёрного цвета, что придаёт двери элегантность и стиль. Дверь комплектуется ручкой типа Smart Kvadro из цинкового сплава на розетке с гальваническим покрытием, которое защищает изделие от ультрафиолета и воздействия погодных условий.",
  "Durvju furnitūras forma ir kvadrātveida melnā krāsā, kas durvīm piešķir eleganci un stilu. Durvis ir komplektētas ar Novelty-A tipa rokturi uz rozetes ar galvanisku pārklājumu, kas pasargā izstrādājumu no ultravioletā starojuma un laikapstākļu iedarbības.":
    "Фурнитура двери квадратной формы чёрного цвета, что придаёт двери элегантность и стиль. Дверь комплектуется ручкой типа Novelty-A на розетке с гальваническим покрытием, которое защищает изделие от ультрафиолета и воздействия погодных условий.",
  "Durvju furnitūras forma ir kvadrātveida melnā šagrēna krāsā, kas durvīm piešķir eleganci un stilu. Durvis ir komplektētas ar Smart-A tipa rokturi uz rozetes.":
    "Фурнитура двери квадратной формы цвета чёрный шагрень, что придаёт двери элегантность и стиль. Дверь комплектуется ручкой типа Smart-A на розетке.",
  "Durvju furnitūras forma ir kvadrātveida un krāsa - melna, kas durvīm piešķir eleganci un stilu. Durvis ir komplektētas ar Smart Kvadro tipa rokturi uz rozetes, arī melnā krāsā.":
    "Фурнитура двери квадратной формы, цвет - чёрный, что придаёт двери элегантность и стиль. Дверь комплектуется ручкой типа Smart Kvadro на розетке, также чёрного цвета.",
  [KVADRO_LV + "cinka sakausējuma Smart Kvadro" + ROSE_GALV_LV]:
    KVADRO_RU + "ручкой типа Smart Kvadro из цинкового сплава" + ROSE_GALV_RU,
  [KVADRO_LV + "melnas krāsas Smart Kvadro tipa rokturi uz rozetes ar paaugstinātu nodilumizturību un galvanisku pārklājumu, kas pasargā izstrādājumu no ultravioletā starojuma un laikapstākļu iedarbības."]:
    KVADRO_RU + "чёрной ручкой типа Smart Kvadro на розетке с повышенной износостойкостью и гальваническим покрытием, которое защищает изделие от ультрафиолета и воздействия погодных условий.",
  [KVADRO_LV + "Novelty-A" + ROSE_GALV_LV]: KVADRO_RU + "ручкой типа Novelty-A" + ROSE_GALV_RU,
  [KVADRO_LV + "Smart Kvadro" + ROSE_GALV_LV]: KVADRO_RU + "ручкой типа Smart Kvadro" + ROSE_GALV_RU,
  [KVADRO_LV + "Smart-RDA" + ROSE_GALV_LV]: KVADRO_RU + "ручкой типа Smart-RDA" + ROSE_GALV_RU,
  "Durvju kārba ir izgatavota ar termopārrāvuma tehnoloģiju, kas pasargā vērtni un kārbu no aizsalšanas.":
    "Дверная коробка изготовлена по технологии терморазрыва, которая защищает полотно и коробку от промерзания.",
  [FRAME_LV("100", "1,2", false)]: FRAME_RU("100", "1,2", false),
  [FRAME_LV("100", "1,2", true)]: FRAME_RU("100", "1,2", true),
  [FRAME_LV("110", "1,2", false)]: FRAME_RU("110", "1,2", false),
  [FRAME_LV("130", "2", false)]: FRAME_RU("130", "2", false),
  [FRAME_LV("85", "1,2", false)]: FRAME_RU("85", "1,2", false),
  "Durvju kārba ir siltināta ar minerālvati un korķa koku. Kārbas un vērtnes karkass ir krāsots no abām pusēm ilgmūžīgai ekspluatācijai. Kārba ir divkrāsu: no ārpuses tumša, no iekšpuses gaiša.":
    "Дверная коробка утеплена минеральной ватой и пробкой. Каркас коробки и полотна окрашен с обеих сторон для долговечной эксплуатации. Коробка двухцветная: снаружи тёмная, внутри светлая.",
  ["Durvju svars atkarībā no izmēra ir 136 kg vai 146 kg. " + WEIGHT_TAIL_LV]:
    "В зависимости от размера вес двери - 136 кг или 146 кг. " + WEIGHT_TAIL_RU,
  ["Durvju svars atkarībā no izmēra ir 136 kg vai 146 kg. " + WEIGHT_TAIL_LV + ARMORED_LV]:
    "В зависимости от размера вес двери - 136 кг или 146 кг. " + WEIGHT_TAIL_RU + ARMORED_RU,
  ["Durvju svars atkarībā no izmēra ir 62 kg vai 70 kg. " + WEIGHT_TAIL_LV]:
    "В зависимости от размера вес двери - 62 кг или 70 кг. " + WEIGHT_TAIL_RU,
  ["Durvju svars atkarībā no izmēra ir 69 kg vai 74 kg. " + WEIGHT_TAIL_LV]:
    "В зависимости от размера вес двери - 69 кг или 74 кг. " + WEIGHT_TAIL_RU,
  ["Durvju svars atkarībā no izmēra ir 82 vai 87 kg. " + WEIGHT_TAIL_LV + ARMORED_LV]:
    "В зависимости от размера вес двери - 82 или 87 кг. " + WEIGHT_TAIL_RU + ARMORED_RU,
  ["Durvju svars atkarībā no izmēra ir 89 kg vai 98 kg. " + WEIGHT_TAIL_LV]:
    "В зависимости от размера вес двери - 89 кг или 98 кг. " + WEIGHT_TAIL_RU,
  ["Durvju svars atkarībā no izmēra ir 92 kg vai 98 kg. " + WEIGHT_TAIL_LV + ARMORED_LV]:
    "В зависимости от размера вес двери - 92 кг или 98 кг. " + WEIGHT_TAIL_RU + ARMORED_RU,
  ["Durvju svars atkarībā no izmēra ir 97 kg vai 103 kg. " + WEIGHT_TAIL_LV]:
    "В зависимости от размера вес двери - 97 кг или 103 кг. " + WEIGHT_TAIL_RU,
  ["Durvju svars ir 102 kg. " + WEIGHT_TAIL_LV]: "Вес двери - 102 кг. " + WEIGHT_TAIL_RU,
  "Durvju svars ir 105 kg, kas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.":
    "Вес двери - 105 кг, что подтверждает её прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.",
  "Durvju svars ir 125 kg, kas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.":
    "Вес двери - 125 кг, что подтверждает её прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.",
  "Durvju svars ir 135 kg, kas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.":
    "Вес двери - 135 кг, что подтверждает её прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.",
  "Durvju svars ir 145 kg, kas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.":
    "Вес двери - 145 кг, что подтверждает её прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.",
  ["Durvju svars ir 88-93 kg. " + WEIGHT_TAIL_LV]: "Вес двери - 88-93 кг. " + WEIGHT_TAIL_RU,
  "Durvju svars ir 91-96 kg, kas apliecina to izturību un uzticamību, savukārt trīs eņģes pasargā durvis no nolaišanās un nodrošina plūdenu gaitu, tās verot.":
    "Вес двери - 91-96 кг, что подтверждает её прочность и надёжность, а три петли защищают дверь от провисания и обеспечивают плавный ход при открывании.",
  "Durvju vērtne 105 mm biezumā ir siltināta ar minerālvati un folijas siltinājumu. Durvīm ir trīs blīvējuma kontūras, pateicoties kurām tiek sasniegts augsts siltuma un skaņas izolācijas līmenis - tas pasargās jūsu dzīvokli no caurvēja, lieka trokšņa un nepatīkamām smakām no kāpņu telpas.":
    "Дверное полотно толщиной 105 мм утеплено минеральной ватой и фольгированным утеплителем. У двери три контура уплотнения, благодаря которым достигается высокий уровень тепло- и звукоизоляции - это защитит вашу квартиру от сквозняков, лишнего шума и неприятных запахов с лестничной площадки.",
  "Durvju vērtne ir siltināta ar minerālvati un aprīkota ar trim blīvējuma kontūriem, kas saglabās siltumu dzīvoklī un pasargās mājokli no caurvēja un nepatīkamām smakām no kāpņu telpas. Securemme piespiedes regulators nodrošinās durvīm mīkstu un ciešu aizvēršanos.":
    "Дверное полотно утеплено минеральной ватой и оснащено тремя контурами уплотнения, которые сохранят тепло в квартире и защитят дом от сквозняков и неприятных запахов с лестничной площадки. Регулятор прижима Securemme обеспечит мягкое и плотное закрывание двери.",
  "Durvju vērtne ir siltināta ar minerālvati, kas palīdz saglabāt siltumu telpā un novērš aukstā gaisa iekļūšanu. Durvju kārba nav siltināta. Durvis ir aprīkotas arī ar diviem eiroblīvējuma kontūriem, kas nodrošina efektīvu siltuma un skaņas izolāciju dzīvoklī.":
    "Дверное полотно утеплено минеральной ватой, которая помогает сохранить тепло в помещении и не пропускает холодный воздух. Дверная коробка не утеплена. Дверь также оснащена двумя контурами евроуплотнения, обеспечивающими эффективную тепло- и звукоизоляцию квартиры.",
  "Durvju vērtne un kārba ir siltinātas ar minerālvati, kas palīdz saglabāt siltumu telpā un novērš aukstā gaisa iekļūšanu. Durvis ir aprīkotas arī ar trim eiroblīvējuma kontūriem, kas nodrošina efektīvu siltuma un skaņas izolāciju dzīvoklī.":
    "Дверное полотно и коробка утеплены минеральной ватой, которая помогает сохранить тепло в помещении и не пропускает холодный воздух. Дверь также оснащена тремя контурами евроуплотнения, обеспечивающими эффективную тепло- и звукоизоляцию квартиры.",
  ...Object.fromEntries(
    [
      [true, 4, 105, "metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm", "толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм"],
      [true, 7, 95, "bet metāla loksnes biezums vērtnē - 1 mm", "а толщина металлического листа в полотне - 1 мм"],
      [true, 9, 95, "bet metāla loksnes biezums vērtnē - 1 mm", "а толщина металлического листа в полотне - 1 мм"],
      [false, 15, 95, "bet metāla loksnes biezums vērtnē - 1,2 mm", "а толщина металлического листа в полотне - 1,2 мм"],
      [false, 4, 105, "bet metāla loksnes biezums vērtnē - 2 mm", "а толщина металлического листа в полотне - 2 мм"],
      [false, 4, 105, "metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm", "толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм"],
      [false, 4, 72, "metāla profila biezums vērtnē - 1,2 mm, tērauda loksne - 0,5 mm", "толщина металлического профиля в полотне - 1,2 мм, стальной лист - 0,5 мм"],
      [false, 4, 85, "metāla profila biezums vērtnē - 1,2 mm, tērauda loksne - 0,8 mm", "толщина металлического профиля в полотне - 1,2 мм, стальной лист - 0,8 мм"],
      [false, 4, 95, "metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm", "толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм"],
      [false, 6, 100, "metāla profila biezums vērtnē - 1,2 mm, tērauda loksne - 1 mm", "толщина металлического профиля в полотне - 1,2 мм, стальной лист - 1 мм"],
      [false, 6, 105, "metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm", "толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм"],
      [false, 7, 95, "bet metāla loksnes biezums vērtnē - 1,2 mm", "а толщина металлического листа в полотне - 1,2 мм"],
    ].map(([also, ribs, t, midLv, midRu]) => [
      `Durvju vērtnei ${also ? "arī " : ""}ir pastiprināta konstrukcija ar ${ribs} stingruma ribām un papildu metāla kabatām slēdzenei. Vērtnes biezums ir ${t} mm, ${midLv}. Tas nodrošina durvju izturību un stabilitāti, kā arī paaugstina to noturību pret ārējo iedarbību. Kārba un vērtne ir pārklātas ar pulverkrāsu, kas durvīm nodrošina ilgu kalpošanas laiku un pasargā no rūsas.`,
      `Дверное полотно ${also ? "также " : ""}имеет усиленную конструкцию с ${ribs} рёбрами жёсткости и дополнительными металлическими карманами для замка. Толщина полотна - ${t} мм, ${midRu}. Это обеспечивает прочность и устойчивость двери, а также повышает её стойкость к внешним воздействиям. Коробка и полотно покрыты порошковой краской, что обеспечивает двери долгий срок службы и защищает от ржавчины.`,
    ]),
  ),
  "Eņģes uz gultņiem nodrošina mīkstu un klusu durvju vēršanos. Bruņu uzlikas ir kvadrātveida un iegremdētas.":
    "Петли на подшипниках обеспечивают мягкий и бесшумный ход двери. Броненакладки квадратные и утопленные.",
  "Horizontālie melnie moldingi uz ārējās un iekšējās MDF apdares piešķir durvīm mūsdienīgu stilu, bet kvadrātveida melnā furnitūra pievieno izsmalcinātību.":
    "Горизонтальные чёрные молдинги на наружной и внутренней отделке МДФ придают двери современный стиль, а квадратная чёрная фурнитура добавляет изысканности.",
  "Itāļu ražotāja Securemme nakts aizbīdnis ir papildu slēdzene, ko var aizslēgt tikai no telpas iekšpuses - no ārpuses tai piekļuves nav.":
    "Ночная задвижка итальянского производителя Securemme - это дополнительный замок, который можно запереть только изнутри помещения - снаружи доступа к нему нет.",
  "Kārba ir no liekta profila, siltināta ar minerālvati, un trīs blīvējuma kontūras nodrošinās durvīm vislabāko skaņas izolāciju, lai lieks troksnis no kāpņu telpas jūs netraucētu.":
    "Коробка из гнутого профиля утеплена минеральной ватой, а три контура уплотнения обеспечат двери наилучшую звукоизоляцию, чтобы лишний шум с лестничной площадки вас не беспокоил.",
  ...Object.fromEntries(
    [
      ["bazalta vati un folijas siltinājumu", "базальтовой ватой и фольгированным утеплителем", "diviem", "двумя"],
      ["minerālvati un folijas siltinājumu", "минеральной ватой и фольгированным утеплителем", "diviem", "двумя"],
      ["minerālvati un folijas siltinājumu", "минеральной ватой и фольгированным утеплителем", "trim", "тремя"],
      ["minerālvati, folijas siltinājumu un ekstrudētu putupolistirolu", "минеральной ватой, фольгированным утеплителем и экструдированным пенополистиролом", "diviem", "двумя"],
      ["minerālvati, folijas siltinājumu un ekstrudētu putupolistirolu", "минеральной ватой, фольгированным утеплителем и экструдированным пенополистиролом", "trim", "тремя"],
      ["minerālvati", "минеральной ватой", "trim", "тремя"],
    ].map(([matLv, matRu, nLv, nRu]) => [
      `Kārba un durvju vērtne ir siltinātas ar ${matLv}, kas palīdz saglabāt siltumu telpā un novērš aukstā gaisa iekļūšanu. Durvis ir aprīkotas arī ar ${nLv} eiroblīvējuma kontūriem, kas nodrošina efektīvu siltuma un skaņas izolāciju dzīvoklī.`,
      `Коробка и дверное полотно утеплены ${matRu}, что помогает сохранить тепло в помещении и не пропускает холодный воздух. Дверь также оснащена ${nRu} контурами евроуплотнения, обеспечивающими эффективную тепло- и звукоизоляцию квартиры.`,
    ]),
  ),
  "Metāla biezums kārbā - 1,2 mm, metāla profila biezums vērtnē - 1,2 mm, metāla loksnes biezums vērtnē - 1 mm; slēdzeņu zonā ir papildu 1,2 mm bieza kabata, kas pasargā slēdzenes no uzlaušanas. Durvju karkass ir krāsots no abām pusēm ar pulverkrāsu ilgmūžīgai ekspluatācijai. Durvju svars sasniedz 102 kg.":
    "Толщина металла в коробке - 1,2 мм, толщина металлического профиля в полотне - 1,2 мм, толщина металлического листа в полотне - 1 мм; в зоне замков есть дополнительный карман толщиной 1,2 мм, защищающий замки от взлома. Каркас двери окрашен порошковой краской с обеих сторон для долговечной эксплуатации. Вес двери достигает 102 кг.",
  "Metāla biezums kārbā - 1,5 mm. Metāla loksnes biezums vērtnē - 1,5 mm. Svars sasniedz 117 kg, kas apliecina durvju uzticamību. Maksimālu siltuma un skaņas izolāciju nodrošina siltinājums ar minerālvati un folijas siltinājumu. Trīs blīvējuma kontūras vērtnē pasargās jūsu dzīvokli no caurvēja un nepatīkamām smakām no kāpņu telpas.":
    "Толщина металла в коробке - 1,5 мм. Толщина металлического листа в полотне - 1,5 мм. Вес достигает 117 кг, что подтверждает надёжность двери. Максимальную тепло- и звукоизоляцию обеспечивает утепление минеральной ватой и фольгированным утеплителем. Три контура уплотнения в полотне защитят вашу квартиру от сквозняков и неприятных запахов с лестничной площадки.",
  "Metāla biezums kārbā - 1,5 mm. Metāla loksnes biezums vērtnē - 1,5 mm. Svars sasniedz 122 kg, kas apliecina durvju uzticamību. Maksimālu siltuma un skaņas izolāciju nodrošina siltinājums ar minerālvati un folijas siltinājumu. Trīs blīvējuma kontūras vērtnē pasargās jūsu dzīvokli no caurvēja un nepatīkamām smakām no kāpņu telpas.":
    "Толщина металла в коробке - 1,5 мм. Толщина металлического листа в полотне - 1,5 мм. Вес достигает 122 кг, что подтверждает надёжность двери. Максимальную тепло- и звукоизоляцию обеспечивает утепление минеральной ватой и фольгированным утеплителем. Три контура уплотнения в полотне защитят вашу квартиру от сквозняков и неприятных запахов с лестничной площадки.",
  "Metāla biezums kārbā ir 1,5 mm, metāla loksnes biezums vērtnē - 1,4 mm. Slēdzeņu zonā vērtnē ir papildu pastiprinājums - 1,2 mm bieza metāla kabata. Svars sasniedz 108-117 kg, kas apliecina durvju uzticamību.":
    "Толщина металла в коробке - 1,5 мм, толщина металлического листа в полотне - 1,4 мм. В зоне замков полотна есть дополнительное усиление - металлический карман толщиной 1,2 мм. Вес достигает 108-117 кг, что подтверждает надёжность двери.",
  "Monolīta metāla apmale 52 mm platumā piešķirs jūsu durvīm pabeigtību un estētisku pievilcību.":
    "Монолитное металлическое обрамление шириной 52 мм придаст вашей двери завершённость и эстетическую привлекательность.",
  "Monolīta metāla apmale 54 mm platumā piešķirs jūsu durvīm pabeigtību un estētisku pievilcību.":
    "Монолитное металлическое обрамление шириной 54 мм придаст вашей двери завершённость и эстетическую привлекательность.",
  "Nakts aizbīdnis ir papildu slēdzene, ko var aizslēgt tikai no telpas iekšpuses - no ārpuses tai piekļuves nav.":
    "Ночная задвижка - это дополнительный замок, который можно запереть только изнутри помещения - снаружи доступа к нему нет.",
  "No durvju ārpuses ir uzstādīts sendvičpanelis - 0,8 mm bieza tērauda loksne kopā ar 20 mm biezu ekstrudētu putupolistirolu. Inovatīvais pārklājums ietver cinka grunti pret koroziju, aizsargkrāsu pret ultravioleto starojumu un koka struktūras uzklāšanu. No iekšpuses ir uzstādīts mitrumizturīgs MDF, kas pārklāts ar mitrumizturīgu Izraēlas PVC plēvi Winshield.":
    "С наружной стороны двери установлена сэндвич-панель - стальной лист толщиной 0,8 мм вместе с экструдированным пенополистиролом толщиной 20 мм. Инновационное покрытие включает антикоррозийный цинковый грунт, защитную краску от ультрафиолета и нанесение текстуры дерева. С внутренней стороны установлен влагостойкий МДФ, покрытый влагостойкой израильской ПВХ-плёнкой Winshield.",
  "No noliktavas pieejamas četras kārbas: 2034 × 648 / 748 / 848 / 948 mm 40 mm vērtnei un 2044 × 648 / 748 / 848 / 948 mm 52 mm vērtnei. Ieteicamā durvju aile attiecīgi 2055 × 670 / 770 / 870 / 970 mm un 2065 × 670 / 770 / 870 / 970 mm.":
    "Со склада доступны четыре коробки: 2034 × 648 / 748 / 848 / 948 мм для полотна 40 мм и 2044 × 648 / 748 / 848 / 948 мм для полотна 52 мм. Рекомендуемый дверной проём - соответственно 2055 × 670 / 770 / 870 / 970 мм и 2065 × 670 / 770 / 870 / 970 мм.",
  "Pamatnē tiek izmantots augsta blīvuma koksnes polimēra vai pastiprinātas mitrumizturīgas koksnes šķiedras kompozīts, kas apstrādāts ar hidrofobiem sveķiem. Atšķirībā no standarta MDF, tas praktiski neuzsūc mitrumu no gaisa un neuzbriest.":
    "В основе используется древесно-полимерный композит высокой плотности или усиленный влагостойкий древесноволокнистый композит, обработанный гидрофобными смолами. В отличие от стандартного МДФ, он практически не впитывает влагу из воздуха и не разбухает.",
  "Pasūtiet bruņotās durvis jau tagad un radiet mājīgu un aizsargātu telpu savā dzīvoklī!":
    "Закажите бронированную дверь уже сейчас и создайте уютное и защищённое пространство в своей квартире!",
  "Pasūtiet bruņotās durvis jau tagad un radiet mājīgu un aizsargātu telpu savā mājā!":
    "Закажите бронированную дверь уже сейчас и создайте уютное и защищённое пространство в своём доме!",
  "Pasūtiet Fortezza bruņotās durvis jau tagad un radiet mājīgu un aizsargātu telpu savā dzīvoklī!":
    "Закажите бронированную дверь Fortezza уже сейчас и создайте уютное и защищённое пространство в своей квартире!",
  "Pasūtiet Termo House bruņotās durvis jau tagad un radiet mājīgu un aizsargātu telpu savā mājā!":
    "Закажите бронированную дверь Termo House уже сейчас и создайте уютное и защищённое пространство в своём доме!",
  "Pārklājumā tiek izmantoti speciāli pigmenti un UV stabilizatori, kas pasargā paneli no izbālēšanas tiešos saules staros un novērš virsmas pārkaršanu/deformāciju.":
    "В покрытии используются специальные пигменты и УФ-стабилизаторы, которые защищают панель от выцветания под прямыми солнечными лучами и предотвращают перегрев и деформацию поверхности.",
  "Piespiedes regulators ļauj durvis vērt plūdeni un nodrošina maksimāli ciešu blīvējuma piekļaušanos kārbai labākai siltuma un skaņas izolācijai. 6 stingruma ribas vērtnē un 6 stingruma ribas kārbā garantē izstrādājuma izturību.":
    "Регулятор прижима позволяет двери открываться плавно и обеспечивает максимально плотное прилегание уплотнителя к коробке для лучшей тепло- и звукоизоляции. 6 рёбер жёсткости в полотне и 6 рёбер жёсткости в коробке гарантируют прочность изделия.",
  "Platums virs standarta (līdz 1100 mm) vai augstums līdz 2100 mm - piemaksa +10 %. Augstums 2110-2200 mm - +20 %, 2210-2300 mm - +30 %, 2310-2400 mm - +40 %, 2410-2700 mm - +50 %.":
    "Ширина больше стандартной (до 1100 мм) или высота до 2100 мм - доплата +10 %. Высота 2110-2200 мм - +20 %, 2210-2300 мм - +30 %, 2310-2400 мм - +40 %, 2410-2700 мм - +50 %.",
  "Sānu apmale 52 mm, augšējā apmale 71 mm, monolīta ar durvju kārbu - tā piešķirs jūsu durvīm pabeigtību un estētisku pievilcību.":
    "Боковое обрамление 52 мм, верхнее обрамление 71 мм, монолитное с дверной коробкой - оно придаст вашей двери завершённость и эстетическую привлекательность.",
  "Securemme (Itālija) nakts aizbīdnis ir papildu slēdzene, ko var aizslēgt tikai no telpas iekšpuses - no ārpuses tai piekļuves nav.":
    "Ночная задвижка Securemme (Италия) - это дополнительный замок, который можно запереть только изнутри помещения - снаружи доступа к нему нет.",
  "Slēptās durvis iebūvē sienā tā, ka kārba no ārpuses nav redzama: alumīnija profilu iestiprina starpsienā un noslēpj zem apmetuma, bet vērtne aizveras vienā līmenī ar sienu. Redzama paliek tikai plāna ēnu sprauga un rokturis.":
    "Скрытые двери встраиваются в стену так, что коробка снаружи не видна: алюминиевый профиль закрепляется в перегородке и прячется под штукатуркой, а полотно закрывается заподлицо со стеной. Видимыми остаются только тонкий теневой зазор и ручка.",
  "Spogulis uz vērtnes - no 210 € par kv.m, grafīta vai bronzas tonī 285 € par kv.m. Slēptais durvju pievilcējs GEZE Boxer - 285 €, iegriešana no 40 €. Krītošais slieksnis CCE (Itālija) skaņas izolācijai un caurvēja novēršanai - no 32 €, iegriešana 25 €.":
    "Зеркало на полотне - от 210 € за кв. м, в графитовом или бронзовом тоне - 285 € за кв. м. Скрытый дверной доводчик GEZE Boxer - 285 €, врезка от 40 €. Выпадающий порог CCE (Италия) для звукоизоляции и защиты от сквозняков - от 32 €, врезка 25 €.",
  "Standarta komplektācijā durvis ir aprīkotas ar šādām slēdzenēm:":
    "В стандартной комплектации дверь оснащена следующими замками:",
  "Standarta komplektācijā durvis ir aprīkotas ar šādām slēdzenēm: augšējo Turcijā ražoto cilindra slēdzeni Kale 257 ar cilindru 50×30 stieņa tipa, kas aizslēdzas ar trim pusapgriezieniem. Slēdzenes rīvja diametrs - 16 mm, izbīde - 34 mm. Ir arī nakts aizbīdnis. Apakšējā ir viedslēdzene PES MOPS, kuras darbībai atslēgas nav vajadzīgas. Viedslēdzeni var atslēgt šādi: ar viedtālruni, izmantojot bezmaksas lietotni Smarta Lock; ar pirksta nospiedumu; ievadot paroli uz sensora klaviatūras; ar atslēgu piekariņu vai NFC birku; ar mehānisko atslēgu; ar RFID karti.":
    "В стандартной комплектации дверь оснащена следующими замками: верхний цилиндровый замок турецкого производства Kale 257 со штоковым цилиндром 50×30, запирающийся на три полуоборота. Диаметр ригеля - 16 мм, вылет - 34 мм. Есть также ночная задвижка. Нижний - умный замок PES MOPS, для работы которого ключи не нужны. Умный замок можно открыть так: смартфоном через бесплатное приложение Smarta Lock; отпечатком пальца; вводом пароля на сенсорной клавиатуре; брелоком или NFC-меткой; механическим ключом; RFID-картой.",
  "Stronwood ir daudzslāņu kompozītmateriāla plāksne, kas apvieno koka tekstūras estētiku ar augstāku noturību pret ūdeni un temperatūras svārstībām.":
    "Stronwood - многослойная композитная панель, сочетающая эстетику текстуры дерева с повышенной стойкостью к воде и перепадам температуры.",
  "Stronwood izstrādāts specializēts kompozītmateriāla apdares panelis, kas paredzēts metāla ārdurvju ārējai apdarei, īpaši privātmājām un ieejas mezgliem, kas pakļauti tiešai āra vides iedarbībai.":
    "Stronwood - специализированная композитная отделочная панель для наружной отделки металлических входных дверей, особенно для частных домов и входных узлов, подверженных прямому воздействию уличной среды.",
  "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Kārbas rāmis un vērtnes apmale ir melnā alumīnija krāsā, tāpēc ap gaišo vērtni paliek plāna melna kontūra un durvis kļūst par grafisku sienas elementu, nevis pazūd tajā.":
    "В этой конфигурации толщина полотна - 40 мм, оно открывается наружу. Рама коробки и обрамление полотна - чёрный алюминий, поэтому вокруг светлого полотна остаётся тонкий чёрный контур, и дверь становится графичным элементом стены, а не растворяется в ней.",
  "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes mala ir gruntēta tāpat kā virsma, tāpēc pēc krāsošanas durvis saplūst ar sienu bez metāla akcenta.":
    "В этой конфигурации толщина полотна - 40 мм, оно открывается наружу. Кромка полотна загрунтована так же, как поверхность, поэтому после покраски дверь сливается со стеной без металлического акцента.",
  "Šai konfigurācijai vērtnes biezums ir 40 mm un tā veras uz ārpusi. Vērtnes perimetru noslēdz alumīnija apmale: tā pasargā malu no sitieniem un pēc sienas nokrāsošanas paliek kā vienīgā redzamā metāla līnija. Apmali var nokrāsot pēc RAL kataloga par 30 €.":
    "В этой конфигурации толщина полотна - 40 мм, оно открывается наружу. Периметр полотна завершает алюминиевое обрамление: оно защищает кромку от ударов и после покраски стены остаётся единственной видимой металлической линией. Обрамление можно окрасить по каталогу RAL за 30 €.",
  "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Reversajā konstrukcijā vērtnes mala pārsedz kārbu, tāpēc no aizvērtās puses redzama tikai siena un vērtne.":
    "В этой конфигурации толщина полотна - 52 мм, оно открывается внутрь помещения. В реверсной конструкции кромка полотна перекрывает коробку, поэтому с закрытой стороны видны только стена и полотно.",
  "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un gan rāmis, gan vērtnes apmale ir melnā alumīnija krāsā.":
    "В этой конфигурации толщина полотна - 52 мм, оно открывается внутрь помещения. Полотно перекрывает коробку, а рама и обрамление полотна - чёрный алюминий.",
  "Šai konfigurācijai vērtnes biezums ir 52 mm un tā veras uz telpas iekšpusi. Vērtne pārsedz kārbu, un tās perimetru noslēdz alumīnija apmale, kuru var nokrāsot pēc RAL kataloga par 30 €.":
    "В этой конфигурации толщина полотна - 52 мм, оно открывается внутрь помещения. Полотно перекрывает коробку, а его периметр завершает алюминиевое обрамление, которое можно окрасить по каталогу RAL за 30 €.",
  "Šis materiāls tika radīts kā izturīgāka alternatīva standartā izmantotajam mitrumizturīgajam MDF ar PVC plēvi, kurš ilgstošā saulē un mitrumā ar laiku mēdz delaminēties (atpūsties vai atlipt plēve).":
    "Этот материал создан как более стойкая альтернатива стандартному влагостойкому МДФ с ПВХ-плёнкой, который при длительном воздействии солнца и влаги со временем склонен расслаиваться (плёнка вздувается или отклеивается).",
  "Un apakšējā slēdzene Class 252 ar cilindra mehānismu 30×40 atslēga/kloķis. Trīs rīvji ar 14 mm diametru, izbīde - 34 mm.":
    "И нижний замок Class 252 с цилиндровым механизмом 30×40 ключ/вертушка. Три ригеля диаметром 14 мм, вылет - 34 мм.",
  "Uz pasūtījumu vērtni izgatavo ar 5 mm soli līdz 2700 mm augstumā un 1100 mm platumā. Virs 2300 mm augstuma vērtni izgatavo tikai 52 mm biezumā ar pārfalci.":
    "Под заказ полотно изготавливается с шагом 5 мм высотой до 2700 мм и шириной до 1100 мм. При высоте более 2300 мм полотно изготавливается только толщиной 52 мм с притвором.",
  "Vertikālie melnie moldingi uz ārējās un iekšējās MDF apdares piešķir durvīm mūsdienīgu stilu, bet kvadrātveida melnā furnitūra pievieno izsmalcinātību.":
    "Вертикальные чёрные молдинги на наружной и внутренней отделке МДФ придают двери современный стиль, а квадратная чёрная фурнитура добавляет изысканности.",
  "Vērtne tiek piegādāta gruntēta, tāpēc to špaktelē, krāso vai tapetē kopā ar sienu. Tā durvis vizuāli pazūd un siena paliek nepārtraukta.":
    "Полотно поставляется загрунтованным, поэтому его шпаклюют, красят или оклеивают обоями вместе со стеной. Так дверь визуально исчезает, а стена остаётся непрерывной.",
  "Vērtnes biezums ir 105 mm. Pateicoties minerālvatei un folijas siltinājumam, durvīm ir augsts siltuma un skaņas izolācijas līmenis. Piespiedes regulators nodrošina maksimālu blīvējuma piekļaušanos kārbai, kas palīdz izvairīties no siltuma zudumiem un nevēlamu skaņu un smaku iekļūšanas.":
    "Толщина полотна - 105 мм. Благодаря минеральной вате и фольгированному утеплителю дверь имеет высокий уровень тепло- и звукоизоляции. Регулятор прижима обеспечивает максимальное прилегание уплотнителя к коробке, что помогает избежать теплопотерь и проникновения нежелательных звуков и запахов.",
  "Vērtnes biezums ir 95 mm. Pateicoties bazalta vatei, folijas siltinājumam un korķa kokam, durvīm ir augsts siltuma un skaņas izolācijas līmenis.":
    "Толщина полотна - 95 мм. Благодаря базальтовой вате, фольгированному утеплителю и пробке дверь имеет высокий уровень тепло- и звукоизоляции.",
  "Vērtni tur divas slēptās Otlav Invisacta IN300 eņģes, kuras pēc montāžas var regulēt trīs plaknēs. Aizvēršanu nodrošina magnētiskā slēdzene, tāpēc uz kārbas nav redzamas atslēgas plāksnes un aizverot nav klikšķa.":
    "Полотно держится на двух скрытых петлях Otlav Invisacta IN300, которые после монтажа регулируются в трёх плоскостях. Закрывание обеспечивает магнитный замок, поэтому на коробке нет видимой ответной планки и при закрывании нет щелчка.",
  "Virsma tiek pārklāta ar īpašu UV staru izturīgu PVC vai HPL (High-Pressure Laminate) polimēra pārklājumu/plēvi, kas tiek presēta augstā temperatūrā un spiedienā. Šim slānim ir izteikta koka vai matēta tekstūra.":
    "Поверхность покрывается специальным УФ-стойким полимерным покрытием / плёнкой ПВХ или HPL (High-Pressure Laminate), спрессованной при высокой температуре и давлении. Этот слой имеет выраженную текстуру дерева или матовую текстуру.",
};
