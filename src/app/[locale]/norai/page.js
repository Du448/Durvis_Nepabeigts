import PageTitle from "@/components/PageTitle";
import WishlistClient from "@/components/WishlistClient";
import { t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.wishlist,
    title: t(locale, "wishlist.title"),
    description: t(locale, "wishlist.description"),
    noindex: true,
  });
}

export default async function WishlistPage({ params }) {
  const locale = await resolveLocale(params);

  return (
    <main>
      <PageTitle title={t(locale, "wishlist.title")} description={t(locale, "wishlist.description")} />
      <WishlistClient />
    </main>
  );
}
