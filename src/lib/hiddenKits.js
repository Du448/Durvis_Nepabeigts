/* Hidden doors are sold as a set - a leaf plus its aluminium frame - but the
   warehouse stocks the three parts as separate rows:

     leaf        "Slēpto iekšdurvju Vērtne, eņģes 2gb (2000x600x38mm, Balta grunts, OUT univers.)"
                 "Slēpto iekšdurvju Vērtne, eņģes 2gb (2010x700x50mm, Balta grunts, INS Kreisā)"
     horizontal  "Slēpto iekšdurvju alumīnija kārba Horizontal (Anodēts ALU, 700mm)"
     vertical    "Slēpto iekšdurvju alumīnija kārba Vertical, 2 eņģes (Anodēts ALU, 2000mm, OUT Kreisā)"

   One set = one leaf + one horizontal of the leaf's width + one vertical of
   the leaf's height and swing (OUT = 40 mm outward-opening, 2000 mm; INS =
   52 mm reverse, 2010 mm). INS leaves are handed, so they need the vertical
   of their own side; OUT leaves are universal and take either side's.
   Horizontals carry no height or swing, so OUT and INS leaves of the same
   width compete for them.

   Because the parts are shared, "how many sets can we sell" is a max-flow
   problem: source -> horizontal(width) -> leaf -> vertical(swing, side) ->
   sink, each unit of flow being one complete set. Augmenting one unit at a
   time, round-robin over the leaves, keeps a shortage spread across sizes
   instead of whichever size happened to be counted first emptying out. */

const FRAME_FINISH = "Anodēts ALU"; // the "Standarta" frame of the primer models

const HORIZONTAL_RE = /kārba\s+Horizontal\s*\(\s*([^,()]+?)\s*,\s*(\d{3,4})\s*mm\s*\)/i;
const VERTICAL_RE = /kārba\s+Vertical\b[^(]*\(\s*([^,()]+?)\s*,\s*(\d{4})\s*mm\s*,\s*(OUT|INS)\s+(Kreisā|Labā)\s*\)/i;
const LEAF_RE = /\((\d{4})x(\d{2,4})x\d{2}mm,\s*Balta grunts,\s*(OUT univers\.|INS Kreisā|INS Labā)\)\s*$/i;

const sideOf = (word) => (/^k/i.test(word) ? "left" : "right");

// A frame part row -> { part: "horizontal", width } | { part: "vertical",
// height, swing, side }, or null. Only the anodised frame counts: a frame in
// another finish doesn't fit the leaves stocked today, so it falls through to
// the admin's unmatched list rather than being counted silently.
export function parseHiddenFrame(name) {
  const h = name.match(HORIZONTAL_RE);
  if (h) return h[1] === FRAME_FINISH ? { part: "horizontal", width: Number(h[2]) } : null;
  const v = name.match(VERTICAL_RE);
  if (v) {
    if (v[1] !== FRAME_FINISH) return null;
    return { part: "vertical", height: Number(v[2]), swing: v[3].toUpperCase(), side: sideOf(v[4]) };
  }
  return null;
}

// A leaf row -> { height, width, swing, side } (side null for OUT univers.), or null.
export function parseHiddenLeaf(name) {
  const m = name.match(LEAF_RE);
  if (!m) return null;
  const [swing, sideWord] = m[3].split(/\s+/);
  return {
    height: Number(m[1]),
    width: Number(m[2]),
    swing: swing.toUpperCase(),
    side: swing.toUpperCase() === "INS" ? sideOf(sideWord) : null,
  };
}

export const verticalKey = ({ swing, side, height }) => `${swing}|${side}|${height}`;

/* leaves:  [{ productId, width, height, swing, side, qty }] (one per distinct part)
   frames:  { horizontal: Map(width -> qty), vertical: Map(verticalKey -> qty) }
   returns the same leaves with `kits` - how many of each can go out as a set. */
export function computeHiddenKits(leaves, frames) {
  const S = 0;
  const T = 1;
  let n = 2;
  const hNode = new Map();
  const vNode = new Map();
  for (const w of frames.horizontal.keys()) hNode.set(w, n++);
  for (const k of frames.vertical.keys()) vNode.set(k, n++);
  const leafNodes = leaves.map(() => {
    const ins = n++;
    const out = n++;
    return { ins, out };
  });

  const cap = Array.from({ length: n }, () => new Array(n).fill(0));
  const INF = 1e9;
  for (const [w, qty] of frames.horizontal) cap[S][hNode.get(w)] = qty;
  for (const [k, qty] of frames.vertical) cap[vNode.get(k)][T] = qty;
  leaves.forEach((leaf, i) => {
    const { ins, out } = leafNodes[i];
    cap[ins][out] = leaf.qty;
    const h = hNode.get(leaf.width);
    if (h != null) cap[h][ins] = INF;
    const sides = leaf.side ? [leaf.side] : ["left", "right"];
    for (const side of sides) {
      const v = vNode.get(verticalKey({ swing: leaf.swing, side, height: leaf.height }));
      if (v != null) cap[out][v] = INF;
    }
  });

  // One unit S -> H(width of leaf i) -> leaf i -> ... -> T, the tail found by
  // BFS in the residual graph (so it may re-route sets already counted).
  function augmentThrough(i) {
    const h = hNode.get(leaves[i].width);
    if (h == null || cap[S][h] <= 0) return false;
    const start = leafNodes[i].ins;
    const prev = new Array(n).fill(-1);
    prev[start] = start;
    prev[S] = S; // never walk back through the source or this leaf's horizontal
    prev[h] = h;
    const queue = [start];
    while (queue.length && prev[T] === -1) {
      const u = queue.shift();
      for (let v = 0; v < n; v++) {
        if (prev[v] === -1 && cap[u][v] > 0) {
          prev[v] = u;
          queue.push(v);
        }
      }
    }
    if (prev[T] === -1) return false;
    for (let v = T; v !== start; v = prev[v]) {
      cap[prev[v]][v] -= 1;
      cap[v][prev[v]] += 1;
    }
    cap[S][h] -= 1;
    cap[h][S] += 1;
    cap[h][start] -= 1;
    cap[start][h] += 1;
    return true;
  }

  // A leaf that is stuck now can get a set again after another leaf's set is
  // re-routed, so keep going until a whole pass adds nothing.
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (let i = 0; i < leaves.length; i++) {
      if (augmentThrough(i)) progressed = true;
    }
  }

  return leaves.map((leaf, i) => ({ ...leaf, kits: leaf.qty - cap[leafNodes[i].ins][leafNodes[i].out] }));
}
