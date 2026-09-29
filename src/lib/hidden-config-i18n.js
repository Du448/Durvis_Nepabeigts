/* Hidden-door configurator copy in the site's three languages, plus the
   helpers that turn a config / price line into readable text for the
   product page, cart, checkout, offer form and order e-mail. */

import { DROP_SEALS } from "@/data/hidden-door-options";
import { hiddenSpec, hiddenSizes, normalizeHidden, priceHidden } from "@/lib/hidden-config";

const DICT = {
  lv: {
    title: "Konfigurators",
    introOrder: "Izmērs ar 5 mm soli, krāsa, izpilde un aksesuāri — cena pārrēķinās uzreiz.",
    introStock: "Noliktavas durvīm izvēlieties izmēru, eņģu pusi un montāžas aksesuārus.",
    stepSize: "Vērtnes izmērs",
    stepHinges: "Eņģes",
    stepColor: "Rāmja un malas krāsa",
    stepBuild: "Izpilde",
    stepAccessories: "Aksesuāri un montāža",
    next: "Tālāk",
    sizeStd: "Standarta izmērs",
    sizeCustom: "Cits izmērs",
    width: "Vērtnes platums",
    height: "Vērtnes augstums",
    range: "{min}–{max} mm",
    sizeStepNote: "Uz pasūtījumu vērtni izgatavo ar 5 mm soli, līdz {w} mm platumā un {h} mm augstumā.",
    sizeMin: "Mazākus izmērus aprēķinām pēc pieprasījuma.",
    size40Max: "40 mm vērtnei maksimālais augstums 2300 mm — augstākām durvīm izvēlieties 52 mm reverso modeli.",
    sizeStockOnly: "Noliktavas durvis ir tikai standarta izmēros. Citu izmēru var pasūtīt modelim «uz pasūtījumu».",
    surchargeNone: "Standarta cena",
    surchargeW: "nestandarta platums +{pct}%",
    surchargeH: "augstums +{pct}%",
    frameSize: "Kārba",
    openingSize: "Ieteicamā aile",
    hingeSide: "Eņģu puse",
    hingeLeft: "Kreisās",
    hingeRight: "Labās",
    hingeSideHint40: "40 mm vērtne veras uz ārpusi — eņģu pusi nosakām, skatoties no tās puses, uz kuru durvis veras.",
    hingeSideHint52: "52 mm reversā vērtne veras uz telpas iekšpusi — eņģu pusi nosakām, skatoties no tās puses, uz kuru durvis veras.",
    hingeCount: "Eņģu skaits",
    hingeCountHint: "Komplektā 2 slēptās eņģes Otlav Invisacta IN300. Šim izmēram nepieciešamas {req}, ražotājs iesaka {rec}. Katra papildu eņģe ar frēzējumu — 59 €.",
    hingesN: "{n} eņģes",
    recommended: "ieteicams",
    hingesStock: "2 slēptās eņģes Otlav Invisacta IN300 (iekļautas).",
    frameColor: "Alumīnija rāmis",
    edgeColor: "Vērtnes alumīnija mala",
    black: "Melns",
    ral: "Pēc RAL",
    ralCode: "RAL kods",
    ralHint: "Krāsojums pēc RAL kataloga +30 € rāmim un +30 € vērtnes malai.",
    ralMissing: "Norādiet RAL kodu — to precizēsim pirms ražošanas.",
    ralOtherModels: "RAL krāsojums pieejams modeļiem ar melnu rāmi un melnu malu.",
    noTopFrame: "Bez augšējās kārbas daļas",
    noTopFrameHint: "Durvīm līdz griestiem — +10% pie komplekta summas.",
    thinLeaf: "Vērtne ar samazinātu biezumu",
    thinLeafHint: "Ja sienas apmetums vai apdare ir biezāka, vērtni izgatavo plānāku.",
    mirror: "Spogulis uz vērtnes",
    mirrorNone: "Bez spoguļa",
    mirror_silver: "Spogulis",
    mirror_graphite: "Grafīta spogulis",
    mirror_bronze: "Bronzas spogulis",
    perM2: "{p} €/m²",
    mirrorArea: "Vērtnes laukums {a} m²",
    drilling: "Urbumi vērtnē",
    handleHole: "Urbums rokturim",
    cylinderHole: "Urbums cilindram / aizgriežnim",
    cylNone: "Nav",
    cyl_pz: "PZ cilindrs",
    cyl_wc: "WC aizgrieznis",
    closer: "Slēptais pievilcējs GEZE Boxer",
    closerHint: "285 € + iegriešana 40 €",
    activeStop: "Iegriešana ActiveStop",
    activeStopHint: "46 €; paša ActiveStop cenu precizēsim.",
    dropSeal: "Krītošais slieksnis CCE (Itālija)",
    dropSealNone: "Bez krītošā sliekšņa",
    dropSealLen: "{len} mm — {p} € + iegriešana 25 €",
    dropSealNA: "šim platumam nav piemērota garuma",
    stopper: "Durvju atdure NF Stopio Indoor",
    stopperHint: "22 € + iegriešana 10 €",
    stopperNone: "Bez atdures",
    color_black: "Melna",
    color_bronze: "Bronza",
    color_chrome: "Matēts hroms",
    reinforcement: "Kārbas pastiprinošais montāžas komplekts",
    spacers: "Starpliku izgatavošana",
    perFrame: "{p} € komplektam",
    orderOnly: "Spogulis, pievilcējs, krītošais slieksnis un nestandarta izmērs pieejami durvīm uz pasūtījumu.",
    summary: "Jūsu konfigurācija",
    total: "Kopā",
    requestItems: "Precizēsim pēc pieprasījuma",
    req_activeStopDevice: "ActiveStop mehānisma cena",
    req_ralFrameCode: "rāmja RAL kods",
    req_ralEdgeCode: "malas RAL kods",
    noteRebate: "Virs 2300 mm vērtni izgatavo tikai 52 mm biezumā ar pārfalci.",
    noteNoTopFrame: "Bez augšējās kārbas daļas — kārbas augstumu precizēsim pēc ailes uzmērīšanas.",
    previewLabel: "Vērtne {w} × {h} mm",
    lineDoor: "Slēptās durvis, vērtne {w} × {h} mm",
    lineHeight: "Nestandarta augstums {h} mm +{pct}%",
    lineWidth: "Nestandarta platums {w} mm +{pct}%",
    lineHinges: "Papildu eņģes {n} × 59 €",
    lineRalFrame: "Rāmis pēc RAL{ral}",
    lineRalEdge: "Vērtnes mala pēc RAL{ral}",
    lineNoTopFrame: "Bez augšējās kārbas daļas +{pct}%",
    lineThinLeaf: "Vērtne ar samazinātu biezumu",
    lineMirror: "{kind} {a} m² × {r} €",
    lineCloser: "GEZE Boxer pievilcējs + iegriešana",
    lineActiveStop: "ActiveStop iegriešana",
    lineDropSeal: "{kind} {len} mm + iegriešana",
    lineStopper: "Atdure NF Stopio ({color}) + iegriešana",
    lineHandleHole: "Urbums rokturim",
    lineCylinderHole: "Urbums: {kind}",
    lineReinforcement: "Kārbas pastiprinošais komplekts",
    lineSpacers: "Starplikas",
    dSize: "Vērtne",
    dFrame: "Kārba / aile",
    dHinges: "Eņģes",
    dColor: "Krāsa",
    dBuild: "Izpilde",
    dDrilling: "Urbumi",
    dAccessories: "Aksesuāri",
    frameShort: "rāmis",
    edgeShort: "mala",
  },
  lt: {
    title: "Konfigūratorius",
    introOrder: "Dydis 5 mm žingsniu, spalva, išpildymas ir priedai — kaina perskaičiuojama iš karto.",
    introStock: "Sandėlio durims pasirinkite dydį, vyrių pusę ir montavimo priedus.",
    stepSize: "Varčios dydis",
    stepHinges: "Vyriai",
    stepColor: "Rėmo ir krašto spalva",
    stepBuild: "Išpildymas",
    stepAccessories: "Priedai ir montavimas",
    next: "Toliau",
    sizeStd: "Standartinis dydis",
    sizeCustom: "Kitas dydis",
    width: "Varčios plotis",
    height: "Varčios aukštis",
    range: "{min}–{max} mm",
    sizeStepNote: "Pagal užsakymą varčia gaminama 5 mm žingsniu, iki {w} mm pločio ir {h} mm aukščio.",
    sizeMin: "Mažesnius dydžius apskaičiuosime pagal užklausą.",
    size40Max: "40 mm varčios didžiausias aukštis 2300 mm — aukštesnėms durims rinkitės 52 mm reversinį modelį.",
    sizeStockOnly: "Sandėlio durys būna tik standartinių dydžių. Kitą dydį galima užsakyti modeliui „pagal užsakymą“.",
    surchargeNone: "Standartinė kaina",
    surchargeW: "nestandartinis plotis +{pct}%",
    surchargeH: "aukštis +{pct}%",
    frameSize: "Stakta",
    openingSize: "Rekomenduojama anga",
    hingeSide: "Vyrių pusė",
    hingeLeft: "Kairės",
    hingeRight: "Dešinės",
    hingeSideHint40: "40 mm varčia atsidaro į išorę — vyrių pusę nustatome žiūrėdami iš tos pusės, į kurią durys atsidaro.",
    hingeSideHint52: "52 mm reversinė varčia atsidaro į patalpos vidų — vyrių pusę nustatome žiūrėdami iš tos pusės, į kurią durys atsidaro.",
    hingeCount: "Vyrių skaičius",
    hingeCountHint: "Komplekte 2 paslėpti Otlav Invisacta IN300 vyriai. Šiam dydžiui reikia {req}, gamintojas rekomenduoja {rec}. Kiekvienas papildomas vyris su frezavimu — 59 €.",
    hingesN: "{n} vyriai",
    recommended: "rekomenduojama",
    hingesStock: "2 paslėpti Otlav Invisacta IN300 vyriai (įskaičiuota).",
    frameColor: "Aliuminio rėmas",
    edgeColor: "Varčios aliuminio kraštas",
    black: "Juodas",
    ral: "Pagal RAL",
    ralCode: "RAL kodas",
    ralHint: "Dažymas pagal RAL katalogą +30 € rėmui ir +30 € varčios kraštui.",
    ralMissing: "Nurodykite RAL kodą — jį patikslinsime prieš gamybą.",
    ralOtherModels: "RAL dažymas galimas modeliams su juodu rėmu ir juodu kraštu.",
    noTopFrame: "Be viršutinės staktos dalies",
    noTopFrameHint: "Durims iki lubų — +10% prie komplekto sumos.",
    thinLeaf: "Plonesnė varčia",
    thinLeafHint: "Jei sienos tinkas ar apdaila storesnė, varčia gaminama plonesnė.",
    mirror: "Veidrodis ant varčios",
    mirrorNone: "Be veidrodžio",
    mirror_silver: "Veidrodis",
    mirror_graphite: "Grafito veidrodis",
    mirror_bronze: "Bronzos veidrodis",
    perM2: "{p} €/m²",
    mirrorArea: "Varčios plotas {a} m²",
    drilling: "Gręžimai varčioje",
    handleHole: "Gręžimas rankenai",
    cylinderHole: "Gręžimas cilindrui / sukliui",
    cylNone: "Nėra",
    cyl_pz: "PZ cilindras",
    cyl_wc: "WC suklys",
    closer: "Paslėptas pritraukėjas GEZE Boxer",
    closerHint: "285 € + įfrezavimas 40 €",
    activeStop: "ActiveStop įfrezavimas",
    activeStopHint: "46 €; paties ActiveStop kainą patikslinsime.",
    dropSeal: "Nuleidžiamas slenkstis CCE (Italija)",
    dropSealNone: "Be nuleidžiamo slenksčio",
    dropSealLen: "{len} mm — {p} € + įfrezavimas 25 €",
    dropSealNA: "šiam pločiui nėra tinkamo ilgio",
    stopper: "Durų stabdiklis NF Stopio Indoor",
    stopperHint: "22 € + įfrezavimas 10 €",
    stopperNone: "Be stabdiklio",
    color_black: "Juodas",
    color_bronze: "Bronza",
    color_chrome: "Matinis chromas",
    reinforcement: "Staktos sutvirtinimo montavimo komplektas",
    spacers: "Tarpinių gamyba",
    perFrame: "{p} € komplektui",
    orderOnly: "Veidrodis, pritraukėjas, nuleidžiamas slenkstis ir nestandartinis dydis galimi durims pagal užsakymą.",
    summary: "Jūsų konfigūracija",
    total: "Iš viso",
    requestItems: "Patikslinsime pagal užklausą",
    req_activeStopDevice: "ActiveStop mechanizmo kaina",
    req_ralFrameCode: "rėmo RAL kodas",
    req_ralEdgeCode: "krašto RAL kodas",
    noteRebate: "Virš 2300 mm varčia gaminama tik 52 mm storio su užlaida.",
    noteNoTopFrame: "Be viršutinės staktos dalies — staktos aukštį patikslinsime išmatavę angą.",
    previewLabel: "Varčia {w} × {h} mm",
    lineDoor: "Paslėptos durys, varčia {w} × {h} mm",
    lineHeight: "Nestandartinis aukštis {h} mm +{pct}%",
    lineWidth: "Nestandartinis plotis {w} mm +{pct}%",
    lineHinges: "Papildomi vyriai {n} × 59 €",
    lineRalFrame: "Rėmas pagal RAL{ral}",
    lineRalEdge: "Varčios kraštas pagal RAL{ral}",
    lineNoTopFrame: "Be viršutinės staktos dalies +{pct}%",
    lineThinLeaf: "Plonesnė varčia",
    lineMirror: "{kind} {a} m² × {r} €",
    lineCloser: "GEZE Boxer pritraukėjas + įfrezavimas",
    lineActiveStop: "ActiveStop įfrezavimas",
    lineDropSeal: "{kind} {len} mm + įfrezavimas",
    lineStopper: "Stabdiklis NF Stopio ({color}) + įfrezavimas",
    lineHandleHole: "Gręžimas rankenai",
    lineCylinderHole: "Gręžimas: {kind}",
    lineReinforcement: "Staktos sutvirtinimo komplektas",
    lineSpacers: "Tarpinės",
    dSize: "Varčia",
    dFrame: "Stakta / anga",
    dHinges: "Vyriai",
    dColor: "Spalva",
    dBuild: "Išpildymas",
    dDrilling: "Gręžimai",
    dAccessories: "Priedai",
    frameShort: "rėmas",
    edgeShort: "kraštas",
  },
  en: {
    title: "Configurator",
    introOrder: "Size in 5 mm steps, colour, build and accessories — the price updates as you go.",
    introStock: "Pick the size, hinge side and fitting accessories for a stock door.",
    stepSize: "Leaf size",
    stepHinges: "Hinges",
    stepColor: "Frame and edge colour",
    stepBuild: "Build",
    stepAccessories: "Accessories and fitting",
    next: "Next",
    sizeStd: "Standard size",
    sizeCustom: "Other size",
    width: "Leaf width",
    height: "Leaf height",
    range: "{min}–{max} mm",
    sizeStepNote: "Made-to-order leaves come in 5 mm steps, up to {w} mm wide and {h} mm high.",
    sizeMin: "Smaller sizes are quoted on request.",
    size40Max: "A 40 mm leaf goes up to 2300 mm — for taller doors choose the 52 mm reversed model.",
    sizeStockOnly: "Stock doors come in standard sizes only. Any other size can be ordered on the made-to-order model.",
    surchargeNone: "Standard price",
    surchargeW: "non-standard width +{pct}%",
    surchargeH: "height +{pct}%",
    frameSize: "Frame",
    openingSize: "Recommended opening",
    hingeSide: "Hinge side",
    hingeLeft: "Left",
    hingeRight: "Right",
    hingeSideHint40: "The 40 mm leaf opens outward — the hinge side is seen from the side the door opens towards.",
    hingeSideHint52: "The 52 mm reversed leaf opens into the room — the hinge side is seen from the side the door opens towards.",
    hingeCount: "Number of hinges",
    hingeCountHint: "The set has 2 Otlav Invisacta IN300 concealed hinges. This size needs {req}; the manufacturer recommends {rec}. Each extra hinge with routing is €59.",
    hingesN: "{n} hinges",
    recommended: "recommended",
    hingesStock: "2 Otlav Invisacta IN300 concealed hinges (included).",
    frameColor: "Aluminium frame",
    edgeColor: "Aluminium leaf edge",
    black: "Black",
    ral: "RAL colour",
    ralCode: "RAL code",
    ralHint: "Painted to a RAL colour: +€30 for the frame and +€30 for the leaf edge.",
    ralMissing: "Enter the RAL code — we'll confirm it before production.",
    ralOtherModels: "RAL colours are available on the models with a black frame and black edge.",
    noTopFrame: "Without the top frame member",
    noTopFrameHint: "For floor-to-ceiling doors — +10% on the set.",
    thinLeaf: "Reduced leaf thickness",
    thinLeafHint: "When the plaster or wall finish is thicker, the leaf is made thinner.",
    mirror: "Mirror on the leaf",
    mirrorNone: "No mirror",
    mirror_silver: "Mirror",
    mirror_graphite: "Graphite mirror",
    mirror_bronze: "Bronze mirror",
    perM2: "€{p}/m²",
    mirrorArea: "Leaf area {a} m²",
    drilling: "Holes in the leaf",
    handleHole: "Hole for a handle",
    cylinderHole: "Hole for a cylinder / thumb-turn",
    cylNone: "None",
    cyl_pz: "PZ cylinder",
    cyl_wc: "WC thumb-turn",
    closer: "GEZE Boxer concealed closer",
    closerHint: "€285 + routing €40",
    activeStop: "ActiveStop routing",
    activeStopHint: "€46; the ActiveStop device itself is quoted separately.",
    dropSeal: "CCE automatic drop seal (Italy)",
    dropSealNone: "No drop seal",
    dropSealLen: "{len} mm — €{p} + routing €25",
    dropSealNA: "no suitable length for this width",
    stopper: "NF Stopio Indoor door stop",
    stopperHint: "€22 + routing €10",
    stopperNone: "No door stop",
    color_black: "Black",
    color_bronze: "Bronze",
    color_chrome: "Matt chrome",
    reinforcement: "Frame reinforcing mounting kit",
    spacers: "Spacers",
    perFrame: "€{p} per frame",
    orderOnly: "Mirrors, closers, drop seals and non-standard sizes are available on made-to-order doors.",
    summary: "Your configuration",
    total: "Total",
    requestItems: "To be confirmed on request",
    req_activeStopDevice: "ActiveStop device price",
    req_ralFrameCode: "frame RAL code",
    req_ralEdgeCode: "edge RAL code",
    noteRebate: "Above 2300 mm the leaf is made 52 mm thick with a rebate only.",
    noteNoTopFrame: "Without the top frame member — the frame height is confirmed after measuring the opening.",
    previewLabel: "Leaf {w} × {h} mm",
    lineDoor: "Hidden door, leaf {w} × {h} mm",
    lineHeight: "Non-standard height {h} mm +{pct}%",
    lineWidth: "Non-standard width {w} mm +{pct}%",
    lineHinges: "Extra hinges {n} × €59",
    lineRalFrame: "Frame in RAL{ral}",
    lineRalEdge: "Leaf edge in RAL{ral}",
    lineNoTopFrame: "Without top frame member +{pct}%",
    lineThinLeaf: "Reduced leaf thickness",
    lineMirror: "{kind} {a} m² × €{r}",
    lineCloser: "GEZE Boxer closer + routing",
    lineActiveStop: "ActiveStop routing",
    lineDropSeal: "{kind} {len} mm + routing",
    lineStopper: "NF Stopio door stop ({color}) + routing",
    lineHandleHole: "Hole for a handle",
    lineCylinderHole: "Hole: {kind}",
    lineReinforcement: "Frame reinforcing kit",
    lineSpacers: "Spacers",
    dSize: "Leaf",
    dFrame: "Frame / opening",
    dHinges: "Hinges",
    dColor: "Colour",
    dBuild: "Build",
    dDrilling: "Holes",
    dAccessories: "Accessories",
    frameShort: "frame",
    edgeShort: "edge",
  },
};

export function ht(locale, key, vars) {
  const s = DICT[locale]?.[key] ?? DICT.lv[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? "")) : s;
}

const ralText = (code) => (code ? ` ${code}` : "");

export function hiddenLineLabel(line, locale) {
  const L = (k, v) => ht(locale, k, v);
  switch (line.id) {
    case "door":
      return L("lineDoor", line);
    case "height":
      return L("lineHeight", line);
    case "width":
      return L("lineWidth", line);
    case "hinges":
      return L("lineHinges", line);
    case "ralFrame":
      return L("lineRalFrame", { ral: ralText(line.ral) });
    case "ralEdge":
      return L("lineRalEdge", { ral: ralText(line.ral) });
    case "noTopFrame":
      return L("lineNoTopFrame", line);
    case "thinLeaf":
      return L("lineThinLeaf");
    case "mirror":
      return L("lineMirror", { kind: L(`mirror_${line.kind}`), a: line.area, r: line.rate });
    case "closer":
      return L("lineCloser");
    case "activeStop":
      return L("lineActiveStop");
    case "dropSeal":
      return L("lineDropSeal", { kind: DROP_SEALS[line.kind]?.label || line.kind, len: line.length });
    case "stopper":
      return L("lineStopper", { color: L(`color_${line.color}`).toLowerCase() });
    case "handleHole":
      return L("lineHandleHole");
    case "cylinderHole":
      return L("lineCylinderHole", { kind: L(`cyl_${line.kind}`) });
    case "reinforcement":
      return L("lineReinforcement");
    case "spacers":
      return L("lineSpacers");
    default:
      return line.id;
  }
}

/* The whole config as [label, value] rows - for cart chips, the checkout
   summary, the offer-form prefill and the order e-mail. */
export function describeHidden(spec, config, locale) {
  const L = (k, v) => ht(locale, k, v);
  const priced = priceHidden(spec, config);
  const c = normalizeHidden(spec, config);
  const { frame, opening } = hiddenSizes(c);
  const rows = [];
  rows.push([L("dSize"), `${c.width} × ${c.height} × ${spec.thickness} mm`]);
  rows.push([L("dFrame"), `${frame.w} × ${frame.h} / ${opening.w} × ${opening.h} mm`]);
  rows.push([L("dHinges"), `${L(c.hinge === "left" ? "hingeLeft" : "hingeRight")}, ${L("hingesN", { n: priced.hinges })}`]);
  if (spec.ral) {
    const part = (label, kind, code) => `${label}: ${kind === "ral" ? `RAL ${code || "?"}` : L("black").toLowerCase()}`;
    rows.push([L("dColor"), [part(L("frameShort"), c.frameColor, c.frameRal), part(L("edgeShort"), c.edgeColor, c.edgeRal)].join(", ")]);
  }
  const build = [
    c.noTopFrame ? L("noTopFrame") : null,
    c.thinLeaf ? L("thinLeaf") : null,
    c.mirror !== "none" ? L(`mirror_${c.mirror}`) : null,
  ].filter(Boolean);
  if (build.length) rows.push([L("dBuild"), build.join(", ")]);
  const holes = [c.handleHole ? L("handleHole") : null, c.cylinderHole !== "none" ? L(`cyl_${c.cylinderHole}`) : null].filter(Boolean);
  if (holes.length) rows.push([L("dDrilling"), holes.join(", ")]);
  const seal = priced.lines.find((l) => l.id === "dropSeal");
  const acc = [
    c.closer ? "GEZE Boxer" : null,
    c.activeStop ? L("activeStop") : null,
    seal ? `${DROP_SEALS[seal.kind].label} ${seal.length} mm` : null,
    c.stopper !== "none" ? `NF Stopio (${L(`color_${c.stopper}`).toLowerCase()})` : null,
    c.reinforcement ? L("reinforcement") : null,
    c.spacers ? L("spacers") : null,
  ].filter(Boolean);
  if (acc.length) rows.push([L("dAccessories"), acc.join(", ")]);
  return rows;
}

// A cart line's hidden-door config as rows - [] for any other line.
export function hiddenRows(product, line, locale) {
  const spec = line?.hidden ? hiddenSpec(product) : null;
  return spec ? describeHidden(spec, line.hidden, locale) : [];
}
