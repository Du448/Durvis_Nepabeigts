import { permanentRedirect } from "next/navigation";
import { withLocaleHref } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

// There is no cart; the wishlist does that job.
export default async function CartPage({ params }) {
  const locale = await resolveLocale(params);
  permanentRedirect(withLocaleHref(locale, paths.wishlist));
}
