"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Search, X, Menu, ChevronDown } from "lucide-react";
import { getLocaleFromPathname, withLocaleHref, locales, t } from "@/lib/i18n";
import { readWishlistIds } from "@/lib/wishlist";

const BRAND = "Durys";

/* Brand marks are not part of lucide v1, so they are inlined. */
function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Header modelled on m-lux.by: fixed overlay on the homepage, solid white on
   inner pages, 105px tall at the top, shrinking to 60px once stuck, hidden on
   scroll-down and revealed on scroll-up. */

function NavLink({ href, children, light, active }) {
  return (
    <Link
      href={href}
      className={`group relative flex h-10 items-center whitespace-nowrap px-[9px] t-el text-[12px] transition-colors duration-200 2xl:px-[13px] 2xl:text-[13px] ${
        light ? "text-white/95 hover:text-white" : "text-[color:var(--color-title)] hover:text-[color:var(--color-accent)]"
      } ${active ? "!text-[color:var(--color-accent)]" : ""}`}
    >
      {children}
    </Link>
  );
}

/* Desktop dropdown: opens on hover and on keyboard focus, closes on Escape or
   once focus leaves the group. */
function NavDropdown({ label, items, light, active, locale, pathnameWithoutLocale }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`group relative flex h-10 items-center gap-1 whitespace-nowrap px-[9px] t-el text-[12px] transition-colors duration-200 2xl:px-[13px] 2xl:text-[13px] ${
          light ? "text-white/95 hover:text-white" : "text-[color:var(--color-title)] hover:text-[color:var(--color-accent)]"
        } ${active ? "!text-[color:var(--color-accent)]" : ""}`}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 w-[248px] -translate-x-1/2 border border-line bg-white py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={withLocaleHref(locale, item.href)}
            onClick={() => setOpen(false)}
            className={`block px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[--color-soft] hover:text-[color:var(--color-accent)] ${
              pathnameWithoutLocale.startsWith(item.href)
                ? "text-[color:var(--color-accent)]"
                : "text-[color:var(--color-title)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const locale = getLocaleFromPathname(pathname);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const light = isHome && !stuck;

  useEffect(() => {
    const sync = () => setWishlistCount(readWishlistIds().length);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
    };
  }, []);

  useEffect(() => {
    if (!open && !showSearch) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, showSearch]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 60);
      setHidden(y > lastY.current && y > 300);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathnameWithoutLocale = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (locales.includes(parts[0])) {
      const rest = parts.slice(1).join("/");
      return rest ? `/${rest}` : "/";
    }
    return pathname || "/";
  })();

  const buildLangHref = (nextLocale) =>
    pathnameWithoutLocale === "/" ? `/${nextLocale}` : `/${nextLocale}${pathnameWithoutLocale}`;

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q.length) return;
    router.push(withLocaleHref(locale, `/meklet?q=${encodeURIComponent(q)}`));
    setShowSearch(false);
    setOpen(false);
  };

  const productLinks = [
    { href: "/kategorija/ardurvis-dzivoklim", label: t(locale, "nav.exteriorApartment") },
    { href: "/kategorija/ardurvis-privatmajai", label: t(locale, "nav.exteriorHouse") },
    { href: "/kategorija/ieksdurvis", label: t(locale, "nav.interior") },
    { href: "/kategorija/sleptas-durvis", label: t(locale, "nav.hidden") },
  ];

  /* The four door categories live under one PRODUKTI dropdown; the rest of the
     bar stays flat. */
  const nav = [
    { href: "/kategorija", label: t(locale, "nav.products"), children: productLinks },
    { href: "/apdare", label: t(locale, "nav.finishes") },
    { href: "/akcijas", label: t(locale, "nav.deals") },
    { href: "/par-mums", label: t(locale, "nav.about") },
    { href: "/kontakti", label: t(locale, "nav.contacts") },
  ];

  // Never slide the bar away while an overlay is open.
  const isHidden = hidden && !open && !showSearch;

  const iconTone = light ? "text-white" : "text-[color:var(--color-title)]";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[390] transition-[transform,background-color,height,box-shadow] duration-300 ease-out ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${light ? "bg-transparent" : "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"}`}
        style={{ height: stuck || !isHome ? "60px" : "105px" }}
      >
        <div className="container flex h-full items-center gap-2">
          {/* Two prints of the mark stacked, cross-fading: over the hero the
              header is transparent and needs the white one, everywhere else
              the colour one. Swapping the src instead would blink on the
              first scroll while the other file loads. */}
          <Link
            href={withLocaleHref(locale, "/")}
            className="relative block shrink-0"
            aria-label={BRAND}
          >
            <Image
              src="/logo.png"
              alt={BRAND}
              width={941}
              height={481}
              priority
              className={`h-9 w-auto transition-opacity duration-300 sm:h-11 ${light ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/logo-white.png"
              alt=""
              aria-hidden
              width={941}
              height={481}
              priority
              className={`absolute inset-0 h-9 w-auto transition-opacity duration-300 sm:h-11 ${light ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          <nav className="mx-auto hidden items-center xl:flex" aria-label="Main navigation">
            {nav.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.href}
                  label={item.label}
                  items={item.children}
                  light={light}
                  locale={locale}
                  pathnameWithoutLocale={pathnameWithoutLocale}
                  active={pathnameWithoutLocale.startsWith(item.href)}
                />
              ) : (
                <NavLink
                  key={item.href}
                  href={withLocaleHref(locale, item.href)}
                  light={light}
                  active={pathnameWithoutLocale.startsWith(item.href)}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className={`ml-auto flex items-center gap-0.5 xl:ml-0 ${iconTone}`}>
            <div className="mr-1 hidden items-center lg:flex">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={buildLangHref(l)}
                  onClick={() => l !== locale && router.refresh()}
                  className={`px-1.5 text-[12px] font-semibold uppercase tracking-wide transition-opacity hover:opacity-70 ${
                    l === locale ? "text-[color:var(--color-accent)]" : ""
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-label={t(locale, "a11y.search")}
              onClick={() => setShowSearch(true)}
              className="flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <Search size={20} strokeWidth={1.6} />
            </button>

            <Link
              href={withLocaleHref(locale, "/velmes")}
              aria-label={t(locale, "wishlist.title")}
              className="relative flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <Heart size={20} strokeWidth={1.6} />
              <span className="absolute right-1 top-1.5 flex h-[16px] min-w-[16px] items-center justify-center bg-[color:var(--color-accent)] px-[3px] text-[10px] font-semibold leading-none text-white">
                {wishlistCount}
              </span>
            </Link>

            <Link
              href={withLocaleHref(locale, "/grozs")}
              aria-label={t(locale, "cart.title")}
              className="flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <ShoppingCart size={20} strokeWidth={1.6} />
            </Link>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="Instagram"
              className="hidden h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70 2xl:flex"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="YouTube"
              className="hidden h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70 2xl:flex"
            >
              <YoutubeIcon size={18} />
            </a>

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-70 xl:hidden"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so inner pages start below the fixed header */}
      {!isHome ? <div style={{ height: "60px" }} aria-hidden /> : null}

      {showSearch ? (
        <div className="animate-fade-in fixed inset-0 z-[400] bg-white/98 backdrop-blur-sm">
          <button
            type="button"
            aria-label={t(locale, "a11y.close")}
            onClick={() => setShowSearch(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-[color:var(--color-title)] transition-opacity hover:opacity-60"
          >
            <X size={26} strokeWidth={1.4} />
          </button>
          <div className="container flex h-full flex-col items-center justify-center">
            <form onSubmit={submitSearch} className="w-full max-w-[700px]">
              <div className="t-el mb-4 text-center text-[color:var(--color-muted)]">
                {t(locale, "search.title")}
              </div>
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(locale, "nav.searchPlaceholder")}
                aria-label={t(locale, "a11y.search")}
                className="w-full border-0 border-b-2 border-[color:var(--color-line-strong)] bg-transparent pb-4 text-center text-[22px] text-[color:var(--color-title)] outline-none placeholder:text-[color:var(--color-muted)] sm:text-[32px]"
              />
            </form>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[400] xl:hidden" onClick={() => setOpen(false)}>
          <div className="animate-fade-in absolute inset-0 bg-black/50" />
          <div
            className="animate-drawer-in absolute inset-y-0 right-0 flex w-[300px] max-w-[85vw] flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[60px] items-center justify-between border-b border-[color:var(--color-line)] px-5">
              <Image src="/logo.png" alt={BRAND} width={941} height={481} className="h-7 w-auto" />
              <button
                type="button"
                aria-label={t(locale, "a11y.close")}
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              {nav.map((item) =>
                item.children ? (
                  <div key={item.href} className="border-b border-[color:var(--color-line)]">
                    <button
                      type="button"
                      onClick={() => setProductsOpen((v) => !v)}
                      aria-expanded={productsOpen}
                      className="t-el flex w-full items-center justify-between px-5 py-3.5 text-left text-[color:var(--color-title)]"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {productsOpen ? (
                      <div className="bg-[--color-soft] pb-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={withLocaleHref(locale, child.href)}
                            onClick={() => setOpen(false)}
                            className="block px-8 py-3 text-[14px] text-[color:var(--color-title)]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={withLocaleHref(locale, item.href)}
                    onClick={() => setOpen(false)}
                    className="t-el block border-b border-[color:var(--color-line)] px-5 py-3.5 text-[color:var(--color-title)]"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2 border-t border-[color:var(--color-line)] px-5 py-4">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={buildLangHref(l)}
                  onClick={() => {
                    if (l !== locale) router.refresh();
                    setOpen(false);
                  }}
                  className={`border border-[color:var(--color-line)] px-2.5 py-1 text-[12px] font-semibold uppercase ${
                    l === locale ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-title)]"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
