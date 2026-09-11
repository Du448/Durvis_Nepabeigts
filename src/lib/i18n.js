import { catalogTranslations } from "@/data/translations";

export const locales = ["lt", "lv", "en"];
export const defaultLocale = "lt";

export function getLocaleFromPathname(pathname) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return locales.includes(seg) ? seg : defaultLocale;
}

export function withLocaleHref(locale, href) {
  if (!href) return `/${locale}`;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  const normalized = href.startsWith("/") ? href : `/${href}`;
  const parts = normalized.split("/").filter(Boolean);
  if (locales.includes(parts[0])) return normalized;

  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

const messages = {
  lt: {
    nav: {
      news: "Naujienos",
      exteriorApartment: "Buto lauko durys",
      exteriorHouse: "Namo lauko durys",
      interior: "Vidaus durys",
      hidden: "Paslėptos durys",
      deals: "Akcijos",
      finishes: "Apdailė",
      individualSolutions: "Individualūs sprendimai",
      manufacturer1: "Gamintojas - 1",
      manufacturer2: "Gamintojas - 2",
      products: "Produktai",
      about: "Apie mus",
      contacts: "Kontaktai",
      searchPlaceholder: "Ieškoti durų...",
    },
    categories: {
      "ardurvis-dzivoklim": "Buto lauko durys",
      "ardurvis-privatmajai": "Namo lauko durys",
      ieksdurvis: "Vidaus durys",
      "sleptas-durvis": "Paslėptos durys",
      details: {
        "ardurvis-dzivoklim": {
          name: "Buto lauko durys",
          description: "Metalinės lauko durys butams su garso ir šilumos izoliacija.",
        },
        "ardurvis-privatmajai": {
          name: "Namo lauko durys",
          description: "Apšiltintos metalinės ir aliuminio lauko durys su termo pertrauka namams.",
        },
        ieksdurvis: {
          name: "Vidaus durys",
          description: "Vidaus durys gyvenamosioms patalpoms įvairių spalvų ir faktūrų.",
        },
        "sleptas-durvis": {
          name: "Paslėptos durys",
          description: "Paslėpto tipo durys be matomos staktos.",
        },
      },
    },
    footer: {
      assortment: "Asortimentas",
      services: "Paslaugos",
      company: "Įmonė",
      contacts: "Kontaktai",
      measurement: "Matavimas",
      installation: "Montavimas",
      warranty: "Garantija",
      delivery: "Pristatymas",
      phone: "Telefonas",
      email: "El. paštas",
      showroom: "Adresas",
      hours: "Darbo laikas",
      rights: "Visos teisės saugomos.",
    },
    common: {
      home: "Pradžia",
    },
    home: {
      popularCategories: "Populiarios kategorijos",
      newArrivals: "Naujienos",
      popularExterior: "Populiariausios lauko durys",
      ctaTitle: "Nežinai, kurias duris pasirinkti? Susisiek su mumis nemokamai konsultacijai.",
      ctaButton: "Susisiekti",
    },
    hero: {
      carouselLabel: "Hero karuselė",
      imageAlt: "Hero nuotrauka",
      noSlides: "Nėra skaidrių",
      prevSlide: "Ankstesnė skaidrė",
      nextSlide: "Kita skaidrė",
      goToSlide: "Eiti į {n}. skaidrę",
      chooseDoors: "Rinkis duris",
      partnership: "Bendradarbiavimas",
    },
    search: {
      title: "Paieška",
      results: "Paieškos rezultatai",
      found: "rasta",
      nothingFound: "Nieko nerasta.",
      backHome: "Atgal į pradžią",
    },
    specs: {
      leafThickness: "Varčios storis",
      frameThickness: "Staktos storis",
      weight: "Svoris",
      locks: "Spynos",
      filling: "Užpildas",
      outsideFinish: "Išorės apdaila",
      insideFinish: "Vidaus apdaila",
      finish: "Apdaila",
      peephole: "Akutė",
      hardware: "Furnitūra",
    },
    values: {
      yes: "Taip",
      no: "Ne",
    },
    pages: {
      manufacturer2: {
        title: "Gamintojas - 2",
        description:
          "Durų dizaino serijos, plėvelės spalvos ir milteliniai dažai iš Bulat gamyklos (Černihivas).",
      },
      deals: {
        title: "Akcijos",
        description:
          "Čia rasi durų modelius su specialiomis nuolaidomis. Pasiūlymai galioja ribotą laiką arba iki prekių išpardavimo.",
      },
      news: {
        title: "Naujienos",
        description: "Naujausi durų modeliai mūsų asortimente — atrask naujausias kolekcijas ir dizainus.",
      },
      about: {
        title: "Apie mus",
        intro1:
          "Siūlome kokybiškas lauko ir vidaus duris su pristatymu ir profesionaliu montavimu visoje Lietuvoje.",
        intro2:
          "Asortimente — šimtai skirtingų stilių ir spalvų modelių. Padėsime išsirinkti sprendimą jūsų namams.",
        intro3:
          "Kviečiame apsilankyti mūsų salone, kur duris galima apžiūrėti ir palyginti gyvai, bei gauti specialisto konsultaciją.",
        cta: "Susisiekti",
        featuresTitle1: "Platus asortimentas",
        featuresDesc1: "Daug durų modelių įvairiems stiliams ir biudžetams.",
        featuresTitle2: "Profesionalus montavimas",
        featuresDesc2: "Sertifikuoti meistrai užtikrina kokybišką įrengimą.",
        featuresTitle3: "Garantija",
        featuresDesc3: "Gamintojo ir montavimo garantija patikimam rezultatui.",
        featuresTitle4: "Nemokama konsultacija",
        featuresDesc4: "Padėsime rasti optimalų sprendimą jūsų poreikiams.",
      },
      services: {
        title: "Paslaugos",
        description: "Matavimas, montavimas, garantija ir pristatymas — detalesnė informacija bus pridėta vėliau.",
      },
    },
    header: {
      promo: "Nemokama konsultacija ir matavimas · Pristatymas visoje Lietuvoje",
    },
    a11y: {
      search: "Ieškoti",
      close: "Uždaryti",
      language: "Kalba {code}",
      addWishlist: "Pridėti į norus",
    },
    cart: {
      title: "Krepšelis",
      description: "Jūsų pasirinkti produktai bus rodomi čia. Funkcija bus pridėta vėliau.",
    },
    wishlist: {
      title: "Norų sąrašas",
      description: "Jūsų mėgstami modeliai bus rodomi čia. Funkcija bus pridėta vėliau.",
      empty: "Norų sąrašas tuščias.",
    },
    loading: {
      search: "Įkeliami paieškos rezultatai…",
      contacts: "Įkeliama kontaktų informacija…",
    },
    category: {
      collection: "Kolekcija",
      color: "Spalva",
      price: "Kaina",
      from: "Nuo",
      to: "Iki",
      thermo: "Termo pertrauka",
      all: "Visi",
      yes: "Taip",
      no: "Ne",
      clearFilters: "Išvalyti filtrus",
      sort: "Rūšiuoti:",
      filters: "Filtrai",
      close: "Uždaryti",
      models: "modeliai",
      sortPopular: "Populiariausi",
      sortCheap: "Pirmiausia pigiausi",
      sortExpensive: "Pirmiausia brangiausi",
      sortNew: "Naujienos",
            size: "Matmenys",
      features: "Savybės",
      glass: "Su stiklu",
      newOnly: "Naujiena",
      offerOnly: "Akcija",
      activeFilters: "Pasirinkti filtrai",
      nothingFound: "Pagal pasirinktus filtrus nieko nerasta.",
      notFound: "Kategorija nerasta",
    },
    product: {
      notFound: "Produktas nerastas",
      image: "Nuotrauka",
      imageN: "Nuotrauka {n}",
      openImage: "Atidaryti nuotrauką pilnu dydžiu",
      colorLabel: "Spalva (išorė / vidus):",
      size: "Dydis:",
      requestOffer: "Prašyti pasiūlymo",
      addWishlist: "Pridėti į norus",
      freeServices: "Nemokamas matavimas · Montavimas · Pristatymas visoje Lietuvoje",
      specs: "Specifikacija",
      finishMaterial: "Išorinės apdailos medžiaga",
      set: "Komplektacija",
      installDelivery: "Montavimas ir pristatymas",
      warranty: "Garantija",
      similar: "Panašūs modeliai",
      previous: "Ankstesnis",
      next: "Kitas",
      close: "Uždaryti",
      offerBadge: "Pasiūlymas",
      newBadge: "Naujas",
      inStock: "Yra sandėlyje",
      inStockFactory: "Gamintojo sandėlyje",
      tabDescription: "Aprašymas",
      tabSpecs: "Charakteristikos",
    },
    contacts: {
      title: "Kontaktai",
      relatedToProduct: "Užklausa susijusi su produktu:",
      prefill: "Norėčiau gauti pasiūlymą modeliui:",
      contactUs: "Susisiek su mumis",
      phone: "Telefonas",
      email: "El. paštas",
      showroom: "Adresas",
      hours: "Darbo laikas",
      formName: "Vardas",
      formPhone: "Telefonas",
      formEmail: "El. paštas",
      formMessage: "Žinutė",
      formPlaceholder: "Jūsų klausimas ar užklausa",
      submit: "Siųsti",
      sending: "Siunčiama...",
      thanks: "Ačiū! Susisieksime artimiausiu metu.",
      error: "Nepavyko išsiųsti. Bandykite dar kartą arba rašykite el. paštu.",
      mapTitle: "TN Baltic — žemėlapis",
    },
    finishes: {
      title: "Apdaila ir dizainas",
      lead:
        "Frezavimo raštai, dekoratyviniai elementai ir visos spalvų paletės, iš kurių renkamasi durų išvaizda. Kiekvieną raštą galima derinti su bet kuria spalva.",
      itemsCount: "variantų",
      openImage: "Padidinti",
      close: "Uždaryti",
      note: "Spalvų atspalviai ekrane gali skirtis nuo tikrųjų. Dėl pavyzdžių kreipkitės į saloną.",
    },
    partners: {
      title: "Bendradarbiavimas",
      lead: "Ieškome partnerių Lietuvoje ir užsienyje — salonų, montuotojų, statybos bendrovių ir projektuotojų. Užpildyk paraišką ir susisieksime su prekybos sąlygomis.",
      benefitsTitle: "Ką siūlome",
      benefit1: "Partnerių kainos ir laipsniškos nuolaidos pagal apyvartą",
      benefit2: "Pavyzdžiai, katalogai ir salono medžiaga",
      benefit3: "Pristatymas visoje Lietuvoje ir gamintojo garantija",
      benefit4: "Techninės konsultacijos ir pagalba matavimuose",
      formTitle: "Partnerio paraiška",
      company: "Įmonė",
      person: "Kontaktinis asmuo",
      phone: "Telefonas",
      email: "El. paštas",
      city: "Miestas / regionas",
      website: "Svetainė (nebūtina)",
      activity: "Veiklos sritis",
      activitySalon: "Durų salonas / prekyba",
      activityInstaller: "Montavimas",
      activityBuilder: "Statybos bendrovė",
      activityDesigner: "Architektas / dizaineris",
      activityOther: "Kita",
      message: "Komentaras",
      messagePlaceholder: "Trumpai apie savo veiklą ir planuojamus kiekius",
      consent: "Sutinku, kad mano duomenys būtų tvarkomi paraiškai nagrinėti.",
      submit: "Siųsti paraišką",
      sending: "Siunčiama...",
      thanks: "Ačiū! Paraiška gauta — susisieksime per 1–2 darbo dienas.",
      error: "Nepavyko išsiųsti. Bandykite dar kartą arba rašykite el. paštu.",
    },
  },
  lv: {
    nav: {
      news: "Jaunumi",
      exteriorApartment: "Ārdurvis dzīvoklim",
      exteriorHouse: "Ārdurvis privātmājai",
      interior: "Iekšdurvis",
      hidden: "Slēptās durvis",
      deals: "Akcijas",
      finishes: "Apdare",
      individualSolutions: "Individuālie risinājumi",
      manufacturer1: "Ražotājs - 1",
      manufacturer2: "Ražotājs - 2",
      products: "Produkti",
      about: "Par mums",
      contacts: "Kontakti",
      searchPlaceholder: "Meklēt durvis...",
    },
    categories: {
      "ardurvis-dzivoklim": "Ārdurvis dzīvoklim",
      "ardurvis-privatmajai": "Ārdurvis privātmājai",
      ieksdurvis: "Iekšdurvis",
      "sleptas-durvis": "Slēptās durvis",
      details: {
        "ardurvis-dzivoklim": {
          name: "Ārdurvis dzīvoklim",
          description: "Metāla ārdurvis dzīvokļiem ar skaņas un siltuma izolāciju.",
        },
        "ardurvis-privatmajai": {
          name: "Ārdurvis privātmājai",
          description: "Siltinātas metāla un alumīnija ārdurvis ar termopārrāvumu privātmājām.",
        },
        ieksdurvis: {
          name: "Iekšdurvis",
          description: "Iekšdurvis dzīvojamām telpām dažādās krāsās un faktūrās.",
        },
        "sleptas-durvis": {
          name: "Slēptās durvis",
          description: "Slēptā tipa durvis bez redzamas kārbas.",
        },
      },
    },
    footer: {
      assortment: "Sortiments",
      services: "Pakalpojumi",
      company: "Uzņēmums",
      contacts: "Kontakti",
      measurement: "Uzmērīšana",
      installation: "Montāža",
      warranty: "Garantija",
      delivery: "Piegāde",
      phone: "Tālrunis",
      email: "E-pasts",
      showroom: "Salons",
      hours: "Darba laiks",
      rights: "Visas tiesības aizsargātas.",
    },
    common: {
      home: "Sākums",
    },
    home: {
      popularCategories: "Populārās kategorijas",
      newArrivals: "Jaunumi",
      popularExterior: "Populārākās ārdurvis",
      ctaTitle: "Nezini, kuras durvis izvēlēties? Sazinies ar mums bezmaksas konsultācijai.",
      ctaButton: "Sazināties",
    },
    hero: {
      carouselLabel: "Hero karuselis",
      imageAlt: "Hero attēls",
      noSlides: "Nav slaidu",
      prevSlide: "Iepriekšējais slaids",
      nextSlide: "Nākamais slaids",
      goToSlide: "Dot uz {n}. slaidu",
      chooseDoors: "Izvēlies durvis",
      partnership: "Sadarbība",
    },
    search: {
      title: "Meklēšana",
      results: "Meklēšanas rezultāti",
      found: "atrasti",
      nothingFound: "Nekas netika atrasts.",
      backHome: "Atpakaļ uz sākumu",
    },
    specs: {
      leafThickness: "Vērtnes biezums",
      frameThickness: "Kārbas biezums",
      weight: "Svars",
      locks: "Slēdzenes",
      filling: "Pildījums",
      outsideFinish: "Ārējā apdare",
      insideFinish: "Iekšējā apdare",
      finish: "Apdare",
      peephole: "Actiņa",
      hardware: "Furnitūra",
    },
    values: {
      yes: "Ir",
      no: "Nav",
    },
    pages: {
      manufacturer2: {
        title: "Ražotājs - 2",
        description:
          "Durvju dizaina sērijas, plēves krāsas un pulverkrāsojums no Bulat ražotnes (Čerņihiva).",
      },
      deals: {
        title: "Akcijas",
        description:
          "Šeit atradīsi durvju modeļus ar īpašām atlaidēm. Piedāvājumi spēkā uz ierobežotu laiku vai līdz preču izpirkšanai.",
      },
      news: {
        title: "Jaunumi",
        description: "Jaunākie durvju modeļi mūsu sortimentā — iepazīsti svaigākās kolekcijas un dizainus.",
      },
      about: {
        title: "Par mums",
        intro1:
          "Mēs piedāvājam kvalitatīvas metāla ārdurvis un iekšdurvis ar piegādi un profesionālu montāžu visā Lietuvā.",
        intro2:
          "Sortimentā vairāk nekā 400 modeļu dažādu stilu un krāsu izvēlē. Palīdzēsim atrast piemērotāko risinājumu jūsu mājoklim.",
        intro3:
          "Aicinām apmeklēt mūsu salonu, kur durvis var apskatīt un salīdzināt klātienē, kā arī saņemt speciālista konsultāciju.",
        cta: "Sazināties",
        featuresTitle1: "Plašs sortiments",
        featuresDesc1: "Vairāk nekā 400 durvju modeļi dažādām gaumēm un budžetiem.",
        featuresTitle2: "Profesionāla montāža",
        featuresDesc2: "Sertificēti meistari nodrošina kvalitatīvu uzstādīšanu.",
        featuresTitle3: "Garantija",
        featuresDesc3: "Ražotāja un montāžas garantija drošam rezultātam.",
        featuresTitle4: "Bezmaksas konsultācija",
        featuresDesc4: "Palīdzēsim izvēlēties optimālu risinājumu jūsu vajadzībām.",
      },
      services: {
        title: "Pakalpojumi",
        description: "Uzmērīšana, montāža, garantija un piegāde — detalizēta informācija tiks pievienota vēlāk.",
      },
    },
    header: {
      promo: "Bezmaksas konsultācija un uzmērīšana · Piegāde visā Lietuvā",
    },
    a11y: {
      search: "Meklēt",
      close: "Aizvērt",
      language: "Valoda {code}",
      addWishlist: "Pievienot vēlmēm",
    },
    cart: {
      title: "Grozs",
      description: "Jūsu izvēlētie produkti parādīsies šeit. Funkcija tiks pievienota vēlāk.",
    },
    wishlist: {
      title: "Vēlmes",
      description: "Jūsu iecienītie modeļi parādīsies šeit. Funkcija tiks pievienota vēlāk.",
      empty: "Vēlmju saraksts ir tukšs.",
    },
    loading: {
      search: "Ielādē meklēšanas rezultātus…",
      contacts: "Ielādē kontaktu lapu…",
    },
    category: {
      collection: "Kolekcija",
      color: "Krāsa",
      price: "Cena",
      from: "No",
      to: "Līdz",
      thermo: "Termo pārrāvums",
      all: "Visi",
      yes: "Jā",
      no: "Nē",
      clearFilters: "Notīrīt filtrus",
      sort: "Kārtot:",
      filters: "Filtri",
      close: "Aizvērt",
      models: "modeļi",
      sortPopular: "Populārākie",
      sortCheap: "Lētākie vispirms",
      sortExpensive: "Dārgākie vispirms",
      sortNew: "Jaunumi",
            size: "Izmērs",
      features: "Īpašības",
      glass: "Ar stiklu",
      newOnly: "Jaunums",
      offerOnly: "Akcija",
      activeFilters: "Izvēlētie filtri",
      nothingFound: "Pēc izvēlētajiem filtriem nekas nav atrasts.",
      notFound: "Kategorija nav atrasta",
    },
    product: {
      notFound: "Produkts nav atrasts",
      image: "Attēls",
      imageN: "Attēls {n}",
      openImage: "Atvērt attēlu pilnā izmērā",
      colorLabel: "Krāsa (ārpuse / iekšpuse):",
      size: "Izmērs:",
      requestOffer: "Pieprasīt piedāvājumu",
      addWishlist: "Pievienot vēlmēm",
      freeServices: "Bezmaksas uzmērīšana · Montāža · Piegāde visā Lietuvā",
      specs: "Specifikācija",
      finishMaterial: "Ārējās apdares materiāls",
      set: "Komplektācija",
      installDelivery: "Montāža un piegāde",
      warranty: "Garantija",
      similar: "Līdzīgi modeļi",
      previous: "Iepriekšējais",
      next: "Nākamais",
      close: "Aizvērt",
      offerBadge: "Piedāvājums",
      newBadge: "Jaunums",
      inStock: "Ir noliktavā",
      inStockFactory: "Ražotāja noliktavā",
      tabDescription: "Apraksts",
      tabSpecs: "Raksturojums",
    },
    contacts: {
      title: "Kontakti",
      relatedToProduct: "Pieteikums saistīts ar produktu:",
      prefill: "Vēlos piedāvājumu par modeli:",
      contactUs: "Sazinies ar mums",
      phone: "Tālrunis",
      email: "E-pasts",
      showroom: "Salons",
      hours: "Darba laiks",
      formName: "Vārds",
      formPhone: "Tālrunis",
      formEmail: "E-pasts",
      formMessage: "Ziņojums",
      formPlaceholder: "Jūsu jautājums vai pieprasījums",
      submit: "Nosūtīt",
      sending: "Sūta...",
      thanks: "Paldies! Sazināsimies tuvākajā laikā.",
      error: "Neizdevās nosūtīt. Lūdzu, mēģiniet vēlreiz vai rakstiet uz e-pastu.",
      mapTitle: "TN Baltic — karte",
    },
    finishes: {
      title: "Apdare un dizains",
      lead:
        "Frēzējuma raksti, dekoratīvie elementi un visas krāsu paletes, no kurām veido durvju izskatu. Katru rakstu var kombinēt ar jebkuru krāsu.",
      itemsCount: "varianti",
      openImage: "Palielināt",
      close: "Aizvērt",
      note: "Krāsu toņi ekrānā var atšķirties no reālajiem. Paraugiem vērsieties salonā.",
    },
    partners: {
      title: "Sadarbība",
      lead: "Meklējam partnerus Latvijā un ārpus tās — salonus, montētājus, būvfirmas un projektētājus. Aizpildi pieteikumu, un sazināsimies ar sadarbības nosacījumiem.",
      benefitsTitle: "Ko piedāvājam",
      benefit1: "Partneru cenas un atlaides atkarībā no apgrozījuma",
      benefit2: "Paraugi, katalogi un materiāli salonam",
      benefit3: "Piegāde visā valstī un ražotāja garantija",
      benefit4: "Tehniskās konsultācijas un atbalsts uzmērīšanā",
      formTitle: "Sadarbības pieteikums",
      company: "Uzņēmums",
      person: "Kontaktpersona",
      phone: "Tālrunis",
      email: "E-pasts",
      city: "Pilsēta / reģions",
      website: "Mājaslapa (nav obligāti)",
      activity: "Darbības joma",
      activitySalon: "Durvju salons / tirdzniecība",
      activityInstaller: "Montāža",
      activityBuilder: "Būvniecības uzņēmums",
      activityDesigner: "Arhitekts / dizainers",
      activityOther: "Cits",
      message: "Komentārs",
      messagePlaceholder: "Īsi par savu darbību un plānotajiem apjomiem",
      consent: "Piekrītu savu datu apstrādei pieteikuma izskatīšanai.",
      submit: "Nosūtīt pieteikumu",
      sending: "Sūta...",
      thanks: "Paldies! Pieteikums saņemts — sazināsimies 1–2 darba dienu laikā.",
      error: "Neizdevās nosūtīt. Lūdzu, mēģiniet vēlreiz vai rakstiet uz e-pastu.",
    },
  },
  en: {
    nav: {
      news: "News",
      exteriorApartment: "Apartment Entrance Doors",
      exteriorHouse: "House Entrance Doors",
      interior: "Interior Doors",
      hidden: "Hidden Doors",
      deals: "Deals",
      finishes: "Finishes",
      individualSolutions: "Individual solutions",
      manufacturer1: "Manufacturer - 1",
      manufacturer2: "Manufacturer - 2",
      products: "Products",
      about: "About",
      contacts: "Contacts",
      searchPlaceholder: "Search doors...",
    },
    categories: {
      "ardurvis-dzivoklim": "Apartment Entrance Doors",
      "ardurvis-privatmajai": "House Entrance Doors",
      ieksdurvis: "Interior Doors",
      "sleptas-durvis": "Hidden Doors",
      details: {
        "ardurvis-dzivoklim": {
          name: "Apartment entrance doors",
          description: "Metal entrance doors for apartments with sound and thermal insulation.",
        },
        "ardurvis-privatmajai": {
          name: "House entrance doors",
          description: "Insulated metal and aluminum entrance doors with thermal break for houses.",
        },
        ieksdurvis: {
          name: "Interior doors",
          description: "Interior doors for living spaces in various colors and finishes.",
        },
        "sleptas-durvis": {
          name: "Hidden doors",
          description: "Hidden-type doors with no visible frame.",
        },
      },
    },
    footer: {
      assortment: "Assortment",
      services: "Services",
      company: "Company",
      contacts: "Contacts",
      measurement: "Measurement",
      installation: "Installation",
      warranty: "Warranty",
      delivery: "Delivery",
      phone: "Phone",
      email: "Email",
      showroom: "Address",
      hours: "Working hours",
      rights: "All rights reserved.",
    },
    common: {
      home: "Home",
    },
    home: {
      popularCategories: "Popular categories",
      newArrivals: "New arrivals",
      popularExterior: "Most popular exterior doors",
      ctaTitle: "Not sure which doors to choose? Contact us for a free consultation.",
      ctaButton: "Contact us",
    },
    hero: {
      carouselLabel: "Hero carousel",
      imageAlt: "Hero image",
      noSlides: "No slides",
      prevSlide: "Previous slide",
      nextSlide: "Next slide",
      goToSlide: "Go to slide {n}",
      chooseDoors: "Choose doors",
      partnership: "Partnership",
    },
    search: {
      title: "Search",
      results: "Search results",
      found: "found",
      nothingFound: "Nothing was found.",
      backHome: "Back to home",
    },
    specs: {
      leafThickness: "Leaf thickness",
      frameThickness: "Frame thickness",
      weight: "Weight",
      locks: "Locks",
      filling: "Filling",
      outsideFinish: "Outside finish",
      insideFinish: "Inside finish",
      finish: "Finish",
      peephole: "Peephole",
      hardware: "Hardware",
    },
    values: {
      yes: "Yes",
      no: "No",
    },
    pages: {
      manufacturer2: {
        title: "Manufacturer - 2",
        description:
          "Door design series, film colours and powder coating from the Bulat factory (Chernihiv).",
      },
      deals: {
        title: "Deals",
        description:
          "Here you'll find door models with special discounts. Offers are valid for a limited time or while stock lasts.",
      },
      news: {
        title: "News",
        description: "The newest door models in our assortment — explore the latest collections and designs.",
      },
      about: {
        title: "About",
        intro1:
          "We offer quality exterior and interior doors with delivery and professional installation across Lithuania.",
        intro2:
          "Our assortment includes many models in various styles and finishes. We'll help you find the best solution for your home.",
        intro3: "Visit our showroom to see and compare models in person and get expert advice.",
        cta: "Contact us",
        featuresTitle1: "Wide assortment",
        featuresDesc1: "Many door models for different styles and budgets.",
        featuresTitle2: "Professional installation",
        featuresDesc2: "Certified installers ensure quality installation.",
        featuresTitle3: "Warranty",
        featuresDesc3: "Manufacturer and installation warranty for peace of mind.",
        featuresTitle4: "Free consultation",
        featuresDesc4: "We'll help you choose the optimal solution for your needs.",
      },
      services: {
        title: "Services",
        description: "Measurement, installation, warranty and delivery — detailed information will be added later.",
      },
    },
    header: {
      promo: "Free consultation and measurement · Delivery across Lithuania",
    },
    a11y: {
      search: "Search",
      close: "Close",
      language: "Language {code}",
      addWishlist: "Add to wishlist",
    },
    cart: {
      title: "Cart",
      description: "Your selected products will appear here. This feature will be added later.",
    },
    wishlist: {
      title: "Wishlist",
      description: "Your favorite models will appear here. This feature will be added later.",
      empty: "Your wishlist is empty.",
    },
    loading: {
      search: "Loading search results…",
      contacts: "Loading contacts…",
    },
    category: {
      collection: "Collection",
      color: "Color",
      price: "Price",
      from: "From",
      to: "To",
      thermo: "Thermal break",
      all: "All",
      yes: "Yes",
      no: "No",
      clearFilters: "Clear filters",
      sort: "Sort:",
      filters: "Filters",
      close: "Close",
      models: "models",
      sortPopular: "Most popular",
      sortCheap: "Cheapest first",
      sortExpensive: "Most expensive first",
      sortNew: "New",
            size: "Size",
      features: "Features",
      glass: "With glass",
      newOnly: "New",
      offerOnly: "Offer",
      activeFilters: "Active filters",
      nothingFound: "Nothing matches the selected filters.",
      notFound: "Category not found",
    },
    product: {
      notFound: "Product not found",
      image: "Image",
      imageN: "Image {n}",
      openImage: "Open full-size image",
      colorLabel: "Color (outside / inside):",
      size: "Size:",
      requestOffer: "Request an offer",
      addWishlist: "Add to wishlist",
      freeServices: "Free measurement · Installation · Delivery across Lithuania",
      specs: "Specification",
      finishMaterial: "Exterior finish material",
      set: "Set",
      installDelivery: "Installation and delivery",
      warranty: "Warranty",
      similar: "Similar models",
      previous: "Previous",
      next: "Next",
      close: "Close",
      offerBadge: "Offer",
      newBadge: "New",
      inStock: "In stock",
      inStockFactory: "In manufacturer's warehouse",
      tabDescription: "Description",
      tabSpecs: "Specifications",
    },
    contacts: {
      title: "Contacts",
      relatedToProduct: "Request related to product:",
      prefill: "I would like an offer for the model:",
      contactUs: "Contact us",
      phone: "Phone",
      email: "Email",
      showroom: "Address",
      hours: "Working hours",
      formName: "Name",
      formPhone: "Phone",
      formEmail: "Email",
      formMessage: "Message",
      formPlaceholder: "Your question or request",
      submit: "Send",
      sending: "Sending...",
      thanks: "Thank you! We'll get back to you soon.",
      error: "Couldn't send your message. Please try again or email us directly.",
      mapTitle: "TN Baltic — map",
    },
    finishes: {
      title: "Finishes and design",
      lead:
        "Milling patterns, decorative elements and every colour palette the doors are built from. Any pattern can be combined with any colour.",
      itemsCount: "options",
      openImage: "Enlarge",
      close: "Close",
      note: "On-screen colours may differ from the real finish. Ask the showroom for samples.",
    },
    partners: {
      title: "Partnership",
      lead: "We are looking for partners at home and abroad — showrooms, installers, construction companies and designers. Fill in the application and we will get back to you with trade terms.",
      benefitsTitle: "What we offer",
      benefit1: "Partner pricing and volume-based discounts",
      benefit2: "Samples, catalogues and showroom materials",
      benefit3: "Nationwide delivery and a manufacturer warranty",
      benefit4: "Technical consultation and measuring support",
      formTitle: "Partner application",
      company: "Company",
      person: "Contact person",
      phone: "Phone",
      email: "Email",
      city: "City / region",
      website: "Website (optional)",
      activity: "Field of activity",
      activitySalon: "Door showroom / retail",
      activityInstaller: "Installation",
      activityBuilder: "Construction company",
      activityDesigner: "Architect / designer",
      activityOther: "Other",
      message: "Comment",
      messagePlaceholder: "A few words about your business and expected volumes",
      consent: "I agree to my data being processed to review this application.",
      submit: "Send application",
      sending: "Sending...",
      thanks: "Thank you! We received your application and will reply within 1–2 business days.",
      error: "Couldn't send your application. Please try again or email us directly.",
    },
  },
};

export function t(locale, keyPath) {
  const lang = messages[locale] ? locale : defaultLocale;
  const parts = keyPath.split(".");
  let cur = messages[lang];
  for (const p of parts) {
    cur = cur?.[p];
    if (cur == null) return keyPath;
  }
  return typeof cur === "string" ? cur : keyPath;
}

/* Catalogue data — product names, blurbs, specification rows, description
   paragraphs, finish labels — is stored in Latvian and translated through a
   per-locale dictionary keyed by the source string (see @/data/translations).
   Anything the dictionary does not cover falls back to the source, so a new
   model shows up in Latvian rather than not at all. */
export function trData(locale, value) {
  if (typeof value !== "string") return value;
  if (locale === "lv") return value;
  return catalogTranslations[locale]?.[value] ?? value;
}

/* The same, for a [label, value] specification row. */
export function trRow(locale, row) {
  return [trData(locale, row?.[0]), trData(locale, row?.[1])];
}

export function translateColorLabel(locale, value) {
  if (locale === "lv") return String(value);

  /* Colours the dictionary knows in full read better than the token-by-token
     pass below ("Ārpusē: balts satīns" → "Išorėje: baltas satinas"), so try it
     first and only fall back to per-word substitution. */
  const known = catalogTranslations[locale]?.[String(value)];
  if (known) return known;

  const tokenMaps = {
    en: {
      antracīts: "anthracite",
      antracits: "anthracite",
      balts: "white",
      melns: "black",
      mats: "matte",
      supermats: "super matte",
      dienvidu: "southern",
      betons: "concrete",
      oksīds: "oxide",
      oksids: "oxide",
      tumšs: "dark",
      tums: "dark",
      koks: "wood",
      ozols: "oak",
      tabakas: "tobacco",
      sudraba: "silver",
      sudrabots: "silver",
      horizontāls: "horizontal",
      horizontal: "horizontal",
      pelēks: "grey",
      peleks: "grey",
      zelta: "gold",
      priede: "pine",
      provanss: "provence",
      tīka: "teak",
      tika: "teak",
      sonomas: "sonoma",
      sagrēns: "textured",
      sagrēns: "textured",
    },
    lt: {
      antracīts: "antracitas",
      antracits: "antracitas",
      balts: "balta",
      melns: "juoda",
      mats: "matinis",
      supermats: "super matinis",
      dienvidu: "pietų",
      betons: "betonas",
      oksīds: "oksidas",
      oksids: "oksidas",
      tumšs: "tamsus",
      tums: "tamsus",
      koks: "mediena",
      ozols: "ąžuolas",
      tabakas: "tabako",
      sudraba: "sidabro",
      sudrabots: "sidabrinis",
      horizontāls: "horizontalus",
      horizontal: "horizontalus",
      pelēks: "pilkas",
      peleks: "pilkas",
      zelta: "auksinis",
      priede: "pušis",
      provanss: "provansas",
      tīka: "tikas",
      tika: "tikas",
      sonomas: "sonomos",
      sagrēns: "faktūrinė",
      sagrēns: "faktūrinė",
    },
  };

  const map = locale === "en" ? tokenMaps.en : tokenMaps.lt;
  const parts = String(value).split(" ");

  const translated = parts.map((p) => {
    const lower = p.toLowerCase();
    if (lower.startsWith("ral")) return p.toUpperCase();
    const next = map[lower];
    if (!next) return p;
    const isCapitalized = p[0] === p[0]?.toUpperCase();
    return isCapitalized ? `${next[0].toUpperCase()}${next.slice(1)}` : next;
  });

  return translated.join(" ");
}
