import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import MobileCallBar from "@/components/MobileCallBar";
import ClickTracking from "@/components/ClickTracking";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL, localBusinessLd } from "@/lib/site";
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
  };
}

export default async function LocaleLayout({ children, params }) {
  const locale = await resolveLocale(params);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="antialiased">
        <JsonLd data={localBusinessLd(locale)} />
        <Header />
        <div className="site-main">{children}</div>
        <Footer />
        <MobileCallBar />
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

