import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import PageTitle from "@/components/PageTitle";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "pages.news.title")} | Durų Namai`;
  const description = t(locale, "pages.news.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT",
      siteName: "Durų Namai",
      type: "website",
    },
  };
}

export default async function JaunumiPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const news = products.filter((p) => p.isNew === true);

  const title = t(locale, "pages.news.title");
  const description = t(locale, "pages.news.description");

  return (
    <main>
      <PageTitle title={title} description={description}
        image="https://images.unsplash.com/photo-1603673298820-40d77252226d?auto=format&fit=crop&w=2000&q=60" />

      <section>
        <div className="container py-12">
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
