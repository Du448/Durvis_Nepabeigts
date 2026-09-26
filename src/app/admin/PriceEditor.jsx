"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAction, logoutAction } from "./actions";
import { adminUi } from "./i18n";

/* What a row shows: the catalogue value, replaced by any saved change. */
function current(row, override) {
  return {
    price: override?.price ?? row.base.price,
    oldPrice: override && "oldPrice" in override ? override.oldPrice : row.base.oldPrice,
    inStock: typeof override?.inStock === "boolean" ? override.inStock : row.base.inStock,
  };
}

// Sum of a per-size/side stock map ({ "size|side": qty }), or null when
// there's nothing for this product from that source at all. Used for both
// the LV warehouse sync's override.stock and the live factory-sheet stock.
function stockTotal(stock) {
  if (!stock) return null;
  return Object.values(stock).reduce((sum, n) => sum + n, 0);
}

// The same quantities broken down one row per size - left/right side by
// side for doors with an opening side, or a single total for ones without
// (interior doors) - sorted the way the sizes read on the product page.
function stockBreakdown(stock) {
  if (!stock) return null;
  const bySize = new Map();
  for (const [key, qty] of Object.entries(stock)) {
    const [size, side] = key.split("|");
    const row = bySize.get(size) || { size, left: 0, right: 0, total: 0, sided: false };
    if (side === "left" || side === "right") {
      row[side] = qty;
      row.sided = true;
    } else {
      row.total = qty;
    }
    bySize.set(size, row);
  }
  return [...bySize.values()].sort((a, b) => a.size.localeCompare(b.size, undefined, { numeric: true }));
}

const toField = (v) => (v == null ? "" : String(v));
const parse = (s) => {
  const t = String(s).trim().replace(",", ".");
  return t === "" ? null : Number(t);
};

function validate(values) {
  const price = parse(values.price);
  const oldPrice = parse(values.oldPrice);
  const okMoney = (v) => Number.isFinite(v) && v > 0 && v <= 100000 && Math.round(v * 100) === v * 100;
  if (!okMoney(price)) return "price";
  if (oldPrice !== null && (!okMoney(oldPrice) || oldPrice <= price)) return "oldPrice";
  return null;
}

export default function PriceEditor({ rows, initialOverrides, categories, storageReady, loadError }) {
  const router = useRouter();
  const [overrides, setOverrides] = useState(initialOverrides || {});
  const [edits, setEdits] = useState({}); // id -> { price, oldPrice, inStock } as typed
  const [resets, setResets] = useState({}); // id -> true
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [lang, setLang] = useState("lt");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [warehouseFilter, setWarehouseFilter] = useState(""); // "", "linked", "unlinked"
  const [message, setMessage] = useState(loadError ? { kind: "error", text: loadError } : null);
  const [rowErrors, setRowErrors] = useState({});
  const [pending, startTransition] = useTransition();

  const ui = adminUi[lang];

  const dirtyIds = useMemo(
    () => [...new Set([...Object.keys(edits), ...Object.keys(resets)])],
    [edits, resets]
  );
  const dirty = dirtyIds.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Remembers the last language chosen, per browser (and picks up a change
  // made in another tab, same as the wishlist does). Controls both the
  // panel's own text and which of a product's names is shown.
  useEffect(() => {
    const sync = () => {
      let saved = null;
      try {
        saved = window.localStorage.getItem("admin-lang");
      } catch {}
      setLang(saved === "en" ? "en" : "lt");
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function setLangAndRemember(next) {
    setLang(next);
    try {
      window.localStorage.setItem("admin-lang", next);
    } catch {}
  }

  const nameOf = (row) => row.name[lang] || row.name.lt;
  const categoryNameOf = (c) => c.name[lang] || c.name.lt;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      if (onlyChanged && !overrides[row.id] && !edits[row.id]) return false;
      const isLinked = Boolean(overrides[row.id]?.stock) || Boolean(row.factoryStock);
      if (warehouseFilter === "linked" && !isLinked) return false;
      if (warehouseFilter === "unlinked" && isLinked) return false;
      if (!q) return true;
      return `${row.name.lt} ${row.name.en} ${row.collection} ${row.id}`.toLowerCase().includes(q);
    });
  }, [rows, query, category, onlyChanged, warehouseFilter, overrides, edits]);

  function valuesFor(row) {
    if (edits[row.id]) return edits[row.id];
    const base = resets[row.id] ? row.base : current(row, overrides[row.id]);
    return { price: toField(base.price), oldPrice: toField(base.oldPrice), inStock: base.inStock };
  }

  function change(row, field, value) {
    setEdits((prev) => ({ ...prev, [row.id]: { ...valuesFor(row), [field]: value } }));
    setResets((prev) => {
      if (!prev[row.id]) return prev;
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    setRowErrors((prev) => ({ ...prev, [row.id]: undefined }));
    setMessage(null);
  }

  function reset(row) {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    setResets((prev) => ({ ...prev, [row.id]: true }));
  }

  function discard() {
    setEdits({});
    setResets({});
    setRowErrors({});
    setMessage(null);
  }

  function save() {
    const errors = {};
    const changes = dirtyIds.map((id) => {
      if (resets[id] && !edits[id]) return { id, reset: true };
      const v = edits[id];
      const error = validate(v);
      if (error) errors[id] = error;
      return { id, price: parse(v.price), oldPrice: parse(v.oldPrice), inStock: Boolean(v.inStock) };
    });
    if (Object.keys(errors).length) {
      setRowErrors(errors);
      setMessage({ kind: "error", text: ui.saveErrors.invalid });
      return;
    }

    startTransition(async () => {
      const res = await saveAction(changes);
      if (res?.ok) {
        setOverrides(res.overrides);
        setEdits({});
        setResets({});
        setRowErrors({});
        const time = new Date(res.savedAt).toLocaleTimeString(ui.timeLocale, { hour: "2-digit", minute: "2-digit" });
        setMessage({ kind: "ok", text: ui.saved(time) });
        return;
      }
      if (res?.error === "auth") {
        router.refresh();
        return;
      }
      if (res?.invalid) setRowErrors(Object.fromEntries(res.invalid.map((i) => [i.id, i.error])));
      setMessage({ kind: "error", text: ui.saveErrors[res?.error] || ui.saveErrors.write });
    });
  }

  async function logout() {
    if (dirty && !window.confirm(ui.logoutConfirm)) return;
    await logoutAction();
    router.refresh();
  }

  const changedCount = Object.keys(overrides).length;

  return (
    <div className="min-h-screen bg-neutral-100 pb-28 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-[20px] font-semibold">{ui.title}</h1>
            <p className="text-[13px] text-neutral-500">{ui.subtitle(rows.length, changedCount)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-md border border-neutral-300 text-[13px]">
              {[
                { code: "lt", label: "LT" },
                { code: "en", label: "EN" },
              ].map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLangAndRemember(opt.code)}
                  aria-pressed={lang === opt.code}
                  title={ui.langLabel}
                  className={`px-3 py-2 font-medium ${
                    lang === opt.code ? "bg-emerald-800 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <a href="/" target="_blank" rel="noreferrer" className="text-[14px] text-emerald-800 underline">
              {ui.openSite}
            </a>
            <button type="button" onClick={logout} className="rounded-md border border-neutral-300 px-3 py-2 text-[14px] hover:bg-neutral-50">
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 pt-5">
        {!storageReady ? (
          <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
            {ui.storageWarning}
          </p>
        ) : null}

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col text-[13px] text-neutral-600">
            {ui.searchLabel}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="mt-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 outline-none focus:border-emerald-700"
            />
          </label>
          <label className="flex flex-col text-[13px] text-neutral-600">
            {ui.categoryLabel}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            >
              <option value="">{ui.categoryAll}</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {categoryNameOf(c)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-[13px] text-neutral-600">
            {ui.warehouseFilterLabel}
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="mt-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            >
              <option value="">{ui.warehouseFilterAll}</option>
              <option value="linked">{ui.warehouseFilterLinked}</option>
              <option value="unlinked">{ui.warehouseFilterUnlinked}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-[14px]">
            <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} />
            {ui.onlyChanged}
          </label>
        </div>

        <p className="mt-3 text-[13px] text-neutral-500">{ui.oldPriceHint}</p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[760px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-[12px] uppercase tracking-wide text-neutral-500">
                <th className="px-3 py-2.5 font-medium">{ui.colProduct}</th>
                <th className="w-[130px] px-3 py-2.5 font-medium">{ui.colPrice}</th>
                <th className="w-[130px] px-3 py-2.5 font-medium">{ui.colOldPrice}</th>
                <th className="w-[100px] px-3 py-2.5 text-center font-medium">{ui.colInStock}</th>
                <th className="w-[150px] px-3 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const v = valuesFor(row);
                const isEdited = Boolean(edits[row.id] || resets[row.id]);
                const hasOverride = Boolean(overrides[row.id]) && !resets[row.id];
                const error = rowErrors[row.id];
                const lvTotal = stockTotal(overrides[row.id]?.stock);
                const lvRows = stockBreakdown(overrides[row.id]?.stock);
                const factoryTotal = stockTotal(row.factoryStock);
                const factoryRows = stockBreakdown(row.factoryStock);
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-neutral-100 align-top ${isEdited ? "bg-amber-50" : hasOverride ? "bg-emerald-50/50" : ""}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{nameOf(row)}</div>
                      <div className="text-[12px] text-neutral-500">
                        {row.collection ? `${row.collection} · ` : ""}
                        {row.id}
                        {hasOverride ? ui.changedSuffix : ""}
                      </div>
                      {lvTotal !== null ? (
                        <div className="mt-1 text-[12px] text-emerald-700">
                          <div className="font-medium">{ui.warehouseStock(lvTotal)}</div>
                          {lvRows.map((r) => (
                            <div key={r.size} className="text-neutral-500">
                              {r.sided ? (
                                <>
                                  {r.size} · {ui.directionLeft}: {r.left} · {ui.directionRight}: {r.right}
                                </>
                              ) : (
                                <>
                                  {r.size} mm: {r.total} {ui.pcsSuffix}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {factoryTotal !== null ? (
                        <div className="mt-1 text-[12px] text-sky-700">
                          <div className="font-medium">{ui.factoryStockLabel(factoryTotal)}</div>
                          {factoryRows.map((r) => (
                            <div key={r.size} className="text-neutral-500">
                              {r.sided ? (
                                <>
                                  {r.size} · {ui.directionLeft}: {r.left} · {ui.directionRight}: {r.right}
                                </>
                              ) : (
                                <>
                                  {r.size} mm: {r.total} {ui.pcsSuffix}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {error ? <div className="mt-1 text-[12px] text-red-700">{ui.fieldErrors[error]}</div> : null}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          inputMode="decimal"
                          aria-label={ui.ariaPrice(nameOf(row))}
                          value={v.price}
                          onChange={(e) => change(row, "price", e.target.value)}
                          className={`w-[90px] rounded-md border px-2 py-1.5 text-right ${error === "price" ? "border-red-500" : "border-neutral-300"}`}
                        />
                        <span className="text-neutral-500">{row.currency}</span>
                      </div>
                      {Number(v.price) !== row.base.price ? (
                        <div className="mt-1 text-[11px] text-neutral-400">{ui.inCatalogue(row.base.price)}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          inputMode="decimal"
                          aria-label={ui.ariaOldPrice(nameOf(row))}
                          value={v.oldPrice}
                          placeholder="—"
                          onChange={(e) => change(row, "oldPrice", e.target.value)}
                          className={`w-[90px] rounded-md border px-2 py-1.5 text-right ${error === "oldPrice" ? "border-red-500" : "border-neutral-300"}`}
                        />
                        <span className="text-neutral-500">{row.currency}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        aria-label={ui.ariaInStock(nameOf(row))}
                        checked={Boolean(v.inStock)}
                        onChange={(e) => change(row, "inStock", e.target.checked)}
                        className="mt-2 h-5 w-5"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      {hasOverride || edits[row.id] ? (
                        <button
                          type="button"
                          onClick={() => reset(row)}
                          className="text-[13px] text-neutral-600 underline hover:text-neutral-900"
                        >
                          {ui.resetToCatalogue}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {!visible.length ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-neutral-500">
                    {ui.nothingFound}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p
            role="status"
            className={`text-[14px] ${message?.kind === "error" ? "text-red-700" : message?.kind === "ok" ? "text-emerald-800" : "text-neutral-600"}`}
          >
            {message?.text || (dirty ? ui.dirtyCount(dirtyIds.length) : ui.noDirty)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={discard}
              disabled={!dirty || pending}
              className="rounded-md border border-neutral-300 px-4 py-2.5 text-[14px] hover:bg-neutral-50 disabled:opacity-40"
            >
              {ui.discard}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending || !storageReady}
              className="rounded-md bg-emerald-800 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-emerald-900 disabled:opacity-40"
            >
              {pending ? ui.saving : ui.save(dirty, dirtyIds.length)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
