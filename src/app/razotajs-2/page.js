import { Suspense } from "react";
import Manufacturer2Client from "@/components/Manufacturer2Client";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "pages.manufacturer2.title")} | NT Durys`;
  const description = t(locale, "pages.manufacturer2.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "lv" ? "lv_LV" : locale === "en" ? "en_US" : "lt_LT",
      siteName: "NT Durys",
      type: "website",
    },
  };
}

export default function Manufacturer2Page() {
  return (
    <main>
      <Suspense fallback={null}>
        <Manufacturer2Client />
      </Suspense>
    </main>
  );
}
