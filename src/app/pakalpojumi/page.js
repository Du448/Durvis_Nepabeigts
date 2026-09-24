import PageTitle from "@/components/PageTitle";
import { headers } from "next/headers";
import Link from "next/link";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { getService, serviceSlugs } from "@/data/services";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "pages.services.title")} | Durų Namai`;
  const description = t(locale, "pages.services.description");

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

export default async function PakalpojumiPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <main>
      <PageTitle title={t(locale, "pages.services.title")} />
      <section>
        <div className="container grid grid-cols-1 gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSlugs.map((slug) => {
            const s = getService(slug, locale);
            return (
              <Link
                key={slug}
                href={withLocaleHref(locale, `/pakalpojumi/${slug}`)}
                className="block border border-line bg-white p-5 transition-colors hover:border-ink"
              >
                <h2 className="mb-2 font-semibold text-ink">{s.title}</h2>
                <p className="text-[15px] text-muted">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
