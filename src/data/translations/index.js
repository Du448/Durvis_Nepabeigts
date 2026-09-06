/* Catalogue translations.

   The product data (products.js, factory-products.js, catalog-specs.js,
   hidden-doors.js, finishes.js) is generated from the manufacturer's and the
   warehouse's own listings and is stored in Latvian. Rather than forking that
   data per language — which would be lost the next time it is regenerated —
   each locale gets a dictionary keyed by the Latvian source string. `trData`
   in @/lib/i18n does the lookup and falls back to the source, so a string
   nobody has translated yet still renders instead of disappearing.

   Only Lithuanian is filled in; English still falls through to the source
   except for colour names, which @/lib/i18n translates token by token. */

import { ltLabels } from "./lt/labels";
import { ltSpecValues } from "./lt/spec-values";
import { ltFullValues } from "./lt/full-values";
import { ltNames } from "./lt/names";
import { ltShorts } from "./lt/shorts";
import { ltDescTitles, ltDescParas } from "./lt/descriptions";
import { ltFinishText, ltFinishLabels } from "./lt/finishes";
import { ltColors, ltSetItems } from "./lt/misc";

const lt = {
  ...ltLabels,
  ...ltSpecValues,
  ...ltFullValues,
  ...ltNames,
  ...ltShorts,
  ...ltDescTitles,
  ...ltDescParas,
  ...ltFinishText,
  ...ltFinishLabels,
  ...ltColors,
  ...ltSetItems,
};

export const catalogTranslations = { lt };
