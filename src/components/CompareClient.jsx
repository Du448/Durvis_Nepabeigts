"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Ruler, DoorOpen, Layers, Wind, KeyRound, Palette, ListChecks } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { paths } from "@/lib/routes";
import { readCompareIds, removeCompareId, clearCompare } from "@/lib/compare";
import { formatPrice } from "@/lib/product-utils";
import { imageProps } from "@/lib/images";

// Same sections and icons as the product page's own spec tab (ProductTabs.jsx)
// - buildSpecGroups already returns each product's rows in this fixed order.
const SPEC_GROUP_ORDER = ["size", "application", "construction", "sealing", "locks", "finish", "other"];
const SPEC_GROUP_ICONS = {
  size: Ruler,
  application: DoorOpen,
  construction: Layers,
  sealing: Wind,
  locks: KeyRound,
  finish: Palette,
  other: ListChecks,
};

/* Comparison table modelled on rdveikals.lv: products grouped by category
   (each door type gets its own mini-table, so mixing an entrance door and an
   interior door in one comparison never mashes their spec rows together),
   a per-group "all / different only" toggle that hides identical rows
   client-side, and an "X" on each column that drops that product instantly. */

export default function CompareClient() {
  const locale = getLocaleFromPathname(usePathname());
  // null until localStorage has been read, so the page doesn't flash "empty".
  const [ids, setIds] = useState(null);

  useEffect(() => {
    const sync = () => setIds(readCompareIds());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("compare:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("compare:change", sync);
    };
  }, []);

  // Cards come from /api/compare, so the catalogue stays off the client.
  // Tagged with the id list it answers, so a stale response is never shown.
  const [result, setResult] = useState({ key: null, products: [] });
  const idsKey = ids ? ids.join(",") : null;

  useEffect(() => {
    if (!idsKey) return;
    const controller = new AbortController();
    fetch(`/api/compare?locale=${locale}&ids=${encodeURIComponent(idsKey)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        // Keep the order the visitor added them in.
        const byId = new Map((data.products || []).map((p) => [p.id, p]));
        setResult({ key: idsKey, products: idsKey.split(",").map((id) => byId.get(id)).filter(Boolean) });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [idsKey, locale]);

  const loaded = idsKey === "" || (idsKey !== null && result.key === idsKey);
  const products = idsKey && result.key === idsKey ? result.products : [];

  if (!loaded) return <div className="container min-h-[40vh] py-10" />;

  if (!products.length) {
    return (
      <div className="container py-10">
        <div className="border border-line bg-white p-6 text-[15px] text-muted">
          {t(locale, "compare.empty")}
          <div className="mt-4">
            <Link href={withLocaleHref(locale, "/")} className="btn btn-accent">
              {t(locale, "search.backHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group by category, in the order each category first appears.
  const groups = [];
  const byCategory = new Map();
  for (const p of products) {
    if (!byCategory.has(p.category)) {
      const group = { category: p.category, label: p.categoryLabel, products: [] };
      byCategory.set(p.category, group);
      groups.push(group);
    }
    byCategory.get(p.category).products.push(p);
  }

  return <CompareGroups groups={groups} locale={locale} />;
}

function CompareGroups({ groups, locale }) {
  const [active, setActive] = useState(groups[0].category);
  const activeGroup = groups.find((g) => g.category === active) || groups[0];

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {groups.length > 1 ? (
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line">
            {groups.map((group) => (
              <button
                key={group.category}
                type="button"
                onClick={() => setActive(group.category)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-1 pb-3 text-[14px] font-medium transition-colors duration-200 ${
                  group.category === activeGroup.category
                    ? "border-[color:var(--color-accent)] text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {group.label}
                <span
                  className={
                    group.category === activeGroup.category
                      ? "text-[color:var(--color-accent)]"
                      : "text-muted"
                  }
                >
                  {group.products.length}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={clearCompare}
          className="min-h-11 shrink-0 border border-line px-4 py-1.5 text-[13px] text-ink transition-colors duration-200 hover:border-[--color-muted]"
        >
          {t(locale, "compare.clearAll")}
        </button>
      </div>

      <CompareGroup group={activeGroup} locale={locale} showHeading={groups.length === 1} />
    </div>
  );
}

function CompareGroup({ group, locale, showHeading }) {
  const [diffOnly, setDiffOnly] = useState(false);
  const { products } = group;

  // Flat label -> value lookup per product, from every spec section combined.
  const valueMaps = products.map((p) => new Map((p.specGroups || []).flatMap((g) => g.rows)));

  // Section titles and each section's labels (first-seen order across
  // products), so the table breaks down the same way the product page's own
  // spec tab does instead of one flat list of every row.
  const groupTitles = new Map();
  const groupLabels = new Map();
  for (const p of products) {
    for (const g of p.specGroups || []) {
      if (!groupTitles.has(g.key)) {
        groupTitles.set(g.key, g.title);
        groupLabels.set(g.key, []);
      }
      const seen = groupLabels.get(g.key);
      for (const [label] of g.rows) {
        if (!seen.includes(label)) seen.push(label);
      }
    }
  }

  const sections = SPEC_GROUP_ORDER.filter((key) => groupLabels.has(key))
    .map((key) => ({
      key,
      title: groupTitles.get(key),
      rows: groupLabels
        .get(key)
        .map((label) => ({ label, values: valueMaps.map((m) => m.get(label) ?? null) }))
        .filter((row) => !diffOnly || new Set(row.values).size > 1),
    }))
    .filter((section) => section.rows.length);

  return (
    <div className="mb-12">
      {showHeading ? (
        <h2 className="mb-4 flex items-center gap-2 border-b border-line pb-2 text-[13px] font-semibold uppercase tracking-wide text-muted">
          {group.label}
          <span className="text-[color:var(--color-accent)]">{products.length}</span>
        </h2>
      ) : null}

      {products.length > 1 ? (
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={`compare-mode-${group.category}`}
              checked={!diffOnly}
              onChange={() => setDiffOnly(false)}
              className="h-4 w-4 accent-[--color-accent]"
            />
            {t(locale, "compare.showAll")}
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={`compare-mode-${group.category}`}
              checked={diffOnly}
              onChange={() => setDiffOnly(true)}
              className="h-4 w-4 accent-[--color-accent]"
            />
            {t(locale, "compare.showDiff")}
          </label>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[14px]">
          <caption className="sr-only">{group.label}</caption>
          <thead>
            <tr>
              <th className="w-[220px]" scope="col" />
              {products.map((p) => (
                <th key={p.id} className="border border-line bg-white p-3 text-left align-top font-normal" scope="col">
                  <div className="relative pr-6">
                    <button
                      type="button"
                      aria-label={t(locale, "compare.remove")}
                      onClick={() => removeCompareId(p.id)}
                      className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-ink"
                    >
                      <X size={15} />
                    </button>
                    <Link href={withLocaleHref(locale, paths.product(p.id))} className="block">
                      <div className="relative mb-2 aspect-square w-24 overflow-hidden bg-[--color-soft]">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="96px"
                            {...imageProps(p.image)}
                            className="object-contain mix-blend-multiply p-2"
                          />
                        ) : null}
                      </div>
                      <div className="text-[13px] font-medium leading-[1.4] text-ink">{p.name}</div>
                    </Link>
                    <div className="mt-1 text-[14px] text-[color:var(--color-accent)]">{formatPrice(p)}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[--color-soft]">
              <th scope="row" className="border border-line px-3 py-2 text-left font-normal text-muted">
                {t(locale, "compare.code")}
              </th>
              {products.map((p) => (
                <td key={p.id} className="border border-line px-3 py-2 text-ink">
                  {p.id}
                </td>
              ))}
            </tr>
          </tbody>
          {sections.map((section) => {
            const Icon = SPEC_GROUP_ICONS[section.key] || ListChecks;
            return (
              <tbody key={section.key}>
                <tr>
                  <th
                    colSpan={products.length + 1}
                    scope="colgroup"
                    className="border border-l-[3px] border-line border-l-[color:var(--color-accent)] bg-white px-3 py-2.5 text-left"
                  >
                    <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-title)]">
                      <Icon size={15} className="text-[color:var(--color-accent)]" />
                      {section.title}
                    </span>
                  </th>
                </tr>
                {section.rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-white" : "bg-[--color-soft]"}>
                    <th scope="row" className="border border-line px-3 py-2 text-left font-normal text-muted">
                      {row.label}
                    </th>
                    {row.values.map((v, j) => (
                      <td key={j} className="border border-line px-3 py-2 text-ink">
                        {v ?? "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
