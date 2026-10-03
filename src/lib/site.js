import { localePath } from "@/lib/i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ntdurys.lt").replace(/\/$/, "");

export const company = {
  legalName: "UAB „TN Baltic“",
  code: "302435068",
  vat: "LT100004913115",
  address: "Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.",
  email: "info@tnbaltic.lt",
};

export function localizedUrl(locale, path) {
  return `${SITE_URL}${localePath(locale, path)}`;
}


export const phones = [
  { href: "tel:+37066213171", label: "+370 662 13171" },
  { href: "tel:+37060557978", label: "+370 605 57978" },
];
export const mainPhone = phones[0];

// Digits only, international format, for wa.me links.
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "37066213171").replace(/\D/g, "");

// Shown on the contacts page and in the footer; keep in step with the showroom's real hours.
export const openingHours = {
  lt: [
    { days: "Pr–Pn", time: "9:00–18:00" },
    { days: "Št–Sk", time: "Nedirbame" },
  ],
  lv: [
    { days: "P–Pk", time: "9:00–18:00" },
    { days: "S–Sv", time: "Slēgts" },
  ],
  en: [
    { days: "Mon–Fri", time: "9:00–18:00" },
    { days: "Sat–Sun", time: "Closed" },
  ],
  ru: [
    { days: "Пн–Пт", time: "9:00–18:00" },
    { days: "Сб–Вс", time: "Выходной" },
  ],
};

export const hoursFor = (locale) => openingHours[locale] || openingHours.lt;

// Machine-readable opening hours for LocalBusiness JSON-LD; keep in step with openingHours above.
export const openingHoursSpec = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
];

export const postalAddress = {
  streetAddress: "Džūkų g. 17",
  addressLocality: "Šveicarijos k.",
  addressRegion: "Jonavos r.",
  postalCode: "LT-55301",
  addressCountry: "LT",
};

/* Public profiles of the business (Facebook, Instagram, Google Business
   Profile, Rekvizitai, …), comma-separated in NEXT_PUBLIC_SOCIAL_PROFILES.
   They go into the structured data as sameAs, which is how search engines and
   AI assistants tie this site to the same business mentioned elsewhere. */
export const socialProfiles = (process.env.NEXT_PUBLIC_SOCIAL_PROFILES || "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => /^https?:\/\//.test(s));

export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${postalAddress.streetAddress}, ${postalAddress.addressLocality}, ${postalAddress.postalCode}`
)}`;

const LANGUAGES = { lt: "lt-LT", lv: "lv-LV", en: "en", ru: "ru" };

// What the business does, in the page's language - read by search engines and
// AI assistants as the topics the business is an authority on.
const KNOWS_ABOUT = {
  lt: ["Lauko durys", "Buto lauko durys", "Namo lauko durys", "Vidaus durys", "Paslėptos durys", "Durų montavimas", "Durų matavimas", "Durų spynos ir furnitūra"],
  lv: ["Ārdurvis", "Ārdurvis dzīvoklim", "Ārdurvis privātmājai", "Iekšdurvis", "Slēptās durvis", "Durvju montāža", "Durvju uzmērīšana", "Durvju slēdzenes un furnitūra"],
  en: ["Entrance doors", "Apartment entrance doors", "House entrance doors", "Interior doors", "Hidden doors", "Door installation", "Door measurement", "Door locks and hardware"],
  ru: ["Входные двери", "Входные двери в квартиру", "Входные двери в дом", "Межкомнатные двери", "Скрытые двери", "Монтаж дверей", "Замер дверей", "Дверные замки и фурнитура"],
};

/* Site-wide structured data: the business (a local shop with a showroom)
   and the website it publishes, linked by @id so every page's Product,
   Service and breadcrumb data points back to one entity. */
export function localBusinessLd(locale) {
  const phoneNumbers = phones.map((p) => p.label.replace(/\s+/g, ""));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HomeAndConstructionBusiness", "Store"],
        "@id": `${SITE_URL}/#business`,
        name: "NT Durys",
        alternateName: ["NTDurys", "ntdurys.lt"],
        legalName: company.legalName,
        url: localizedUrl(locale, ""),
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        image: `${SITE_URL}/og-image.png`,
        email: company.email,
        telephone: phoneNumbers,
        vatID: company.vat,
        taxID: company.code,
        address: { "@type": "PostalAddress", ...postalAddress },
        hasMap: mapUrl,
        areaServed: { "@type": "Country", name: "Lithuania", identifier: "LT" },
        knowsAbout: KNOWS_ABOUT[locale] || KNOWS_ABOUT.lt,
        knowsLanguage: Object.values(LANGUAGES),
        currenciesAccepted: "EUR",
        priceRange: "€€",
        contactPoint: phoneNumbers.map((telephone) => ({
          "@type": "ContactPoint",
          telephone,
          email: company.email,
          contactType: "customer service",
          areaServed: "LT",
          availableLanguage: ["Lithuanian", "Latvian", "English"],
        })),
        openingHoursSpecification: openingHoursSpec.map((s) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: s.days,
          opens: s.opens,
          closes: s.closes,
        })),
        ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: localizedUrl(locale, ""),
        name: "NT Durys",
        inLanguage: LANGUAGES[locale] || LANGUAGES.lt,
        publisher: { "@id": `${SITE_URL}/#business` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${localizedUrl(locale, "/paieska")}?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
