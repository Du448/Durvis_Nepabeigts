import PageTitle from "@/components/PageTitle";
import { t } from "@/lib/i18n";
import { privacy, privacyUpdated } from "@/data/privacy";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.privacy,
    title: t(locale, "legal.privacyTitle"),
    description: t(locale, "legal.privacyDescription"),
  });
}

export default async function PrivacyPage({ params }) {
  const locale = await resolveLocale(params);
  const sections = privacy[locale] || privacy.lt;

  return (
    <main>
      <PageTitle title={t(locale, "legal.privacyTitle")} />
      <section>
        <div className="container max-w-[860px] space-y-8 py-14 text-[15px] text-ink">
          {sections.map((s) => (
            <div key={s.h} className="space-y-3">
              <h2 className="text-[20px] font-semibold">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          ))}
          <p className="text-[13px] text-muted">{privacyUpdated}</p>
        </div>
      </section>
    </main>
  );
}
