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
    path: paths.deals,
    title: t(locale, "pages.deals.title"),
    description: t(locale, "pages.deals.description"),
  });
}

export default async function DealsPage({ params }) {
  const locale = await resolveLocale(params);
  const discounted = cardsFor(products.filter((p) => p.oldPrice != null), locale);

  return (
    <main>
      <PageTitle
        title={t(locale, "pages.deals.title")}
        description={t(locale, "pages.deals.description")}
        image="https://images.unsplash.com/photo-1525570665650-76bb26af503d?auto=format&fit=crop&w=2000&q=60"
      />

      <section>
        <div className="container py-12">
          <h2 className="sr-only">
            {discounted.length} {t(locale, "category.models")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {discounted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
