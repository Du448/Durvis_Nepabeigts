import Link from "next/link";
import PageTitle from "@/components/PageTitle";
import { withLocaleHref, t } from "@/lib/i18n";
import { getService, serviceSlugs } from "@/data/services";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.services,
    title: t(locale, "pages.services.title"),
    description: t(locale, "pages.services.description"),
  });
}

export default async function ServicesPage({ params }) {
  const locale = await resolveLocale(params);

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
                href={withLocaleHref(locale, paths.service(slug))}
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
