import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { withLocaleHref, t } from "@/lib/i18n";
import { cardsFor, searchProducts } from "@/lib/catalog";
import { getProducts } from "@/lib/pricedCatalog";
import { paths } from "@/lib/routes";
import { pageMetadata, resolveLocale } from "@/lib/page";

/* Searched on the server, so the browser gets the matching cards rather than
   the whole catalogue. Results depend on ?q=, so this page is rendered per
   request (and kept out of the index). */

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.search,
    title: t(locale, "search.title"),
    description: t(locale, "search.results"),
    noindex: true,
  });
}

export default async function SearchPage({ params, searchParams }) {
  const locale = await resolveLocale(params);
  const q = String((await searchParams).q || "").trim();
  const results = cardsFor(searchProducts(q, locale, await getProducts()), locale);

  return (
    <main>
      <section className="border-b border-line">
        <div className="container py-10">
          <h1 className="text-[28px] font-medium leading-[1.3] text-[color:var(--color-title)] sm:text-[36px]">
            {t(locale, "search.title")}
          </h1>
          <p className="mt-2 text-muted">
            {t(locale, "search.results")}: &quot;{q}&quot; ({results.length} {t(locale, "search.found")})
          </p>
        </div>
      </section>

      <section>
        <div className="container py-10">
          <h2 className="sr-only">
            {results.length} {t(locale, "category.models")}
          </h2>
          {q && results.length === 0 ? (
            <div className="text-ink">
              {t(locale, "search.nothingFound")}{" "}
              <Link className="text-accent underline" href={withLocaleHref(locale, "/")}>
                {t(locale, "search.backHome")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
