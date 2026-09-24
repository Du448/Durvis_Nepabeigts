import Link from "next/link";
import Image from "next/image";
import { Layers, Wrench, ShieldCheck, MessageCircle, MapPin, Clock, Star } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { withLocaleHref, t } from "@/lib/i18n";
import { imageProps } from "@/lib/images";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";
import { products } from "@/data/products";
import { company, hoursFor } from "@/lib/site";
import { showroomPhotos, extraStats, testimonials } from "@/data/about";

const pick = (locale, obj) => (typeof obj === "string" ? obj : obj?.[locale] ?? obj?.lt ?? "");

const FALLBACK_INTRO_IMAGE =
  "https://images.unsplash.com/photo-1506636366880-b083d2cb2f34?auto=format&fit=crop&w=1800&q=80";

/* Counted from the live catalogue, so the numbers stay true as it changes.
   Rounded down to a tidy "N+" so they don't jump on every small import. */
function catalogueStats(locale) {
  const tidy = (n) => (n >= 100 ? `${Math.floor(n / 50) * 50}+` : n >= 20 ? `${Math.floor(n / 10) * 10}+` : String(n));
  const collections = new Set(products.map((p) => p.collection).filter(Boolean)).size;
  const colors = new Set(products.flatMap((p) => p.colors || []).filter(Boolean)).size;
  return [
    { value: tidy(products.length), label: t(locale, "pages.about.statModels") },
    { value: tidy(collections), label: t(locale, "pages.about.statCollections") },
    { value: tidy(colors), label: t(locale, "pages.about.statColors") },
  ];
}

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.about,
    title: t(locale, "pages.about.title"),
    description: t(locale, "pages.about.intro1"),
  });
}

export default async function AboutPage({ params }) {
  const locale = await resolveLocale(params);

  const stats = [
    ...extraStats.map((s) => ({ value: s.value, label: pick(locale, s.label) })),
    ...catalogueStats(locale),
  ];

  return (
    <main>
      <PageTitle
        title={t(locale, "pages.about.title")}
        image="https://images.unsplash.com/photo-1613544723301-176686aa9f09?auto=format&fit=crop&w=2000&q=60"
      />

      {/* Intro */}
      <section>
        <div className="container py-14">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[15px] text-ink">
              <p>
                {t(locale, "pages.about.intro1")}
              </p>
              <p>
                {t(locale, "pages.about.intro2")}
              </p>
              <p>
                {t(locale, "pages.about.intro3")}
              </p>
              <div>
                <Link href={withLocaleHref(locale, "/kontaktai")} className="btn btn-accent">
                  {t(locale, "pages.about.cta")}
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden border border-line bg-[--color-soft] aspect-16/10">
              <Image
                src={showroomPhotos[0] || FALLBACK_INTRO_IMAGE}
                alt=""
                fill
                {...imageProps(showroomPhotos[0] || FALLBACK_INTRO_IMAGE)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-[color:var(--color-soft)]">
        <div className="container py-10">
          <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <div className="text-[34px] font-medium leading-none text-[color:var(--color-accent)] sm:text-[42px]">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[14px] text-muted">{s.label}</div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="container py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <Layers size={18} />
                <span className="font-semibold">{t(locale, "pages.about.featuresTitle1")}</span>
              </div>
              <p className="text-[15px] text-muted">{t(locale, "pages.about.featuresDesc1")}</p>
            </div>
            <div className="border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <Wrench size={18} />
                <span className="font-semibold">{t(locale, "pages.about.featuresTitle2")}</span>
              </div>
              <p className="text-[15px] text-muted">{t(locale, "pages.about.featuresDesc2")}</p>
            </div>
            <div className="border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="font-semibold">{t(locale, "pages.about.featuresTitle3")}</span>
              </div>
              <p className="text-[15px] text-muted">{t(locale, "pages.about.featuresDesc3")}</p>
            </div>
            <div className="border border-line bg-white p-4">
              <div className="mb-2 text-ink inline-flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold">{t(locale, "pages.about.featuresTitle4")}</span>
              </div>
              <p className="text-[15px] text-muted">{t(locale, "pages.about.featuresDesc4")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom */}
      <section>
        <div className="container pb-16">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="text-[26px] font-medium text-[color:var(--color-title)]">
                {t(locale, "pages.about.showroomTitle")}
              </h2>
              <p className="mt-3 text-[15px] text-ink">{t(locale, "pages.about.showroomText")}</p>
              <div className="mt-5 space-y-3 text-[15px] text-ink">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                  <span>{company.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                  <span>
                    {hoursFor(locale).map((row) => (
                      <span key={row.days} className="block">
                        {row.days}: {row.time}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Link href={withLocaleHref(locale, "/kontaktai")} className="btn btn-outline-dark">
                  {t(locale, "pages.about.showroomCta")}
                </Link>
              </div>
            </div>
            {/* Real showroom shots once added in src/data/about.js; until then
                the interior door, exterior door and hardware detail. */}
            <div className="grid grid-cols-2 gap-4">
              {(showroomPhotos.length > 1
                ? showroomPhotos.slice(1, 4)
                : [
                    "https://images.unsplash.com/photo-1693387593120-bd37acc8cf57?auto=format&fit=crop&w=1400&q=80",
                    "https://images.unsplash.com/photo-1787491581029-e712d8e8caa4?auto=format&fit=crop&w=1400&q=80",
                    "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/6NcPT.jpg",
                  ]
              ).map((src, i) => (
                <div
                  key={src}
                  className={`relative overflow-hidden border border-line bg-[--color-soft] ${
                    i === 0 ? "col-span-2 aspect-16/9" : "aspect-4/3"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    {...imageProps(src)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials: hidden until real reviews are added in src/data/about.js */}
      {testimonials.length ? (
        <section className="bg-[color:var(--color-soft)]">
          <div className="container py-16">
            <h2 className="text-[26px] font-medium text-[color:var(--color-title)]">
              {t(locale, "pages.about.testimonialsTitle")}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((r) => (
                <figure key={r.name} className="border border-line bg-white p-5">
                  {r.rating ? (
                    <div className="mb-3 flex gap-0.5 text-[color:var(--color-accent)]" aria-label={`${r.rating}/5`}>
                      {Array.from({ length: r.rating }, (_, i) => (
                        <Star key={i} size={16} fill="currentColor" aria-hidden />
                      ))}
                    </div>
                  ) : null}
                  <blockquote className="text-[15px] text-ink">{pick(locale, r.text)}</blockquote>
                  <figcaption className="mt-4 text-[14px] font-semibold text-[color:var(--color-title)]">
                    {r.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
