import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import MobileCallBar from "@/components/MobileCallBar";
import WhatsAppBubble from "@/components/WhatsAppBubble";
import ScrollToTop from "@/components/ScrollToTop";
import ClickTracking from "@/components/ClickTracking";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL, localBusinessLd } from "@/lib/site";
import { t } from "@/lib/i18n";
import { localeParams, pageMetadata, resolveLocale, siteTitle, siteDescription } from "@/lib/page";
import { fontVariables } from "../fonts";

/* Every page lives under /{lt,lv,en}/ and is rendered at build time for all
   three languages; unknown language segments 404. */
export const generateStaticParams = localeParams;
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  // Defaults only: canonical/hreflang and og:url are page-specific, so every
  // page sets them itself through pageMetadata().
  const { alternates, ...base } = pageMetadata({ locale, path: "", description: siteDescription(locale) });
  const { url, ...openGraph } = base.openGraph;
  return {
    ...base,
    openGraph,
    metadataBase: new URL(SITE_URL),
    title: siteTitle(locale),
    openGraph: { ...openGraph, title: siteTitle(locale) },
    twitter: { ...base.twitter, title: siteTitle(locale) },
    verification: siteVerification(),
  };
}

/* Ownership tags for Google Search Console and Bing Webmaster Tools. Bing's
   index is what ChatGPT search and Microsoft Copilot answer from, so the site
   is registered there as well as with Google. Codes come from the env. */
function siteVerification() {
  const other = {};
  if (process.env.BING_SITE_VERIFICATION) other["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
  if (process.env.YANDEX_SITE_VERIFICATION) other["yandex-verification"] = process.env.YANDEX_SITE_VERIFICATION;
  return {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(Object.keys(other).length ? { other } : {}),
  };
}

export default async function LocaleLayout({ children, params }) {
  const locale = await resolveLocale(params);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          {t(locale, "a11y.skipToContent")}
        </a>
        <JsonLd data={localBusinessLd(locale)} />
        <Header />
        <div id="main-content" tabIndex={-1} className="site-main outline-none">
          {children}
        </div>
        <Footer />
        <MobileCallBar />
        <WhatsAppBubble />
        <ScrollToTop />
        <CookieBanner />
        <ClickTracking />
        {/* Both are cookieless and collect no personal data, so they run
            without waiting for the cookie banner. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

