/* Catalogue translations.

   The product data (products.js, factory-products.js, catalog-specs.js,
   hidden-doors.js, finishes.js) is generated from the manufacturer's and the
   warehouse's own listings and is stored in Latvian. Rather than forking that
   data per language - which would be lost the next time it is regenerated -
   each locale gets a dictionary keyed by the Latvian source string. `trData`
   in @/lib/i18n does the lookup and falls back to the source, so a string
   nobody has translated yet still renders instead of disappearing.

   Lithuanian, English and Russian are filled in; anything a dictionary does
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
import { ltManufacturer2 } from "./lt/manufacturer2";
import { ltManufacturer2Calculator } from "./lt/manufacturer2Calculator";
import { ltBoston } from "./lt/boston";

import { enLabels } from "./en/labels";
import { enSpecValues } from "./en/spec-values";
import { enFullValues } from "./en/full-values";
import { enNames } from "./en/names";
import { enShorts } from "./en/shorts";
import { enDescTitles, enDescParas } from "./en/descriptions";
import { enFinishText, enFinishLabels } from "./en/finishes";
import { enColors, enSetItems } from "./en/misc";
import { enManufacturer2 } from "./en/manufacturer2";
import { enManufacturer2Calculator } from "./en/manufacturer2Calculator";
import { enBoston } from "./en/boston";

import { ruLabels } from "./ru/labels";
import { ruSpecValues } from "./ru/spec-values";
import { ruFullValues } from "./ru/full-values";
import { ruNames } from "./ru/names";
import { ruShorts } from "./ru/shorts";
import { ruDescTitles, ruDescParas } from "./ru/descriptions";
import { ruFinishText, ruFinishLabels } from "./ru/finishes";
import { ruColors, ruSetItems } from "./ru/misc";
import { ruManufacturer2 } from "./ru/manufacturer2";
import { ruManufacturer2Calculator } from "./ru/manufacturer2Calculator";
import { ruBoston } from "./ru/boston";

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
  ...ltManufacturer2,
  ...ltManufacturer2Calculator,
  ...ltBoston,
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
  ...enManufacturer2,
  ...enManufacturer2Calculator,
  ...enBoston,
};

const ru = {
  ...ruLabels,
  ...ruSpecValues,
  ...ruFullValues,
  ...ruNames,
  ...ruShorts,
  ...ruDescTitles,
  ...ruDescParas,
  ...ruFinishText,
  ...ruFinishLabels,
  ...ruColors,
  ...ruSetItems,
  ...ruManufacturer2,
  ...ruManufacturer2Calculator,
  ...ruBoston,
};

export const catalogTranslations = { lt, en, ru };
