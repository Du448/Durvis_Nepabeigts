"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { getConsent, setConsent, subscribeConsent, serverConsent, OPEN_SETTINGS_EVENT } from "@/lib/consent";

export default function CookieBanner() {
  const locale = getLocaleFromPathname(usePathname() || "/");
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (consent !== null && !reopened) return null;

  const choose = (value) => {
    setConsent(value);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t(locale, "legal.cookieSettings")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="container flex flex-col gap-4 py-4 text-[14px] text-ink md:flex-row md:items-center md:justify-between">
        <p className="max-w-[760px]">
          {t(locale, "legal.cookieText")}{" "}
          <Link href={withLocaleHref(locale, "/privatumo-politika")} className="underline">
            {t(locale, "legal.cookieMore")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="btn btn-outline-dark" onClick={() => choose("necessary")}>
            {t(locale, "legal.cookieDecline")}
          </button>
          <button type="button" className="btn btn-accent" onClick={() => choose("all")}>
            {t(locale, "legal.cookieAccept")}
          </button>
        </div>
      </div>
    </div>
  );
}
