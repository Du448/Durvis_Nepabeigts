import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/data/products";
import CategoryClient from "@/components/CategoryClient";
import { DictProvider } from "@/components/DictProvider";
import JsonLd from "@/components/JsonLd";
import { locales, t } from "@/lib/i18n";
import { cardsFor } from "@/lib/catalog";
import { buildDict } from "@/lib/dict";
import { localizedUrl } from "@/lib/site";
import { CATEGORY_SLUGS, categoryIdFromSlug, paths } from "@/lib/routes";
import { pageMetadata, resolveLocale } from "@/lib/page";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.values(CATEGORY_SLUGS).map((slug) => ({ locale, slug })));
}

const BANNERS = {
  "ardurvis-dzivoklim": "/scenes/ardurvis-dzivoklim.webp",
  "ardurvis-privatmajai": "/scenes/ardurvis-privatmajai.webp",
  ieksdurvis: "/scenes/ieksdurvis.webp",
  "sleptas-durvis": "/scenes/sleptas-durvis.webp",
};

const SUFFIX = {
  lt: "Montavimas ir pristatymas visoje Lietuvoje.",
  lv: "Montāža un piegāde visā Lietuvā.",
  en: "Installation and delivery across Lithuania.",
};

function categoryText(locale, id) {
  const category = getCategoryBySlug(id);
  const name = t(locale, `categories.details.${id}.name`);
  const description = t(locale, `categories.details.${id}.description`);
  return {
    name: name.startsWith("categories.") ? category?.name || id : name,
    description: description.startsWith("categories.") ? category?.description || "" : description,
  };
}

async function resolve(params) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const id = categoryIdFromSlug(slug);
  if (!id || !getCategoryBySlug(id)) notFound();
  return { locale, id };
}

export async function generateMetadata({ params }) {
  const { locale, id } = await resolve(params);
  const { name, description } = categoryText(locale, id);
  return pageMetadata({
    locale,
    path: paths.category(id),
    title: name,
    description: `${description} ${SUFFIX[locale] || SUFFIX.lt}`.trim(),
    image: BANNERS[id],
    imageAlt: name,
  });
}

export default async function CategoryPage({ params }) {
  const { locale, id } = await resolve(params);
  const { name } = categoryText(locale, id);
  const raw = getProductsByCategory(id);
  const cards = cardsFor(raw, locale);
  const typeCounts = Object.fromEntries(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, categoryText(locale, c.slug).name]));
  // Only colour names need the dictionary here; card names come translated.
  const dict = buildDict(locale, [], { colors: raw.flatMap((p) => p.colors || []) });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t(locale, "common.home"), item: localizedUrl(locale, "") },
      { "@type": "ListItem", position: 2, name, item: localizedUrl(locale, paths.category(id)) },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <DictProvider dict={dict}>
        {/* CategoryClient reads its filters from the query string. */}
        <Suspense fallback={null}>
          <CategoryClient
            slug={id}
            category={getCategoryBySlug(id)}
            products={cards}
            typeCounts={typeCounts}
            categoryNames={categoryNames}
          />
        </Suspense>
      </DictProvider>
    </>
  );
}
