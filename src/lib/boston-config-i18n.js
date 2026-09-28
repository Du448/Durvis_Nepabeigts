/* Configurator copy in the site's three languages, plus the helpers that
   turn a config / price line into readable text for the product page,
   cart, checkout, offer form and order e-mail. */

import {
  BOSTON_PAINT,
  DECOLUX_FULL,
  DECOLUX_INSERTS,
  SLAT_TONES,
  METAL_FINISHES,
  HARDWARE_TYPES,
  GLASS_TINTS,
} from "@/data/boston-config-options";
import { blockSize, bostonSpec, layoutOf, normalize } from "@/lib/boston-config";

const DICT = {
  lv: {
    casingTitle: "Pieliekamās aplodes",
    casingNone: "Bez pieliekamām aplodēm",
    casing_alu: "Alumīnija pieliekamā aplode",
    casing_mono: "Monolīta pieliekamā aplode",
    casing_figured: "Figurēta alumīnija aplode",
    bottomPlate: "Atdure durvju apakšā (plāksne)",
    bottomPlateHint: "Tikai klasiskajiem modeļiem",
    stripSteelNote: "Nerūsējošā tērauda ieliktnis pieejams tikai ar tērauda/hroma furnitūru.",
    grilleShort: "ar režģi",
    lineBottomPlate: "Atdure {m} m × {p} €",
    sizeStepNote: "Nestandarta izmēri — ar 50 mm soli.",
    title: "Konfigurators",
    intro: "Izvēlieties izmēru, apdari un furnitūru — cena pārrēķinās uzreiz.",
    stepSize: "Izmērs un bloka tips",
    stepOpening: "Atvēršanās",
    stepExterior: "Ārpuse",
    stepInterior: "Iekšpuse",
    stepGlass: "Stikla pakete",
    stepHardware: "Furnitūra",
    stepExtras: "Papildu opcijas",
    next: "Tālāk",
    leafSingle: "Vienvērtnes",
    leafSingleHint: "Platums līdz {w} mm, augstums līdz {h} mm",
    leafSingleStdHint: "{w} × {h} mm",
    leafDouble: "Pusotras vērtnes",
    leafDoubleHint: "Aktīvā + sānu vērtne, platums {w1}–{w2} mm, augstums līdz {h} mm",
    leafDoubleStdHint: "Aktīvā + sānu vērtne, {w} × {h} mm",
    sizeCustom: "Cits izmērs",
    width: "Platums",
    height: "Augstums",
    range: "{min}–{max} mm",
    layoutTitle: "Sāngaismas un virsgaisma",
    layout1: "Bez stiklojuma",
    layout2: "Viena sāngaisma",
    layout3: "Divas sāngaismas",
    layout4: "Virsgaisma",
    layout5: "Sāngaisma + virsgaisma",
    layout6: "2 sāngaismas + virsgaisma",
    sideW: "Sāngaismas platums",
    sideWLeft: "Kreisās sāngaismas platums",
    sideWRight: "Labās sāngaismas platums",
    sidePos: "Sāngaisma",
    posLeft: "pa kreisi",
    posRight: "pa labi",
    topH: "Virsgaismas augstums",
    panoTint: "Sāngaismu / virsgaismas stikla tonis",
    panoGrille: "Ar dekoratīvu ielikto režģi",
    blockSize: "Bloka kopējais izmērs: {w} × {h} mm",
    hingeSide: "Eņģu puse (skatoties no ārpuses)",
    hingeLeft: "Kreisās",
    hingeRight: "Labās",
    openDir: "Atvēršanās virziens",
    openOut: "Uz āru",
    openIn: "Uz iekšu",
    openInHint: "Uz iekšu vērāmām durvīm uzstāda Guardian cilindrus (+45 € gab.).",
    openInSmart: "Smart modeļiem atvēršana uz iekšu — pēc pieprasījuma.",
    extPaint: "Vērtnes un kārbas krāsa ārpusē",
    decolux: "Decolux tonis (tikai ārpusē)",
    decoluxNote: "Decolux pārklājums iespējams tikai ārpusē; iekšpusi krāso Boston paletē.",
    slatExt: "Dēlīšu krāsa ārpusē",
    slatInt: "Dēlīšu krāsa iekšpusē",
    slatTones: "Dēlīšu toņi",
    slatPaint: "Boston paletes krāsā",
    insertExt: "Ieliktņa tonis ārpusē",
    insertInt: "Ieliktņa tonis iekšpusē",
    strip: "Dekoratīvās ieliktnes krāsa",
    knocker: "Klauvēklis «Lauva»",
    forging: "Kalumu krāsa",
    intPaint: "Vērtnes un kārbas krāsa iekšpusē",
    sameAsExt: "Kā ārpusē",
    twoTone: "Divkrāsu durvis: ārpuse un iekšpuse var būt dažādās krāsās bez piemaksas.",
    premium: "Premium krāsa +{pct}%",
    lacobel: "Melns Lacobel stikls — iekļauts",
    mirrorInt: "Spogulis iekšpusē — iekļauts",
    glassPick: "Stikla paketes tonis",
    glassFixed: "Stikla pakete šim modelim",
    glassMirror: "spoguļstikls",
    glassGrille: "ar melnu ielikto režģi",
    glassInfo: "Vērtnē — 4 kameru triplekss (ar režģi — 3 kameru).",
    hwType: "Furnitūras komplekts",
    hwColor: "Krāsa",
    hwOnOrder: "uz pasūtījumu",
    hwSmart: "Smart modeļiem komplektācija ir fiksēta: biometriskā slēdzene «CBA» PSL2 ar Face ID, rokturis ar pirkstu nospieduma skeneri un augšējā cilindra slēdzene «CBA» ar termostieni.",
    sizeStdOnly: "Smart modeļi tiek izgatavoti tikai standarta izmēros.",
    hwIncluded: "Komplektā: slēdzeņu sistēma «CBA» KDL-6085 un cilindrs «CBA» ar termostieni.",
    eStrike: "Fuhr elektrosprūds mehāniskā sprūda vietā",
    onRequest: "cena pēc pieprasījuma",
    casings: "Pieliekamās alumīnija aplodes",
    capitalExtend: "Kapitēlija pāri visam blokam",
    perMeter: "{m} m × {p} €/m",
    summary: "Jūsu konfigurācija",
    total: "Kopā",
    requestItems: "Precizēsim pēc pieprasījuma",
    noteCastCasing: "Nestandarta augstums līdz 2200 mm — ar monolītu aplodi.",
    noteTwoK: "Virs 2200 mm durvis izgatavo 2K konstrukcijā, vērtnes biezums 78 mm.",
    noteHinges: "No 2100 mm augstuma pievieno 3. eņģi, no 2250 mm — 4. eņģi (iekļautas cenā).",
    lineDoor: "Durvis {hw}{w} × {h} mm",
    lineDoorDouble: "Pusotras durvis {hw}{w} × {h} mm",
    lineWidth: "Nestandarta platums +{pct}%",
    lineDoubleWidth: "Bloka platums {w} mm +{pct}%",
    lineHeight: "Augstums {h} mm +{pct}%",
    linePremium: "Premium krāsa +{pct}%",
    lineGuardian: "Guardian cilindri {n} × 45 €",
    lineSide: "Sāngaisma {w} × {h} mm ({a} m² × {r} €)",
    lineTop: "Virsgaisma {w} × {h} mm ({a} m² × {r} €)",
    lineCapital: "Kapitēlija {m} m × 60 €",
    lineCasings: "{kind} {m} m × {p} €",
    dType: "Durvju tips",
    dSize: "Izmērs",
    dLayout: "Stiklojums",
    dOpening: "Atvēršana",
    dExt: "Ārpuse",
    dInt: "Iekšpuse",
    dGlass: "Stikls",
    dHw: "Furnitūra",
    dExtras: "Papildus",
    slats: "dēlīši",
    insert: "ieliktnis",
  },
  lt: {
    casingTitle: "Pridedami apvadai",
    casingNone: "Be pridedamų apvadų",
    casing_alu: "Aliuminio pridedamas apvadas",
    casing_mono: "Vientisas pridedamas apvadas",
    casing_figured: "Figūrinis aliuminio apvadas",
    bottomPlate: "Atrama durų apačioje (plokštelė)",
    bottomPlateHint: "Tik klasikiniams modeliams",
    stripSteelNote: "Nerūdijančio plieno intarpas galimas tik su plieno/chromo furnitūra.",
    grilleShort: "su grotelėmis",
    lineBottomPlate: "Atrama {m} m × {p} €",
    sizeStepNote: "Nestandartiniai dydžiai — 50 mm žingsniu.",
    title: "Konfigūratorius",
    intro: "Pasirinkite dydį, apdailą ir furnitūrą — kaina perskaičiuojama iš karto.",
    stepSize: "Dydis ir bloko tipas",
    stepOpening: "Atidarymas",
    stepExterior: "Išorė",
    stepInterior: "Vidus",
    stepGlass: "Stiklo paketas",
    stepHardware: "Furnitūra",
    stepExtras: "Papildomos parinktys",
    next: "Toliau",
    leafSingle: "Vienvėrės",
    leafSingleHint: "Plotis iki {w} mm, aukštis iki {h} mm",
    leafSingleStdHint: "{w} × {h} mm",
    leafDoubleStdHint: "Aktyvioji + šoninė varčia, {w} × {h} mm",
    leafDouble: "Pusantrų varčių",
    leafDoubleHint: "Aktyvioji + šoninė varčia, plotis {w1}–{w2} mm, aukštis iki {h} mm",
    sizeCustom: "Kitas dydis",
    width: "Plotis",
    height: "Aukštis",
    range: "{min}–{max} mm",
    layoutTitle: "Šoniniai ir viršutinis stiklinimas",
    layout1: "Be stiklinimo",
    layout2: "Vienas šoninis",
    layout3: "Du šoniniai",
    layout4: "Viršutinis",
    layout5: "Šoninis + viršutinis",
    layout6: "2 šoniniai + viršutinis",
    sideW: "Šoninio stiklinimo plotis",
    sideWLeft: "Kairiojo šoninio plotis",
    sideWRight: "Dešiniojo šoninio plotis",
    sidePos: "Šoninis stiklinimas",
    posLeft: "kairėje",
    posRight: "dešinėje",
    topH: "Viršutinio stiklinimo aukštis",
    panoTint: "Šoninio / viršutinio stiklo tonas",
    panoGrille: "Su dekoratyvinėmis įstatomomis grotelėmis",
    blockSize: "Bendras bloko dydis: {w} × {h} mm",
    hingeSide: "Vyrių pusė (žiūrint iš lauko)",
    hingeLeft: "Kairės",
    hingeRight: "Dešinės",
    openDir: "Atidarymo kryptis",
    openOut: "Į lauką",
    openIn: "Į vidų",
    openInHint: "Į vidų atsidarančioms durims montuojami Guardian cilindrai (+45 € vnt.).",
    openInSmart: "Smart modeliams atidarymas į vidų — pagal užklausą.",
    extPaint: "Varčios ir staktos spalva išorėje",
    decolux: "Decolux tonas (tik išorėje)",
    decoluxNote: "Decolux danga galima tik išorėje; vidus dažomas Boston paletės spalva.",
    slatExt: "Juostelių spalva išorėje",
    slatInt: "Juostelių spalva viduje",
    slatTones: "Juostelių tonai",
    slatPaint: "Boston paletės spalva",
    insertExt: "Intarpo tonas išorėje",
    insertInt: "Intarpo tonas viduje",
    strip: "Dekoratyvinio intarpo spalva",
    knocker: "Beldiklis «Liūtas»",
    forging: "Kalinių elementų spalva",
    intPaint: "Varčios ir staktos spalva viduje",
    sameAsExt: "Kaip išorėje",
    twoTone: "Dvispalvės durys: išorė ir vidus gali būti skirtingų spalvų be priemokos.",
    premium: "Premium spalva +{pct}%",
    lacobel: "Juodas Lacobel stiklas — įskaičiuota",
    mirrorInt: "Veidrodis viduje — įskaičiuota",
    glassPick: "Stiklo paketo tonas",
    glassFixed: "Šio modelio stiklo paketas",
    glassMirror: "veidrodinis",
    glassGrille: "su juodomis įstatomomis grotelėmis",
    glassInfo: "Varčioje — 4 kamerų tripleksas (su grotelėmis — 3 kamerų).",
    hwType: "Furnitūros komplektas",
    hwColor: "Spalva",
    hwOnOrder: "užsakymui",
    hwSmart: "Smart modelių komplektacija fiksuota: biometrinė spyna «CBA» PSL2 su Face ID, rankena su piršto atspaudo skaitytuvu ir viršutinė cilindrinė spyna «CBA» su termostrypu.",
    sizeStdOnly: "Smart modeliai gaminami tik standartinių matmenų.",
    hwIncluded: "Komplekte: spynų sistema «CBA» KDL-6085 ir cilindras «CBA» su termostrypu.",
    eStrike: "Fuhr elektrinis skląstis vietoj mechaninio",
    onRequest: "kaina pagal užklausą",
    casings: "Pridedamos aliuminio apvadai",
    capitalExtend: "Kapitelis per visą bloką",
    perMeter: "{m} m × {p} €/m",
    summary: "Jūsų konfigūracija",
    total: "Iš viso",
    requestItems: "Patikslinsime pagal užklausą",
    noteCastCasing: "Nestandartinis aukštis iki 2200 mm — su vientisu apvadu.",
    noteTwoK: "Virš 2200 mm durys gaminamos 2K konstrukcija, varčios storis 78 mm.",
    noteHinges: "Nuo 2100 mm aukščio pridedamas 3-as vyris, nuo 2250 mm — 4-as (įskaičiuota į kainą).",
    lineDoor: "Durys {hw}{w} × {h} mm",
    lineDoorDouble: "Pusantrų varčių durys {hw}{w} × {h} mm",
    lineWidth: "Nestandartinis plotis +{pct}%",
    lineDoubleWidth: "Bloko plotis {w} mm +{pct}%",
    lineHeight: "Aukštis {h} mm +{pct}%",
    linePremium: "Premium spalva +{pct}%",
    lineGuardian: "Guardian cilindrai {n} × 45 €",
    lineSide: "Šoninis stiklinimas {w} × {h} mm ({a} m² × {r} €)",
    lineTop: "Viršutinis stiklinimas {w} × {h} mm ({a} m² × {r} €)",
    lineCapital: "Kapitelis {m} m × 60 €",
    lineCasings: "{kind} {m} m × {p} €",
    dType: "Durų tipas",
    dSize: "Dydis",
    dLayout: "Stiklinimas",
    dOpening: "Atidarymas",
    dExt: "Išorė",
    dInt: "Vidus",
    dGlass: "Stiklas",
    dHw: "Furnitūra",
    dExtras: "Papildomai",
    slats: "juostelės",
    insert: "intarpas",
  },
  en: {
    casingTitle: "Add-on casings",
    casingNone: "No add-on casings",
    casing_alu: "Aluminium add-on casing",
    casing_mono: "One-piece add-on casing",
    casing_figured: "Profiled aluminium casing",
    bottomPlate: "Bottom stop plate",
    bottomPlateHint: "Classic models only",
    stripSteelNote: "A stainless strip is only available with steel/chrome hardware.",
    grilleShort: "with grille",
    lineBottomPlate: "Stop plate {m} m × {p} €",
    sizeStepNote: "Non-standard sizes come in 50 mm steps.",
    title: "Configurator",
    intro: "Choose the size, finish and hardware — the price updates as you go.",
    stepSize: "Size and door type",
    stepOpening: "Opening",
    stepExterior: "Outside",
    stepInterior: "Inside",
    stepGlass: "Glass unit",
    stepHardware: "Hardware",
    stepExtras: "Extras",
    next: "Next",
    leafSingle: "Single leaf",
    leafSingleHint: "Up to {w} mm wide, {h} mm high",
    leafSingleStdHint: "{w} × {h} mm",
    leafDoubleStdHint: "Active + side leaf, {w} × {h} mm",
    leafDouble: "Door-and-a-half",
    leafDoubleHint: "Active + side leaf, {w1}–{w2} mm wide, up to {h} mm high",
    sizeCustom: "Other size",
    width: "Width",
    height: "Height",
    range: "{min}–{max} mm",
    layoutTitle: "Side-lights and toplight",
    layout1: "No glazing",
    layout2: "One side-light",
    layout3: "Two side-lights",
    layout4: "Toplight",
    layout5: "Side-light + toplight",
    layout6: "2 side-lights + toplight",
    sideW: "Side-light width",
    sideWLeft: "Left side-light width",
    sideWRight: "Right side-light width",
    sidePos: "Side-light",
    posLeft: "on the left",
    posRight: "on the right",
    topH: "Toplight height",
    panoTint: "Side-light / toplight glass tint",
    panoGrille: "With a decorative inset grille",
    blockSize: "Overall block size: {w} × {h} mm",
    hingeSide: "Hinge side (seen from outside)",
    hingeLeft: "Left",
    hingeRight: "Right",
    openDir: "Opening direction",
    openOut: "Outward",
    openIn: "Inward",
    openInHint: "Inward-opening doors get Guardian cylinders (+45 € each).",
    openInSmart: "Inward opening on Smart models — on request.",
    extPaint: "Leaf and frame colour, outside",
    decolux: "Decolux tone (outside only)",
    decoluxNote: "Decolux is applied on the outside only; the inside is painted in the Boston palette.",
    slatExt: "Slat colour, outside",
    slatInt: "Slat colour, inside",
    slatTones: "Slat tones",
    slatPaint: "In a Boston palette colour",
    insertExt: "Insert tone, outside",
    insertInt: "Insert tone, inside",
    strip: "Decorative strip colour",
    knocker: "«Lion» door knocker",
    forging: "Wrought-iron colour",
    intPaint: "Leaf and frame colour, inside",
    sameAsExt: "Same as outside",
    twoTone: "Two-tone doors: outside and inside can differ at no extra cost.",
    premium: "Premium colour +{pct}%",
    lacobel: "Black Lacobel glass — included",
    mirrorInt: "Mirror on the inside — included",
    glassPick: "Glass unit tint",
    glassFixed: "This model's glass unit",
    glassMirror: "mirrored",
    glassGrille: "with a black inset grille",
    glassInfo: "4-chamber triplex in the leaf (3-chamber with a grille).",
    hwType: "Hardware set",
    hwColor: "Finish",
    hwOnOrder: "to order",
    hwSmart: "Smart models come with a fixed set: «CBA» PSL2 biometric lock with Face ID, a handle with fingerprint scanner and an upper «CBA» thermal-rod cylinder lock.",
    sizeStdOnly: "Smart models are made in standard sizes only.",
    hwIncluded: "Includes the «CBA» KDL-6085 lock system and a «CBA» thermal-rod cylinder.",
    eStrike: "Fuhr electric strike instead of the mechanical latch",
    onRequest: "price on request",
    casings: "Add-on aluminium casings",
    capitalExtend: "Capital across the whole block",
    perMeter: "{m} m × {p} €/m",
    summary: "Your configuration",
    total: "Total",
    requestItems: "To be confirmed on request",
    noteCastCasing: "Non-standard height up to 2200 mm — with a one-piece casing.",
    noteTwoK: "Above 2200 mm the door is built as 2K, 78 mm leaf.",
    noteHinges: "From 2100 mm a 3rd hinge is added, from 2250 mm a 4th (included in the price).",
    lineDoor: "Door {hw}{w} × {h} mm",
    lineDoorDouble: "Door-and-a-half {hw}{w} × {h} mm",
    lineWidth: "Non-standard width +{pct}%",
    lineDoubleWidth: "Block width {w} mm +{pct}%",
    lineHeight: "Height {h} mm +{pct}%",
    linePremium: "Premium colour +{pct}%",
    lineGuardian: "Guardian cylinders {n} × 45 €",
    lineSide: "Side-light {w} × {h} mm ({a} m² × {r} €)",
    lineTop: "Toplight {w} × {h} mm ({a} m² × {r} €)",
    lineCapital: "Capital {m} m × 60 €",
    lineCasings: "{kind} {m} m × {p} €",
    dType: "Door type",
    dSize: "Size",
    dLayout: "Glazing",
    dOpening: "Opening",
    dExt: "Outside",
    dInt: "Inside",
    dGlass: "Glass",
    dHw: "Hardware",
    dExtras: "Extras",
    slats: "slats",
    insert: "insert",
  },
};

export function bt(locale, key, vars) {
  const s = DICT[locale]?.[key] ?? DICT.lv[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? "")) : s;
}

const nm = (item, locale) => item?.name?.[locale] || item?.name?.lv || "";
export const paintName = (key, locale) => nm(BOSTON_PAINT.find((p) => p.key === key), locale);
export const metalName = (key, locale) => nm(METAL_FINISHES[key], locale);
export const decoluxName = (key, locale) => nm(DECOLUX_FULL.find((d) => d.key === key), locale);
export const insertName = (key, locale) => nm(DECOLUX_INSERTS.find((d) => d.key === key), locale);
export const glassName = (key, locale) => nm(GLASS_TINTS[key], locale);
export function slatName(value, locale) {
  if (value?.startsWith("paint:")) return paintName(value.slice(6), locale);
  return nm(SLAT_TONES.find((s) => `tone:${s.key}` === value), locale);
}
export function hwName(type, color, locale) {
  if (!type) return "";
  return `${HARDWARE_TYPES[type]?.label || type}${color ? ` · ${metalName(color, locale)}` : ""}`;
}

export function lineLabel(line, locale) {
  switch (line.id) {
    case "door":
      return bt(locale, line.leaf === "double" ? "lineDoorDouble" : "lineDoor", {
        hw: line.hw ? `(${HARDWARE_TYPES[line.hw]?.label}) ` : "",
        w: line.w,
        h: line.h,
      });
    case "width":
      return bt(locale, "lineWidth", line);
    case "doubleWidth":
      return bt(locale, "lineDoubleWidth", line);
    case "height":
      return bt(locale, "lineHeight", line);
    case "premium":
      return bt(locale, "linePremium", line);
    case "guardian":
      return bt(locale, "lineGuardian", line);
    case "side":
    case "top":
      return `${bt(locale, line.id === "side" ? "lineSide" : "lineTop", { ...line, a: line.area, r: line.rate })}${line.grille ? `, ${bt(locale, "grilleShort")}` : ""}`;
    case "capital":
      return bt(locale, "lineCapital", line);
    case "casings":
      return bt(locale, "lineCasings", { kind: bt(locale, `casing_${line.kind}`), m: line.m, p: line.perM });
    case "bottomPlate":
      return bt(locale, "lineBottomPlate", { m: line.m, p: line.perM });
    default:
      return line.id;
  }
}

/* The whole config as [label, value] rows - for cart chips, the checkout
   summary, the offer-form prefill and the order e-mail. */
export function describeBoston(spec, config, locale) {
  const c = normalize(spec, config);
  const f = spec.features;
  const rows = [];
  const block = blockSize(c);
  rows.push([bt(locale, "dType"), bt(locale, c.leaf === "double" ? "leafDouble" : "leafSingle")]);
  rows.push([bt(locale, "dSize"), `${c.width} × ${c.height} mm`]);
  const layout = layoutOf(c);
  if (layout.key !== "1") {
    const parts = [bt(locale, `layout${layout.key}`)];
    if (layout.sides === 1) parts.push(`${bt(locale, "sidePos").toLowerCase()} ${bt(locale, c.sidePos === "right" ? "posRight" : "posLeft")} ${c.sideW} mm`);
    if (layout.sides === 2) parts.push(`${c.sideW} + ${c.sideW2} mm`);
    if (layout.top) parts.push(`${bt(locale, "topH").toLowerCase()} ${c.topH} mm`);
    parts.push(glassName(c.panoTint, locale));
    if (c.panoGrille) parts.push(bt(locale, "panoGrille").toLowerCase());
    parts.push(bt(locale, "blockSize", { w: block.width, h: block.height }));
    rows.push([bt(locale, "dLayout"), parts.join(", ")]);
  }
  rows.push([
    bt(locale, "dOpening"),
    `${bt(locale, c.hinge === "left" ? "hingeLeft" : "hingeRight")}, ${bt(locale, c.opening === "in" ? "openIn" : "openOut").toLowerCase()}`,
  ]);

  const ext = [spec.series === "decolux" ? `Decolux ${decoluxName(c.ext, locale)}` : paintName(c.ext, locale)];
  if (f.slatsExt) ext.push(`${bt(locale, "slats")}: ${slatName(c.slatExt, locale)}`);
  if (spec.series === "inserts") ext.push(`${bt(locale, "insert")}: ${insertName(c.insertExt, locale)}`);
  if (f.decorStrip) ext.push(`${bt(locale, "strip").toLowerCase()}: ${metalName(c.strip, locale)}`);
  if (f.knocker) ext.push(`${bt(locale, "knocker")}: ${metalName(c.knocker, locale)}`);
  if (f.forging) ext.push(`${bt(locale, "forging").toLowerCase()}: ${metalName(c.forging, locale)}`);
  rows.push([bt(locale, "dExt"), ext.join(", ")]);

  const int = [paintName(c.int, locale)];
  if (f.slatsInt) int.push(`${bt(locale, "slats")}: ${slatName(c.slatInt, locale)}`);
  if (f.insertInt) int.push(`${bt(locale, "insert")}: ${insertName(c.insertInt, locale)}`);
  rows.push([bt(locale, "dInt"), int.join(", ")]);

  if (spec.glass) {
    const g = [spec.glass.code, glassName(c.glass, locale)];
    if (spec.glass.mirror) g.push(bt(locale, "glassMirror"));
    if (spec.glass.grille) g.push(bt(locale, "glassGrille"));
    rows.push([bt(locale, "dGlass"), g.filter(Boolean).join(", ")]);
  }
  rows.push([bt(locale, "dHw"), spec.smart && !c.hw ? "«CBA» PSL-2 Smart" : hwName(c.hw, c.hwColor, locale)]);

  const extras = [];
  if (c.eStrike) extras.push(`${bt(locale, "eStrike")} (${bt(locale, "onRequest")})`);
  if (c.casing !== "none") extras.push(bt(locale, `casing_${c.casing}`));
  if (c.bottomPlate) extras.push(`${bt(locale, "bottomPlate")} (${metalName(c.plateColor, locale)})`);
  if (f.capital && c.capitalExtend && block.sides) extras.push(bt(locale, "capitalExtend"));
  if (extras.length) rows.push([bt(locale, "dExtras"), extras.join(", ")]);
  return rows;
}

// A cart line's Boston config as rows - [] for any other line.
export function bostonRows(product, line, locale) {
  const spec = line?.boston ? bostonSpec(product) : null;
  return spec ? describeBoston(spec, line.boston, locale) : [];
}
