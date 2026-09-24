import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import MobileCallBar from "../components/MobileCallBar";
import ClickTracking from "../components/ClickTracking";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";
import { getLocaleFromPathname } from "@/lib/i18n";
import { SITE_URL, alternatesFor } from "@/lib/site";

// Montserrat is loaded via <link> rather than next/font to avoid a build-time fetch.

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);
  return { ...baseMetadata, alternates: alternatesFor(pathname, locale) };
}

const baseMetadata = {
  metadataBase: new URL(SITE_URL),
  title: "NT Durys - lauko ir vidaus durys Lietuvoje",
  description:
    "NT Durys: lauko ir vidaus durys, profesionalus montavimas ir pristatymas visoje Lietuvoje. Platus asortimentas, konsultacijos ir garantija.",
  openGraph: {
    title: "NT Durys - lauko ir vidaus durys Lietuvoje",
    description:
      "NT Durys: lauko ir vidaus durys, montavimas ir pristatymas visoje Lietuvoje.",
    siteName: "NT Durys",
    locale: "lt_LT",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
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
