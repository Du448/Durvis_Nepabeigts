/* Russian for the finishes page: section titles, leads and notes, plus the
   swatch labels. Milling-pattern codes (Adel 1, B-105, Grille 12, PVC-90, RAL
   numbers …) are the manufacturer's own designations and stay as they are -
   only the descriptive labels are translated. */

/* Numbered decorative-insert series: the label is the same phrase with a
   running number, so build those entries instead of repeating them. */
const numbered = (lv, ru, count) =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [`${lv} ${i + 1}`, `${ru} ${i + 1}`]));

export const ruFinishText = {
  // Section titles
  "Stronwood": "Stronwood",
  "Frēzējumi": "Рисунки фрезеровки",
  "Dekoratīvie elementi": "Декоративные элементы",
  "PVC plēves krāsas": "Цвета ПВХ-плёнки",
  "Lampre krāsas": "Цвета Lampre",
  "Pulverkrāsojums": "Порошковая окраска",

  // Group titles
  "Krāsu paraugi": "Образцы цветов",
  "Melna organiskā stikla ieliktņi": "Вставки из чёрного оргстекла",
  "Nerūsējošā tērauda ieliktņi": "Вставки из нержавеющей стали",
  "Nerūsējošā tērauda un metāla ieliktņi": "Вставки из нержавеющей стали и металла",
  "Štancējums": "Штамповка",
  "T veida moldingi": "Т-образные молдинги",

  // Leads and notes
  "Stronwood ir specializēts kompozītmateriāla panelis metāla ārdurvju ārējai apdarei - izturīgāka alternatīva standarta mitrumizturīgajam MDF ar PVC plēvi, kas ilgstošā saulē un mitrumā laika gaitā var delaminēties.":
    "Stronwood - специализированная композитная панель для наружной отделки металлических входных дверей - более стойкая альтернатива стандартному влагостойкому МДФ с ПВХ-плёнкой, который при длительном воздействии солнца и влаги со временем может расслаиваться.",
  "Bāzes slānis - augsta blīvuma koksnes polimēra kompozīts ar hidrofobiem sveķiem; praktiski neuzsūc mitrumu un neuzbriest.":
    "Базовый слой - древесно-полимерный композит высокой плотности с гидрофобными смолами; практически не впитывает влагу и не разбухает.",
  "Dekoratīvais slānis - UV izturīgs PVC/HPL pārklājums ar koka vai matētu tekstūru, presēts augstā temperatūrā un spiedienā.":
    "Декоративный слой - УФ-стойкое покрытие ПВХ/HPL с текстурой дерева или матовой текстурой, спрессованное при высокой температуре и давлении.",
  "UV/termo aizsardzība - speciāli pigmenti un stabilizatori pret izbalēšanu un virsmas deformāciju.":
    "УФ/термозащита - специальные пигменты и стабилизаторы против выцветания и деформации поверхности.",
  "Frēzējuma raksts nosaka durvju vērtnes reljefu. Katrs raksts ir pieejams gan ārdurvīm, gan iekšdurvīm, un to var kombinēt ar jebkuru krāsu no zemāk redzamajām paletēm.":
    "Рисунок фрезеровки определяет рельеф дверного полотна. Каждый рисунок доступен как для входных, так и для межкомнатных дверей и сочетается с любым цветом из палитр ниже.",
  "Ieliktņi, moldingi un uzliktņi, ar ko papildina vērtnes rakstu: nerūsējošais tērauds, melns organiskais stikls, T veida moldingi un štancējums, kā arī gatavas dekoru sērijas.":
    "Вставки, молдинги и накладки, дополняющие рисунок полотна: нержавеющая сталь, чёрное оргстекло, Т-образные молдинги и штамповка, а также готовые декоративные серии.",
  "PVC plēve ir plašākā pieejamā palete - koka faktūras, betona toņi, matētas un šagrēna virsmas. To lieto MDF apdares plāksnēm no durvju ārpuses un iekšpuses.":
    "ПВХ-плёнка - самая широкая палитра: текстуры дерева, оттенки бетона, матовые и шагреневые поверхности. Применяется для отделочных панелей МДФ снаружи и внутри двери.",
  "Lampre ir izturīgs dekoratīvais pārklājums ar dabīga koka faktūru. To lieto ārdurvju vērtnēm, kur svarīga noturība pret laikapstākļiem un ultravioleto starojumu.":
    "Lampre - прочное декоративное покрытие с текстурой натурального дерева. Применяется на полотнах входных дверей, где важна стойкость к погодным условиям и ультрафиолету.",
  "Pulverkrāsojumu uzklāj metāla karkasam un kārbai. Krāsa tiek iededzināta augstā temperatūrā, tāpēc virsma ir noturīga pret skrāpējumiem un koroziju.":
    "Порошковая окраска наносится на металлический каркас и коробку. Краска запекается при высокой температуре, поэтому поверхность устойчива к царапинам и коррозии.",
};

export const ruFinishLabels = {
  ...numbered("Melna organiskā stikla ieliktņi", "Вставки из чёрного оргстекла", 8),
  ...numbered("Nerūsējošā tērauda ieliktņi", "Вставки из нержавеющей стали", 8),
  ...numbered("Nerūsējošā tērauda un metāla ieliktņi", "Вставки из нержавеющей стали и металла", 3),
  ...numbered("Štancējums", "Штамповка", 2),
  ...numbered("T veida moldingi", "Т-образные молдинги", 5),

  "Angļu ozols": "Английский дуб",
  "Antracīta betons": "Бетон антрацит",
  "Antracīts": "Антрацит",
  "Antracīts tumšais": "Тёмный антрацит",
  "Astana osis balts, horizontāls": "Ясень Астана белый, горизонтальный",
  "Astana osis pelēks, horizontāls": "Ясень Астана серый, горизонтальный",
  "Āra betons": "Уличный бетон",
  "Balts koks": "Белое дерево",
  "Balts krafts": "Белый крафт",
  "Balts supermatēts": "Белый супермат",
  "Bēšs betons": "Бежевый бетон",
  "Canero rieksts": "Орех Canero",
  "Cinka epoksīda grunts": "Цинковый эпоксидный грунт",
  "Grafīta Šalē ozols": "Дуб Шале графит",
  "Grafīts": "Графит",
  "Itāļu ozols": "Итальянский дуб",
  "Kalnu kļava": "Горный клён",
  "Kanēļa Šalē ozols": "Дуб Шале корица",
  "Kastanis": "Каштан",
  "Kļava gaiši pelēka": "Клён светло-серый",
  "Kļava tumši pelēka": "Клён тёмно-серый",
  "Konjaka koka grieziens": "Срез дерева коньяк",
  "Kvarcīts": "Кварцит",
  "Medus koka grieziens": "Срез дерева мёд",
  "Melns šagrēns": "Чёрный шагрень",
  "Oksīds balts": "Оксид белый",
  "Oksīds melns": "Оксид чёрный",
  "Ostas ozols": "Дуб гаванский",
  "Ozols bronza": "Дуб бронза",
  "Pasadena ozols": "Дуб Пасадена",
  "Pelēks betons": "Серый бетон",
  "Pelēks marmors": "Серый мрамор",
  "Pelnu betons": "Пепельный бетон",
  "Pelnu koka grieziens": "Срез дерева пепельный",
  "Provansas priede": "Сосна прованс",
  "Rieksts bronza": "Орех бронза",
  "Rieksts tumšais": "Тёмный орех",
  "Sens koks": "Состаренное дерево",
  "Šato ozols": "Дуб Шато",
  "Tabakas ozols": "Дуб табачный",
  "Tumšs betons": "Тёмный бетон",
  "Varš": "Медь",
  "Venge": "Венге",
  "Venge pelēks, horizontāls": "Венге серый, горизонтальный",
  "Venge pelēks, horizontāls (OLD)": "Венге серый, горизонтальный (OLD)",
  "Venge tumšs": "Венге тёмный",
  "Venge tumšs, horizontāls": "Венге тёмный, горизонтальный",
  "Vulkāna ozols": "Вулканический дуб",
  "Zeltainais ozols": "Золотистый дуб",
  "Zeltains krafts": "Золотистый крафт",
};
