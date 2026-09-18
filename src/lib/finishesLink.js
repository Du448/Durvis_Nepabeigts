// A handful of catalogue products are finished in a material that isn't PVC
// film or powder coating and can't be told apart from their colour names —
// override the section by product id.
const SECTION_OVERRIDES = {
  "termix-adele": "stronwood",
};

// Link to the Ražotājs-1 ("/apdare") finishes reference page for a catalogue
// product's own colour swatches — mirrors manufacturer2ColorLinkParams(): a
// RAL code in the colour name means the door is powder-coated (points at the
// "pulverkrasojums" section), otherwise it's PVC-film wrapped ("pvc").
export function finishesColorLinkParams(product) {
  const override = SECTION_OVERRIDES[product.id];
  if (override) return { section: override };
  const hasRal = (product.colors || []).some((c) => /\bRAL\b/i.test(c));
  return { section: hasRal ? "pulverkrasojums" : "pvc" };
}

// Query string (with leading "?") for the "Toņu maiņa" link — appended to
// "/apdare" before running the result through withLocaleHref().
export function finishesColorQuery(product) {
  return `?${new URLSearchParams(finishesColorLinkParams(product)).toString()}`;
}
