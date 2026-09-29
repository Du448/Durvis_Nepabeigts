/* A cart / offer line's configurator choices as [label, value] rows,
   whichever configurator the line came from (Boston or hidden doors) -
   [] for a plain line. */

import { bostonRows } from "@/lib/boston-config-i18n";
import { hiddenRows } from "@/lib/hidden-config-i18n";

export function configRows(product, line, locale) {
  const boston = bostonRows(product, line, locale);
  return boston.length ? boston : hiddenRows(product, line, locale);
}

export const isConfiguredLine = (line) => !!(line?.boston || line?.hidden);
