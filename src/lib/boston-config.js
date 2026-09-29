/* Made-to-order Boston door configurator: what a model allows (spec), a
   config clamped to those limits (normalize), and its price broken into
   lines (priceBoston). Pure functions, shared by the product page, cart,
   checkout, offer form and order e-mail so every place prices a config the
   same way. */

import { bostonSheetModels } from "@/data/boston-models";
import { bostonSmartModels } from "@/data/boston-smart-models";
import {
  BOSTON_PAINT,
  DECOLUX_FULL,
  DECOLUX_INSERTS,
  SLAT_TONES,
  HARDWARE_TYPES,
  LAYOUTS,
  PANORAMIC_TINTS,
  GRILLE_TINTS,
  RULES_PLAIN,
  RULES_SMART,
  RULES_SU,
} from "@/data/boston-config-options";

const RULES_BY_SOURCE = { su: RULES_SU, plain: RULES_PLAIN, smart: RULES_SMART };

export function isBostonOrder(product) {
  return product?.collection === "BOSTON" && product?.stockSource === "order";
}

// Price-sheet column -> hardware TYPE + the finishes that price covers.
const SHEET_HW = {
  t8: ["t8", ["chrome", "black"]],
  t8gold: ["t8", ["gold"]],
  t10: ["t10", ["steel", "black"]],
  t11: ["t11", ["steel", "black"]],
  t12: ["t12", ["steel", "black"]],
  t13: ["t13", ["steel", "black"]],
  t14: ["t14", ["steel", "black"]],
  t14gb: ["t14", ["gold", "bronze"]],
  t15: ["t15", ["black"]],
  t16: ["t16", ["black"]],
  smart: ["smart", ["black"]],
};

const TYPE_ORDER = ["t14", "t8", "t10", "t11", "t12", "t13", "t15", "t16", "smart"];

export function bostonSpec(product) {
  if (!isBostonOrder(product)) return null;
  const smart = product.id.includes("smart");
  const sheet = bostonSheetModels[product.id] || bostonSmartModels[product.id];
  // Smart models missing from the Smart price sheet get no configurator.
  if (smart && !sheet) return null;
  const rules = RULES_BY_SOURCE[sheet?.source] || RULES_PLAIN;
  const variants = sheet
    ? Object.entries(sheet.single)
        .filter(([k]) => SHEET_HW[k])
        .map(([k, single]) => ({ type: SHEET_HW[k][0], colors: SHEET_HW[k][1], single, double: sheet.double[k] ?? null }))
    : [];
  return {
    id: product.id,
    rules,
    series: sheet?.series || "painted",
    smart,
    basePrice: product.price,
    variants,
    types: TYPE_ORDER.filter((t) => variants.some((v) => v.type === t)),
    glass: sheet?.glass || null,
    features: { ...(sheet?.features || {}) },
    widths: sheet?.widths || [860, 960],
    palette: BOSTON_PAINT.filter((p) => !p.plainOnly || rules !== RULES_SU),
    doubleImage: sheet?.doubleImage || null,
  };
}

export function colorsForType(spec, type) {
  return spec.variants.filter((v) => v.type === type).flatMap((v) => v.colors);
}

function variantFor(spec, type, color) {
  return spec.variants.find((v) => v.type === type && v.colors.includes(color)) || null;
}

const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

/* What the size step may offer for this model and leaf type: heights and
   door-and-a-half widths come in 50 mm steps; single-leaf widths are either
   a fixed list (plain workbook) or free between the limits (SU workbook). */
export function sizeOptions(spec, leaf) {
  const r = spec.rules;
  if (leaf === "double") {
    const minW = spec.widths.includes(860) ? r.double.minW : r.double.stdW;
    return { widths: range(minW, r.double.maxW, r.sizeStep), heights: range(r.double.minH, r.double.maxH, r.sizeStep) };
  }
  const heights = range(r.single.minH, r.single.maxH, r.sizeStep);
  if (r.single.widths) {
    const minStd = Math.min(...spec.widths);
    return { widths: r.single.widths.map(([w]) => w).filter((w) => w >= minStd), heights };
  }
  return { widths: null, minW: Math.max(r.single.minW, Math.min(...spec.widths)), maxW: r.single.maxW, heights };
}

const nearest = (list, v) => list.reduce((best, x) => (Math.abs(x - v) < Math.abs(best - v) ? x : best), list[0]);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Math.round(Number(n) || lo)));
const slatKeys = [...SLAT_TONES.map((s) => `tone:${s.key}`), ...BOSTON_PAINT.map((p) => `paint:${p.key}`)];

export function defaultConfig(spec) {
  const type = spec.types[0] || null;
  return normalize(spec, {
    leaf: "single",
    size: "std",
    width: spec.widths[spec.widths.length - 1],
    height: spec.rules.stdH,
    layout: "1",
    sideW: 400,
    sideW2: 400,
    sidePos: "left",
    topH: 400,
    panoTint: spec.glass?.options?.find((o) => PANORAMIC_TINTS.includes(o)) || "satins",
    panoGrille: false,
    hinge: "right",
    opening: "out",
    ext: spec.series === "decolux" ? DECOLUX_FULL[0].key : "7021",
    int: "9016",
    slatExt: "tone:tik-gaiss",
    slatInt: "paint:9016",
    insertExt: DECOLUX_INSERTS[1].key,
    insertInt: DECOLUX_INSERTS[1].key,
    strip: "black",
    knocker: "black",
    forging: "black",
    glass: spec.glass?.options?.[0] || null,
    hw: type,
    hwColor: type ? colorsForType(spec, type)[0] : null,
    eStrike: false,
    casing: "none",
    capitalExtend: true,
    bottomPlate: false,
    plateColor: "black",
  });
}

/* Clamp every field to what this model and the other choices allow, so a
   stale cart line or a hand-edited URL can never price something the
   factory can't build. */
export function normalize(spec, raw) {
  const c = { ...raw };
  const r = spec.rules;
  c.leaf = c.leaf === "double" ? "double" : "single";
  c.size = c.size === "custom" && r.customSize ? "custom" : "std";
  const opts = sizeOptions(spec, c.leaf);
  if (c.size === "std") {
    c.width = c.leaf === "double" ? r.double.stdW : spec.widths.includes(Number(c.width)) ? Number(c.width) : spec.widths[spec.widths.length - 1];
    c.height = r.stdH;
  } else {
    c.width = opts.widths ? nearest(opts.widths, Number(c.width) || 0) : Math.round(clamp(c.width, opts.minW, opts.maxW) / 10) * 10;
    c.height = nearest(opts.heights, Number(c.height) || 0);
  }
  c.layout = r.glazing && LAYOUTS.some((l) => l.key === c.layout) ? c.layout : "1";
  c.sideW = clamp(c.sideW, r.glazingMin, r.glazingMax);
  c.sideW2 = clamp(c.sideW2, r.glazingMin, r.glazingMax);
  c.topH = clamp(c.topH, r.glazingMin, r.glazingMax);
  c.sidePos = c.sidePos === "right" ? "right" : "left";
  c.panoTint = PANORAMIC_TINTS.includes(c.panoTint) ? c.panoTint : "satins";
  c.panoGrille = !!c.panoGrille && c.panoTint in GRILLE_TINTS;
  c.hinge = c.hinge === "left" ? "left" : "right";
  c.opening = c.opening === "in" && !spec.smart ? "in" : "out";

  const paintKeys = spec.palette.map((p) => p.key);
  if (spec.series === "decolux") {
    c.ext = DECOLUX_FULL.some((d) => d.key === c.ext) ? c.ext : DECOLUX_FULL[0].key;
  } else {
    c.ext = paintKeys.includes(c.ext) ? c.ext : "7021";
  }
  c.int = paintKeys.includes(c.int) ? c.int : "9016";
  const slatOk = (v) => slatKeys.includes(v) && (!v.startsWith("paint:") || paintKeys.includes(v.slice(6)));
  c.slatExt = slatOk(c.slatExt) ? c.slatExt : "tone:tik-gaiss";
  c.slatInt = slatOk(c.slatInt) ? c.slatInt : "paint:9016";
  const insertOk = (k) => DECOLUX_INSERTS.some((d) => d.key === k);
  c.insertExt = insertOk(c.insertExt) ? c.insertExt : DECOLUX_INSERTS[1].key;
  c.insertInt = insertOk(c.insertInt) ? c.insertInt : c.insertExt;
  c.knocker = spec.features.knockerBlackOnly ? "black" : ["black", "gold", "bronze"].includes(c.knocker) ? c.knocker : "black";
  c.forging = ["black", "gold", "bronze"].includes(c.forging) ? c.forging : "black";
  c.glass = spec.glass ? (spec.glass.options.includes(c.glass) ? c.glass : spec.glass.options[0] || null) : null;

  if (spec.types.length) {
    c.hw = spec.types.includes(c.hw) ? c.hw : spec.types[0];
    const colors = colorsForType(spec, c.hw);
    c.hwColor = colors.includes(c.hwColor) ? c.hwColor : colors[0];
  } else {
    c.hw = null;
    c.hwColor = null;
  }
  // A stainless décor strip only comes with steel/chrome hardware; black,
  // bronze and gold sets always get a black strip.
  c.strip = c.strip === "steel" && stripSteelAllowed(c) ? "steel" : "black";
  c.eStrike = !!c.eStrike && !!HARDWARE_TYPES[c.hw]?.latch;
  c.casing = r.casings.some((k) => k.key === c.casing) ? c.casing : "none";
  c.capitalExtend = c.capitalExtend !== false;
  c.bottomPlate = !!c.bottomPlate && !!r.bottomPlatePerM && !!spec.features.bottomPlate;
  c.plateColor = c.plateColor === "steel" ? "steel" : "black";
  return c;
}

export function stripSteelAllowed(config) {
  return !config.hw || config.hwColor === "steel" || config.hwColor === "chrome";
}

const pctFrom = (table, value) => (table.find(([max]) => value <= max) || table[table.length - 1])[1];

export function layoutOf(config) {
  return LAYOUTS.find((l) => l.key === config.layout) || LAYOUTS[0];
}

// Overall dimensions of the door block, glazing included.
export function blockSize(config) {
  const l = layoutOf(config);
  const sides = l.sides === 2 ? config.sideW + config.sideW2 : l.sides === 1 ? config.sideW : 0;
  const width = config.width + sides;
  const height = config.height + (l.top ? config.topH : 0);
  return { width, height, sides: l.sides, top: l.top };
}

export function usesPremium(spec, c) {
  const prem = (k) => BOSTON_PAINT.find((p) => p.key === k)?.premium;
  if (spec.series !== "decolux" && prem(c.ext)) return true;
  if (prem(c.int)) return true;
  const slat = (v) => v?.startsWith("paint:") && prem(v.slice(6));
  if (spec.features.slatsExt && slat(c.slatExt)) return true;
  if (spec.features.slatsInt && slat(c.slatInt)) return true;
  return false;
}

// Length (m) the add-on casings run: both sides plus the top of the block.
export const casingLength = (block) => Math.round(((2 * block.height + block.width) / 1000) * 100) / 100;

/* Price lines, each already rounded, so the total is exactly their sum.
   `onRequest` lists chosen options the sheet gives no price for. */
export function priceBoston(spec, config) {
  const c = normalize(spec, config);
  const r = spec.rules;
  const lines = [];
  const add = (id, amount, meta = {}) => lines.push({ id, amount: Math.round(amount), ...meta });
  const variant = c.hw ? variantFor(spec, c.hw, c.hwColor) : null;
  const single = variant ? variant.single : spec.basePrice;

  let base = single;
  let widthPct = 0;
  let widthLine = "width";
  if (c.leaf === "double") {
    if (c.width <= r.double.stdW && variant?.double) {
      base = variant.double;
    } else {
      widthPct = pctFrom(r.double.widthPct, c.width);
      widthLine = "doubleWidth";
    }
  } else if (r.single.widths) {
    widthPct = r.single.widths.find(([w]) => w === c.width)?.[1] ?? 0;
  } else if (!spec.widths.includes(c.width)) {
    widthPct = r.single.customWidthPct;
  }
  const heightPct = pctFrom(r.heightPct, c.height);
  const premiumPct = usesPremium(spec, c) ? r.premiumPct : 0;

  // Compounded in the sheet's order: height, width, then colour.
  const steps = [
    ["height", heightPct, { h: c.height }],
    [widthLine, widthPct, { w: c.width }],
    ["premium", premiumPct, {}],
  ];
  add("door", base, { hw: c.hw, hwColor: c.hwColor, w: c.width, h: c.height, leaf: c.leaf });
  let running = base;
  for (const [id, pct, meta] of steps) {
    if (!pct) continue;
    const next = running * (1 + pct / 100);
    lines.push({ id, amount: Math.round(next) - Math.round(running), pct, ...meta });
    running = next;
  }

  // Extra hinges on tall doors are included in the door price - noted, not charged.
  const extraHinges = c.height >= r.thirdHingeFrom;

  if (c.opening === "in") {
    const n = HARDWARE_TYPES[c.hw]?.cylinders ?? 2;
    add("guardian", n * r.guardianPerCylinder, { n });
  }

  const block = blockSize(c);
  const grille = c.panoGrille && !r.grilleOnRequest;
  const panel = (id, w, h) => {
    const area = (w * h) / 1e6;
    const rate = r.glazingRate(id, area, grille);
    add(id, area * rate, { w, h, area: Math.round(area * 100) / 100, rate, grille });
  };
  if (block.sides >= 1) panel("side", c.sideW, c.height);
  if (block.sides === 2) panel("side", c.sideW2, c.height);
  if (block.top) panel("top", block.width, c.topH);

  if (spec.features.capital && c.capitalExtend && block.sides) {
    const m = (block.width - c.width) / 1000;
    add("capital", m * r.capitalPerM, { m: Math.round(m * 100) / 100 });
  }
  const casing = r.casings.find((k) => k.key === c.casing);
  if (casing) {
    const m = casingLength(block);
    add("casings", m * casing.perM, { m, kind: casing.key, perM: casing.perM });
  }
  if (c.bottomPlate) {
    const m = Math.round((c.width / 1000) * 100) / 100;
    add("bottomPlate", m * r.bottomPlatePerM, { m, perM: r.bottomPlatePerM });
  }

  const onRequest = [];
  if (c.eStrike) onRequest.push("eStrike");
  if (block.sides + (block.top ? 1 : 0) > 0 && c.panoGrille && r.grilleOnRequest) onRequest.push("panoGrille");

  const notes = [];
  if (r.castCasingUpTo && c.height > r.stdH && c.height <= r.castCasingUpTo) notes.push("castCasing");
  if (c.height > r.twoKFrom) notes.push("twoK");
  if (extraHinges) notes.push("hinges");

  return { config: c, lines, total: lines.reduce((s, l) => s + l.amount, 0), onRequest, notes, block };
}

/* Compact, URL-safe form of a config for the "request an offer" link. */
export function encodeConfig(config) {
  const json = JSON.stringify(config);
  const b64 = typeof window === "undefined" ? Buffer.from(json, "utf8").toString("base64") : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeConfig(str) {
  if (!str) return null;
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof window === "undefined" ? Buffer.from(b64, "base64").toString("utf8") : decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    return obj && typeof obj === "object" ? obj : null;
  } catch {
    return null;
  }
}
