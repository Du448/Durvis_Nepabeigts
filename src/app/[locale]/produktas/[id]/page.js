import { notFound } from "next/navigation";
import { products, getProductById, getProductsByCategory } from "@/data/products";
import { locksFor } from "@/data/locks";
import ProductClient from "@/components/ProductClient";
import { DictProvider } from "@/components/DictProvider";
import JsonLd from "@/components/JsonLd";
import { locales, t } from "@/lib/i18n";
import { trData } from "@/lib/i18n-data";
import { cardsFor } from "@/lib/catalog";
import { buildDict } from "@/lib/dict";
import { isInStock } from "@/lib/product-utils";
import { hasManufacturer2Series, manufacturer2ColorQuery } from "@/lib/manufacturer2Series";
import { sizedImage } from "@/lib/images";
import { SITE_URL, localizedUrl } from "@/lib/site";
import { paths } from "@/lib/routes";
import { pageMetadata, resolveLocale } from "@/lib/page";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, id: p.id })));
}

const DESCRIPTION = {
  lt: (c, price) => `${c} kolekcijos durys. Kaina nuo ${price} €. Montavimas ir pristatymas visoje Lietuvoje.`,
  lv: (c, price) => `${c} kolekcijas durvis. Cena no ${price} €. Montāža un piegāde visā Lietuvā.`,
  en: (c, price) => `${c} collection doors. Price from €${price}. Installation and delivery across Lithuania.`,
};

async function resolve(params) {
  const { id } = await params;
  const locale = await resolveLocale(params);
  const product = getProductById(id);
  if (!product) notFound();
  return { locale, product };
}

const absolute = (src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

function describe(locale, product) {
  const short = trData(locale, product.short || "");
  const tail = (DESCRIPTION[locale] || DESCRIPTION.lt)(product.collection, product.price);
  return short ? `${short} ${tail}` : tail;
}

export async function generateMetadata({ params }) {
  const { locale, product } = await resolve(params);
  const name = trData(locale, product.name);
  const image = product.images?.[0];
  return pageMetadata({
    locale,
    path: paths.product(product.id),
    title: `${name} - ${product.collection}`,
    description: describe(locale, product),
    image: image ? sizedImage(image, 1200) : undefined,
    imageAlt: name,
  });
}

export default async function ProductPage({ params }) {
  const { locale, product } = await resolve(params);
  const name = trData(locale, product.name);
  const url = localizedUrl(locale, paths.product(product.id));

  const similar = cardsFor(
    getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4),
    locale
  );
  const configurator = hasManufacturer2Series(product.name)
    ? { colorQuery: manufacturer2ColorQuery(product) }
    : null;
  const dict = buildDict(
    locale,
    [product.name, product.short, product.specs, product.specsFull, product.description, product.finishMaterial],
    { colors: product.colors || [] }
  );

  const categoryName = t(locale, `categories.details.${product.category}.name`);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: product.id,
    url,
    description: describe(locale, product),
    image: (product.images || []).slice(0, 4).map((src) => absolute(sizedImage(src, 1200))),
    category: categoryName.startsWith("categories.") ? undefined : categoryName,
    ...(product.collection ? { model: product.collection } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: product.currency === "UAH" ? "UAH" : "EUR",
      availability: isInStock(product) ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t(locale, "common.home"), item: localizedUrl(locale, "") },
      ...(categoryName.startsWith("categories.")
        ? []
        : [{ "@type": "ListItem", position: 2, name: categoryName, item: localizedUrl(locale, paths.category(product.category)) }]),
      { "@type": "ListItem", position: categoryName.startsWith("categories.") ? 2 : 3, name, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <DictProvider dict={dict}>
        <ProductClient
          product={product}
          similar={similar}
          configurator={configurator}
          locks={locksFor(product.id, locale)}
        />
      </DictProvider>
    </>
  );
}
