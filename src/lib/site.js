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

export function localBusinessLd(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "NT Durys",
    legalName: company.legalName,
    url: localizedUrl(locale, ""),
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    email: company.email,
    telephone: phones.map((p) => p.label.replace(/\s+/g, "")),
    vatID: company.vat,
    taxID: company.code,
    address: { "@type": "PostalAddress", ...postalAddress },
    areaServed: { "@type": "Country", name: "Lithuania" },
    priceRange: "€€",
    openingHoursSpecification: openingHoursSpec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
  };
}
