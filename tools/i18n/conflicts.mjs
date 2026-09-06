import * as L from "../../src/data/translations/lt/labels.js";
import * as S from "../../src/data/translations/lt/spec-values.js";
import * as F from "../../src/data/translations/lt/full-values.js";
import * as N from "../../src/data/translations/lt/names.js";
import * as H from "../../src/data/translations/lt/shorts.js";
import * as D from "../../src/data/translations/lt/descriptions.js";
import * as X from "../../src/data/translations/lt/finishes.js";
import * as M from "../../src/data/translations/lt/misc.js";

const parts = [
  ["labels", L.ltLabels], ["spec-values", S.ltSpecValues], ["full-values", F.ltFullValues],
  ["names", N.ltNames], ["shorts", H.ltShorts], ["descTitles", D.ltDescTitles],
  ["descParas", D.ltDescParas], ["finishText", X.ltFinishText], ["finishLabels", X.ltFinishLabels],
  ["colors", M.ltColors], ["setItems", M.ltSetItems],
];
const seen = new Map();
let n = 0;
for (const [name, obj] of parts) {
  for (const [k, v] of Object.entries(obj)) {
    n++;
    const prev = seen.get(k);
    if (prev && prev.v !== v) console.log(`CONFLICT "${k}"\n  ${prev.name}: ${prev.v}\n  ${name}: ${v}`);
    seen.set(k, { name, v });
  }
}
console.log(`entries: ${n}, unique keys: ${seen.size}`);
