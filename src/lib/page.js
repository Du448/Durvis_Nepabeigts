import { notFound } from "next/navigation";
import { locales, defaultLocale } from "@/lib/i18n";
import { SITE_URL, localizedUrl } from "@/lib/site";

export const BRAND = "NT Durys";

// Site-wide title and description, used by the layout and the homepage.
const SITE = {
  lt: {
    title: "NT Durys - lauko ir vidaus durys Lietuvoje",
    description:
      "NT Durys: lauko ir vidaus durys, profesionalus montavimas ir pristatymas visoje Lietuvoje. Platus asortimentas, konsultacijos ir garantija.",
  },
  lv: {
    title: "NT Durys - ārdurvis un iekšdurvis Lietuvā",
    description:
      "NT Durys: ārdurvis un iekšdurvis, profesionāla montāža un piegāde visā Lietuvā. Plašs sortiments, konsultācijas un garantija.",
  },
  en: {
    title: "NT Durys - entrance and interior doors in Lithuania",
    description:
      "NT Durys: entrance and interior doors with professional installation and delivery across Lithuania. Wide range, expert advice and warranty.",
  },
};

export const siteTitle = (locale) => (SITE[locale] || SITE.lt).title;
export const siteDescription = (locale) => (SITE[locale] || SITE.lt).description;

const OG_LOCALES = { lt: "lt_LT", lv: "lv_LV", en: "en_GB" };

// For generateStaticParams in pages that only vary by language.
export const localeParams = () => locales.map((locale) => ({ locale }));

/* The [locale] segment of the current route. Anything outside the known
   languages is a 404 (the proxy already sends bare paths to /lt). */
export async function resolveLocale(params) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return locale;
}

/* Full metadata for one localized page: title, description, canonical and
   hreflang alternates, Open Graph and Twitter. `path` is the path without
   the locale ("" for the homepage). `image` is an absolute URL or a path on
   this site; without one the section's opengraph-image file is used. */
export function pageMetadata({ locale, path, title, description, image, imageAlt, type = "website", noindex = false }) {
  const fullTitle = title ? `${title} | ${BRAND}` : undefined;
  const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));
  languages["x-default"] = localizedUrl(defaultLocale, path);
  const url = localizedUrl(locale, path);
  const images = image
    ? [{ url: image.startsWith("http") ? image : `${SITE_URL}${image}`, alt: imageAlt || title || BRAND }]
    : undefined;

  return {
    ...(fullTitle ? { title: fullTitle } : {}),
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND,
      locale: OG_LOCALES[locale] || OG_LOCALES.lt,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
