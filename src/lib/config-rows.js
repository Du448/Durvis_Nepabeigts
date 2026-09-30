/* A cart / offer line's configurator choices as [label, value] rows,
   whichever configurator the line came from (Boston or hidden doors) -
   [] for a plain line. */

import { bostonRows } from "@/lib/boston-config-i18n";
import { hiddenRows } from "@/lib/hidden-config-i18n";
import { extenderLines } from "@/lib/interior-extenders";
import { t } from "@/lib/i18n";

export function configRows(product, line, locale) {
  const boston = bostonRows(product, line, locale);
  if (boston.length) return boston;
  const hidden = hiddenRows(product, line, locale);
  if (hidden.length) return hidden;
  // Interior-door extension boards, one row per board width.
  return extenderLines(line?.extenders).map(({ width, qty, price }) => [
    t(locale, "product.extenderBoard").replace("{w}", width),
    `${qty} × ${price.toFixed(2)} €`,
  ]);
}

export const isConfiguredLine = (line) => !!(line?.boston || line?.hidden);
