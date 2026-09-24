import { locales, defaultLocale } from "@/lib/i18n";
import { categories, products } from "@/data/products";
import { localizedUrl } from "@/lib/site";
import { serviceSlugs } from "@/data/services";

const STATIC_PATHS = [
  "",
  "/akcijas",
  "/jaunumi",
  "/apdare",
  "/razotajs-2",
  "/sadarbiba",
  "/pakalpojumi",
  "/par-mums",
  "/kontakti",
  "/privatumo-politika",
];

export default function sitemap() {
  const lastModified = new Date();
  const paths = [
    ...STATIC_PATHS,
    ...serviceSlugs.map((s) => `/pakalpojumi/${s}`),
    ...categories.map((c) => `/kategorija/${c.slug}`),
    ...products.map((p) => `/produkts/${p.id}`),
  ];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));
    languages["x-default"] = localizedUrl(defaultLocale, path);
    return locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: path.startsWith("/produkts") ? "monthly" : "weekly",
      priority: path === "" ? 1 : path.startsWith("/kategorija") ? 0.8 : 0.6,
      alternates: { languages },
    }));
  });
}
