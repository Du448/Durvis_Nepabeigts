import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Mail, Phone } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import JsonLd from "@/components/JsonLd";
import { locales, withLocaleHref, t } from "@/lib/i18n";
import { getService, serviceSlugs, serviceUi } from "@/data/services";
import { SITE_URL, company, localizedUrl, mainPhone } from "@/lib/site";
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

function SectionHeading({ children }) {
  return <h2 className="text-[22px] font-medium leading-[1.3] text-[color:var(--color-title)] sm:text-[26px]">{children}</h2>;
}

/* A service page: intro and key figures, the steps, an indicative price
   table, FAQ (native <details>, so it works without JS) and a contact box.
   Content and prices live in @/data/services. */
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const service = getService(slug, locale);
  if (!service) notFound();
  const ui = serviceUi(locale);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: localizedUrl(locale, paths.service(slug)),
    areaServed: { "@type": "Country", name: "Lithuania" },
    provider: { "@id": `${SITE_URL}/#business` },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <PageTitle title={service.title} />

      <section>
        <div className="container grid grid-cols-1 gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0 space-y-14">
            {/* Intro + key figures */}
            <div className="space-y-5">
              {service.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[18px] leading-[1.65] text-ink" : "text-[16px] leading-[1.75] text-muted"}>
                  {p}
                </p>
              ))}
              {service.highlights.length ? (
                <dl className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-[color:var(--color-line)] sm:grid-cols-3">
                  {service.highlights.map((h) => (
                    <div key={h.label} className="flex flex-col-reverse bg-white px-5 py-5">
                      <dt className="mt-2 text-[13px] leading-[1.4] text-muted">{h.label}</dt>
                      <dd className="text-[26px] font-semibold leading-none text-[color:var(--color-accent)] sm:text-[30px]">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            {/* Steps */}
            <div>
              <SectionHeading>{service.stepsHeading}</SectionHeading>
              <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.steps.map((step, i) => (
                  <li key={step.title} className="relative border border-line bg-white p-5 pl-16">
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center bg-[color:var(--color-accent)] text-[14px] font-semibold text-white"
                    >
                      {i + 1}
                    </span>
                    <h3 className="text-[16px] font-semibold text-[color:var(--color-title)]">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Prices */}
            {service.prices.length ? (
              <div>
                <SectionHeading>{ui.pricesHeading}</SectionHeading>
                <div className="mt-6 space-y-6">
                  {service.prices.map((group, gi) => (
                    <table key={group.title || gi} className="w-full border-collapse border border-line bg-white text-[15px]">
                      {group.title ? (
                        <caption className="bg-[color:var(--color-soft)] px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-title)] [caption-side:top] border border-b-0 border-line">
                          {group.title}
                        </caption>
                      ) : null}
                      <thead className="sr-only">
                        <tr>
                          <th scope="col">{ui.service}</th>
                          <th scope="col">{ui.price}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map(([label, price]) => (
                          <tr key={label} className="border-t border-line first:border-t-0">
                            <th scope="row" className="px-5 py-3.5 text-left font-normal leading-[1.5] text-ink">
                              {label}
                            </th>
                            <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold text-[color:var(--color-title)]">
                              {price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}
                </div>
                {service.priceNote ? <p className="mt-4 text-[13px] leading-[1.6] text-muted">{service.priceNote}</p> : null}
              </div>
            ) : null}

            {/* FAQ */}
            <div>
              <SectionHeading>{ui.faqHeading}</SectionHeading>
              <div className="mt-6 border-t border-line">
                {service.faq.map((f) => (
                  <details key={f.q} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium text-[color:var(--color-title)] [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pb-5 pr-8 text-[15px] leading-[1.7] text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: contact + other services */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-[color:var(--color-accent)] p-6 text-white">
              <p className="text-[20px] font-medium">{ui.ctaTitle}</p>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/85">{ui.ctaText}</p>
              <div className="mt-5 space-y-2.5 text-[15px]">
                <a href={mainPhone.href} className="flex items-center gap-2.5 font-semibold hover:underline">
                  <Phone size={16} aria-hidden="true" />
                  {mainPhone.label}
                </a>
                <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 hover:underline">
                  <Mail size={16} aria-hidden="true" />
                  {company.email}
                </a>
              </div>
              <Link
                href={withLocaleHref(locale, paths.contacts)}
                className="mt-6 inline-flex w-full items-center justify-center bg-white px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-accent)] transition-colors hover:bg-white/90"
              >
                {ui.ctaButton}
              </Link>
            </div>

            <nav aria-label={t(locale, "footer.services")} className="border border-line bg-white p-5">
              <h2 className="t-widget mb-4">{t(locale, "footer.services")}</h2>
              <ul className="space-y-1">
                {serviceSlugs.map((s) => (
                  <li key={s}>
                    <Link
                      href={withLocaleHref(locale, paths.service(s))}
                      aria-current={s === slug ? "page" : undefined}
                      className={`block border-l-2 py-1.5 pl-3 text-[15px] transition-colors ${
                        s === slug
                          ? "border-[color:var(--color-accent)] font-semibold text-ink"
                          : "border-transparent text-muted hover:border-line hover:text-ink"
                      }`}
                    >
                      {getService(s, locale).title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}
