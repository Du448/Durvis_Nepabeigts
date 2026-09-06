"use client";

import Link from "next/link";
import Image from "next/image";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Footer modelled on m-lux.by: solid black, four uppercase columns,
   links at 80% white, thin divider above the copyright line. */

const TAGLINE = {
  lt: "Patikimos ir ilgaamžės durys jūsų namams.",
  lv: "Uzticamas un ilgmūžīgas durvis jūsu mājoklim.",
  en: "Reliable, long-lasting doors for your home.",
};

function Col({ title, children }) {
  return (
    <div>
      <h3 className="t-widget mb-5 text-white">{title}</h3>
      {children}
    </div>
  );
}

function FootLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/80 transition-colors duration-200 hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const ref = useRef(null);

  /* Pin the footer and let the page slide over it — only when the viewport is
     wide and tall enough for the whole footer to stay visible underneath. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    const sync = () => {
      const h = el.offsetHeight;
      const fits = window.matchMedia("(min-width: 1025px)").matches && h <= window.innerHeight * 0.8;
      root.classList.toggle("footer-reveal", fits);
      root.style.setProperty("--footer-h", fits ? `${h}px` : "0px");
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      root.classList.remove("footer-reveal");
      root.style.removeProperty("--footer-h");
    };
  }, []);

  return (
    <footer ref={ref} className="site-footer bg-[color:var(--color-dark)] text-white/80">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* The footer is solid black, so the white print of the mark. */}
            <Link href={withLocaleHref(locale, "/")} className="mb-5 block">
              <Image src="/logo-white.png" alt="Durys" width={941} height={481} className="h-14 w-auto" />
            </Link>
            <p className="mb-6 max-w-[280px] text-white/80">
              {TAGLINE[locale] || TAGLINE.lt}
            </p>
            <div className="space-y-1.5">
              <div>
                <span className="text-white/60">{t(locale, "footer.phone")}: </span>
                <a className="text-white/80 hover:text-white" href="tel:+37066213171">
                  +370 662 13171
                </a>
              </div>
              <div>
                <span className="text-white/60">{t(locale, "footer.email")}: </span>
                <a className="text-white/80 hover:text-white" href="mailto:info@tnbaltic.lt">
                  info@tnbaltic.lt
                </a>
              </div>
            </div>
          </div>

          <Col title={t(locale, "footer.assortment")}>
            <ul className="space-y-2.5">
              <FootLink href={withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim")}>
                {t(locale, "nav.exteriorApartment")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/kategorija/ardurvis-privatmajai")}>
                {t(locale, "nav.exteriorHouse")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/kategorija/ieksdurvis")}>
                {t(locale, "nav.interior")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/kategorija/sleptas-durvis")}>
                {t(locale, "nav.hidden")}
              </FootLink>
            </ul>
          </Col>

          <Col title={t(locale, "footer.services")}>
            <ul className="space-y-2.5">
              <FootLink href={withLocaleHref(locale, "/pakalpojumi/uzmerisana")}>
                {t(locale, "footer.measurement")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/pakalpojumi/montaza")}>
                {t(locale, "footer.installation")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/pakalpojumi/garantija")}>
                {t(locale, "footer.warranty")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/pakalpojumi/piegade")}>
                {t(locale, "footer.delivery")}
              </FootLink>
            </ul>
          </Col>

          <Col title={t(locale, "footer.company")}>
            <ul className="space-y-2.5">
              <FootLink href={withLocaleHref(locale, "/apdare")}>
                {t(locale, "nav.finishes")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/par-mums")}>
                {t(locale, "nav.about")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/kontakti")}>
                {t(locale, "nav.contacts")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/jaunumi")}>
                {t(locale, "nav.news")}
              </FootLink>
              <FootLink href={withLocaleHref(locale, "/akcijas")}>
                {t(locale, "nav.deals")}
              </FootLink>
            </ul>
            <div className="mt-6 space-y-1.5 text-white/60">
              <div>{t(locale, "footer.showroom")}</div>
              <div className="text-white/80">
                Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.
              </div>
              <div className="pt-2">{t(locale, "footer.hours")}</div>
              <div className="text-white/80">9:00–18:00</div>
            </div>
          </Col>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-5 text-center text-[13px] text-white/60">
          DURYS {new Date().getFullYear()}. {t(locale, "footer.rights")}
        </div>
      </div>
    </footer>
  );
}
