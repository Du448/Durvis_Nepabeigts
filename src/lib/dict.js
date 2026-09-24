import { trData, translateColorLabel } from "@/lib/i18n-data";

/* Builds the slice of the catalogue dictionary one page needs, for
   <DictProvider>. Every string found anywhere in `values` (walked
   recursively) is looked up; only entries that actually translate are kept,
   so a Latvian page gets an empty dictionary. `colors` are run through the
   colour translator, which also handles names the dictionary doesn't know.
   `extra` merges whole dictionaries in, for components that translate
   literal UI strings rather than data (the configurator). */
export function buildDict(locale, values, { colors = [], extra = [] } = {}) {
  const t = {};
  const c = {};
  if (locale === "lv") return { t, c };

  const seen = new Set();
  const visit = (v) => {
    if (typeof v === "string") {
      if (seen.has(v)) return;
      seen.add(v);
      const out = trData(locale, v);
      if (out !== v) t[v] = out;
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        visit(k);
        visit(val);
      }
    }
  };
  visit(values);

  for (const d of extra) Object.assign(t, d);

  for (const v of colors) {
    if (!v) continue;
    const out = translateColorLabel(locale, v);
    if (out !== v) c[v] = out;
  }
  return { t, c };
}
