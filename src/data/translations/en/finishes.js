/* English for the finishes page: section titles, leads and notes, plus the
   swatch labels. Milling-pattern codes (Adel 1, B-105, Grille 12, PVC-90, RAL
   numbers …) are the manufacturer's own designations and stay as they are —
   only the descriptive labels are translated. */

/* Numbered decorative-insert series: the label is the same phrase with a
   running number, so build those entries instead of repeating them. */
const numbered = (lv, en, count) =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [`${lv} ${i + 1}`, `${en} ${i + 1}`]));

export const enFinishText = {
  // Section titles
  "Stronwood": "Stronwood",
  "Frēzējumi": "Milling patterns",
  "Dekoratīvie elementi": "Decorative elements",
  "PVC plēves krāsas": "PVC film colors",
  "Lampre krāsas": "Lampre colors",
  "Pulverkrāsojums": "Powder coating",

  // Group titles
  "Krāsu paraugi": "Color samples",
  "Melna organiskā stikla ieliktņi": "Black acrylic glass inserts",
  "Nerūsējošā tērauda ieliktņi": "Stainless steel inserts",
  "Nerūsējošā tērauda un metāla ieliktņi": "Stainless steel and metal inserts",
  "Štancējums": "Stamping",
  "T veida moldingi": "T-shaped moldings",

  // Leads and notes
  "Stronwood ir specializēts kompozītmateriāla panelis metāla ārdurvju ārējai apdarei - izturīgāka alternatīva standarta mitrumizturīgajam MDF ar PVC plēvi, kas ilgstošā saulē un mitrumā laika gaitā var delaminēties.":
    "Stronwood is a specialized composite panel for the exterior facing of metal entrance doors - a more durable alternative to standard moisture-resistant MDF with PVC film, which can delaminate over time under prolonged sun and moisture.",
  "Bāzes slānis - augsta blīvuma koksnes polimēra kompozīts ar hidrofobiem sveķiem; praktiski neuzsūc mitrumu un neuzbriest.":
    "Base layer - high-density wood-polymer composite with hydrophobic resins; it practically does not absorb moisture and does not swell.",
  "Dekoratīvais slānis - UV izturīgs PVC/HPL pārklājums ar koka vai matētu tekstūru, presēts augstā temperatūrā un spiedienā.":
    "Decorative layer - UV-resistant PVC/HPL coating with a wood or matte texture, pressed at high temperature and pressure.",
  "UV/termo aizsardzība - speciāli pigmenti un stabilizatori pret izbalēšanu un virsmas deformāciju.":
    "UV / thermal protection - special pigments and stabilizers against fading and surface deformation.",
  "Frēzējuma raksts nosaka durvju vērtnes reljefu. Katrs raksts ir pieejams gan ārdurvīm, gan iekšdurvīm, un to var kombinēt ar jebkuru krāsu no zemāk redzamajām paletēm.":
    "The milling pattern defines the relief of the door leaf. Every pattern is available for both entrance and interior doors and can be combined with any color from the palettes shown below.",
  "Ieliktņi, moldingi un uzliktņi, ar ko papildina vērtnes rakstu: nerūsējošais tērauds, melns organiskais stikls, T veida moldingi un štancējums, kā arī gatavas dekoru sērijas.":
    "Inserts, moldings and overlays that complement the leaf pattern: stainless steel, black acrylic glass, T-shaped moldings and stamping, as well as ready-made decor series.",
  "PVC plēve ir plašākā pieejamā palete - koka faktūras, betona toņi, matētas un šagrēna virsmas. To lieto MDF apdares plāksnēm no durvju ārpuses un iekšpuses.":
    "PVC film is the widest available palette - wood textures, concrete shades, matte and shagreen surfaces. It is used for MDF facing panels on the outside and inside of the door.",
  "Lampre ir izturīgs dekoratīvais pārklājums ar dabīga koka faktūru. To lieto ārdurvju vērtnēm, kur svarīga noturība pret laikapstākļiem un ultravioleto starojumu.":
    "Lampre is a durable decorative coating with a natural wood texture. It is used on entrance-door leaves where resistance to weather and ultraviolet radiation matters.",
  "Pulverkrāsojumu uzklāj metāla karkasam un kārbai. Krāsa tiek iededzināta augstā temperatūrā, tāpēc virsma ir noturīga pret skrāpējumiem un koroziju.":
    "Powder coating is applied to the metal frame and door frame. The paint is baked at high temperature, so the surface is resistant to scratches and corrosion.",
};

export const enFinishLabels = {
  ...numbered("Melna organiskā stikla ieliktņi", "Black acrylic glass inserts", 8),
  ...numbered("Nerūsējošā tērauda ieliktņi", "Stainless steel inserts", 8),
  ...numbered("Nerūsējošā tērauda un metāla ieliktņi", "Stainless steel and metal inserts", 3),
  ...numbered("Štancējums", "Stamping", 2),
  ...numbered("T veida moldingi", "T-shaped moldings", 5),

  "Angļu ozols": "English oak",
  "Antracīta betons": "Anthracite concrete",
  "Antracīts": "Anthracite",
  "Antracīts tumšais": "Dark anthracite",
  "Astana osis balts, horizontāls": "Astana ash white, horizontal",
  "Astana osis pelēks, horizontāls": "Astana ash grey, horizontal",
  "Āra betons": "Outdoor concrete",
  "Balts koks": "White wood",
  "Balts krafts": "White kraft",
  "Balts supermatēts": "White super matte",
  "Bēšs betons": "Beige concrete",
  "Canero rieksts": "Canero walnut",
  "Cinka epoksīda grunts": "Zinc epoxy primer",
  "Grafīta Šalē ozols": "Graphite Chalet oak",
  "Grafīts": "Graphite",
  "Itāļu ozols": "Italian oak",
  "Kalnu kļava": "Mountain maple",
  "Kanēļa Šalē ozols": "Cinnamon Chalet oak",
  "Kastanis": "Chestnut",
  "Kļava gaiši pelēka": "Maple light grey",
  "Kļava tumši pelēka": "Maple dark grey",
  "Konjaka koka grieziens": "Cognac wood cut",
  "Kvarcīts": "Quartzite",
  "Medus koka grieziens": "Honey wood cut",
  "Melns šagrēns": "Black shagreen",
  "Oksīds balts": "Oxide white",
  "Oksīds melns": "Oxide black",
  "Ostas ozols": "Harbor oak",
  "Ozols bronza": "Oak bronze",
  "Pasadena ozols": "Pasadena oak",
  "Pelēks betons": "Grey concrete",
  "Pelēks marmors": "Grey marble",
  "Pelnu betons": "Ash concrete",
  "Pelnu koka grieziens": "Ash wood cut",
  "Provansas priede": "Provence pine",
  "Rieksts bronza": "Walnut bronze",
  "Rieksts tumšais": "Dark walnut",
  "Sens koks": "Aged wood",
  "Šato ozols": "Chateau oak",
  "Tabakas ozols": "Tobacco oak",
  "Tumšs betons": "Dark concrete",
  "Varš": "Copper",
  "Venge": "Wenge",
  "Venge pelēks, horizontāls": "Wenge grey, horizontal",
  "Venge pelēks, horizontāls (OLD)": "Wenge grey, horizontal (OLD)",
  "Venge tumšs": "Dark wenge",
  "Venge tumšs, horizontāls": "Dark wenge, horizontal",
  "Vulkāna ozols": "Volcano oak",
  "Zeltainais ozols": "Golden oak",
  "Zeltains krafts": "Golden kraft",
};
