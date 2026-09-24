import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import { legacyToCurrent } from "@/lib/routes";

/* Pages live under app/[locale]/, so this only has to send visitors to a
   URL with a language in it:

   - "/"                         -> 307 to /lt (may one day depend on the browser language)
   - a path without a language   -> 301 to /lt/<path>
   - a pre-migration Latvian slug (/lt/produkts/x, /kontakti, /lv/kategorija/ieksdurvis …)
                                 -> 301 straight to the current address, in one hop. */

function isPublicFile(pathname) {
  return pathname.includes(".");
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = locales.includes(segments[0]);
  const locale = hasLocale ? segments[0] : defaultLocale;
  const rest = `/${(hasLocale ? segments.slice(1) : segments).join("/")}`;
  const current = legacyToCurrent(rest);

  if (hasLocale && !current) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${current || (rest === "/" ? "" : rest)}`;
  return NextResponse.redirect(url, pathname === "/" ? 307 : 301);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
