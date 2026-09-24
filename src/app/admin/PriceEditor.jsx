"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAction, logoutAction } from "./actions";

const SAVE_ERRORS = {
  auth: "Сессия истекла. Войдите снова.",
  storage: "Хранилище цен не подключено. Обратитесь к разработчику.",
  read: "Не удалось прочитать сохранённые цены. Попробуйте ещё раз.",
  write: "Не удалось сохранить. Попробуйте ещё раз.",
  input: "Нет изменений для сохранения.",
  invalid: "Проверьте выделенные строки.",
};

const FIELD_ERRORS = {
  price: "Цена должна быть больше 0 (не более двух знаков после запятой).",
  oldPrice: "Старая цена должна быть больше текущей или пустой.",
  unknown: "Товар не найден.",
};

/* What a row shows: the catalogue value, replaced by any saved change. */
function current(row, override) {
  return {
    price: override?.price ?? row.base.price,
    oldPrice: override && "oldPrice" in override ? override.oldPrice : row.base.oldPrice,
    inStock: typeof override?.inStock === "boolean" ? override.inStock : row.base.inStock,
  };
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
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [message, setMessage] = useState(loadError ? { kind: "error", text: loadError } : null);
  const [rowErrors, setRowErrors] = useState({});
  const [pending, startTransition] = useTransition();

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

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      if (onlyChanged && !overrides[row.id] && !edits[row.id]) return false;
      if (!q) return true;
      return `${row.name} ${row.collection} ${row.id}`.toLowerCase().includes(q);
    });
  }, [rows, query, category, onlyChanged, overrides, edits]);

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
      setMessage({ kind: "error", text: SAVE_ERRORS.invalid });
      return;
    }

    startTransition(async () => {
      const res = await saveAction(changes);
      if (res?.ok) {
        setOverrides(res.overrides);
        setEdits({});
        setResets({});
        setRowErrors({});
        const time = new Date(res.savedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        setMessage({ kind: "ok", text: `Сохранено в ${time}. Сайт обновится в течение минуты.` });
        return;
      }
      if (res?.error === "auth") {
        router.refresh();
        return;
      }
      if (res?.invalid) setRowErrors(Object.fromEntries(res.invalid.map((i) => [i.id, i.error])));
      setMessage({ kind: "error", text: SAVE_ERRORS[res?.error] || SAVE_ERRORS.write });
    });
  }

  async function logout() {
    if (dirty && !window.confirm("Есть несохранённые изменения. Всё равно выйти?")) return;
    await logoutAction();
    router.refresh();
  }

  const changedCount = Object.keys(overrides).length;

  return (
    <div className="min-h-screen bg-neutral-100 pb-28 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-[20px] font-semibold">Управление ценами</h1>
            <p className="text-[13px] text-neutral-500">
              {rows.length} товаров · изменено вручную: {changedCount}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-[14px] text-emerald-800 underline">
              Открыть сайт
            </a>
            <button type="button" onClick={logout} className="rounded-md border border-neutral-300 px-3 py-2 text-[14px] hover:bg-neutral-50">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 pt-5">
        {!storageReady ? (
          <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
            Хранилище цен ещё не подключено: изменения нельзя сохранить. Обратитесь к разработчику.
          </p>
        ) : null}

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col text-[13px] text-neutral-600">
            Поиск
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Название, коллекция или код"
              className="mt-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 outline-none focus:border-emerald-700"
            />
          </label>
          <label className="flex flex-col text-[13px] text-neutral-600">
            Категория
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900"
            >
              <option value="">Все</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-[14px]">
            <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} />
            Только изменённые
          </label>
        </div>

        <p className="mt-3 text-[13px] text-neutral-500">
          Старая цена — зачёркнутая цена; если она заполнена, товар попадает в раздел «Акции». Оставьте поле пустым, чтобы убрать скидку.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[760px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-[12px] uppercase tracking-wide text-neutral-500">
                <th className="px-3 py-2.5 font-medium">Товар</th>
                <th className="w-[130px] px-3 py-2.5 font-medium">Цена</th>
                <th className="w-[130px] px-3 py-2.5 font-medium">Старая цена</th>
                <th className="w-[100px] px-3 py-2.5 text-center font-medium">На складе</th>
                <th className="w-[150px] px-3 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const v = valuesFor(row);
                const isEdited = Boolean(edits[row.id] || resets[row.id]);
                const hasOverride = Boolean(overrides[row.id]) && !resets[row.id];
                const error = rowErrors[row.id];
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-neutral-100 align-top ${isEdited ? "bg-amber-50" : hasOverride ? "bg-emerald-50/50" : ""}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-[12px] text-neutral-500">
                        {row.collection ? `${row.collection} · ` : ""}
                        {row.id}
                        {hasOverride ? " · изменено" : ""}
                      </div>
                      {error ? <div className="mt-1 text-[12px] text-red-700">{FIELD_ERRORS[error]}</div> : null}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          inputMode="decimal"
                          aria-label={`Цена: ${row.name}`}
                          value={v.price}
                          onChange={(e) => change(row, "price", e.target.value)}
                          className={`w-[90px] rounded-md border px-2 py-1.5 text-right ${error === "price" ? "border-red-500" : "border-neutral-300"}`}
                        />
                        <span className="text-neutral-500">{row.currency}</span>
                      </div>
                      {Number(v.price) !== row.base.price ? (
                        <div className="mt-1 text-[11px] text-neutral-400">в каталоге: {row.base.price}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          inputMode="decimal"
                          aria-label={`Старая цена: ${row.name}`}
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
                        aria-label={`На складе: ${row.name}`}
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
                          Вернуть из каталога
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {!visible.length ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-neutral-500">
                    Ничего не найдено.
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
            {message?.text || (dirty ? `Несохранённых изменений: ${dirtyIds.length}` : "Нет несохранённых изменений.")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={discard}
              disabled={!dirty || pending}
              className="rounded-md border border-neutral-300 px-4 py-2.5 text-[14px] hover:bg-neutral-50 disabled:opacity-40"
            >
              Отменить
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending || !storageReady}
              className="rounded-md bg-emerald-800 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-emerald-900 disabled:opacity-40"
            >
              {pending ? "Сохранение…" : `Сохранить${dirty ? ` (${dirtyIds.length})` : ""}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
