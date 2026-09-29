/* Hidden-door configurator: what a model allows (spec), a config clamped
   to those limits (normalize), and its price broken into lines
   (priceHidden). Pure functions, shared by the product page, cart,
   checkout, offer form and order e-mail - the same shape as
   @/lib/boston-config, so every place prices a config the same way.

   Stock doors get a short version (standard sizes, hinge side and the
   accessories that need no work at the factory); made-to-order doors get
   everything the price list offers. "Drīzumā pieejams" stock doors are not
   configurable - they cannot be bought yet. */

import {
  HIDDEN_MODELS,
  STD_WIDTHS,
  STD_HEIGHT,
  FRAME_ADD,
  OPENING_ADD,
  SIZE_STEP,
  MIN_W,
  MAX_W,
  MIN_H,
  MAX_H,
  WIDTH_PCT,
  HEIGHT_BANDS,
  HINGE_PRICE,
  HINGES_IN_SET,
  HINGE_TABLE,
  HINGE_TABLE_WIDTHS,
  PRICES,
  MIRRORS,
  STOPPER_COLORS,
  DROP_SEALS,
  DROP_SEAL_GAP,
  DROP_SEAL_MAX_CUT,
} from "@/data/hidden-door-options";

export function hiddenModel(product) {
  return product?.id ? HIDDEN_MODELS[product.id] || null : null;
}

/* An announced model is released by marking it in stock (with a price) in
   the admin panel - on a full catalogue entry that is `inStock`, on a card
   the stock label worked out from it. */
const released = (product) => product.inStock === true || product.stock === "local" || product.stock === "factory";

export function isHiddenComingSoon(product) {
  return hiddenModel(product)?.mode === "soon" && !released(product);
}

export function hiddenSpec(product) {
  const model = hiddenModel(product);
  if (!model || isHiddenComingSoon(product)) return null;
  const order = model.mode === "order";
  return {
    id: product.id,
    order,
    thickness: model.thickness,
    edge: model.edge,
    basePrice: product.price,
    stdHeight: STD_HEIGHT[model.thickness],
    maxH: MAX_H[model.thickness],
    // RAL colours are priced on top of the black-frame models only.
    ral: order && model.edge === "black",
  };
}

export function defaultHiddenConfig(spec) {
  return normalizeHidden(spec, {
    size: "std",
    width: 800,
    height: spec.stdHeight,
    hinge: "right",
    frameColor: "black",
    frameRal: "",
    edgeColor: "black",
    edgeRal: "",
    extraHinges: 0,
    noTopFrame: false,
    thinLeaf: false,
    mirror: "none",
    handleHole: false,
    cylinderHole: "none",
    closer: false,
    activeStop: false,
    dropSeal: "none",
    stopper: "none",
    reinforcement: false,
    spacers: false,
  });
}

const snap = (n, lo, hi) => Math.min(hi, Math.max(lo, Math.round((Number(n) || lo) / SIZE_STEP) * SIZE_STEP));
const ralCode = (v) => String(v || "").replace(/\D/g, "").slice(0, 4);

/* Hinges the price list builds this height with (p. 5). */
export function bandFor(height) {
  return HEIGHT_BANDS.find(([max]) => height <= max) || HEIGHT_BANDS[HEIGHT_BANDS.length - 1];
}

/* The manufacturer's recommended hinge count for this leaf (p. 10). */
export function recommendedHinges(width, height) {
  const row = (HINGE_TABLE.find(([h]) => height <= h) || HINGE_TABLE[HINGE_TABLE.length - 1])[1];
  let col = HINGE_TABLE_WIDTHS.findIndex((w) => width <= w);
  if (col < 0) col = HINGE_TABLE_WIDTHS.length - 1;
  // Blank cells sit below the rows that have a value; take the nearest one above.
  for (let i = col; i >= 0; i--) if (row[i] != null) return Math.max(row[i], i < col ? 3 : 0);
  return 2;
}

/* The shortest seal that covers the leaf, or null when this seal is not
   made short enough / long enough for it. */
export function dropSealFor(kind, width) {
  const seal = DROP_SEALS[kind];
  if (!seal) return null;
  const need = width - DROP_SEAL_GAP;
  const hit = seal.lengths.find(([len]) => len >= need);
  if (!hit || hit[0] - need > DROP_SEAL_MAX_CUT) return null;
  return { length: hit[0], price: hit[1] };
}

export function hingeLimits(config) {
  const required = bandFor(config.height)[2];
  const recommended = Math.max(required, recommendedHinges(config.width, config.height));
  return { required, recommended };
}

/* Clamp every field to what this model and the other choices allow, so a
   stale cart line or a hand-edited URL can never price something the
   factory can't build. */
export function normalizeHidden(spec, raw) {
  const c = { ...raw };
  c.size = c.size === "custom" && spec.order ? "custom" : "std";
  if (c.size === "std") {
    c.width = STD_WIDTHS.includes(Number(c.width)) ? Number(c.width) : 800;
    c.height = spec.stdHeight;
  } else {
    c.width = snap(c.width, MIN_W, MAX_W);
    c.height = snap(c.height, MIN_H, spec.maxH);
  }
  c.hinge = c.hinge === "left" ? "left" : "right";

  c.frameColor = spec.ral && c.frameColor === "ral" ? "ral" : "black";
  c.edgeColor = spec.ral && c.edgeColor === "ral" ? "ral" : "black";
  c.frameRal = c.frameColor === "ral" ? ralCode(c.frameRal) : "";
  c.edgeRal = c.edgeColor === "ral" ? ralCode(c.edgeRal) : "";

  /* The price list's own hinge count by default; up to the manufacturer's
     recommendation plus one more is the visitor's choice. */
  const { required, recommended } = hingeLimits(c);
  const extra = Number.isInteger(c.extraHinges) ? c.extraHinges : 0;
  c.extraHinges = spec.order ? Math.max(0, Math.min(recommended - required + 1, extra)) : 0;

  c.noTopFrame = spec.order && !!c.noTopFrame;
  c.thinLeaf = spec.order && !!c.thinLeaf;
  c.mirror = spec.order && c.mirror in MIRRORS ? c.mirror : "none";
  c.closer = spec.order && !!c.closer;
  c.activeStop = spec.order && !!c.activeStop;
  c.dropSeal = spec.order && dropSealFor(c.dropSeal, c.width) ? c.dropSeal : "none";

  c.handleHole = !!c.handleHole;
  c.cylinderHole = ["pz", "wc"].includes(c.cylinderHole) ? c.cylinderHole : "none";
  c.stopper = STOPPER_COLORS.includes(c.stopper) ? c.stopper : "none";
  c.reinforcement = !!c.reinforcement;
  c.spacers = !!c.spacers;
  return c;
}

export const isStdWidth = (w) => STD_WIDTHS.includes(w);

/* Frame and recommended wall opening for this leaf. */
export function hiddenSizes(config) {
  return {
    frame: { w: config.width + FRAME_ADD.w, h: config.height + FRAME_ADD.h },
    opening: { w: config.width + OPENING_ADD.w, h: config.height + OPENING_ADD.h },
  };
}

export const leafArea = (c) => Math.round(((c.width * c.height) / 1e6) * 100) / 100;

/* Price lines, each already rounded, so the total is exactly their sum.
   Size surcharges are percentages of the standard price and add up rather
   than compound - the price list states each one "pie standarta cenas". */
export function priceHidden(spec, config) {
  const c = normalizeHidden(spec, config);
  const lines = [];
  const add = (id, amount, meta = {}) => lines.push({ id, amount: Math.round(amount), ...meta });
  const base = spec.basePrice;

  add("door", base, { w: c.width, h: c.height });
  if (c.height !== spec.stdHeight) add("height", (base * bandFor(c.height)[1]) / 100, { h: c.height, pct: bandFor(c.height)[1] });
  if (!isStdWidth(c.width)) add("width", (base * WIDTH_PCT) / 100, { w: c.width, pct: WIDTH_PCT });

  const { required } = hingeLimits(c);
  const hinges = required + c.extraHinges;
  if (hinges > HINGES_IN_SET) add("hinges", (hinges - HINGES_IN_SET) * HINGE_PRICE, { n: hinges - HINGES_IN_SET, total: hinges });

  if (c.frameColor === "ral") add("ralFrame", PRICES.ral, { ral: c.frameRal });
  if (c.edgeColor === "ral") add("ralEdge", PRICES.ral, { ral: c.edgeRal });

  // Leaving out the top frame member adds 10 % to the set as configured so far.
  if (c.noTopFrame) {
    const set = lines.reduce((s, l) => s + l.amount, 0);
    add("noTopFrame", (set * PRICES.noTopFramePct) / 100, { pct: PRICES.noTopFramePct });
  }
  if (c.thinLeaf) add("thinLeaf", PRICES.thinLeaf);
  if (c.mirror !== "none") {
    const area = leafArea(c);
    add("mirror", area * MIRRORS[c.mirror], { kind: c.mirror, area, rate: MIRRORS[c.mirror] });
  }
  if (c.closer) add("closer", PRICES.closer + PRICES.closerRouting);
  if (c.activeStop) add("activeStop", PRICES.activeStopRouting);
  if (c.dropSeal !== "none") {
    const seal = dropSealFor(c.dropSeal, c.width);
    add("dropSeal", seal.price + PRICES.dropSealRouting, { kind: c.dropSeal, length: seal.length });
  }
  if (c.stopper !== "none") add("stopper", PRICES.stopper + PRICES.stopperRouting, { color: c.stopper });
  if (c.handleHole) add("handleHole", PRICES.handleHole);
  if (c.cylinderHole !== "none") add("cylinderHole", PRICES.cylinderHole, { kind: c.cylinderHole });
  if (c.reinforcement) add("reinforcement", PRICES.reinforcement);
  if (c.spacers) add("spacers", PRICES.spacers);

  const onRequest = [];
  if (c.activeStop) onRequest.push("activeStopDevice");
  if (c.frameColor === "ral" && !c.frameRal) onRequest.push("ralFrameCode");
  if (c.edgeColor === "ral" && !c.edgeRal) onRequest.push("ralEdgeCode");

  const notes = [];
  if (c.height > 2300) notes.push("rebate");
  if (c.noTopFrame) notes.push("noTopFrame");

  return { config: c, lines, total: lines.reduce((s, l) => s + l.amount, 0), hinges, onRequest, notes };
}
