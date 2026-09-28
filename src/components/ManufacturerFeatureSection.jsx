"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { imageProps } from "@/lib/images";

/* One "Konstruktīvs"-style manufacturer section: a full-height banner photo
   (hidden on mobile) beside a heading, a subtitle and an autoplaying feature
   carousel - modelled on m-lux.by's own product-page tabs (see the
   "m-lux Konstruktīvs section" memory). Two slides show at a time on wider
   screens via native scroll-snap, so there's no percentage math to keep in
   sync with Tailwind's own breakpoints. Autoplay is skipped entirely for
   prefers-reduced-motion, same as the accordions elsewhere on this page. */
export default function ManufacturerFeatureSection({ heading, subtitle, note, banner, slides, prevLabel, nextLabel, closeLabel, zoomLabel }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxOpen = lightboxIndex !== null;

  const stepLightbox = (delta) =>
    setLightboxIndex((i) => (i === null ? i : (i + delta + slides.length) % slides.length));

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, slides.length]);

  /* Scroll positions the track can actually reach. With two slides in view,
     three slides only have two positions - so the dots follow these, not the
     slide count. Re-measured on resize, since how many fit depends on width. */
  const [stops, setStops] = useState([0]);
  const stopsRef = useRef([0]);
  const pausedRef = useRef(false);
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const max = track.scrollWidth - track.clientWidth;
      const base = track.getBoundingClientRect().left - track.scrollLeft;
      const lefts = Array.from(track.querySelectorAll("[data-slide]")).map((el) =>
        Math.min(max, Math.max(0, Math.round(el.getBoundingClientRect().left - base)))
      );
      const next = lefts.filter((v, i) => i === 0 || Math.abs(v - lefts[i - 1]) > 4);
      stopsRef.current = next;
      setStops(next);
    };
    const onScroll = () => {
      const s = stopsRef.current;
      let closest = 0;
      s.forEach((v, i) => {
        if (Math.abs(v - track.scrollLeft) < Math.abs(s[closest] - track.scrollLeft)) closest = i;
      });
      setActive(closest);
    };
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(track);
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      track.removeEventListener("scroll", onScroll);
    };
  }, [slides.length]);

  // Unhurried autoplay that holds still while the visitor is looking at or
  // using the carousel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const s = stopsRef.current;
      if (s.length < 2 || pausedRef.current || Date.now() - lastInteractionRef.current < 10000) return;
      const current = s.findIndex((v) => Math.abs(v - track.scrollLeft) <= 4);
      const next = current === -1 || current >= s.length - 1 ? 0 : current + 1;
      track.scrollTo({ left: s[next], behavior: "smooth" });
    }, 6500);
    return () => clearInterval(id);
  }, []);

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    const s = stopsRef.current;
    if (!track || !s.length) return;
    lastInteractionRef.current = Date.now();
    track.scrollTo({ left: s[(i + s.length) % s.length], behavior: "smooth" });
  };

  const scrollByStep = (dir) => scrollToIndex(active + dir);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-stretch lg:gap-12">
      <div className="relative hidden aspect-[3/4] overflow-hidden md:block">
        <Image src={banner} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" {...imageProps(banner)} />
      </div>

      <div className="min-w-0 flex flex-col justify-center">
        <h3 className="text-center text-[26px] font-medium leading-[1.2] text-[color:var(--color-title)] sm:text-[32px]">
          {heading}
        </h3>
        <p className="mx-auto mt-3 max-w-[520px] text-center text-[15px] leading-[1.6] text-muted">{subtitle}</p>

        <div
          className="relative mt-8"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onTouchStart={() => (lastInteractionRef.current = Date.now())}
          onFocus={() => (lastInteractionRef.current = Date.now())}
        >
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {slides.map((slide, i) => (
              <figure
                key={slide.image}
                data-slide
                className="flex w-[70%] shrink-0 snap-start flex-col sm:w-[calc(50%-8px)]"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={zoomLabel}
                  className="group relative aspect-square w-full cursor-zoom-in overflow-hidden bg-[--color-soft]"
                >
                  <Image
                    src={slide.image}
                    alt={slide.caption}
                    fill
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    {...imageProps(slide.image)}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center bg-white/90 text-ink opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
                  >
                    <ZoomIn size={16} />
                  </span>
                </button>
                <figcaption className="mt-2.5 text-center text-[13px] leading-[1.5] text-ink">{slide.caption}</figcaption>
              </figure>
            ))}
          </div>

          {stops.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => scrollByStep(-1)}
                aria-label={prevLabel}
                className="absolute left-1 top-[calc(50%-14px)] hidden h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85 text-ink shadow-sm transition-colors hover:text-[color:var(--color-accent)] sm:flex"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollByStep(1)}
                aria-label={nextLabel}
                className="absolute right-1 top-[calc(50%-14px)] hidden h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85 text-ink shadow-sm transition-colors hover:text-[color:var(--color-accent)] sm:flex"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </>
          ) : null}
        </div>

        {stops.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {stops.map((stop, i) => (
              <button
                key={stop}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`${i + 1} / ${stops.length}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === active ? "w-5 bg-[color:var(--color-accent)]" : "w-1.5 bg-[color:var(--color-muted)]/35"
                }`}
              />
            ))}
          </div>
        ) : null}

        {note ? <p className="mx-auto mt-6 max-w-[520px] text-center text-[13px] leading-[1.6] text-muted">{note}</p> : null}
      </div>

      {lightboxOpen ? (
        <div
          className="animate-fade-in fixed inset-0 z-[420] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={slides[lightboxIndex].caption}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label={closeLabel}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X size={20} />
          </button>

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(-1);
                }}
                aria-label={prevLabel}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-6 sm:h-14 sm:w-14"
              >
                <ChevronLeft size={26} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                aria-label={nextLabel}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-6 sm:h-14 sm:w-14"
              >
                <ChevronRight size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-[720px]" onClick={(e) => e.stopPropagation()}>
            <div className="relative mx-auto aspect-square max-h-[76vh] w-auto">
              <Image
                key={slides[lightboxIndex].image}
                src={slides[lightboxIndex].image}
                alt={slides[lightboxIndex].caption}
                fill
                sizes="720px"
                className="animate-fade-in bg-[--color-soft] object-contain"
                {...imageProps(slides[lightboxIndex].image)}
              />
            </div>
            <figcaption className="mt-3 text-center text-[14px] text-white">
              {slides[lightboxIndex].caption}
              {slides.length > 1 ? (
                <span className="ml-2 text-white/55">
                  {lightboxIndex + 1} / {slides.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
