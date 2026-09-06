import PageTitle from "@/components/PageTitle";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";
import WishlistClient from "@/components/WishlistClient";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "wishlist.title")} | Durų Namai`;
  const description = t(locale, "wishlist.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT",
      siteName: "Durų Namai",
      type: "website",
    },
  };
}

export default async function VelmesPage() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <main>
      <PageTitle title={t(locale, "wishlist.title")} description={t(locale, "wishlist.description")} />

      <WishlistClient />
    </main>
  );
}
