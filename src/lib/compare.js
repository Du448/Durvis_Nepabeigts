const STORAGE_KEY = "compareIds";

// A comparison table wider than this stops being readable side by side.
export const MAX_COMPARE = 4;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function readCompareIds() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((x) => typeof x === "string");
}

export function writeCompareIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("compare:change"));
}

/* Adding past MAX_COMPARE is a no-op rather than dropping the oldest pick -
   the visitor chose those models on purpose, so making room silently would
   surprise them more than the button doing nothing. */
export function toggleCompareId(id) {
  const ids = readCompareIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < MAX_COMPARE ? [...ids, id] : ids;
  if (next !== ids) writeCompareIds(next);
  return next;
}

export function removeCompareId(id) {
  const next = readCompareIds().filter((x) => x !== id);
  writeCompareIds(next);
  return next;
}

export function clearCompare() {
  writeCompareIds([]);
}

export function isCompared(id) {
  return readCompareIds().includes(id);
}
