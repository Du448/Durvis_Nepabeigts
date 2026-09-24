/* Service pages under /pakalpojumi/<slug>. Kept deliberately general - no
   prices, terms or durations that the shop has not confirmed. */

export const services = {
  matavimas: {
    lt: {
      title: "Matavimas",
      description: "Nemokama konsultacija ir durų angos matavimas. Specialistas atvyksta, išmatuoja angą ir padeda parinkti tinkamas duris.",
      points: [
        "Specialistas atvyksta į objektą suderintu laiku",
        "Tiksliai išmatuojama durų anga ir įvertinama jos būklė",
        "Patariama dėl modelio, varčios krypties, spynų ir apdailos",
        "Po matavimo parengiamas pasiūlymas",
      ],
    },
    lv: {
      title: "Uzmērīšana",
      description: "Bezmaksas konsultācija un durvju ailes uzmērīšana. Speciālists ierodas, izmēra aili un palīdz izvēlēties piemērotas durvis.",
      points: [
        "Speciālists ierodas objektā saskaņotā laikā",
        "Precīzi izmēra durvju aili un novērtē tās stāvokli",
        "Konsultē par modeli, vēršanās virzienu, slēdzenēm un apdari",
        "Pēc uzmērīšanas sagatavo piedāvājumu",
      ],
    },
    en: {
      title: "Measurement",
      description: "Free consultation and door opening measurement. A specialist visits, measures the opening and helps you choose the right door.",
      points: [
        "A specialist visits at an agreed time",
        "The opening is measured precisely and its condition assessed",
        "Advice on the model, opening direction, locks and finish",
        "A quote is prepared after the measurement",
      ],
    },
  },
  montavimas: {
    lt: {
      title: "Montavimas",
      description: "Profesionalus lauko ir vidaus durų montavimas visoje Lietuvoje, laikantis gamintojo reikalavimų.",
      points: [
        "Senų durų demontavimas ir išvežimas pagal poreikį",
        "Montavimas pagal gamintojo technologiją",
        "Sandarinimas, reguliavimas ir furnitūros patikrinimas",
        "Švarus darbas ir tvarkinga aplinka po montavimo",
      ],
    },
    lv: {
      title: "Montāža",
      description: "Profesionāla ārdurvju un iekšdurvju montāža visā Lietuvā atbilstoši ražotāja prasībām.",
      points: [
        "Veco durvju demontāža un izvešana pēc vajadzības",
        "Montāža atbilstoši ražotāja tehnoloģijai",
        "Blīvēšana, regulēšana un furnitūras pārbaude",
        "Tīrs darbs un sakopta vide pēc montāžas",
      ],
    },
    en: {
      title: "Installation",
      description: "Professional installation of exterior and interior doors across Lithuania, following the manufacturer's requirements.",
      points: [
        "Removal and disposal of old doors on request",
        "Installation to the manufacturer's specification",
        "Sealing, adjustment and hardware check",
        "Clean work and a tidy site afterwards",
      ],
    },
  },
  garantija: {
    lt: {
      title: "Garantija",
      description: "Durims taikoma gamintojo garantija, o mūsų atliktiems darbams - montavimo garantija.",
      points: [
        "Gamintojo garantija durims ir furnitūrai",
        "Montavimo darbų garantija, kai duris montuoja mūsų specialistai",
        "Garantinius klausimus spręskite susisiekę su mumis el. paštu ar telefonu",
        "Išsaugokite pirkimo dokumentus - jie reikalingi garantijai",
      ],
    },
    lv: {
      title: "Garantija",
      description: "Durvīm ir ražotāja garantija, bet mūsu veiktajiem darbiem - montāžas garantija.",
      points: [
        "Ražotāja garantija durvīm un furnitūrai",
        "Montāžas darbu garantija, ja durvis uzstāda mūsu speciālisti",
        "Garantijas jautājumos sazinieties ar mums pa e-pastu vai tālruni",
        "Saglabājiet pirkuma dokumentus - tie nepieciešami garantijai",
      ],
    },
    en: {
      title: "Warranty",
      description: "Doors carry the manufacturer's warranty, and our own installation work carries an installation warranty.",
      points: [
        "Manufacturer's warranty on doors and hardware",
        "Installation warranty when our specialists fit the door",
        "Contact us by email or phone about any warranty issue",
        "Keep your purchase documents - they are needed for warranty claims",
      ],
    },
  },
  pristatymas: {
    lt: {
      title: "Pristatymas",
      description: "Durų pristatymas visoje Lietuvoje. Pristatymo laiką ir sąlygas suderiname iš anksto.",
      points: [
        "Pristatome visoje Lietuvoje",
        "Pristatymo laikas suderinamas iš anksto",
        "Durys gabenamos gamintojo pakuotėje",
        "Galima atsiimti ir patiems iš salono",
      ],
    },
    lv: {
      title: "Piegāde",
      description: "Durvju piegāde visā Lietuvā. Piegādes laiku un nosacījumus saskaņojam iepriekš.",
      points: [
        "Piegādājam visā Lietuvā",
        "Piegādes laiks tiek saskaņots iepriekš",
        "Durvis tiek pārvadātas ražotāja iepakojumā",
        "Iespējams saņemt arī pašiem salonā",
      ],
    },
    en: {
      title: "Delivery",
      description: "Door delivery across Lithuania. Delivery time and terms are agreed in advance.",
      points: [
        "Delivery anywhere in Lithuania",
        "Delivery time agreed in advance",
        "Doors are shipped in the manufacturer's packaging",
        "Self-collection from the showroom is also possible",
      ],
    },
  },
};

export const serviceSlugs = Object.keys(services);

export function getService(slug, locale) {
  const s = services[slug];
  return s ? s[locale] || s.lt : null;
}
