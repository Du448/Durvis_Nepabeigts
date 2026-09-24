/* Public URL slugs. The site's main market is Lithuania, so every language
   uses the same Lithuanian slugs (/produktas/…, /lv/produktas/…). The
   catalogue data keeps its own internal category ids ("ardurvis-dzivoklim"
   etc.); only the URLs are mapped here.

   LEGACY_PATHS lists the Latvian slugs the site used before, so the proxy can
   answer old links and indexed pages with a 301 to the new address. */

export const CATEGORY_SLUGS = {
  "ardurvis-dzivoklim": "buto-lauko-durys",
  "ardurvis-privatmajai": "namo-lauko-durys",
  ieksdurvis: "vidaus-durys",
  "sleptas-durvis": "pasleptos-durys",
};

const CATEGORY_IDS = Object.fromEntries(Object.entries(CATEGORY_SLUGS).map(([id, slug]) => [slug, id]));

export const categorySlug = (categoryId) => CATEGORY_SLUGS[categoryId] || categoryId;
export const categoryIdFromSlug = (slug) => CATEGORY_IDS[slug] || null;

export const paths = {
  category: (categoryId) => `/kategorija/${categorySlug(categoryId)}`,
  product: (id) => `/produktas/${id}`,
  contacts: "/kontaktai",
  deals: "/akcijos",
  news: "/naujienos",
  finishes: "/apdaila",
  configurator: "/duru-konfiguratorius",
  search: "/paieska",
  wishlist: "/norai",
  cart: "/krepselis",
  partners: "/bendradarbiavimas",
  about: "/apie-mus",
  services: "/paslaugos",
  service: (slug) => `/paslaugos/${slug}`,
  privacy: "/privatumo-politika",
};

// Old first path segment -> new one. Category slugs are mapped separately.
export const LEGACY_SEGMENTS = {
  produkts: "produktas",
  kontakti: "kontaktai",
  akcijas: "akcijos",
  jaunumi: "naujienos",
  apdare: "apdaila",
  "razotajs-2": "duru-konfiguratorius",
  meklet: "paieska",
  velmes: "norai",
  grozs: "krepselis",
  sadarbiba: "bendradarbiavimas",
  "par-mums": "apie-mus",
  pakalpojumi: "paslaugos",
};

/* Rewrites a pre-migration path (without locale) to its current form, or
   returns null when nothing in it is legacy. */
export function legacyToCurrent(path) {
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return null;
  let changed = false;
  if (LEGACY_SEGMENTS[parts[0]]) {
    parts[0] = LEGACY_SEGMENTS[parts[0]];
    changed = true;
  }
  if (parts[0] === "kategorija" && parts[1] && CATEGORY_SLUGS[parts[1]]) {
    parts[1] = CATEGORY_SLUGS[parts[1]];
    changed = true;
  }
  return changed ? `/${parts.join("/")}` : null;
}
