import { Suspense } from "react";
import ContactsClient from "@/components/ContactsClient";
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

  return (
    <main>
      <Suspense fallback={<div className="container py-6 text-muted">{t(locale, "loading.contacts")}</div>}>
        <ContactsClient />
      </Suspense>
    </main>
  );
}
