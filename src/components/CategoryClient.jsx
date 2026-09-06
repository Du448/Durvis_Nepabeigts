"use client";

import { useCallback, useMemo, useState } from "react";
import { X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import RevealGrid from "@/components/anim/RevealGrid";
import PageTitle from "@/components/PageTitle";
import {
  getProductsByCategory,
  getCategoryBySlug,
  products as allProductsData,
  categories as allCategoriesData,
} from "@/data/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t, translateColorLabel as translateColor } from "@/lib/i18n";

/* Catalogue filtering modelled on bulat-doors.com.ua: a permanent sidebar of
   stacked attribute groups (door type, collection, colour, size, price,
   features), every option multi-select with a live count, applied the moment
   it is clicked and written into the query string — so a filtered view can be
   shared, bookmarked and reached again with the back button. */

/* The same scene renders the homepage blocks use: each one shows a door that
   is actually in that category's catalogue, so the banner matches what the
   page below it lists. Stock photography of somebody else's door did not. */
const CATEGORY_BANNERS = {
  "ardurvis-dzivoklim": "/scenes/ardurvis-dzivoklim.webp",
  "ardurvis-privatmajai": "/scenes/ardurvis-privatmajai.webp",
  ieksdurvis: "/scenes/ieksdurvis.webp",
  "sleptas-durvis": "/scenes/sleptas-durvis.webp",
};

const TYPE_OPTIONS = [
  "ardurvis-dzivoklim",
  "ardurvis-privatmajai",
  "ieksdurvis",
  "sleptas-durvis",
];

const FEATURE_KEYS = ["thermo", "glass", "new", "offer"];

function Group({ title, children }) {
  return (
    <div className="mb-7">
      <div className="t-widget mb-3 border-b border-line pb-2 text-[color:var(--color-title)]">{title}</div>
      {children}
    </div>
  );
}

function Option({ type = "checkbox", name, checked, onChange, label, count, disabled }) {
  return (
    <label
      className={`-mx-2 flex min-h-9 items-center gap-2.5 px-2 text-[15px] transition-colors duration-200 ${
        disabled ? "cursor-default text-muted/60" : "cursor-pointer text-ink hover:bg-[--color-soft]"
      }`}
    >
      <input
        type={type}
        name={name}
        className="h-4 w-4 accent-[--color-accent]"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="flex-1">{label}</span>
      {typeof count === "number" ? <span className="text-[13px] text-muted">{count}</span> : null}
    </label>
  );
}

export default function CategoryClient({ slug }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = getCategoryBySlug(slug);
  const allProducts = useMemo(() => getProductsByCategory(slug), [slug]);

  const [collectionSearch, setCollectionSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* --- Filter state lives in the URL ------------------------------------- */

  const readList = (key) => {
    const raw = searchParams.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };

  const selectedCollections = readList("kolekcija");
  const selectedColors = readList("krasa");
  const selectedSizes = readList("izmers");
  const selectedFeatures = readList("ipasibas");
  const priceMin = searchParams.get("no") || "";
  const priceMax = searchParams.get("lidz") || "";
  const sort = searchParams.get("kartot") || "popular";

  const setParams = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value == null || (Array.isArray(value) && !value.length)) next.delete(key);
        else next.set(key, Array.isArray(value) ? value.join(",") : String(value));
      });
      next.delete("__l"); // internal locale marker added by the proxy rewrite
      const qs = next.toString();
      /* History API rather than router.replace: filtering is a pure client
         concern here, and a router navigation would round-trip through the
         locale rewrite. Next still re-renders useSearchParams from this. */
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, searchParams]
  );

  const toggleValue = (key, current, value) =>
    setParams({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });

  const clearFilters = () =>
    setParams({ kolekcija: "", krasa: "", izmers: "", ipasibas: "", no: "", lidz: "" });

  /* Colour names come out of the catalogue in Latvian; @/lib/i18n renders
     them in the page's language. */
  const translateColorLabel = (value) => translateColor(locale, value);

  /* --- Option lists ------------------------------------------------------ */

  const collectionOptions = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.collection).filter(Boolean))).sort(),
    [allProducts]
  );
  const colorOptions = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.colors || []))).sort(),
    [allProducts]
  );
  const sizeOptions = useMemo(
    () => Array.from(new Set(allProducts.flatMap((p) => p.sizes || []))).sort(),
    [allProducts]
  );

  const bounds = useMemo(() => {
    const prices = allProducts.map((p) => p.price).filter((n) => typeof n === "number");
    if (!prices.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [allProducts]);

  const hasFeature = (p, key) =>
    key === "thermo"
      ? !!p.thermo
      : key === "glass"
        ? !!p.glass
        : key === "new"
          ? !!p.isNew
          : !!(p.oldPrice && p.oldPrice > p.price);

  /* Every predicate except the one belonging to `skip`, so each option can
     report how many models it would leave without counting its own group. */
  const matches = (p, skip) => {
    if (skip !== "kolekcija" && selectedCollections.length && !selectedCollections.includes(p.collection))
      return false;
    if (skip !== "krasa" && selectedColors.length && !(p.colors || []).some((c) => selectedColors.includes(c)))
      return false;
    if (skip !== "izmers" && selectedSizes.length && !(p.sizes || []).some((s) => selectedSizes.includes(s)))
      return false;
    if (skip !== "ipasibas" && selectedFeatures.length && !selectedFeatures.every((f) => hasFeature(p, f)))
      return false;
    if (skip !== "cena") {
      const min = priceMin === "" ? null : Number(priceMin);
      const max = priceMax === "" ? null : Number(priceMax);
      if (min !== null && !Number.isNaN(min) && p.price < min) return false;
      if (max !== null && !Number.isNaN(max) && p.price > max) return false;
    }
    return true;
  };

  const countFor = (group, predicate) => allProducts.filter((p) => matches(p, group) && predicate(p)).length;

  const filtered = (() => {
    const list = allProducts.filter((p) => matches(p));
    switch (sort) {
      case "cheap":
        return [...list].sort((a, b) => a.price - b.price);
      case "expensive":
        return [...list].sort((a, b) => b.price - a.price);
      case "new":
        return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return list;
    }
  })();

  if (!category) {
    return (
      <main className="container py-10">
        <div className="text-ink">{t(locale, "category.notFound")}</div>
      </main>
    );
  }

  const categoryName =
    t(locale, `categories.details.${slug}.name`) !== `categories.details.${slug}.name`
      ? t(locale, `categories.details.${slug}.name`)
      : t(locale, `categories.${slug}`);

  const resolvedDescription =
    t(locale, `categories.details.${slug}.description`) !== `categories.details.${slug}.description`
      ? t(locale, `categories.details.${slug}.description`)
      : category.description;

  const labelForSlug = (s) => {
    const k1 = t(locale, `categories.details.${s}.name`);
    if (k1 !== `categories.details.${s}.name`) return k1;
    const k2 = t(locale, `categories.${s}`);
    if (k2 !== `categories.${s}`) return k2;
    return allCategoriesData.find((c) => c.slug === s)?.name || s;
  };

  const featureLabel = (key) =>
    key === "thermo"
      ? t(locale, "category.thermo")
      : key === "glass"
        ? t(locale, "category.glass")
        : key === "new"
          ? t(locale, "category.newOnly")
          : t(locale, "category.offerOnly");

  const typeTitle = locale === "lt" ? "Durų tipas" : locale === "en" ? "Door type" : "Durvju tips";
  const searchPlaceholder = locale === "lt" ? "Ieškoti..." : locale === "en" ? "Search..." : "Meklēt...";

  const collectionQuery = collectionSearch.trim().toLowerCase();
  const colorQuery = colorSearch.trim().toLowerCase();
  const shownCollections = collectionOptions.filter((c) => c.toLowerCase().includes(collectionQuery));
  const shownColors = colorOptions.filter((c) => {
    const base = String(c).toLowerCase();
    return base.includes(colorQuery) || String(translateColorLabel(c)).toLowerCase().includes(colorQuery);
  });

  const sliderMin = priceMin === "" ? bounds.min : Math.max(bounds.min, Number(priceMin) || bounds.min);
  const sliderMax = priceMax === "" ? bounds.max : Math.min(bounds.max, Number(priceMax) || bounds.max);
  const span = Math.max(1, bounds.max - bounds.min);
  const fillLeft = ((sliderMin - bounds.min) / span) * 100;
  const fillRight = ((bounds.max - sliderMax) / span) * 100;

  const activeChips = [
    ...selectedCollections.map((v) => ({ key: "kolekcija", value: v, label: v, list: selectedCollections })),
    ...selectedColors.map((v) => ({ key: "krasa", value: v, label: translateColorLabel(v), list: selectedColors })),
    ...selectedSizes.map((v) => ({ key: "izmers", value: v, label: v, list: selectedSizes })),
    ...selectedFeatures.map((v) => ({ key: "ipasibas", value: v, label: featureLabel(v), list: selectedFeatures })),
  ];
  const priceActive = priceMin !== "" || priceMax !== "";

  const Filters = (
    <div className="w-full max-w-[268px] shrink-0">
      <Group title={typeTitle}>
        <div className="space-y-0.5">
          {TYPE_OPTIONS.map((s) => (
            <Option
              key={s}
              type="radio"
              name="door-type"
              checked={slug === s}
              onChange={() => router.push(withLocaleHref(locale, `/kategorija/${s}`))}
              label={labelForSlug(s)}
              count={allProductsData.filter((p) => p.category === s).length}
            />
          ))}
        </div>
      </Group>

      {collectionOptions.length ? (
        <Group title={t(locale, "category.collection")}>
          {collectionOptions.length > 6 ? (
            <input
              type="text"
              value={collectionSearch}
              onChange={(e) => setCollectionSearch(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={t(locale, "category.collection")}
              className="mb-2 min-h-9 w-full border border-line bg-white px-2 py-1 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
            />
          ) : null}
          <div className="filter-scroll space-y-0.5">
            {shownCollections.map((c) => {
              const count = countFor("kolekcija", (p) => p.collection === c);
              return (
                <Option
                  key={c}
                  checked={selectedCollections.includes(c)}
                  disabled={!count && !selectedCollections.includes(c)}
                  onChange={() => toggleValue("kolekcija", selectedCollections, c)}
                  label={c}
                  count={count}
                />
              );
            })}
            {!shownCollections.length ? <div className="px-2 py-2 text-sm text-muted">—</div> : null}
          </div>
        </Group>
      ) : null}

      {colorOptions.length ? (
        <Group title={t(locale, "category.color")}>
          {colorOptions.length > 6 ? (
            <input
              type="text"
              value={colorSearch}
              onChange={(e) => setColorSearch(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={t(locale, "category.color")}
              className="mb-2 min-h-9 w-full border border-line bg-white px-2 py-1 text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
            />
          ) : null}
          <div className="filter-scroll space-y-0.5">
            {shownColors.map((c) => {
              const count = countFor("krasa", (p) => (p.colors || []).includes(c));
              return (
                <Option
                  key={c}
                  checked={selectedColors.includes(c)}
                  disabled={!count && !selectedColors.includes(c)}
                  onChange={() => toggleValue("krasa", selectedColors, c)}
                  label={translateColorLabel(c)}
                  count={count}
                />
              );
            })}
            {!shownColors.length ? <div className="px-2 py-2 text-sm text-muted">—</div> : null}
          </div>
        </Group>
      ) : null}

      {sizeOptions.length ? (
        <Group title={t(locale, "category.size")}>
          <div className="filter-scroll space-y-0.5">
            {sizeOptions.map((s) => {
              const count = countFor("izmers", (p) => (p.sizes || []).includes(s));
              return (
                <Option
                  key={s}
                  checked={selectedSizes.includes(s)}
                  disabled={!count && !selectedSizes.includes(s)}
                  onChange={() => toggleValue("izmers", selectedSizes, s)}
                  label={s}
                  count={count}
                />
              );
            })}
          </div>
        </Group>
      ) : null}

      <Group title={t(locale, "category.price")}>
        {bounds.max > bounds.min ? (
          <div className="range-dual mb-3">
            <span className="range-dual-track" />
            <span className="range-dual-fill" style={{ left: `${fillLeft}%`, right: `${fillRight}%` }} />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={sliderMin}
              aria-label={t(locale, "category.from")}
              onChange={(e) => setParams({ no: Math.min(Number(e.target.value), sliderMax) })}
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={sliderMax}
              aria-label={t(locale, "category.to")}
              onChange={(e) => setParams({ lidz: Math.max(Number(e.target.value), sliderMin) })}
            />
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${bounds.min}`}
            value={priceMin}
            aria-label={t(locale, "category.from")}
            onChange={(e) => setParams({ no: e.target.value })}
            className="min-h-10 w-24 border border-line bg-white px-2 py-1 text-[15px] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={`${bounds.max}`}
            value={priceMax}
            aria-label={t(locale, "category.to")}
            onChange={(e) => setParams({ lidz: e.target.value })}
            className="min-h-10 w-24 border border-line bg-white px-2 py-1 text-[15px] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
          />
        </div>
      </Group>

      <Group title={t(locale, "category.features")}>
        <div className="space-y-0.5">
          {FEATURE_KEYS.map((key) => {
            const count = countFor("ipasibas", (p) => hasFeature(p, key));
            if (!count && !selectedFeatures.includes(key)) return null;
            return (
              <Option
                key={key}
                checked={selectedFeatures.includes(key)}
                onChange={() => toggleValue("ipasibas", selectedFeatures, key)}
                label={featureLabel(key)}
                count={count}
              />
            );
          })}
        </div>
      </Group>

      <button
        onClick={clearFilters}
        className="min-h-11 border border-line px-4 py-1.5 text-[15px] text-ink transition-[border-color,transform] duration-200 hover:border-[--color-muted] active:scale-[0.97]"
      >
        {t(locale, "category.clearFilters")}
      </button>
    </div>
  );

  return (
    <main>
      <PageTitle
        title={categoryName}
        description={resolvedDescription}
        image={CATEGORY_BANNERS[slug]}
        links={TYPE_OPTIONS.map((s2) => ({
          href: withLocaleHref(locale, `/kategorija/${s2}`),
          label: labelForSlug(s2),
          meta: `${getProductsByCategory(s2).length}`,
        }))}
      />

      <section>
        <div className="container py-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted">
              {filtered.length} {t(locale, "category.models")}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-muted" htmlFor="sort">
                {t(locale, "category.sort")}
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setParams({ kartot: e.target.value === "popular" ? "" : e.target.value })}
                className="field h-10 w-auto py-0 text-[14px]"
              >
                <option value="popular">{t(locale, "category.sortPopular")}</option>
                <option value="cheap">{t(locale, "category.sortCheap")}</option>
                <option value="expensive">{t(locale, "category.sortExpensive")}</option>
                <option value="new">{t(locale, "category.sortNew")}</option>
              </select>
              {/* .btn sets display outside Tailwind's layer, so md:hidden has to
                  sit on a plain wrapper to win the cascade. */}
              <div className="md:hidden">
                <button
                  className="btn btn-outline-dark h-10 px-5"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  {t(locale, "category.filters")}
                </button>
              </div>
            </div>
          </div>

          {activeChips.length || priceActive ? (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">{t(locale, "category.activeFilters")}:</span>
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}:${chip.value}`}
                  type="button"
                  className="filter-chip"
                  onClick={() => toggleValue(chip.key, chip.list, chip.value)}
                >
                  {chip.label}
                  <X size={13} strokeWidth={2} />
                </button>
              ))}
              {priceActive ? (
                <button type="button" className="filter-chip" onClick={() => setParams({ no: "", lidz: "" })}>
                  {`${priceMin || bounds.min} – ${priceMax || bounds.max} €`}
                  <X size={13} strokeWidth={2} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={clearFilters}
                className="text-[13px] text-muted underline transition-colors hover:text-ink"
              >
                {t(locale, "category.clearFilters")}
              </button>
            </div>
          ) : null}

          <div className="flex gap-8">
            <div className="hidden md:block">{Filters}</div>
            <div className="flex-1">
              {filtered.length ? (
                <RevealGrid
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  revealKey={`${slug}|${sort}|${filtered.map((p) => p.id).join(",")}`}
                >
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </RevealGrid>
              ) : (
                <div className="border border-line p-8 text-center text-muted">
                  {t(locale, "category.nothingFound")}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="animate-drawer-in absolute inset-y-0 right-0 w-[85%] max-w-[320px] overflow-y-auto bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">{t(locale, "category.filters")}</div>
              <button
                className="min-h-10 border border-line px-3 py-1 text-[15px] transition-colors active:bg-[--color-soft]"
                onClick={() => setMobileFiltersOpen(false)}
              >
                {t(locale, "category.close")}
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </main>
  );
}
