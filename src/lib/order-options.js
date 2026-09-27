/* Maps the fulfilment/jamb-finish option codes the product page's toggles
   write (and the cart stores per line) to the translation keys those same
   toggles show - shared so the cart, the contact form's prefilled message
   and the request email all describe a choice in the exact same words. */
export const SERVICE_OPTION_KEYS = {
  pickup: "product.optionPickup",
  measurement: "product.optionMeasurement",
  deliveryOnly: "product.optionDeliveryOnly",
  installDelivery: "product.optionInstallDelivery",
  jambFinishStandardSmall: "product.jambFinishStandardSmall",
  jambFinishStandardLarge: "product.jambFinishStandardLarge",
  jambFinishCustomSmall: "product.jambFinishCustomSmall",
  jambFinishCustomLarge: "product.jambFinishCustomLarge",
};

export function serviceLabels(codes, t, locale) {
  return (codes || []).map((code) => SERVICE_OPTION_KEYS[code]).filter(Boolean).map((key) => t(locale, key));
}
