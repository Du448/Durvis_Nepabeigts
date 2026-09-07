/* Catalogue translations.

   The product data (products.js, factory-products.js, catalog-specs.js,
   hidden-doors.js, finishes.js) is generated from the manufacturer's and the
   warehouse's own listings and is stored in Latvian. Rather than forking that
   data per language — which would be lost the next time it is regenerated —
   each locale gets a dictionary keyed by the Latvian source string. `trData`
   in @/lib/i18n does the lookup and falls back to the source, so a string
   nobody has translated yet still renders instead of disappearing.

   Both Lithuanian and English are filled in; anything either dictionary does
   not cover falls through to the Latvian source (colour names are additionally
   translated token by token in @/lib/i18n). */

import { ltLabels } from "./lt/labels";
import { ltSpecValues } from "./lt/spec-values";
import { ltFullValues } from "./lt/full-values";
import { ltNames } from "./lt/names";
import { ltShorts } from "./lt/shorts";
import { ltDescTitles, ltDescParas } from "./lt/descriptions";
import { ltFinishText, ltFinishLabels } from "./lt/finishes";
import { ltColors, ltSetItems } from "./lt/misc";

import { enLabels } from "./en/labels";
import { enSpecValues } from "./en/spec-values";
import { enFullValues } from "./en/full-values";
import { enNames } from "./en/names";
import { enShorts } from "./en/shorts";
import { enDescTitles, enDescParas } from "./en/descriptions";
import { enFinishText, enFinishLabels } from "./en/finishes";
import { enColors, enSetItems } from "./en/misc";

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

const en = {
  ...enLabels,
  ...enSpecValues,
  ...enFullValues,
  ...enNames,
  ...enShorts,
  ...enDescTitles,
  ...enDescParas,
  ...enFinishText,
  ...enFinishLabels,
  ...enColors,
  ...enSetItems,
};

export const catalogTranslations = { lt, en };
