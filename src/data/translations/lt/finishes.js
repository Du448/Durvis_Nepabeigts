/* Lithuanian for the finishes page: section titles, leads and notes, plus the
   swatch labels. Milling-pattern codes (Adel 1, B-105, Grille 12, PVC-90, RAL
   numbers …) are the manufacturer's own designations and stay as they are —
   only the descriptive labels are translated. */

/* Numbered decorative-insert series: the label is the same phrase with a
   running number, so build those entries instead of repeating them. */
const numbered = (lv, lt, count) =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [`${lv} ${i + 1}`, `${lt} ${i + 1}`]));

export const ltFinishText = {
  // Section titles
  "Stronwood": "Stronwood",
  "Frēzējumi": "Frezavimai",
  "Dekoratīvie elementi": "Dekoratyviniai elementai",
  "PVC plēves krāsas": "PVC plėvelės spalvos",
  "Lampre krāsas": "Lampre spalvos",
  "Pulverkrāsojums": "Miltelinis dažymas",

  // Group titles
  "Krāsu paraugi": "Spalvų pavyzdžiai",
  "Melna organiskā stikla ieliktņi": "Juodo organinio stiklo įdėklai",
  "Nerūsējošā tērauda ieliktņi": "Nerūdijančio plieno įdėklai",
  "Nerūsējošā tērauda un metāla ieliktņi": "Nerūdijančio plieno ir metalo įdėklai",
  "Štancējums": "Štampavimas",
  "T veida moldingi": "T formos moldingai",

  // Leads and notes
  "Stronwood ir specializēts kompozītmateriāla panelis metāla ārdurvju ārējai apdarei - izturīgāka alternatīva standarta mitrumizturīgajam MDF ar PVC plēvi, kas ilgstošā saulē un mitrumā laika gaitā var delaminēties.":
    "Stronwood - specializuota kompozitinės medžiagos plokštė metalinių lauko durų išorės apdailai - atsparesnė alternatyva standartiniam drėgmei atspariam MDF su PVC plėvele, kuri ilgai veikiama saulės ir drėgmės ilgainiui gali atsisluoksniuoti.",
  "Bāzes slānis - augsta blīvuma koksnes polimēra kompozīts ar hidrofobiem sveķiem; praktiski neuzsūc mitrumu un neuzbriest.":
    "Bazinis sluoksnis - didelio tankio medienos polimero kompozitas su hidrofobinėmis dervomis; praktiškai nesugeria drėgmės ir nebrinksta.",
  "Dekoratīvais slānis - UV izturīgs PVC/HPL pārklājums ar koka vai matētu tekstūru, presēts augstā temperatūrā un spiedienā.":
    "Dekoratyvinis sluoksnis - UV atspari PVC/HPL danga su medienos arba matine tekstūra, presuota aukštoje temperatūroje ir slėgyje.",
  "UV/termo aizsardzība - speciāli pigmenti un stabilizatori pret izbalēšanu un virsmas deformāciju.":
    "UV / termo apsauga - specialūs pigmentai ir stabilizatoriai nuo išblukimo ir paviršiaus deformacijos.",
  "Frēzējuma raksts nosaka durvju vērtnes reljefu. Katrs raksts ir pieejams gan ārdurvīm, gan iekšdurvīm, un to var kombinēt ar jebkuru krāsu no zemāk redzamajām paletēm.":
    "Frezavimo raštas lemia durų varčios reljefą. Kiekvienas raštas prieinamas tiek lauko, tiek vidaus durims ir gali būti derinamas su bet kuria spalva iš žemiau matomų palečių.",
  "Ieliktņi, moldingi un uzliktņi, ar ko papildina vērtnes rakstu: nerūsējošais tērauds, melns organiskais stikls, T veida moldingi un štancējums, kā arī gatavas dekoru sērijas.":
    "Įdėklai, moldingai ir antdėklai, kuriais papildomas varčios raštas: nerūdijantis plienas, juodas organinis stiklas, T formos moldingai ir štampavimas, taip pat paruoštos dekoro serijos.",
  "PVC plēve ir plašākā pieejamā palete - koka faktūras, betona toņi, matētas un šagrēna virsmas. To lieto MDF apdares plāksnēm no durvju ārpuses un iekšpuses.":
    "PVC plėvelė - plačiausia prieinama paletė: medienos faktūros, betono atspalviai, matiniai ir šagrenės paviršiai. Ji naudojama MDF apdailos plokštėms iš durų išorės ir vidaus.",
  "Lampre ir izturīgs dekoratīvais pārklājums ar dabīga koka faktūru. To lieto ārdurvju vērtnēm, kur svarīga noturība pret laikapstākļiem un ultravioleto starojumu.":
    "Lampre - atspari dekoratyvinė danga su natūralios medienos faktūra. Ji naudojama lauko durų varčioms, kur svarbus atsparumas orams ir ultravioletinei spinduliuotei.",
  "Pulverkrāsojumu uzklāj metāla karkasam un kārbai. Krāsa tiek iededzināta augstā temperatūrā, tāpēc virsma ir noturīga pret skrāpējumiem un koroziju.":
    "Milteliniai dažai užnešami ant metalinio karkaso ir staktos. Dažai įdeginami aukštoje temperatūroje, todėl paviršius atsparus įbrėžimams ir korozijai.",
};

export const ltFinishLabels = {
  ...numbered("Melna organiskā stikla ieliktņi", "Juodo organinio stiklo įdėklai", 8),
  ...numbered("Nerūsējošā tērauda ieliktņi", "Nerūdijančio plieno įdėklai", 8),
  ...numbered("Nerūsējošā tērauda un metāla ieliktņi", "Nerūdijančio plieno ir metalo įdėklai", 3),
  ...numbered("Štancējums", "Štampavimas", 2),
  ...numbered("T veida moldingi", "T formos moldingai", 5),

  "Angļu ozols": "Angliškas ąžuolas",
  "Antracīta betons": "Antracito betonas",
  "Antracīts": "Antracitas",
  "Antracīts tumšais": "Antracitas tamsusis",
  "Astana osis balts, horizontāls": "Astana uosis baltas, horizontalus",
  "Astana osis pelēks, horizontāls": "Astana uosis pilkas, horizontalus",
  "Āra betons": "Lauko betonas",
  "Balts koks": "Balta mediena",
  "Balts krafts": "Baltas kraftas",
  "Balts supermatēts": "Balta supermatinė",
  "Bēšs betons": "Smėlio spalvos betonas",
  "Canero rieksts": "Canero riešutas",
  "Cinka epoksīda grunts": "Cinko epoksidinis gruntas",
  "Grafīta Šalē ozols": "Grafito Chalet ąžuolas",
  "Grafīts": "Grafitas",
  "Itāļu ozols": "Itališkas ąžuolas",
  "Kalnu kļava": "Kalninis klevas",
  "Kanēļa Šalē ozols": "Cinamono Chalet ąžuolas",
  "Kastanis": "Kaštonas",
  "Kļava gaiši pelēka": "Klevas šviesiai pilkas",
  "Kļava tumši pelēka": "Klevas tamsiai pilkas",
  "Konjaka koka grieziens": "Konjako medienos pjūvis",
  "Kvarcīts": "Kvarcitas",
  "Medus koka grieziens": "Medaus medienos pjūvis",
  "Melns šagrēns": "Juoda šagrenė",
  "Oksīds balts": "Oksidas baltas",
  "Oksīds melns": "Oksidas juodas",
  "Ostas ozols": "Uosto ąžuolas",
  "Ozols bronza": "Ąžuolas bronza",
  "Pasadena ozols": "Pasadena ąžuolas",
  "Pelēks betons": "Pilkas betonas",
  "Pelēks marmors": "Pilkas marmuras",
  "Pelnu betons": "Pelenų betonas",
  "Pelnu koka grieziens": "Pelenų medienos pjūvis",
  "Provansas priede": "Provanso pušis",
  "Rieksts bronza": "Riešutas bronza",
  "Rieksts tumšais": "Riešutas tamsusis",
  "Sens koks": "Sena mediena",
  "Šato ozols": "Chateau ąžuolas",
  "Tabakas ozols": "Tabako ąžuolas",
  "Tumšs betons": "Tamsus betonas",
  "Varš": "Varis",
  "Venge": "Vengė",
  "Venge pelēks, horizontāls": "Vengė pilka, horizontali",
  "Venge pelēks, horizontāls (OLD)": "Vengė pilka, horizontali (OLD)",
  "Venge tumšs": "Vengė tamsi",
  "Venge tumšs, horizontāls": "Vengė tamsi, horizontali",
  "Vulkāna ozols": "Vulkano ąžuolas",
  "Zeltainais ozols": "Auksinis ąžuolas",
  "Zeltains krafts": "Auksinis kraftas",

  // RAL powder-coating swatches: code stays, texture word is translated
  "RAL 7016 tekstūra": "RAL 7016 tekstūra",
  "RAL 7024 šagrēns": "RAL 7024 šagrenė",
  "RAL 8017 tekstūra": "RAL 8017 tekstūra",
  "RAL 8017 šagrēns": "RAL 8017 šagrenė",
  "RAL 8019 tekstūra": "RAL 8019 tekstūra",
  "RAL 8019 šagrēns": "RAL 8019 šagrenė",
  "RAL 9003 šagrēns": "RAL 9003 šagrenė",
  "RAL 9005 muārs": "RAL 9005 muaras",
};
