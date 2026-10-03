"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";
import { whatsappNumber } from "@/lib/site";

const COPY = {
  lt: { label: "Rašykite mums WhatsApp", text: "Sveiki! Norėčiau pasiteirauti apie durų pasiūlymą." },
  lv: { label: "Rakstiet mums WhatsApp", text: "Sveiki! Vēlos painteresēties par durvju piedāvājumu." },
  en: { label: "Chat with us on WhatsApp", text: "Hello! I'd like to ask about your doors." },
  ru: { label: "Напишите нам в WhatsApp", text: "Здравствуйте! Хочу узнать о ваших дверях." },
};

/* Floating chat button, bottom right on every page. On phones it sits above the
   call bar so the two never overlap. */
export default function WhatsAppBubble() {
  const locale = getLocaleFromPathname(usePathname() || "/");
  const copy = COPY[locale] || COPY.lt;
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(copy.text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.label}
      title={copy.label}
      data-placement="whatsapp-bubble"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6 md:right-6"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.55 4.19 1.6 6.01L4 29l8.17-1.57a12.03 12.03 0 0 0 3.87.63h.01C22.7 28.06 28 22.68 28 16.05 28 12.84 26.75 9.82 24.48 7.55A11.9 11.9 0 0 0 16.04 3Zm0 22.03h-.01c-1.2 0-2.38-.32-3.4-.93l-.24-.15-4.85.93.97-4.72-.16-.25a9.97 9.97 0 0 1-1.53-5.3c0-5.5 4.5-9.98 10.04-9.98 2.68 0 5.2 1.04 7.09 2.93a9.9 9.9 0 0 1 2.93 7.06c0 5.51-4.5 10.41-9.84 10.41Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}
