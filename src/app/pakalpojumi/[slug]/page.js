import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Check } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { getService, serviceSlugs } from "@/data/services";

async function currentLocale() {
  const h = await headers();
  return getLocaleFromPathname(h.get("x-invoke-path") || "/");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await currentLocale();
  const service = getService(slug, locale);
  if (!service) return {};
  const title = `${service.title} | NT Durys`;
  return {
    title,
    description: service.description,
    openGraph: {
      title,
      description: service.description,
      locale: locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT",
      siteName: "NT Durys",
      type: "website",
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const locale = await currentLocale();
  const service = getService(slug, locale);
  if (!service) notFound();

  return (
    <main>
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
              <Link href={withLocaleHref(locale, "/kontakti")} className="btn btn-accent">
                {t(locale, "pages.about.cta")}
              </Link>
            </div>
            <nav className="border border-line bg-white p-5">
              <h2 className="t-widget mb-4">{t(locale, "footer.services")}</h2>
              <ul className="space-y-2.5">
                {serviceSlugs.map((s) => (
                  <li key={s}>
                    <Link
                      href={withLocaleHref(locale, `/pakalpojumi/${s}`)}
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
