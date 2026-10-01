"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { imageProps } from "@/lib/images";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

/* Photographic page-title banner, as used across m-lux.by inner pages:
   a dark cropped photo, the page name centred in white, breadcrumbs under it
   and an optional row of category shortcuts. The photo is an <Image> rather
   than a CSS background so phones get a phone-sized file, and it is preloaded:
   on inner pages this banner is the largest paint. `compact` is for listing
   pages (categories), where the products below matter more than the banner:
   less height, a smaller title, and the description and shortcut row kept
   short on phones. */

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1628744876657-abd5086695dc?auto=format&fit=crop&w=2400&q=60";

export default function PageTitle({ title, description, image, links = [], crumb, compact = false }) {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const src = image || DEFAULT_IMAGE;

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 text-center ${
        compact ? "py-7 sm:py-9" : "min-h-[240px] py-14 sm:min-h-[282px]"
      }`}
    >
      <Image src={src} alt="" fill preload sizes="100vw" quality={60} className="object-cover object-center" {...imageProps(src)} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 w-full max-w-[1300px]">
        <h1
          className={`font-medium leading-[1.3] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] ${
            compact ? "text-[24px] sm:text-[32px]" : "text-[28px] sm:text-[40px]"
          }`}
        >
          {title}
        </h1>

        {description ? (
          <p className={`mx-auto max-w-[720px] text-white/80 ${compact ? "mt-2 hidden text-[15px] sm:block" : "mt-3"}`}>{description}</p>
        ) : null}

        <nav className={`text-[13px] text-white/70 ${compact ? "mt-2 sm:mt-3" : "mt-4"}`} aria-label="Breadcrumb">
          <Link href={withLocaleHref(locale, "/")} className="transition-colors hover:text-white">
            {t(locale, "common.home")}
          </Link>
          <span className="px-2 text-white/40">/</span>
          <span className="text-white">{crumb || title}</span>
        </nav>

        {links.length ? (
          <div
            className={
              compact
                ? "-mx-4 mt-5 flex items-start gap-x-5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:justify-center sm:gap-x-9 sm:overflow-visible sm:px-0"
                : "mt-8 flex flex-wrap items-start justify-center gap-x-5 gap-y-4 sm:gap-x-9"
            }
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group block shrink-0 text-center">
                <span className="block whitespace-nowrap text-[12px] font-semibold uppercase leading-tight text-white transition-colors group-hover:text-[color:var(--color-accent)] sm:text-[13px]">
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
