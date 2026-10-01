/* llms.txt (https://llmstxt.org): a plain Markdown digest of the shop for AI
   assistants - who the business is, what it sells at what price, the
   services and their prices, and the answers to the usual questions, each
   linking to the page that says it in full. Built from the same data as the
   pages, so it never drifts from what the site shows.

   /llms.txt is the short index; /llms-full.txt (and /lv/…, /en/…) adds the
   whole catalogue, one entry per model. Server-only: it reads the
   translated catalogue. */

import { categories } from "@/data/products";
import { getProducts } from "@/lib/pricedCatalog";
import { getService, serviceSlugs } from "@/data/services";
import { locales, t } from "@/lib/i18n";
import { trData, translateColorLabel } from "@/lib/i18n-data";
import { buildSpecRows } from "@/lib/product-specs";
import { formatPrice, stockKind } from "@/lib/product-utils";
import { SITE_URL, company, hoursFor, localizedUrl, mapUrl, phones, socialProfiles } from "@/lib/site";
import { paths } from "@/lib/routes";
import { siteDescription } from "@/lib/page";

const L = {
  lt: {
    facts: "Pagrindinė informacija",
    company: "Įmonė",
    address: "Salonas",
    phone: "Telefonas",
    email: "El. paštas",
    hours: "Darbo laikas",
    area: "Aptarnaujama teritorija",
    areaValue: "visa Lietuva (pristatymas ir montavimas)",
    languages: "Bendravimo kalbos",
    languagesValue: "lietuvių, latvių, anglų",
    profiles: "Profiliai",
    categories: "Asortimentas",
    models: "modeliai",
    priceFrom: "kaina nuo",
    services: "Paslaugos",
    faq: "Dažniausi klausimai",
    pages: "Kiti puslapiai",
    catalogue: "Visas katalogas",
    collection: "Kolekcija",
    price: "Kaina",
    oldPrice: "buvusi kaina",
    sizes: "Dydžiai",
    colors: "Spalvos",
    availability: "Prieinamumas",
    noPrice: "kaina dar neskelbiama",
    stock: { local: "yra sandėlyje", factory: "gamintojo sandėlyje", order: "gaminama pagal užsakymą", soon: "netrukus" },
    full: "Pilna versija su visu katalogu",
    other: "Kitos kalbos",
    pricesNote: "Kainos eurais su PVM; aktualios kainos - produktų puslapiuose.",
  },
  lv: {
    facts: "Pamatinformācija",
    company: "Uzņēmums",
    address: "Salons",
    phone: "Tālrunis",
    email: "E-pasts",
    hours: "Darba laiks",
    area: "Apkalpošanas teritorija",
    areaValue: "visa Lietuva (piegāde un montāža)",
    languages: "Saziņas valodas",
    languagesValue: "lietuviešu, latviešu, angļu",
    profiles: "Profili",
    categories: "Sortiments",
    models: "modeļi",
    priceFrom: "cena no",
    services: "Pakalpojumi",
    faq: "Biežāk uzdotie jautājumi",
    pages: "Citas lapas",
    catalogue: "Pilns katalogs",
    collection: "Kolekcija",
    price: "Cena",
    oldPrice: "iepriekšējā cena",
    sizes: "Izmēri",
    colors: "Krāsas",
    availability: "Pieejamība",
    noPrice: "cena vēl nav publicēta",
    stock: { local: "ir noliktavā", factory: "ražotāja noliktavā", order: "izgatavo pēc pasūtījuma", soon: "drīzumā" },
    full: "Pilnā versija ar visu katalogu",
    other: "Citas valodas",
    pricesNote: "Cenas eiro ar PVN; aktuālās cenas - produktu lapās.",
  },
  en: {
    facts: "Key facts",
    company: "Company",
    address: "Showroom",
    phone: "Phone",
    email: "Email",
    hours: "Opening hours",
    area: "Area served",
    areaValue: "all of Lithuania (delivery and installation)",
    languages: "Languages spoken",
    languagesValue: "Lithuanian, Latvian, English",
    profiles: "Profiles",
    categories: "Product range",
    models: "models",
    priceFrom: "from",
    services: "Services",
    faq: "Frequently asked questions",
    pages: "Other pages",
    catalogue: "Full catalogue",
    collection: "Collection",
    price: "Price",
    oldPrice: "was",
    sizes: "Sizes",
    colors: "Colours",
    availability: "Availability",
    noPrice: "price not announced yet",
    stock: { local: "in stock", factory: "in the manufacturer's warehouse", order: "made to order", soon: "coming soon" },
    full: "Full version with the whole catalogue",
    other: "Other languages",
    pricesNote: "Prices in euro incl. VAT; current prices are on the product pages.",
  },
};

const fullTxtUrl = (locale) => (locale === "en" ? `${SITE_URL}/llms-full.txt` : `${SITE_URL}/${locale}/llms-full.txt`);

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

function categoryName(locale, id) {
  const name = t(locale, `categories.details.${id}.name`);
  return name.startsWith("categories.") ? categories.find((c) => c.slug === id)?.name || id : name;
}

function categoryDescription(locale, id) {
  const d = t(locale, `categories.details.${id}.description`);
  return d.startsWith("categories.") ? categories.find((c) => c.slug === id)?.description || "" : d;
}

function header(locale, l) {
  const lines = [
    "# NT Durys",
    "",
    `> ${siteDescription(locale)}`,
    "",
    `## ${l.facts}`,
    "",
    `- ${l.company}: NT Durys (${company.legalName}, ${company.code}, PVM/VAT ${company.vat})`,
    `- ${l.address}: ${company.address} ([Google Maps](${mapUrl}))`,
    `- ${l.phone}: ${phones.map((p) => p.label).join(", ")}`,
    `- ${l.email}: ${company.email}`,
    `- ${l.hours}: ${hoursFor(locale).map((r) => `${r.days} ${r.time}`).join("; ")}`,
    `- ${l.area}: ${l.areaValue}`,
    `- ${l.languages}: ${l.languagesValue}`,
    `- Website: ${localizedUrl(locale, "")}`,
  ];
  if (socialProfiles.length) lines.push(`- ${l.profiles}: ${socialProfiles.join(", ")}`);
  return lines;
}

function categorySection(locale, l, products) {
  const lines = ["", `## ${l.categories}`, ""];
  for (const c of categories) {
    const inCat = products.filter((p) => p.category === c.slug);
    const prices = inCat.map((p) => p.price).filter((n) => typeof n === "number" && n > 0);
    const min = prices.length ? Math.min(...prices) : null;
    const meta = [`${inCat.length} ${l.models}`, min != null ? `${l.priceFrom} ${min} €` : null].filter(Boolean).join(", ");
    lines.push(
      `- [${categoryName(locale, c.slug)}](${localizedUrl(locale, paths.category(c.slug))}): ${clean(categoryDescription(locale, c.slug))} (${meta})`
    );
  }
  lines.push("", l.pricesNote);
  return lines;
}

function serviceSection(locale, l, withPrices) {
  const lines = ["", `## ${l.services}`, ""];
  for (const slug of serviceSlugs) {
    const s = getService(slug, locale);
    lines.push(`- [${s.title}](${localizedUrl(locale, paths.service(slug))}): ${clean(s.description)}`);
    if (!withPrices) continue;
    for (const group of s.prices) {
      for (const [label, price] of group.rows) {
        lines.push(`  - ${group.title ? `${clean(group.title)} - ` : ""}${clean(label)}: ${price}`);
      }
    }
    if (s.priceNote) lines.push(`  - ${clean(s.priceNote)}`);
  }
  return lines;
}

function faqSection(locale, l, perService) {
  const lines = ["", `## ${l.faq}`, ""];
  for (const slug of serviceSlugs) {
    const s = getService(slug, locale);
    for (const f of s.faq.slice(0, perService)) {
      lines.push(`### ${clean(f.q)}`, "", clean(f.a), "", `(${localizedUrl(locale, paths.service(slug))})`, "");
    }
  }
  return lines;
}

function pagesSection(locale, l) {
  const page = (key, path) => `- [${t(locale, key)}](${localizedUrl(locale, path)})`;
  return [
    "",
    `## ${l.pages}`,
    "",
    page("nav.about", paths.about),
    page("nav.contacts", paths.contacts),
    page("nav.configurator", paths.configurator),
    page("nav.finishes", paths.finishes),
    page("nav.deals", paths.deals),
    page("nav.news", paths.news),
  ];
}

function productEntry(locale, l, p) {
  const name = clean(trData(locale, p.name));
  const lines = [`### [${name}](${localizedUrl(locale, paths.product(p.id))})`, ""];
  const short = clean(trData(locale, p.short || ""));
  if (short) lines.push(short, "");
  const kind = stockKind(p);
  const facts = [
    [l.collection, p.collection],
    [
      l.price,
      p.price == null
        ? l.noPrice
        : `${formatPrice(p)}${p.oldPrice ? ` (${l.oldPrice} ${formatPrice(p, p.oldPrice)})` : ""}`,
    ],
    [l.sizes, (p.sizes || []).join(", ")],
    [l.colors, (p.colors || []).map((c) => translateColorLabel(locale, c)).join(", ")],
    [l.availability, kind ? l.stock[kind] : ""],
    ...buildSpecRows(p, (s) => trData(locale, s), (key) => t(locale, key)).slice(0, 12),
  ];
  for (const [label, value] of facts) if (clean(value)) lines.push(`- ${clean(label)}: ${clean(value)}`);
  lines.push("");
  return lines;
}

function otherLanguages(locale, l) {
  return ["", `## ${l.other}`, "", ...locales.filter((x) => x !== locale).map((x) => `- ${x.toUpperCase()}: ${fullTxtUrl(x)}`)];
}

/* The short index, in English (the convention), with Lithuanian links -
   the shop's main market and language. */
export async function buildLlmsTxt() {
  const locale = "en";
  const l = L[locale];
  const products = await getProducts();
  return [
    ...header(locale, l),
    ...categorySection(locale, l, products),
    ...serviceSection(locale, l, false),
    ...faqSection(locale, l, 2),
    ...pagesSection(locale, l),
    "",
    "## Optional",
    "",
    `- [${l.full} (EN)](${fullTxtUrl("en")})`,
    `- [Lietuviškai - pilna versija (LT)](${fullTxtUrl("lt")})`,
    `- [Latviski - pilnā versija (LV)](${fullTxtUrl("lv")})`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n");
}

export async function buildLlmsFullTxt(locale) {
  const l = L[locale] || L.lt;
  const products = await getProducts();
  const lines = [
    ...header(locale, l),
    ...categorySection(locale, l, products),
    ...serviceSection(locale, l, true),
    ...faqSection(locale, l, Infinity),
    ...pagesSection(locale, l),
    "",
    `## ${l.catalogue}`,
  ];
  for (const c of categories) {
    lines.push("", `## ${categoryName(locale, c.slug)}`, "");
    for (const p of products.filter((x) => x.category === c.slug)) lines.push(...productEntry(locale, l, p));
  }
  lines.push(...otherLanguages(locale, l), "");
  return lines.join("\n");
}

export const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex",
};
