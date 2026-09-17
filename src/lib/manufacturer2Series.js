import { doorTiers } from "@/data/manufacturer2Calculator";

// Ražotājs-2 tiers are named per size ("Termo House 705") or per electric-lock
// variant ("Tandem Elektro") — strip both suffixes to get the series name a
// catalogue product would actually carry in its own name (e.g. "Garant 514").
function seriesBaseName(tierName) {
  return tierName.replace(/\s+Elektro$/i, "").replace(/\s+\d+$/i, "").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Catalogue product names use the Latvian singular ("Garant"), while the
// calculator tier is named in the plural ("Garants") — match either.
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
