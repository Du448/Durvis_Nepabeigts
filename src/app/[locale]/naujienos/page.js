import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import PageTitle from "@/components/PageTitle";
import { t } from "@/lib/i18n";
import { cardsFor } from "@/lib/catalog";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.news,
    title: t(locale, "pages.news.title"),
    description: t(locale, "pages.news.description"),
  });
}

export default async function NewsPage({ params }) {
  const locale = await resolveLocale(params);
  const news = cardsFor(products.filter((p) => p.isNew === true), locale);

  return (
    <main>
      <PageTitle
        title={t(locale, "pages.news.title")}
        description={t(locale, "pages.news.description")}
        image="https://images.unsplash.com/photo-1603673298820-40d77252226d?auto=format&fit=crop&w=2000&q=60"
      />

      <section>
        <div className="container py-12">
          <h2 className="sr-only">
            {news.length} {t(locale, "category.models")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
