"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { imageProps } from "@/lib/images";
import { getLocaleFromPathname, t } from "@/lib/i18n";

/* Cinematic hero modelled on m-lux.by: one full-bleed media stage, 1000px tall
   on desktop, with large uppercase captions that cross-fade in place. No
   chrome, no arrows - the imagery carries the page. */

const INTERVAL = 5200;

export default function HeroSlider({ slides = [] }) {
  const locale = getLocaleFromPathname(usePathname() || "/");
  const [index, setIndex] = useState(0);
  const [captionOn, setCaptionOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const timers = useRef([]);

  /* One timeline drives both layers: the caption fades out, its text is
     swapped while invisible, then it fades back in - so two headlines are
     never legible at once, as on the reference site. */
  const goTo = (next) => {
    timers.current.forEach(clearTimeout);
    setCaptionOn(false);
    timers.current = [
      setTimeout(() => {
        setIndex(((next % slides.length) + slides.length) % slides.length);
        setCaptionOn(true);
      }, 280),
    ];
  };

  const goRelative = (delta) => goTo(index + delta);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setCaptionOn(false);
      timers.current.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % slides.length);
          setCaptionOn(true);
        }, 280)
      );
    }, INTERVAL);

    return () => clearInterval(id);
  }, [slides.length, paused]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  if (!slides.length) {
    return null;
  }

  const caption = slides[index];

  return (
    <div
      className="hero-stage relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t(locale, "hero.carouselLabel")}
    >
      {/* Media stage: cross-fading full-bleed images. Two layers per slide, so
          that on a stage wider than the photograph the picture can be fitted
          whole over a blurred copy of itself instead of being cropped down to
          its middle band. See .hero-stage in globals.css. The blurred layer is
          fetched tiny - blur hides the difference - and only the first slide's
          photo is preloaded, since it is the page's largest paint. */}
      {slides.map((s, i) => (
        <div
          key={s.image + i}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt=""
            fill
            sizes="96px"
            quality={40}
            loading={i === 0 ? "eager" : "lazy"}
            className="hero-photo-fill"
            {...imageProps(s.image)}
          />
          <Image
            src={s.image}
            alt=""
            fill
            sizes="100vw"
            preload={i === 0}
            fetchPriority={i === 0 ? "high" : undefined}
            className="hero-photo"
            {...imageProps(s.image)}
          />
        </div>
      ))}

      {/* Legibility scrim: an overall wash plus a dark pool centred on the
          caption, so white text holds up over bright skies and pale facades. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Caption */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-[4%] text-center transition-opacity duration-[280ms] ease-out"
        style={{ opacity: captionOn ? 1 : 0 }}
      >
        {caption.kicker ? (
          <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.3em] text-white sm:text-[13px]">
            {caption.kicker}
          </div>
        ) : null}

        <h1 className="t-hero max-w-[1300px] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">{caption.title}</h1>

        {caption.subtitle ? (
          <p className="mt-5 max-w-[640px] text-[14px] text-white/85 sm:text-[16px]">
            {caption.subtitle}
          </p>
        ) : null}

        {caption.cta?.length ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {caption.cta.map((c) => (
              <Link
                key={c.href + c.label}
                href={c.href}
                className={`btn ${
                  c.variant === "glass"
                    ? "btn-glass"
                    : c.variant === "glass-accent"
                      ? "btn-glass btn-glass-accent"
                      : c.variant === "outline"
                        ? "btn-outline-light"
                        : "btn-accent"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {/* Manual navigation arrows - minimal, modern */}
      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goRelative(-1)}
            aria-label={t(locale, "hero.prevSlide")}
            className="group absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white sm:left-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 4 7 12l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goRelative(1)}
            aria-label={t(locale, "hero.nextSlide")}
            className="group absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white sm:right-8"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}

      {/* Minimal progress bars */}
      {slides.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={"dot" + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t(locale, "hero.goToSlide").replace("{n}", String(i + 1))}
              aria-current={i === index ? "true" : undefined}
              // The bar stays 2px; the button around it is a 44px tap target.
              className="group/dot flex h-11 items-center"
            >
              <span
                aria-hidden="true"
                className={`block h-[2px] transition-all duration-300 ${
                  i === index ? "w-10 bg-white" : "w-5 bg-white/45 group-hover/dot:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
