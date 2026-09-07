import Link from "next/link";
import Image from "next/image";
import { Layers, Wrench, ShieldCheck, MessageCircle } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

export default async function AboutPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

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
                <Link href={withLocaleHref(locale, "/kontakti")} className="btn btn-accent">
                  {t(locale, "pages.about.cta")}
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden border border-line bg-[--color-soft] aspect-16/10">
              <Image
                src="https://images.unsplash.com/photo-1506636366880-b083d2cb2f34?auto=format&fit=crop&w=1800&q=80"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="container pb-16">
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
          {/* Interior door, exterior door, hardware detail. */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden border border-line bg-[--color-soft] aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1693387593120-bd37acc8cf57?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden border border-line bg-[--color-soft] aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1787491581029-e712d8e8caa4?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden border border-line bg-[--color-soft] aspect-4/3">
              <Image
                src="https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/6NcPT.jpg"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
