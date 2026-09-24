import { locales, defaultLocale } from "@/lib/i18n";
import { categories, products } from "@/data/products";
import { localizedUrl } from "@/lib/site";
import { serviceSlugs } from "@/data/services";
import { paths } from "@/lib/routes";

const STATIC_PATHS = [
  "",
  paths.deals,
  paths.news,
  paths.finishes,
  paths.configurator,
  paths.partners,
  paths.services,
  paths.about,
  paths.contacts,
  paths.privacy,
];

export default function sitemap() {
  const lastModified = new Date();
  const categoryPaths = new Set(categories.map((c) => paths.category(c.slug)));
  const productPaths = new Set(products.map((p) => paths.product(p.id)));
  const all = [
    ...STATIC_PATHS,
    ...serviceSlugs.map((s) => paths.service(s)),
    ...categoryPaths,
    ...productPaths,
  ];

  return all.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));
    languages["x-default"] = localizedUrl(defaultLocale, path);
    return locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: productPaths.has(path) ? "monthly" : "weekly",
      priority: path === "" ? 1 : categoryPaths.has(path) ? 0.8 : 0.6,
      alternates: { languages },
    }));
  });
}
