import { headers } from "next/headers";
import PageTitle from "@/components/PageTitle";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import { privacy, privacyUpdated } from "@/data/privacy";

async function currentLocale() {
  const h = await headers();
  return getLocaleFromPathname(h.get("x-invoke-path") || "/");
}

export async function generateMetadata() {
  const locale = await currentLocale();
  return {
    title: `${t(locale, "legal.privacyTitle")} | NT Durys`,
    description: t(locale, "legal.privacyDescription"),
  };
}

export default async function PrivacyPage() {
  const locale = await currentLocale();
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
