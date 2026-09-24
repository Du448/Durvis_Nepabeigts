"use client";

import { useSyncExternalStore } from "react";
import { MapPin } from "lucide-react";
import { t } from "@/lib/i18n";
import { getConsent, setConsent, subscribeConsent, serverConsent } from "@/lib/consent";

export default function ConsentMap({ locale, query, title }) {
  const allowed = useSyncExternalStore(subscribeConsent, getConsent, serverConsent) === "all";

  const q = encodeURIComponent(query);

  if (allowed) {
    return (
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        className="w-full h-[280px] sm:h-[340px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-4 bg-[--color-soft] px-6 text-center sm:h-[340px]">
      <MapPin size={28} className="text-muted" />
      <p className="max-w-[360px] text-[14px] text-muted">{t(locale, "legal.mapPlaceholder")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-accent" onClick={() => setConsent("all")}>
          {t(locale, "legal.mapLoad")}
        </button>
        <a
          className="btn btn-outline-dark"
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(locale, "legal.mapOpen")}
        </a>
      </div>
    </div>
  );
}
