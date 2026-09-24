import Link from "next/link";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

export const metadata = {
  title: "404 | NT Durys",
  robots: { index: false },
};

export default async function NotFound() {
  const h = await headers();
  const locale = getLocaleFromPathname(h.get("x-invoke-path") || "/");

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-[96px] font-semibold leading-none text-[color:var(--color-accent)]">404</div>
      <h1 className="mt-4 text-[28px] font-medium text-ink">{t(locale, "legal.notFoundTitle")}</h1>
      <p className="mt-3 max-w-[480px] text-muted">{t(locale, "legal.notFoundText")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={withLocaleHref(locale, "/")} className="btn btn-accent">
          {t(locale, "legal.notFoundHome")}
        </Link>
        <Link href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")} className="btn btn-outline-dark">
          {t(locale, "legal.notFoundCatalogue")}
        </Link>
        <Link href={withLocaleHref(locale, "/kontakti")} className="btn btn-outline-dark">
          {t(locale, "legal.notFoundContact")}
        </Link>
      </div>
    </main>
  );
}
