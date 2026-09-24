import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import JsonLd from "@/components/JsonLd";
import { locales, withLocaleHref, t } from "@/lib/i18n";
import { getService, serviceSlugs } from "@/data/services";
import { SITE_URL, localizedUrl } from "@/lib/site";
import { paths } from "@/lib/routes";
import { pageMetadata, resolveLocale } from "@/lib/page";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const service = getService(slug, locale);
  if (!service) return {};
  return pageMetadata({ locale, path: paths.service(slug), title: service.title, description: service.description });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const service = getService(slug, locale);
  if (!service) notFound();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: localizedUrl(locale, paths.service(slug)),
    areaServed: { "@type": "Country", name: "Lithuania" },
    provider: { "@id": `${SITE_URL}/#business` },
  };

  return (
    <main>
      <JsonLd data={serviceLd} />
      <PageTitle title={service.title} />
      <section>
        <div className="container py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6 text-[15px] text-ink">
              <p className="text-[17px]">{service.description}</p>
              <ul className="space-y-3">
                {service.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 shrink-0 text-[color:var(--color-accent)]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link href={withLocaleHref(locale, paths.contacts)} className="btn btn-accent">
                {t(locale, "pages.about.cta")}
              </Link>
            </div>
            <nav className="border border-line bg-white p-5">
              <h2 className="t-widget mb-4">{t(locale, "footer.services")}</h2>
              <ul className="space-y-2.5">
                {serviceSlugs.map((s) => (
                  <li key={s}>
                    <Link
                      href={withLocaleHref(locale, paths.service(s))}
                      className={s === slug ? "font-semibold text-ink" : "text-muted hover:text-ink"}
                    >
                      {getService(s, locale).title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
