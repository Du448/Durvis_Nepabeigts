import { locales, defaultLocale } from "@/lib/i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ntdurys.lt").replace(/\/$/, "");

export const company = {
  legalName: "UAB „TN Baltic“",
  code: "302435068",
  vat: "LT100004913115",
  address: "Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.",
  email: "info@tnbaltic.lt",
};

export function stripLocale(pathname) {
  const parts = (pathname || "/").split("?")[0].split("/").filter(Boolean);
  if (locales.includes(parts[0])) parts.shift();
  return parts.length ? `/${parts.join("/")}` : "";
}

export function localizedUrl(locale, path) {
  return `${SITE_URL}/${locale}${path}`;
}

export function alternatesFor(pathname, locale) {
  const path = stripLocale(pathname);
  const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));
  languages["x-default"] = localizedUrl(defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
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
