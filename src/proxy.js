import { NextResponse } from "next/server";
import { locales, defaultLocale, localePath } from "@/lib/i18n";
import { legacyToCurrent } from "@/lib/routes";

/* Pages live under app/[locale]/, but Lithuanian - the main language - is
   served from the root:

   - a path without a language (/, /kontaktai)  -> rewritten to /lt/… internally
   - /lt or /lt/<path>                          -> 301 to the unprefixed address
   - /lv/…, /en/…                               -> served as is
   - a pre-migration Latvian slug (/produkts/x, /lt/kontakti, /lv/kategorija/ieksdurvis …)
                                                -> 301 straight to the current address, in one hop. */

function isPublicFile(pathname) {
  return pathname.includes(".");
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // "/api/" with the slash: /apie-mus is a page.
  // /admin is the shop's price panel: no language prefix, no redirects.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    isPublicFile(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = locales.includes(segments[0]);
  const locale = hasLocale ? segments[0] : defaultLocale;
  const rest = `/${(hasLocale ? segments.slice(1) : segments).join("/")}`;
  const current = legacyToCurrent(rest);
  const canonical = localePath(locale, current || rest);

  const url = request.nextUrl.clone();
  if (canonical !== pathname) {
    url.pathname = canonical;
    return NextResponse.redirect(url, 301);
  }

  if (hasLocale) return NextResponse.next();

  url.pathname = `/${defaultLocale}${rest === "/" ? "" : rest}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|admin(?:/|$)|.*\\..*).*)"],
};
