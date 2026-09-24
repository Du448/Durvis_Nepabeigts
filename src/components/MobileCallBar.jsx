"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { mainPhone } from "@/lib/site";

/* Phones only: a call is one tap away on every page. The spacer after the bar
   keeps it from covering the end of the footer. */
export default function MobileCallBar() {
  const locale = getLocaleFromPathname(usePathname() || "/");

  return (
    <>
      <div aria-hidden className="h-[64px] md:hidden" />
      <div
        data-placement="mobile-bar"
        className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-line bg-white px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden"
      >
        <a href={mainPhone.href} className="btn btn-accent flex flex-1 items-center justify-center gap-2">
          <Phone size={16} aria-hidden />
          {t(locale, "common.call")}
        </a>
        <Link
          href={withLocaleHref(locale, "/kontakti")}
          aria-label={t(locale, "nav.contacts")}
          className="btn btn-outline-dark flex items-center justify-center gap-2 px-4"
        >
          <Mail size={16} aria-hidden />
          {t(locale, "nav.contacts")}
        </Link>
      </div>
    </>
  );
}
