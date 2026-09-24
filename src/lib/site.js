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
