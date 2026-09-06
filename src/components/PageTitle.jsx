"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

/* Photographic page-title banner, as used across m-lux.by inner pages:
   a dark cropped photo, the page name centred in white, breadcrumbs under it
   and an optional row of category shortcuts. */

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1628744876657-abd5086695dc?auto=format&fit=crop&w=2400&q=60";

export default function PageTitle({ title, description, image, links = [], crumb }) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <section
      className="relative flex min-h-[240px] flex-col items-center justify-center bg-[#0a0a0a] bg-cover bg-center px-4 py-14 text-center sm:min-h-[282px]"
      style={{ backgroundImage: `url("${image || DEFAULT_IMAGE}")` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 w-full max-w-[1300px]">
        <h1 className="text-[28px] font-medium leading-[1.3] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] sm:text-[40px]">
          {title}
        </h1>

        {description ? (
          <p className="mx-auto mt-3 max-w-[720px] text-white/80">{description}</p>
        ) : null}

        <nav className="mt-4 text-[13px] text-white/70" aria-label="Breadcrumb">
          <Link href={withLocaleHref(locale, "/")} className="transition-colors hover:text-white">
            {t(locale, "common.home")}
          </Link>
          <span className="px-2 text-white/40">/</span>
          <span className="text-white">{crumb || title}</span>
        </nav>

        {links.length ? (
          <div className="mt-8 flex flex-wrap items-start justify-center gap-x-5 gap-y-4 sm:gap-x-9">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group block text-center">
                <span className="block text-[11px] font-semibold uppercase leading-tight text-white transition-colors group-hover:text-[color:var(--color-accent)] sm:text-[13px]">
                  {l.label}
                </span>
                {l.meta ? (
                  <span className="mt-1 block text-[12px] text-white/60">{l.meta}</span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
