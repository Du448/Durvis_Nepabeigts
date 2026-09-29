/* Slēptās iekšdurvis - the configurable part of the Eirodurvis 2026 price
   list ("Slēptās iekšdurvis - durvis no noliktavas un uz pasūtījumu"), as
   data for @/lib/hidden-config. Every number below is copied from that
   document; page numbers point back to it.

   The catalogue splits the same six configurations twice: once as stock
   doors (p. 2 - two on sale today, four "drīzumā pieejams") and once as
   made-to-order doors (p. 3, list prices). The model table maps each
   catalogue id to its configuration and which of the two lists it is on. */

/* thickness: leaf thickness in mm (40 = opens outward, 52 = reversed,
   opens inward); edge: primer | alu | black (black also means a black
   frame); mode: stock | soon | order. */
export const HIDDEN_MODELS = {
  "sleptas-40-grunts": { thickness: 40, edge: "primer", mode: "stock" },
  "sleptas-52-revers-grunts": { thickness: 52, edge: "primer", mode: "stock" },
  "sleptas-40-alu-mala-noliktava": { thickness: 40, edge: "alu", mode: "soon", orderTwin: "sleptas-40-alu-mala" },
  "sleptas-52-revers-alu-mala-noliktava": { thickness: 52, edge: "alu", mode: "soon", orderTwin: "sleptas-52-revers-alu-mala" },
  "sleptas-40-melna-mala-noliktava": { thickness: 40, edge: "black", mode: "soon", orderTwin: "sleptas-40-melna-mala" },
  "sleptas-52-revers-melna-mala-noliktava": { thickness: 52, edge: "black", mode: "soon", orderTwin: "sleptas-52-revers-melna-mala" },
  "sleptas-40-grunts-pasutijums": { thickness: 40, edge: "primer", mode: "order" },
  "sleptas-52-revers-grunts-pasutijums": { thickness: 52, edge: "primer", mode: "order" },
  "sleptas-40-alu-mala": { thickness: 40, edge: "alu", mode: "order" },
  "sleptas-52-revers-alu-mala": { thickness: 52, edge: "alu", mode: "order" },
  "sleptas-40-melna-mala": { thickness: 40, edge: "black", mode: "order" },
  "sleptas-52-revers-melna-mala": { thickness: 52, edge: "black", mode: "order" },
};

/* Standard leaf sizes (p. 9): four widths, and a height fixed by the
   thickness. The frame is 48 mm wider and 34 mm taller than the leaf; the
   recommended wall opening 70 mm wider and 55 mm taller. */
export const STD_WIDTHS = [600, 700, 800, 900];
export const STD_HEIGHT = { 40: 2000, 52: 2010 };
export const FRAME_ADD = { w: 48, h: 34 };
export const OPENING_ADD = { w: 70, h: 55 };

/* Made-to-order sizes (p. 5, p. 9): 5 mm steps, at most 1100 mm wide and
   2700 mm high; above 2300 mm the leaf is made 52 mm thick with a rebate
   only, so the 40 mm models stop there. The minimums are not in the price
   list - smaller leaves are quoted on request. */
export const SIZE_STEP = 5;
export const MIN_W = 400;
export const MAX_W = 1100;
export const MIN_H = 1500;
export const MAX_H = { 40: 2300, 52: 2700 };

/* Non-standard size surcharges (p. 5), a percentage of the standard price:
   width up to 1100 mm +10 %; height by band, each with the hinge count the
   band is built with. The percentage never covers the 3rd/4th hinge, which
   is charged on top at HINGE_PRICE. */
export const WIDTH_PCT = 10;
export const HEIGHT_BANDS = [
  // [up to mm, % surcharge, hinges]
  [2100, 10, 2],
  [2200, 20, 3],
  [2300, 30, 3],
  [2400, 40, 4],
  [2700, 50, 4],
];
export const HINGE_PRICE = 59;
export const HINGES_IN_SET = 2;

/* The manufacturer's recommended hinge count by leaf size (p. 10). Rows are
   leaf heights, columns leaf widths, each read as "up to"; null marks a
   combination the table leaves blank. */
export const HINGE_TABLE_WIDTHS = [600, 800, 900, 1000, 1050, 1100];
export const HINGE_TABLE = [
  [800, [2, 2, 2, null, null, null]],
  [1200, [2, 2, 2, null, null, null]],
  [1800, [2, 2, 2, 3, null, null]],
  [1900, [2, 2, 2, 3, 3, null]],
  [2000, [2, 2, 2, 3, 3, 3]],
  [2100, [2, 2, 2, 3, 3, 3]],
  [2200, [3, 3, 3, 3, 3, 4]],
  [2300, [4, 4, 4, 4, 4, 4]],
  [2400, [4, 4, 4, 4, 4, 4]],
  [2700, [4, 4, 4, 4, 4, 4]],
];

/* "Papildus iespējas" (p. 4) and "Papildus opcijas un pakalpojumi" (p. 6). */
export const PRICES = {
  ral: 30, // frame or leaf edge in a RAL colour - black-frame models only
  reinforcement: 45, // frame reinforcing mounting kit, per frame
  spacers: 10, // spacers, per frame
  noTopFramePct: 10, // set without the top frame member, % of the set
  handleHole: 3,
  cylinderHole: 3,
  thinLeaf: 30, // leaf made thinner to allow for a thicker wall finish
  closer: 285, // GEZE Boxer concealed closer
  closerRouting: 40,
  activeStopRouting: 46,
  stopper: 22, // NF Stopio Indoor
  stopperRouting: 10,
  dropSealRouting: 25,
};

/* Mirror on the leaf, per m² of leaf face (p. 4, p. 6). */
export const MIRRORS = {
  silver: 210,
  graphite: 285,
  bronze: 285,
};

export const STOPPER_COLORS = ["black", "bronze", "chrome"];

/* CCE (Italy) automatic drop seals (p. 7): price by length. The seal runs
   70 mm shorter than the leaf (1030 mm for the widest, 1100 mm leaf), and
   is taken in the shortest length that still covers that; a seal more than
   200 mm longer than the leaf needs is not offered. */
export const DROP_SEAL_GAP = 70;
export const DROP_SEAL_MAX_CUT = 200;
export const DROP_SEALS = {
  "trend-seal": {
    label: "CCE Trend Seal",
    lengths: [
      [530, 32],
      [730, 32],
      [830, 34],
      [930, 34],
      [1030, 35],
    ],
  },
  "trend-plus": {
    label: "CCE Trend Plus",
    lengths: [
      [730, 57],
      [830, 60],
      [930, 63],
      [1030, 66],
    ],
  },
  chronosoft: {
    label: "CCE Chronosoft 15×30",
    lengths: [
      [830, 145],
      [1030, 150],
    ],
  },
};
