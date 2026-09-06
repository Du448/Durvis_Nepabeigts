import FinishesClient from "@/components/FinishesClient";
import { headers } from "next/headers";
import { getLocaleFromPathname, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  const title = `${t(locale, "finishes.title")} | Durų Namai`;
  const description = t(locale, "finishes.lead");

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

export default function FinishesPage() {
  return (
    <main>
      <FinishesClient />
    </main>
  );
}
