"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { paths } from "@/lib/routes";

// A client component: not-found receives no params, so the language comes from the URL.
export default function NotFound() {
  const locale = getLocaleFromPathname(usePathname() || "/");

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <title>404 | NT Durys</title>
      <meta name="robots" content="noindex" />
      <div className="text-[96px] font-semibold leading-none text-[color:var(--color-accent)]">404</div>
      <h1 className="mt-4 text-[28px] font-medium text-ink">{t(locale, "legal.notFoundTitle")}</h1>
      <p className="mt-3 max-w-[480px] text-muted">{t(locale, "legal.notFoundText")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={withLocaleHref(locale, "/")} className="btn btn-accent">
          {t(locale, "legal.notFoundHome")}
        </Link>
        <Link href={withLocaleHref(locale, paths.category("ardurvis-dzivoklim"))} className="btn btn-outline-dark">
          {t(locale, "legal.notFoundCatalogue")}
        </Link>
        <Link href={withLocaleHref(locale, paths.contacts)} className="btn btn-outline-dark">
          {t(locale, "legal.notFoundContact")}
        </Link>
      </div>
    </main>
  );
}
