import PartnersClient from "@/components/PartnersClient";
import { t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.partners,
    title: t(locale, "partners.title"),
    description: t(locale, "partners.lead"),
  });
}

export default function PartnersPage() {
  return (
    <main>
      <PartnersClient />
    </main>
  );
}
