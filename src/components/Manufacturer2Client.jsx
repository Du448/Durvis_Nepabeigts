"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import RevealGrid from "@/components/anim/RevealGrid";
import Manufacturer2Calculator from "@/components/Manufacturer2Calculator";
import { manufacturer2Sections } from "@/data/manufacturer2";
import { getLocaleFromPathname, t, trData } from "@/lib/i18n";

const CALCULATOR_KEY = "kalkulators";
const tabs = [...manufacturer2Sections, { key: CALCULATOR_KEY, title: "Kalkulators" }];

/* Ražotājs-2 reference catalogue (Bulat, Chernihiv): door design series,
   film colours and the powder-coating palette. Same swatch-grid + lightbox
   pattern as FinishesClient, driven by manufacturer2Sections. */

export default function Manufacturer2Client() {
  const locale = getLocaleFromPathname(usePathname());
  const [lightbox, setLightbox] = useState(null);
  const [touchX, setTouchX] = useState(null);
  const [activeSectionKey, setActiveSectionKey] = useState(manufacturer2Sections[0]?.key);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const isCalculator = activeSectionKey === CALCULATOR_KEY;
  const section = manufacturer2Sections.find((s) => s.key === activeSectionKey) || manufacturer2Sections[0];
  const group = section?.groups[activeGroupIndex] || section?.groups[0];

  const selectSection = (key) => {
    setActiveSectionKey(key);
    setActiveGroupIndex(0);
  };

  const current = lightbox ? lightbox.items[lightbox.index] : null;

  const step = useCallback((delta) => {
    setLightbox((state) => {
      if (!state) return state;
      const n = state.items.length;
      return { ...state, index: ((state.index + delta) % n + n) % n };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step]);

  return (
    <>
      <PageTitle
        title={t(locale, "pages.manufacturer2.title")}
        description={t(locale, "pages.manufacturer2.description")}
        image="https://images.unsplash.com/photo-1595514535215-9a5e5b3e5e0f?auto=format&fit=crop&w=2000&q=60"
      />

      <nav className="sticky top-[60px] z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          {tabs.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => selectSection(s.key)}
              aria-selected={s.key === activeSectionKey}
              role="tab"
              className={`text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                s.key === activeSectionKey ? "text-[color:var(--color-accent)]" : "text-muted hover:text-ink"
              }`}
            >
              {trData(locale, s.title)}
            </button>
          ))}
        </div>
      </nav>

      {isCalculator ? <Manufacturer2Calculator /> : null}

      {!isCalculator && section ? (
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="max-w-[760px]">
              <h2 className="t-section">{trData(locale, section.title)}</h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-ink">{trData(locale, section.lead)}</p>
              <p className="mt-2 text-[13px] text-muted">
                {section.groups.reduce((a, g) => a + g.items.length, 0)} {t(locale, "finishes.itemsCount")}
              </p>
            </div>

            {section.groups.length > 1 ? (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-line pb-4">
                {section.groups.map((g, gi) => (
                  <button
                    key={g.title || gi}
                    type="button"
                    onClick={() => setActiveGroupIndex(gi)}
                    aria-selected={gi === activeGroupIndex}
                    role="tab"
                    className={`border px-4 py-2 text-[13px] font-medium transition-colors ${
                      gi === activeGroupIndex
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                        : "border-line text-ink hover:border-[color:var(--color-accent)]"
                    }`}
                  >
                    {trData(locale, g.title)}
                  </button>
                ))}
              </div>
            ) : null}

            {group ? (
              <div className="mt-10">
                <RevealGrid
                  key={`${section.key}-${activeGroupIndex}`}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
                  stagger={0.03}
                >
                  {group.items.map((item, itemIndex) => (
                    <button
                      key={item.image}
                      type="button"
                      onClick={() =>
                        setLightbox({ items: group.items, index: itemIndex, group: group.title, aspect: section.aspect })
                      }
                      aria-label={`${trData(locale, item.label)} — ${t(locale, "finishes.openImage")}`}
                      className="group block text-left"
                    >
                      <span
                        className="relative block aspect-[3/4] overflow-hidden border border-line bg-white"
                        style={section.aspect ? { aspectRatio: section.aspect } : undefined}
                      >
                        <Image
                          src={item.image}
                          alt={trData(locale, item.label)}
                          fill
                          unoptimized
                          loading="lazy"
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </span>
                      <span className="mt-2 block text-[13px] leading-snug text-ink">{trData(locale, item.label)}</span>
                    </button>
                  ))}
                </RevealGrid>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {!isCalculator ? (
        <section className="border-t border-line py-8">
          <div className="container text-[13px] text-muted">{t(locale, "finishes.note")}</div>
        </section>
      ) : null}

      {current ? (
        <div
          className="animate-fade-in fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={trData(locale, current.label)}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX == null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            setTouchX(null);
            if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t(locale, "finishes.close")}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          {lightbox.items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t(locale, "product.previous")}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={26} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t(locale, "product.next")}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white/25 active:scale-95 sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-[720px]" onClick={(e) => e.stopPropagation()}>
            <div
              className="relative mx-auto aspect-[3/4] max-h-[76vh] w-auto"
              style={lightbox.aspect ? { aspectRatio: lightbox.aspect } : undefined}
            >
              <Image
                key={current.image}
                src={current.image}
                alt={trData(locale, current.label)}
                fill
                unoptimized
                sizes="720px"
                className="animate-fade-in object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-[14px] text-white">
              {trData(locale, current.label)}
              {lightbox.items.length > 1 ? (
                <span className="ml-2 text-white/55">
                  {lightbox.index + 1} / {lightbox.items.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
