import { Suspense } from "react";
import FinishesClient from "@/components/FinishesClient";
import { DictProvider } from "@/components/DictProvider";
import { finishSections } from "@/data/finishes";
import { t } from "@/lib/i18n";
import { buildDict } from "@/lib/dict";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.finishes,
    title: t(locale, "finishes.title"),
    description: t(locale, "finishes.lead"),
  });
}

export default async function FinishesPage({ params }) {
  const locale = await resolveLocale(params);

  return (
    <main>
      <DictProvider dict={buildDict(locale, finishSections)}>
        <Suspense fallback={null}>
          <FinishesClient />
        </Suspense>
      </DictProvider>
    </main>
  );
}
