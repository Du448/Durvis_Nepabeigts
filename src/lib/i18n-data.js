/* Catalogue translations: server-side only. This pulls in every product
   name, description and specification string for all locales, so client
   components must not import it - server pages translate the data they pass
   down, or hand a page-sized dictionary to <DictProvider> (see @/lib/dict). */

import { catalogTranslations } from "@/data/translations";

/* Catalogue data - product names, blurbs, specification rows, description
   paragraphs, finish labels - is stored in Latvian and translated through a
   per-locale dictionary keyed by the source string (see @/data/translations).
   Anything the dictionary does not cover falls back to the source, so a new
   model shows up in Latvian rather than not at all. */
export function trData(locale, value) {
  if (typeof value !== "string") return value;
  if (locale === "lv") return value;
  return catalogTranslations[locale]?.[value] ?? value;
}

/* The same, for a [label, value] specification row. */
export function trRow(locale, row) {
  return [trData(locale, row?.[0]), trData(locale, row?.[1])];
}

export function translateColorLabel(locale, value) {
  if (locale === "lv") return String(value);

  /* Colours the dictionary knows in full read better than the token-by-token
     pass below ("Ārpusē: balts satīns" → "Išorėje: baltas satinas"), so try it
     first and only fall back to per-word substitution. */
  const known = catalogTranslations[locale]?.[String(value)];
  if (known) return known;

  const tokenMaps = {
    en: {
      antracīts: "anthracite",
      antracits: "anthracite",
      balts: "white",
      melns: "black",
      mats: "matte",
      supermats: "super matte",
      dienvidu: "southern",
      betons: "concrete",
      oksīds: "oxide",
      oksids: "oxide",
      tumšs: "dark",
      tums: "dark",
      koks: "wood",
      ozols: "oak",
      tabakas: "tobacco",
      sudraba: "silver",
      sudrabots: "silver",
      horizontāls: "horizontal",
      horizontal: "horizontal",
      pelēks: "grey",
      peleks: "grey",
      zelta: "gold",
      priede: "pine",
      provanss: "provence",
      tīka: "teak",
      tika: "teak",
      sonomas: "sonoma",
      sagrēns: "textured",
      sagrēns: "textured",
    },
    lt: {
      antracīts: "antracitas",
      antracits: "antracitas",
      balts: "balta",
      melns: "juoda",
      mats: "matinis",
      supermats: "super matinis",
      dienvidu: "pietų",
      betons: "betonas",
      oksīds: "oksidas",
      oksids: "oksidas",
      tumšs: "tamsus",
      tums: "tamsus",
      koks: "mediena",
      ozols: "ąžuolas",
      tabakas: "tabako",
      sudraba: "sidabro",
      sudrabots: "sidabrinis",
      horizontāls: "horizontalus",
      horizontal: "horizontalus",
      pelēks: "pilkas",
      peleks: "pilkas",
      zelta: "auksinis",
      priede: "pušis",
      provanss: "provansas",
      tīka: "tikas",
      tika: "tikas",
      sonomas: "sonomos",
      sagrēns: "faktūrinė",
      sagrēns: "faktūrinė",
    },
  };

  const map = locale === "en" ? tokenMaps.en : tokenMaps.lt;
  const parts = String(value).split(" ");

  const translated = parts.map((p) => {
    const lower = p.toLowerCase();
    if (lower.startsWith("ral")) return p.toUpperCase();
    const next = map[lower];
    if (!next) return p;
    const isCapitalized = p[0] === p[0]?.toUpperCase();
    return isCapitalized ? `${next[0].toUpperCase()}${next.slice(1)}` : next;
  });

  return translated.join(" ");
}
