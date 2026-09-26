import PageTitle from "@/components/PageTitle";
import CompareClient from "@/components/CompareClient";
import { t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.compare,
    title: t(locale, "compare.title"),
    description: t(locale, "compare.description"),
    noindex: true,
  });
}

export default async function ComparePage({ params }) {
  const locale = await resolveLocale(params);

  return (
    <main>
      <PageTitle title={t(locale, "compare.title")} description={t(locale, "compare.description")} />
      <CompareClient />
    </main>
  );
}
