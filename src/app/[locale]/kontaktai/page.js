import ContactsClient from "@/components/ContactsClient";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, localizedUrl } from "@/lib/site";
import { t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.contacts,
    title: t(locale, "contacts.title"),
    description: t(locale, "contacts.contactUs"),
  });
}

export default async function ContactsPage({ params }) {
  const locale = await resolveLocale(params);
  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t(locale, "contacts.title"),
    url: localizedUrl(locale, paths.contacts),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };
  return (
    <main>
      <JsonLd data={contactLd} />
      <ContactsClient />
    </main>
  );
}
