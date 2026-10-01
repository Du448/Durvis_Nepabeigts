/* Service pages under /paslaugos/<slug>. Prices come from the shop's own
   price list (incl. 21% VAT), generalised for Lithuania: the list's "in Riga"
   base prices are shown as in-town prices, with the per-km call-out charge for
   work outside town. Measurement is shown as one general price, without the
   per-km detail, and never as free. Warranty: 2 years on doors, 2 years on our
   installation work (confirmed by the shop). Durations and delivery times are
   deliberately not promised.

   Every text is { lt, lv, en }; prices are specs that getService() formats
   for the locale, so a price is changed in one place for all languages. */

const L = (lt, lv, en) => ({ lt, lv, en });

// ---- Price specs ---------------------------------------------------------
const eur = (n) => ({ eur: n });
const from = (n, unit) => ({ eur: n, from: true, unit });
const per = (n, unit) => ({ eur: n, unit });
const pct = (n) => ({ pct: n });
const FREE = { free: true };

const UNITS = {
  km: L("/km", "/km", "/km"),
  floor: L("/ aukštas", "/ stāvs", "/ floor"),
  leaf: L("/ varčia", "/ vērtne", "/ leaf"),
  piece: L("/ vnt.", "/ gab.", "/ piece"),
  m: L("/ m", "/ m", "/ m"),
  m2: L("/ m²", "/ m²", "/ m²"),
};

function money(n, locale) {
  const value = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return locale === "en" ? `€${value}` : `${value.replace(".", ",")} €`;
}

export function formatPrice(spec, locale) {
  if (spec.free) return L("nemokamai", "bez maksas", "free")[locale];
  if (spec.pct != null) return `+${spec.pct} %`;
  const prefix = spec.from ? `${L("nuo", "no", "from")[locale]} ` : "";
  const unit = spec.unit ? ` ${UNITS[spec.unit][locale]}` : "";
  return `${prefix}${money(spec.eur, locale)}${unit}`.replace(" /km", "/km");
}

// ---- Shared page chrome ----------------------------------------------------
export const SERVICE_UI = {
  stepsHeading: L("Kaip tai vyksta", "Kā tas notiek", "How it works"),
  pricesHeading: L("Orientacinės kainos", "Orientējošās cenas", "Indicative prices"),
  faqHeading: L("Dažniausi klausimai", "Biežāk uzdotie jautājumi", "Frequently asked questions"),
  ctaTitle: L("Turite klausimų?", "Ir jautājumi?", "Any questions?"),
  ctaText: L(
    "Parašykite arba paskambinkite – atsakysime per 1 darbo dieną.",
    "Rakstiet vai zvaniet – atbildēsim 1 darba dienas laikā.",
    "Write or call us – we reply within 1 working day."
  ),
  ctaButton: L("Susisiekti", "Sazināties", "Contact us"),
  price: L("Kaina", "Cena", "Price"),
  service: L("Paslauga", "Pakalpojums", "Service"),
};

const CALL_OUT_NOTE = L(
  "Kainos nurodytos su PVM ir yra orientacinės – galutinę kainą patiksliname po matavimo, įvertinę angą ir reikalingus darbus. Darbams už miesto ribų pridedamas išvykimo mokestis – 1 € už kilometrą (skaičiuojama viena kryptimi).",
  "Cenas norādītas ar PVN un ir orientējošas – galīgo cenu precizējam pēc uzmērīšanas, novērtējot aili un nepieciešamos darbus. Darbiem ārpus pilsētas tiek pieskaitīta izbraukuma maksa – 1 € par kilometru (rēķinot vienā virzienā).",
  "Prices include VAT and are indicative – the final price is confirmed after measuring, once the opening and the work needed are assessed. Work outside town carries a call-out charge of €1 per kilometre (one way)."
);

// ---- Pages -----------------------------------------------------------------
export const services = {
  matavimas: {
    title: L("Matavimas", "Uzmērīšana", "Measurement"),
    description: L(
      "Durų angos matavimas prieš užsakymą: specialistas atvyksta, tiksliai išmatuoja angą, įvertina sienas ir padeda parinkti tinkamas duris.",
      "Durvju ailes uzmērīšana pirms pasūtījuma: speciālists ierodas, precīzi izmēra aili, novērtē sienas un palīdz izvēlēties piemērotas durvis.",
      "Door opening measurement before you order: a specialist visits, measures the opening precisely, checks the walls and helps you choose the right door."
    ),
    highlights: [
      { value: { eur: 20 }, label: L("matavimo kaina", "uzmērīšanas cena", "measurement price") },
      { value: L("1 d. d.", "1 d. d.", "1 day"), label: L("atsakome į užklausą", "atbildam uz pieprasījumu", "to reply to your request") },
    ],
    intro: [
      L(
        "Tikslūs matmenys – svarbiausia sąlyga, kad durys tiktų iš pirmo karto. Ypač tai aktualu lauko durims, nestandartinėms angoms ir renovuojamiems būstams, kur sienos dažnai būna nelygios, o senos staktos paslepia tikrąjį angos dydį.",
        "Precīzi izmēri ir galvenais nosacījums, lai durvis derētu ar pirmo reizi. Īpaši tas attiecas uz ārdurvīm, nestandarta ailēm un renovējamiem mājokļiem, kur sienas bieži ir nelīdzenas, bet vecās kārbas slēpj ailes patieso izmēru.",
        "Accurate measurements are what makes a door fit first time. This matters most for entrance doors, non-standard openings and renovations, where walls are often uneven and an old frame hides the true size of the opening."
      ),
      L(
        "Mūsų specialistas atvyksta suderintu laiku, išmatuoja angą, įvertina sienų ir grindų būklę ir patars, kokį modelį, varčios atidarymo kryptį, spynas ir apdailą verta rinktis. Matuojame tiek lauko, tiek vidaus duris – nuo vienos angos bute iki viso namo. Po matavimo gaunate tikslų pasiūlymą be spėlionių.",
        "Mūsu speciālists ierodas saskaņotā laikā, izmēra aili, novērtē sienu un grīdas stāvokli un iesaka, kādu modeli, vērtnes vēršanās virzienu, slēdzenes un apdari vērts izvēlēties. Uzmērām gan ārdurvis, gan iekšdurvis – no vienas ailes dzīvoklī līdz visai mājai. Pēc uzmērīšanas saņemat precīzu piedāvājumu bez minēšanas.",
        "Our specialist comes at an agreed time, measures the opening, checks the walls and floor, and advises on the model, opening direction, locks and finish worth choosing. We measure both entrance and interior doors – from a single opening in a flat to a whole house. After the visit you get an exact quote, with no guesswork."
      ),
      L(
        "Matavimo metu specialistas taip pat įvertina, ar reikės papildomų darbų – angos platinimo, angokraščių apdailos, slenksčio ar šilto montavimo. Taip iš anksto žinote visą darbų apimtį ir išvengiate netikėtų išlaidų montavimo dieną.",
        "Uzmērīšanas laikā speciālists arī novērtē, vai būs nepieciešami papildu darbi – ailes paplašināšana, ailes apdare, slieksnis vai siltā montāža. Tā jau iepriekš zināt visu darbu apjomu un izvairāties no negaidītām izmaksām montāžas dienā.",
        "During the visit the specialist also checks whether extra work will be needed – widening the opening, reveal trim, a threshold or warm installation. You know the full scope in advance, with no surprise costs on installation day."
      ),
    ],
    steps: [
      {
        title: L("Užklausa", "Pieprasījums", "Request"),
        text: L(
          "Parašykite arba paskambinkite – suderinsime patogų vizito laiką ir adresą.",
          "Rakstiet vai zvaniet – saskaņosim ērtu vizītes laiku un adresi.",
          "Write or call us and we agree a convenient time and address."
        ),
      },
      {
        title: L("Vizitas", "Vizīte", "Visit"),
        text: L(
          "Specialistas išmatuoja angą, įvertina sienas, grindų lygį ir esamą staktą.",
          "Speciālists izmēra aili, novērtē sienas, grīdas līmeni un esošo kārbu.",
          "The specialist measures the opening and checks the walls, floor level and existing frame."
        ),
      },
      {
        title: L("Konsultacija", "Konsultācija", "Advice"),
        text: L(
          "Kartu aptariame modelį, atidarymo kryptį, spynas, slenkstį ir apdailą.",
          "Kopā pārrunājam modeli, vēršanās virzienu, slēdzenes, slieksni un apdari.",
          "Together we go through the model, opening direction, locks, threshold and finish."
        ),
      },
      {
        title: L("Pasiūlymas", "Piedāvājums", "Quote"),
        text: L(
          "Pagal matmenis paruošiame tikslų pasiūlymą su visomis reikalingomis paslaugomis.",
          "Pēc izmēriem sagatavojam precīzu piedāvājumu ar visiem nepieciešamajiem pakalpojumiem.",
          "From the measurements we prepare an exact quote with every service you need."
        ),
      },
    ],
    prices: [
      {
        rows: [[L("Durų angos matavimas", "Durvju ailes uzmērīšana", "Door opening measurement"), eur(20)]],
      },
    ],
    priceNote: L(
      "Kaina nurodyta su PVM.",
      "Cena norādīta ar PVN.",
      "Price includes VAT."
    ),
    faq: [
      {
        q: L("Ar būtina matuoti angą prieš užsakant?", "Vai aile obligāti jāuzmēra pirms pasūtīšanas?", "Do I need the opening measured before ordering?"),
        a: L(
          "Rekomenduojame visada, kai durys gaminamos pagal užsakymą, anga nestandartinė arba keičiamos senos durys. Netikslūs matmenys – dažniausia montavimo problemų priežastis.",
          "Iesakām vienmēr, ja durvis tiek izgatavotas pēc pasūtījuma, aile ir nestandarta vai tiek mainītas vecās durvis. Neprecīzi izmēri ir biežākais montāžas problēmu cēlonis.",
          "We recommend it whenever the door is made to order, the opening is non-standard or old doors are being replaced. Inaccurate measurements are the most common cause of installation problems."
        ),
      },
      {
        q: L("Ką pasiruošti prieš vizitą?", "Kā sagatavoties vizītei?", "How should I prepare for the visit?"),
        a: L(
          "Pakanka laisvo priėjimo prie angos. Jei jau išsirinkote modelį, turėkite jo pavadinimą – specialistas iškart patikrins, ar jis tinka jūsų angai.",
          "Pietiek ar brīvu piekļuvi ailei. Ja modelis jau izvēlēts, sagatavojiet tā nosaukumu – speciālists uzreiz pārbaudīs, vai tas der jūsu ailei.",
          "Clear access to the opening is enough. If you have already picked a model, have its name ready and the specialist will check straight away that it suits your opening."
        ),
      },
      {
        q: L("Ar galiu išmatuoti angą pats?", "Vai aili varu uzmērīt pats?", "Can I measure the opening myself?"),
        a: L(
          "Galite, tačiau tuomet už matmenų tikslumą atsakote patys. Kilus abejonių, geriau patikėti tai specialistui – taip išvengsite netinkamo dydžio durų.",
          "Varat, taču tad par izmēru precizitāti atbildat paši. Ja ir šaubas, labāk uzticiet to speciālistam – tā izvairīsieties no nepareiza izmēra durvīm.",
          "You can, but then you are responsible for the accuracy of the measurements. If in doubt, leave it to a specialist and avoid ending up with a door of the wrong size."
        ),
      },
      {
        q: L("Kada gausiu pasiūlymą?", "Kad saņemšu piedāvājumu?", "When will I get the quote?"),
        a: L(
          "Į užklausas atsakome per 1 darbo dieną, o pasiūlymą paruošiame netrukus po matavimo – su visomis jums reikalingomis paslaugomis.",
          "Uz pieprasījumiem atbildam 1 darba dienas laikā, bet piedāvājumu sagatavojam drīz pēc uzmērīšanas – ar visiem jums nepieciešamajiem pakalpojumiem.",
          "We reply to requests within 1 working day and prepare the quote soon after the visit, including every service you need."
        ),
      },
      {
        q: L("Ar matavimas įpareigoja užsisakyti duris?", "Vai uzmērīšana uzliek pienākumu pasūtīt durvis?", "Does measuring commit me to ordering?"),
        a: L(
          "Ne. Matavimas ir konsultacija jūsų niekuo neįpareigoja – gavę pasiūlymą, sprendimą priimate patys.",
          "Nē. Uzmērīšana un konsultācija jums neuzliek nekādas saistības – saņemot piedāvājumu, lēmumu pieņemat paši.",
          "No. Measuring and advice commit you to nothing – once you have the quote, the decision is yours."
        ),
      },
      {
        q: L("Ar matuojate ir vidaus duris?", "Vai uzmērāt arī iekšdurvis?", "Do you measure interior doors too?"),
        a: L(
          "Taip. Vieno vizito metu galime išmatuoti visas namo angas – vidaus duris, stumdomas sistemas, portalus ir paslėptas duris.",
          "Jā. Vienas vizītes laikā varam uzmērīt visas mājas ailes – iekšdurvis, bīdāmās sistēmas, portālus un slēptās durvis.",
          "Yes. In one visit we can measure every opening in the house – interior doors, sliding systems, portals and hidden doors."
        ),
      },
    ],
  },

  montavimas: {
    title: L("Montavimas", "Montāža", "Installation"),
    description: L(
      "Lauko ir vidaus durų montavimas visoje Lietuvoje: sertifikuoti montuotojai, gamintojo technologija ir 2 metų garantija darbams. Orientacinės kainos.",
      "Ārdurvju un iekšdurvju montāža visā Lietuvā: sertificēti montieri, ražotāja tehnoloģija un 2 gadu garantija darbiem. Orientējošās cenas.",
      "Entrance and interior door installation across Lithuania: certified fitters, the manufacturer's method and a 2-year warranty on the work. Indicative prices."
    ),
    highlights: [
      { value: from(95), label: L("vidaus durų montavimas", "iekšdurvju montāža", "interior door fitting") },
      { value: from(120), label: L("lauko durys su pristatymu", "ārdurvis ar piegādi", "entrance door incl. delivery") },
      { value: L("2 m.", "2 g.", "2 yrs"), label: L("garantija darbams", "garantija darbiem", "warranty on the work") },
    ],
    intro: [
      L(
        "Net geriausios durys tarnaus tik tiek, kiek gerai jos sumontuotos. Netinkamas montavimas – dažniausia priežastis, kodėl durys stringa, šąla, rasoja ar praleidžia triukšmą.",
        "Pat vislabākās durvis kalpos tikai tik labi, cik labi tās būs uzstādītas. Nepareiza montāža ir biežākais iemesls, kāpēc durvis iesprūst, salst, svīst vai laiž cauri troksni.",
        "Even the best door only performs as well as it is fitted. Poor installation is the most common reason doors stick, get cold, collect condensation or let noise through."
      ),
      L(
        "Duris montuoja mūsų sertifikuoti montuotojai pagal gamintojo technologiją. Atliekame visą darbų ciklą – nuo senų durų demontavimo ir išvežimo iki sandarinimo, reguliavimo ir furnitūros patikrinimo. Montavimo darbams suteikiame 2 metų garantiją.",
        "Durvis uzstāda mūsu sertificētie montieri atbilstoši ražotāja tehnoloģijai. Veicam visu darbu ciklu – no veco durvju demontāžas un izvešanas līdz blīvēšanai, regulēšanai un furnitūras pārbaudei. Montāžas darbiem dodam 2 gadu garantiju.",
        "Doors are fitted by our certified installers to the manufacturer's method. We handle the whole job – from removing and taking away the old door to sealing, adjustment and a hardware check. Our installation work carries a 2-year warranty."
      ),
    ],
    steps: [
      {
        title: L("Matavimas ir pasiūlymas", "Uzmērīšana un piedāvājums", "Measuring and quote"),
        text: L(
          "Išmatuojame angą ir suderiname, kokių darbų reikės.",
          "Uzmērām aili un saskaņojam, kādi darbi būs nepieciešami.",
          "We measure the opening and agree what work is needed."
        ),
      },
      {
        title: L("Pasiruošimas", "Sagatavošanās", "Preparation"),
        text: L(
          "Suderintu laiku atvežame duris, apsaugome grindis ir aplinką.",
          "Saskaņotā laikā atvedam durvis, aizsargājam grīdu un apkārtni.",
          "We bring the door at the agreed time and protect the floor and surroundings."
        ),
      },
      {
        title: L("Montavimas", "Montāža", "Fitting"),
        text: L(
          "Demontuojame senas duris, įstatome naująsias, sandariname ir izoliuojame tarpus.",
          "Demontējam vecās durvis, uzstādām jaunās, noblīvējam un izolējam spraugas.",
          "We remove the old door, fit the new one, then seal and insulate the gaps."
        ),
      },
      {
        title: L("Reguliavimas ir perdavimas", "Regulēšana un nodošana", "Adjustment and handover"),
        text: L(
          "Sureguliuojame varčią, patikriname spynas, parodome, kaip prižiūrėti duris, ir sutvarkome darbo vietą.",
          "Noregulējam vērtni, pārbaudām slēdzenes, parādām, kā kopt durvis, un sakopjam darba vietu.",
          "We adjust the leaf, test the locks, show you how to look after the door and leave the site tidy."
        ),
      },
    ],
    prices: [
      {
        title: L("Lauko durys", "Ārdurvis", "Entrance doors"),
        rows: [
          [L("Standartinių lauko durų montavimas su pristatymu", "Standarta ārdurvju montāža ar piegādi", "Standard entrance door, fitted and delivered"), eur(120)],
          [L("Durys aukštesnės nei 2200 mm", "Durvis, augstākas par 2200 mm", "Doors taller than 2200 mm"), eur(130)],
          [L("Dvivėrės lauko durys", "Divviru ārdurvis", "Double-leaf entrance doors"), eur(160)],
          [L("Šoninių ar viršutinių stiklų montavimas", "Sānu vai augšējo stiklojumu uzstādīšana", "Side or top glazing panels"), per(50, "piece")],
          [L("Šiltas montavimas (garo izoliacinė ir difuzinė plėvelė)", "Siltā montāža (tvaika izolācijas un difūzā plēve)", "Warm installation (vapour and diffusion membranes)"), from(40)],
          [L("Skubus montavimas per 7 dienas", "Steidzama montāža 7 dienu laikā", "Express installation within 7 days"), pct(50)],
        ],
      },
      {
        title: L("Vidaus durys", "Iekšdurvis", "Interior doors"),
        rows: [
          [L("Vidaus durų montavimas", "Iekšdurvju montāža", "Interior door fitting"), per(95, "piece")],
          [L("Stumdomos durys ant sienos", "Bīdāmās durvis gar sienu", "Wall-mounted sliding door"), eur(110)],
          [L("Stumdomos durys MAGIC sistema", "Bīdāmās durvis, MAGIC sistēma", "Sliding door, MAGIC system"), eur(125)],
          [L("Portalas", "Portāls", "Portal"), eur(70)],
          [L("Plėtiniai prie esamos staktos", "Paplašinātāji esošai kārbai", "Extension boards on an existing frame"), eur(25)],
          [L("Dvivėrės durys ar nestandartinis portalas", "Divviru durvis vai nestandarta portāls", "Double-leaf door or non-standard portal"), pct(50)],
          [L("Sieninės plokštės", "Sienas paneļi", "Wall panels"), per(50, "piece")],
          [L("Dekoratyvinės lamelės", "Dekoratīvās lameles", "Decorative slats"), from(40, "m2")],
          [L("Grindjuostės", "Grīdlīstes", "Skirting boards"), per(5, "m")],
        ],
      },
      {
        title: L("Angokraščiai ir papildomi darbai", "Ailes apdare un papildu darbi", "Reveals and extra work"),
        rows: [
          [L("Vidinė angokraščio apdaila MDF (medžiaga ir darbas)", "Iekšējā ailes apdare ar MDF (materiāls un darbs)", "Inner reveal trim in MDF (materials and labour)"), from(170)],
          [L("MDF slenkstis", "MDF slieksnis", "MDF threshold"), eur(40)],
          [L("Angos platinimas – betonas", "Ailes paplašināšana – betons", "Widening the opening – concrete"), per(40, "m")],
          [L("Angos platinimas – mediena, gipsas, tinkas", "Ailes paplašināšana – koks, ģipsis, apmetums", "Widening the opening – timber, plaster, render"), per(35, "m")],
          [L("Varčios trumpinimas", "Vērtnes saīsināšana", "Shortening a door leaf"), eur(30)],
          [L("Senų medinių durų demontavimas", "Veco koka durvju demontāža", "Removing an old timber door"), eur(15)],
          [L("Senų metalinių durų demontavimas", "Veco metāla durvju demontāža", "Removing an old metal door"), eur(25)],
          [L("Senų durų utilizavimas", "Veco durvju utilizācija", "Disposal of the old door"), per(15, "piece")],
        ],
      },
    ],
    priceNote: CALL_OUT_NOTE,
    faq: [
      {
        q: L("Ar montavimo kaina apima pristatymą?", "Vai montāžas cenā ietilpst piegāde?", "Does the installation price include delivery?"),
        a: L(
          "Lauko durų montavimo kainoje pristatymas jau įskaičiuotas. Vidaus durų pristatymas skaičiuojamas atskirai – žr. skiltį „Pristatymas“.",
          "Ārdurvju montāžas cenā piegāde jau ir iekļauta. Iekšdurvju piegāde tiek rēķināta atsevišķi – skatiet sadaļu “Piegāde”.",
          "For entrance doors, delivery is already included in the installation price. Interior door delivery is charged separately – see “Delivery”."
        ),
      },
      {
        q: L("Ar išvešite senas duris?", "Vai izvedīsiet vecās durvis?", "Will you take the old door away?"),
        a: L(
          "Taip. Senas duris demontuojame ir, jei pageidaujate, išvežame bei utilizuojame – kainos nurodytos lentelėje.",
          "Jā. Vecās durvis demontējam un pēc vēlēšanās izvedam un utilizējam – cenas norādītas tabulā.",
          "Yes. We remove the old door and, if you wish, take it away for disposal – see the prices above."
        ),
      },
      {
        q: L("Ar galiu duris sumontuoti pats?", "Vai durvis varu uzstādīt pats?", "Can I fit the door myself?"),
        a: L(
          "Žinoma. Užsakydami pasirinkite „Tik pristatymas, be montavimo“ arba atsiimkite duris sandėlyje. Tokiu atveju montavimo garantija netaikoma, tačiau 2 metų garantija durims galioja.",
          "Protams. Pasūtot izvēlieties “Tikai piegāde, bez montāžas” vai saņemiet durvis noliktavā. Šādā gadījumā montāžas garantija netiek piemērota, taču 2 gadu garantija durvīm ir spēkā.",
          "Of course. Choose “Delivery only, no installation” when ordering, or collect the door from our warehouse. The installation warranty then does not apply, but the 2-year warranty on the door does."
        ),
      },
      {
        q: L("Kada sužinosiu galutinę kainą?", "Kad uzzināšu galīgo cenu?", "When will I know the final price?"),
        a: L(
          "Lentelėje pateiktos orientacinės kainos. Galutinė kaina priklauso nuo angos būklės ir papildomų darbų, todėl ją patiksliname po matavimo – prieš pradedant darbus.",
          "Tabulā norādītas orientējošās cenas. Galīgā cena atkarīga no ailes stāvokļa un papildu darbiem, tāpēc to precizējam pēc uzmērīšanas – pirms darbu sākšanas.",
          "The table shows indicative prices. The final price depends on the state of the opening and any extra work, so we confirm it after measuring – before any work starts."
        ),
      },
    ],
  },

  garantija: {
    title: L("Garantija", "Garantija", "Warranty"),
    description: L(
      "Durims taikoma 2 metų garantija, o mūsų atliktiems montavimo darbams – 2 metų garantija. Kaip pateikti garantinę pretenziją.",
      "Durvīm ir 2 gadu garantija, bet mūsu veiktajiem montāžas darbiem – 2 gadu garantija. Kā iesniegt garantijas pretenziju.",
      "Doors carry a 2-year warranty and our installation work a further 2-year warranty. How to make a warranty claim."
    ),
    highlights: [
      { value: L("2 m.", "2 g.", "2 yrs"), label: L("durims ir furnitūrai", "durvīm un furnitūrai", "on doors and hardware") },
      { value: L("2 m.", "2 g.", "2 yrs"), label: L("montavimo darbams", "montāžas darbiem", "on installation work") },
    ],
    intro: [
      L(
        "Parduodame tik patikrintų gamintojų duris ir patys atsakome už savo darbą. Todėl kiekvienam pirkiniui taikoma aiški, dviejų dalių garantija: 2 metai durims ir furnitūrai bei 2 metai montavimo darbams, kai duris sumontavo mūsų specialistai.",
        "Pārdodam tikai pārbaudītu ražotāju durvis un paši atbildam par savu darbu. Tāpēc katram pirkumam ir skaidra divu daļu garantija: 2 gadi durvīm un furnitūrai un 2 gadi montāžas darbiem, ja durvis uzstādīja mūsu speciālisti.",
        "We sell doors only from proven manufacturers and stand behind our own work. Every purchase therefore carries a clear two-part warranty: 2 years on the door and hardware, and 2 years on the installation when our specialists fitted it."
      ),
      L(
        "Jei pastebėjote defektą ar durys veikia ne taip, kaip turėtų, nedelskite – daugumą problemų, pavyzdžiui, varčios ar spynos reguliavimą, išsprendžiame greitai ir be didelių nepatogumų.",
        "Ja pamanījāt defektu vai durvis nedarbojas tā, kā vajadzētu, nekavējieties – lielāko daļu problēmu, piemēram, vērtnes vai slēdzenes regulēšanu, atrisinām ātri un bez lielām neērtībām.",
        "If you notice a defect or the door doesn't work as it should, get in touch straight away – most issues, such as adjusting the leaf or a lock, are fixed quickly and with little disruption."
      ),
      L(
        "Durų garantija apima gamybos defektus, atsiradusius normaliai naudojant duris, – pavyzdžiui, varčios ar staktos deformaciją, dangos atsisluoksniavimą, spynų ar vyrių gedimus. Montavimo garantija apima mūsų atliktų darbų kokybę: tvirtinimą, sandarinimą ir reguliavimą. Dažnai tai, kas atrodo kaip gedimas, išsprendžiama paprastu reguliavimu, pavyzdžiui, kai keičiantis sezonams durys pradeda sunkiau užsidaryti.",
        "Durvju garantija aptver ražošanas defektus, kas radušies, durvis lietojot normāli, – piemēram, vērtnes vai kārbas deformāciju, pārklājuma atslāņošanos, slēdzeņu vai eņģu bojājumus. Montāžas garantija aptver mūsu veikto darbu kvalitāti: stiprināšanu, blīvēšanu un regulēšanu. Bieži vien tas, kas izskatās pēc bojājuma, tiek atrisināts ar vienkāršu regulēšanu, piemēram, ja, mainoties gadalaikiem, durvis sāk grūtāk aizvērties.",
        "The door warranty covers manufacturing defects that appear in normal use – such as a warped leaf or frame, a peeling finish, or failed locks or hinges. The installation warranty covers the quality of our work: fixing, sealing and adjustment. Often what looks like a fault is solved by a simple adjustment – for example when a door starts closing less easily as the seasons change."
      ),
    ],
    stepsHeading: L("Kaip pateikti pretenziją", "Kā iesniegt pretenziju", "How to make a claim"),
    steps: [
      {
        title: L("Susisiekite", "Sazinieties", "Get in touch"),
        text: L(
          "Parašykite el. paštu arba paskambinkite ir trumpai aprašykite problemą.",
          "Rakstiet e-pastu vai zvaniet un īsi aprakstiet problēmu.",
          "Email or call us and briefly describe the problem."
        ),
      },
      {
        title: L("Atsiųskite nuotraukas", "Atsūtiet fotogrāfijas", "Send photos"),
        text: L(
          "Nuotraukos ar trumpas vaizdo įrašas padeda greičiau įvertinti situaciją.",
          "Fotogrāfijas vai īss video palīdz ātrāk novērtēt situāciju.",
          "Photos or a short video help us assess the situation faster."
        ),
      },
      {
        title: L("Pateikite pirkimo dokumentą", "Uzrādiet pirkuma dokumentu", "Show proof of purchase"),
        text: L(
          "Garantijai reikalingas pirkimo dokumentas – sąskaita faktūra ar kasos kvitas.",
          "Garantijai nepieciešams pirkuma dokuments – rēķins vai čeks.",
          "A warranty claim needs proof of purchase – an invoice or receipt."
        ),
      },
      {
        title: L("Sprendimas", "Risinājums", "Resolution"),
        text: L(
          "Įvertiname atvejį ir suderiname specialisto vizitą, reguliavimą, detalių keitimą ar kitą sprendimą.",
          "Izvērtējam gadījumu un saskaņojam speciālista vizīti, regulēšanu, detaļu nomaiņu vai citu risinājumu.",
          "We review the case and arrange a visit, adjustment, replacement parts or another fix."
        ),
      },
    ],
    faq: [
      {
        q: L("Nuo kada skaičiuojama garantija?", "No kura brīža skaitās garantija?", "When does the warranty start?"),
        a: L(
          "Durų garantija skaičiuojama nuo jų pristatymo ar atsiėmimo dienos, o montavimo garantija – nuo montavimo darbų atlikimo dienos.",
          "Durvju garantija skaitās no to piegādes vai saņemšanas dienas, bet montāžas garantija – no montāžas darbu pabeigšanas dienas.",
          "The door warranty runs from the day of delivery or collection, and the installation warranty from the day the fitting is completed."
        ),
      },
      {
        q: L("Kam garantija netaikoma?", "Kam garantija neattiecas?", "What isn't covered?"),
        a: L(
          "Mechaniniams pažeidimams, atsiradusiems po pristatymo, naudojimui ne pagal paskirtį, savavališkam ardymui ar perdarymui. Montavimo garantija galioja tik tada, kai duris montavo mūsų specialistai.",
          "Mehāniskiem bojājumiem, kas radušies pēc piegādes, lietošanai ne pēc nozīmes, patvaļīgai izjaukšanai vai pārveidošanai. Montāžas garantija ir spēkā tikai tad, ja durvis uzstādīja mūsu speciālisti.",
          "Mechanical damage after delivery, use other than intended, and dismantling or alterations by others. The installation warranty applies only when our specialists fitted the door."
        ),
      },
      {
        q: L("Kaip prižiūrėti duris?", "Kā kopt durvis?", "How should I look after the door?"),
        a: L(
          "Kartą per metus patariame patikrinti varčios reguliavimą, sutepti vyrius ir spynų mechanizmus bei nuvalyti sandarinimo gumas. Tai padeda durims ilgai veikti sklandžiai.",
          "Reizi gadā iesakām pārbaudīt vērtnes regulējumu, ieeļļot eņģes un slēdzeņu mehānismus un notīrīt blīvgumijas. Tas palīdz durvīm ilgi darboties nevainojami.",
          "Once a year, check the leaf adjustment, lubricate the hinges and lock mechanisms and wipe the seals clean. It keeps the door working smoothly for years."
        ),
      },
      {
        q: L("Ar kai kurioms dangoms taikoma ilgesnė garantija?", "Vai dažiem pārklājumiem ir ilgāka garantija?", "Do some finishes have a longer warranty?"),
        a: L(
          "Taip, kai kurioms dangoms gamintojas suteikia ilgesnę garantiją, pavyzdžiui, Decolux dangai – 5 metai. Tai nurodoma konkretaus modelio aprašyme.",
          "Jā, dažiem pārklājumiem ražotājs dod ilgāku garantiju, piemēram, Decolux pārklājumam – 5 gadi. Tas norādīts konkrētā modeļa aprakstā.",
          "Yes – for some finishes the manufacturer gives a longer warranty, such as 5 years on the Decolux coating. This is shown in the model's description."
        ),
      },
      {
        q: L("Ar garantija galioja, jei duris montavo kiti meistrai?", "Vai garantija ir spēkā, ja durvis uzstādīja citi meistari?", "Is the door covered if someone else fitted it?"),
        a: L(
          "Durų garantija galioja, tačiau montavimo garantiją suteikia tas, kas duris montavo. Jei gedimą lėmė netinkamas montavimas, jis nelaikomas gamybos defektu.",
          "Durvju garantija ir spēkā, taču montāžas garantiju dod tas, kurš durvis uzstādīja. Ja bojājumu izraisījusi nepareiza montāža, tas netiek uzskatīts par ražošanas defektu.",
          "The door warranty still applies, but the installation is guaranteed by whoever fitted it. A fault caused by poor installation is not treated as a manufacturing defect."
        ),
      },
      {
        q: L("Ką daryti, jei durys pradėjo sunkiau užsidaryti?", "Ko darīt, ja durvis sāk grūtāk aizvērties?", "What if the door starts closing less easily?"),
        a: L(
          "Dažniausiai pakanka sureguliuoti varčią ar spyną. Susisiekite su mumis – patarsime, ką galite padaryti patys, arba suderinsime specialisto vizitą.",
          "Visbiežāk pietiek noregulēt vērtni vai slēdzeni. Sazinieties ar mums – ieteiksim, ko varat izdarīt paši, vai saskaņosim speciālista vizīti.",
          "Usually the leaf or lock just needs adjusting. Get in touch and we'll tell you what you can do yourself, or arrange a visit from a specialist."
        ),
      },
    ],
  },

  pristatymas: {
    title: L("Pristatymas", "Piegāde", "Delivery"),
    description: L(
      "Durų pristatymas visoje Lietuvoje arba nemokamas atsiėmimas iš sandėlio Jonavos r. Orientacinės pristatymo ir užnešimo kainos.",
      "Durvju piegāde visā Lietuvā vai bezmaksas saņemšana noliktavā Jonavas raj. Orientējošās piegādes un uznešanas cenas.",
      "Door delivery across Lithuania, or free collection from our warehouse in the Jonava district. Indicative delivery and carry-in prices."
    ),
    highlights: [
      { value: eur(25), label: L("pristatymas mieste", "piegāde pilsētā", "delivery in town") },
      { value: FREE, label: L("atsiėmimas sandėlyje", "saņemšana noliktavā", "warehouse collection") },
    ],
    intro: [
      L(
        "Duris pristatome visoje Lietuvoje – gamintojo pakuotėje, kad jos pasiektų jus nepažeistos. Pristatymo dieną ir laiką suderiname iš anksto, todėl nereikės laukti namuose visą dieną.",
        "Durvis piegādājam visā Lietuvā – ražotāja iepakojumā, lai tās nonāktu pie jums nebojātas. Piegādes dienu un laiku saskaņojam iepriekš, tāpēc nav jāgaida mājās visu dienu.",
        "We deliver across Lithuania, in the manufacturer's packaging so the door reaches you undamaged. Delivery day and time are agreed in advance, so there's no waiting in all day."
      ),
      L(
        "Jei patogiau, duris galite atsiimti patys iš mūsų sandėlio Džūkų g. 17, Šveicarijos k., Jonavos r. – atsiėmimas nemokamas. Užsakius montavimą, lauko durų pristatymas jau įskaičiuotas į montavimo kainą.",
        "Ja ērtāk, durvis varat saņemt paši mūsu noliktavā Džūkų g. 17, Šveicarijos k., Jonavas raj. – saņemšana bez maksas. Ja pasūtīta montāža, ārdurvju piegāde jau iekļauta montāžas cenā.",
        "If it suits you better, collect the door yourself from our warehouse at Džūkų g. 17, Šveicarijos k., Jonava district – collection is free. If you book installation, entrance door delivery is already included in the installation price."
      ),
    ],
    steps: [
      {
        title: L("Užsakymas", "Pasūtījums", "Order"),
        text: L(
          "Pateikite užsakymą svetainėje arba susisiekite su mumis.",
          "Noformējiet pasūtījumu vietnē vai sazinieties ar mums.",
          "Place your order on the website or get in touch."
        ),
      },
      {
        title: L("Suderinimas", "Saskaņošana", "Scheduling"),
        text: L(
          "Per 1 darbo dieną susisiekiame ir suderiname pristatymo datą bei adresą.",
          "1 darba dienas laikā sazināmies un saskaņojam piegādes datumu un adresi.",
          "Within 1 working day we contact you to agree the date and address."
        ),
      },
      {
        title: L("Pristatymas", "Piegāde", "Delivery"),
        text: L(
          "Atvežame duris gamintojo pakuotėje ir, jei reikia, užnešame į aukštą.",
          "Atvedam durvis ražotāja iepakojumā un, ja nepieciešams, uznesam stāvā.",
          "We bring the door in its original packaging and carry it upstairs if needed."
        ),
      },
      {
        title: L("Patikrinimas", "Pārbaude", "Check"),
        text: L(
          "Priimdami apžiūrėkite pakuotę ir duris – pastebėtus pažeidimus pažymėkite iš karto.",
          "Saņemot apskatiet iepakojumu un durvis – pamanītos bojājumus atzīmējiet uzreiz.",
          "Check the packaging and door on arrival and note any damage straight away."
        ),
      },
    ],
    prices: [
      {
        rows: [
          [L("Lauko durų pristatymas (be montavimo)", "Ārdurvju piegāde (bez montāžas)", "Entrance door delivery (no installation)"), eur(25)],
          [L("Vidaus durų, staktų, portalų ir lamelių pristatymas", "Iekšdurvju, kārbu, portālu un lameļu piegāde", "Interior doors, frames, portals and slats"), eur(25)],
          [L("Išvykimas už miesto ribų", "Izbraukums ārpus pilsētas", "Delivery outside town"), per(1, "km")],
          [L("Lauko durų užnešimas", "Ārdurvju uznešana", "Carrying an entrance door upstairs"), per(5, "floor")],
          [L("Vidaus durų užnešimas ar įnešimas", "Iekšdurvju uznešana vai ienešana", "Carrying interior doors in or upstairs"), per(5, "leaf")],
          [L("Atsiėmimas sandėlyje (Jonavos r.)", "Saņemšana noliktavā (Jonavas raj.)", "Collection from the warehouse (Jonava district)"), FREE],
        ],
      },
    ],
    priceNote: L(
      "Kainos nurodytos su PVM ir yra orientacinės. Už miesto ribų prie pristatymo kainos pridedamas 1 €/km mokestis (skaičiuojama viena kryptimi). Vidaus durų užnešimas skaičiuojamas už varčią, nepriklausomai nuo aukšto.",
      "Cenas norādītas ar PVN un ir orientējošas. Ārpus pilsētas piegādes cenai tiek pieskaitīti 1 €/km (rēķinot vienā virzienā). Iekšdurvju uznešana tiek rēķināta par vērtni, neatkarīgi no stāva.",
      "Prices include VAT and are indicative. Outside town, €1/km is added to the delivery price (one way). Carrying interior doors is charged per leaf, whatever the floor."
    ),
    faq: [
      {
        q: L("Kiek kainuoja pristatymas už miesto ribų?", "Cik maksā piegāde ārpus pilsētas?", "How much is delivery outside town?"),
        a: L(
          "Prie pagrindinės pristatymo kainos pridedamas išvykimo mokestis – 1 € už kiekvieną kilometrą už miesto ribų, skaičiuojant viena kryptimi.",
          "Pamata piegādes cenai tiek pieskaitīta izbraukuma maksa – 1 € par katru kilometru ārpus pilsētas, rēķinot vienā virzienā.",
          "A call-out charge of €1 for every kilometre outside town, one way, is added to the base delivery price."
        ),
      },
      {
        q: L("Ar užnešite duris į butą?", "Vai uznesīsiet durvis dzīvoklī?", "Will you carry the door into my flat?"),
        a: L(
          "Taip. Lauko durų užnešimas kainuoja 5 € už kiekvieną aukštą, vidaus durų – 5 € už varčią, nepriklausomai nuo aukšto.",
          "Jā. Ārdurvju uznešana maksā 5 € par katru stāvu, iekšdurvju – 5 € par vērtni, neatkarīgi no stāva.",
          "Yes. Carrying an entrance door costs €5 per floor; interior doors are €5 per leaf, whatever the floor."
        ),
      },
      {
        q: L("Kada durys bus pristatytos?", "Kad durvis tiks piegādātas?", "When will the door arrive?"),
        a: L(
          "Sandėlyje esančias duris pristatome suderintu laiku, o užsakomų durų terminą nurodome pasiūlyme – jis priklauso nuo gamintojo.",
          "Noliktavā esošās durvis piegādājam saskaņotā laikā, bet pasūtāmo durvju termiņu norādām piedāvājumā – tas atkarīgs no ražotāja.",
          "Doors in stock are delivered at a time we agree; for made-to-order doors the lead time is stated in your quote, as it depends on the manufacturer."
        ),
      },
      {
        q: L("Ką daryti, jei durys pristatytos pažeistos?", "Ko darīt, ja durvis piegādātas bojātas?", "What if the door arrives damaged?"),
        a: L(
          "Pažymėkite pažeidimą priimdami prekę ir iškart susisiekite su mumis – problemą išspręsime pagal garantijos sąlygas.",
          "Atzīmējiet bojājumu, saņemot preci, un uzreiz sazinieties ar mums – problēmu atrisināsim saskaņā ar garantijas noteikumiem.",
          "Note the damage when you accept the delivery and contact us straight away – we'll put it right under the warranty terms."
        ),
      },
      {
        q: L("Ar galiu atsiimti duris pats?", "Vai durvis varu saņemt pats?", "Can I collect the door myself?"),
        a: L(
          "Taip, iš sandėlio Džūkų g. 17, Šveicarijos k., Jonavos r. Atsiėmimas nemokamas – tik iš anksto suderinkite laiką, kad durys jūsų lauktų paruoštos.",
          "Jā, noliktavā Džūkų g. 17, Šveicarijos k., Jonavas raj. Saņemšana ir bez maksas – tikai iepriekš saskaņojiet laiku, lai durvis jūs gaidītu sagatavotas.",
          "Yes, from our warehouse at Džūkų g. 17, Šveicarijos k., Jonava district. Collection is free – just agree a time in advance so the door is ready for you."
        ),
      },
      {
        q: L("Ar pristatymas įskaičiuotas užsakius montavimą?", "Vai piegāde ir iekļauta, ja pasūtīta montāža?", "Is delivery included if I book installation?"),
        a: L(
          "Lauko durų – taip, pristatymas jau įskaičiuotas į montavimo kainą. Vidaus durų pristatymas skaičiuojamas atskirai ir kainuoja 25 €.",
          "Ārdurvīm – jā, piegāde jau ir iekļauta montāžas cenā. Iekšdurvju piegāde tiek rēķināta atsevišķi un maksā 25 €.",
          "For entrance doors, yes – delivery is already in the installation price. Interior door delivery is charged separately at €25."
        ),
      },
    ],
  },
};

export const serviceSlugs = Object.keys(services);

const pick = (text, locale) => (text && typeof text === "object" && "lt" in text ? text[locale] || text.lt : text);

const formatValue = (value, locale) => ("lt" in value ? pick(value, locale) : formatPrice(value, locale));

/* The service in one language, prices formatted. */
export function getService(slug, locale) {
  const s = services[slug];
  if (!s) return null;
  return {
    title: pick(s.title, locale),
    description: pick(s.description, locale),
    intro: s.intro.map((p) => pick(p, locale)),
    highlights: (s.highlights || []).map((h) => ({ value: formatValue(h.value, locale), label: pick(h.label, locale) })),
    stepsHeading: pick(s.stepsHeading || SERVICE_UI.stepsHeading, locale),
    steps: s.steps.map((st) => ({ title: pick(st.title, locale), text: pick(st.text, locale) })),
    prices: (s.prices || []).map((g) => ({
      title: g.title ? pick(g.title, locale) : null,
      rows: g.rows.map(([label, spec]) => [pick(label, locale), formatPrice(spec, locale)]),
    })),
    priceNote: s.priceNote ? pick(s.priceNote, locale) : null,
    faq: s.faq.map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) })),
  };
}

export const serviceUi = (locale) => Object.fromEntries(Object.entries(SERVICE_UI).map(([k, v]) => [k, pick(v, locale)]));
