/* Glass-package tint choices for made-to-order Boston doors' panoramic
   glazing, sourced from the manufacturer's own "Panorāmas stiklojuma
   stiklapaketes krāsu palete" price-sheet section (see @/data/boston-
   size-brackets for that sheet's other, priced, non-standard-size rules).
   Unlike the colour palette or the size brackets, the sheet lists this
   palette with no surcharge note at all, so a tint choice is free - it's
   carried through the cart/order/offer as information for the shop, the
   same way jamb colour already is, not priced into the line total.

   Reuses the same six manufacturer photos and captions already shown
   (read-only) in the product page's own "Stiklojums" tab - see
   bostonGlassSection in @/data/boston-construction. */
const IMG = "/images/boston-construction";

export const bostonGlassColors = [
  { key: "satins", labelKey: "glassCap6", image: `${IMG}/glass-satins.jpg` },
  { key: "bronza", labelKey: "glassCap3", image: `${IMG}/glass-bronza.jpg` },
  { key: "grafits", labelKey: "glassCap7", image: `${IMG}/glass-grafits.jpg` },
  { key: "hroms", labelKey: "glassCap4", image: `${IMG}/glass-hroms.jpg` },
  { key: "bronza-restots", labelKey: "glassCap5", image: `${IMG}/glass-bronza-restots.jpg` },
  { key: "hroms-restots", labelKey: "glassCap8", image: `${IMG}/glass-hroms-restots.jpg` },
];
