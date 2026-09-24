import { doorTiers } from "@/data/manufacturer2Calculator";

// Ražotājs-2 tiers are named per size ("Termo House 705") or per electric-lock
// variant ("Tandem Elektro") - strip both suffixes to get the series name a
// catalogue product would actually carry in its own name (e.g. "Garant 514").
function seriesBaseName(tierName) {
  return tierName.replace(/\s+Elektro$/i, "").replace(/\s+\d+$/i, "").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Catalogue product names use the Latvian singular ("Garant"), while the
// calculator tier is named in the plural ("Garants") - match either.
function seriesNamePattern(baseName) {
  const stem = escapeRegExp(baseName.replace(/s$/i, ""));
  return new RegExp(`\\b${stem}s?\\b`, "iu");
}

const seriesPatterns = [...new Set(doorTiers.map((tier) => seriesBaseName(tier.name)))].map(seriesNamePattern);

// Whether a catalogue product's name matches one of the Ražotājs-2 calculator
// series (e.g. "Garant 514" -> tier "Garants"), meaning an individual/custom
// version of it can be configured there.
export function hasManufacturer2Series(productName) {
  if (!productName) return false;
  return seriesPatterns.some((pattern) => pattern.test(productName));
}

// manufacturer2.js "krasas" groups, in definition order: [0] the PVC film
// used on apartment-entrance leaves, [1] the weather-resistant Winshield PVC
// film used on the street side of house-entrance leaves.
const KRASAS_GROUP_INDEX = { "ardurvis-dzivoklim": 0, "ardurvis-privatmajai": 1 };

// Where a catalogue product's own colour swatches actually come from: a RAL
// code in the colour name (e.g. "Antracīts RAL 7016") means the door is
// powder-coated rather than PVC-film wrapped, so it points at the "ral"
// (pulverkrāsojuma) section instead of "krasas" (film colours). The Termo
// House/Street series is powder-coated too, even though its own colour names
// don't spell out "RAL" (e.g. "Tumšs antracīts").
export function manufacturer2ColorLinkParams(product) {
  const hasRal = (product.colors || []).some((c) => /\bRAL\b/i.test(c));
  const isTermo = /\bTermo\b/i.test(product.name || "");
  if (hasRal || isTermo) return { section: "ral" };
  const group = KRASAS_GROUP_INDEX[product.category];
  return group === undefined ? { section: "krasas" } : { section: "krasas", group: String(group) };
}

// Query string (with leading "?") for the "Toņu maiņa" link - appended to
// "/duru-konfiguratorius" before running the result through withLocaleHref().
export function manufacturer2ColorQuery(product) {
  return `?${new URLSearchParams(manufacturer2ColorLinkParams(product)).toString()}`;
}
