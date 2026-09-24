import Manufacturer2Client from "@/components/Manufacturer2Client";
import { DictProvider } from "@/components/DictProvider";
import { manufacturer2Sections } from "@/data/manufacturer2";
import * as calculatorData from "@/data/manufacturer2Calculator";
import { ltManufacturer2 } from "@/data/translations/lt/manufacturer2";
import { ltManufacturer2Calculator } from "@/data/translations/lt/manufacturer2Calculator";
import { enManufacturer2 } from "@/data/translations/en/manufacturer2";
import { enManufacturer2Calculator } from "@/data/translations/en/manufacturer2Calculator";
import { t } from "@/lib/i18n";
import { buildDict } from "@/lib/dict";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale } from "@/lib/page";

export const generateStaticParams = localeParams;

/* The configurator translates its own interface labels as well as its data,
   so it gets the whole configurator dictionary for its language on top of the
   strings found in the data. */
const CONFIGURATOR_DICTS = {
  lt: [ltManufacturer2, ltManufacturer2Calculator],
  en: [enManufacturer2, enManufacturer2Calculator],
};

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: paths.configurator,
    title: t(locale, "pages.manufacturer2.title"),
    description: t(locale, "pages.manufacturer2.description"),
  });
}

export default async function ConfiguratorPage({ params }) {
  const locale = await resolveLocale(params);
  const dict = buildDict(locale, [manufacturer2Sections, calculatorData], {
    extra: CONFIGURATOR_DICTS[locale] || [],
  });

  return (
    <main>
      <DictProvider dict={dict}>
        <Manufacturer2Client />
      </DictProvider>
    </main>
  );
}
