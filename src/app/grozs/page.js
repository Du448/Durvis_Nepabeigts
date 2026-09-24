import { permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n";

export default async function GrozsPage() {
  const h = await headers();
  const locale = getLocaleFromPathname(h.get("x-invoke-path") || "/");
  permanentRedirect(withLocaleHref(locale, "/velmes"));
}
