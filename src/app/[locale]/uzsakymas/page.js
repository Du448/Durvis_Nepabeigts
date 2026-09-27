import PageTitle from "@/components/PageTitle";
import OrderClient from "@/components/OrderClient";
import { t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.order,
    title: t(locale, "order.title"),
    description: t(locale, "order.description"),
    noindex: true,
  });
}

export default async function OrderPage({ params }) {
  const locale = await resolveLocale(params);

  return (
    <main>
      <PageTitle title={t(locale, "order.title")} description={t(locale, "order.description")} />
      <OrderClient />
    </main>
  );
}
