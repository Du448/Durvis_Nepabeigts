/* The Boston series' manufacturer-construction sections, modelled on
   m-lux.by's own product-page tabs (see the "m-lux Konstruktīvs section"
   memory) - a banner photo plus an autoplaying feature carousel per tab.
   Photos are cropped from the manufacturer's own "BOSTON Prezentācija"
   catalogue (public/images/boston-construction), so they are the real
   construction renders, not stock photography. Headings/subtitles/captions
   are translated through the product.* keys in @/lib/i18n.

   The "hardware" tab has two variants: `bostonHardwareSection` (the
   standard "CBA" KDL-6085 mechanical lock every regular Boston door ships
   with) and `bostonSmartHardwareSection` (the biometric "CBA" PSL-2
   smart lock the catalogue's "Smart Lux Boston AG-S####" models carry
   instead - see each product's own "Slēdzeņu sistēma" spec in
   products.js). ProductTabs picks between them by product id. */
const IMG = "/images/boston-construction";

export const bostonConstructionSection = {
  key: "construction",
  tabKey: "tabConstruction",
  headingKey: "constructionHeading",
  subtitleKey: "constructionSubtitle",
  banner: `${IMG}/06-lifestyle-banner.jpg`,
  slides: [
    { image: `${IMG}/01-termorazryv.jpg`, captionKey: "constructionCap1" },
    { image: `${IMG}/02-korobs.jpg`, captionKey: "constructionCap2" },
    { image: `${IMG}/03-polotno.jpg`, captionKey: "constructionCap3" },
    { image: `${IMG}/04-divkrasu-polotne.jpg`, captionKey: "constructionCap4" },
    { image: `${IMG}/05-viena-plakne.jpg`, captionKey: "constructionCap5" },
    { image: `${IMG}/12-decor-stapik1.jpg`, captionKey: "constructionCap6" },
    { image: `${IMG}/08-menteles-foto.jpg`, captionKey: "constructionCap7" },
  ],
};

export const bostonHardwareSection = {
  key: "hardware",
  tabKey: "tabHardware",
  headingKey: "hardwareHeading",
  subtitleKey: "hardwareSubtitle",
  banner: `${IMG}/15-atslega-banner.jpg`,
  slides: [
    { image: `${IMG}/09-atslega.jpg`, captionKey: "hardwareCap1" },
    { image: `${IMG}/10-slledzene-mehanisms.jpg`, captionKey: "hardwareCap2" },
    { image: `${IMG}/16-rokturi-krasas.jpg`, captionKey: "hardwareCap3" },
  ],
};

export const bostonSmartHardwareSection = {
  key: "hardware",
  tabKey: "tabHardware",
  headingKey: "smartHardwareHeading",
  subtitleKey: "smartHardwareSubtitle",
  noteKey: "smartHardwareNote",
  banner: `${IMG}/smart-lock-banner.jpg`,
  slides: [
    { image: `${IMG}/smart-lock-closeup.jpg`, captionKey: "smartHardwareCap1" },
    { image: `${IMG}/smart-lock-render.jpg`, captionKey: "smartHardwareCap2" },
    { image: `${IMG}/smart-lock-methods.jpg`, captionKey: "smartHardwareCap3" },
  ],
};

export const bostonGlassSection = {
  key: "glass",
  tabKey: "tabGlass",
  headingKey: "glassHeading",
  subtitleKey: "glassSubtitle",
  noteKey: "glassNote",
  banner: `${IMG}/glass-triplex-banner.jpg`,
  slides: [
    { image: `${IMG}/17-stikls-polotne.jpg`, captionKey: "glassCap1" },
    { image: `${IMG}/18-stikls-panoram.jpg`, captionKey: "glassCap2" },
    { image: `${IMG}/glass-bronza.jpg`, captionKey: "glassCap3" },
    { image: `${IMG}/glass-hroms.jpg`, captionKey: "glassCap4" },
    { image: `${IMG}/glass-bronza-restots.jpg`, captionKey: "glassCap5" },
    { image: `${IMG}/glass-satins.jpg`, captionKey: "glassCap6" },
    { image: `${IMG}/glass-grafits.jpg`, captionKey: "glassCap7" },
    { image: `${IMG}/glass-hroms-restots.jpg`, captionKey: "glassCap8" },
  ],
};

export const bostonCustomSizeSection = {
  key: "customSize",
  tabKey: "tabCustomSize",
  headingKey: "customSizeHeading",
  subtitleKey: "customSizeSubtitle",
  noteKey: "customSizeNote",
  banner: `${IMG}/size-lifestyle-banner.jpg`,
  slides: [
    { image: `${IMG}/size-single-leaf.jpg`, captionKey: "customSizeCap1" },
    { image: `${IMG}/size-double-leaf.jpg`, captionKey: "customSizeCap2" },
    { image: `${IMG}/size-active-leaf.jpg`, captionKey: "customSizeCap3" },
  ],
};

/* Assembled per-product: pass `isSmartLux` (product.id starts with
   "boston-smart-lux") to swap in the biometric-lock hardware tab. */
export function getBostonConstructionSections(isSmartLux) {
  return [
    bostonConstructionSection,
    isSmartLux ? bostonSmartHardwareSection : bostonHardwareSection,
    bostonGlassSection,
    bostonCustomSizeSection,
  ];
}
