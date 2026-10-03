"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { getLocaleFromPathname } from "@/lib/i18n";

const LABEL = { lt: "Į viršų", lv: "Uz augšu", en: "Back to top", ru: "Наверх" };

/* Frosted-glass arrow, bottom centre. Appears once the page has been scrolled
   a screen or so; on phones it sits above the call bar. */
export default function ScrollToTop() {
  const locale = getLocaleFromPathname(usePathname() || "/");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };

  const label = LABEL[locale] || LABEL.lt;

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/50 bg-white/30 text-neutral-800 shadow-[0_8px_24px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:bg-white/50 bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={18} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
