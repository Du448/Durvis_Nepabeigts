"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { linkStockGroupAction, unignoreStockGroupAction } from "./actions";

/* One-time linking step for the weekly stock PDF (see /api/telegram/stock):
   every model+colour the file mentions that the site can't yet match to a
   product id, so the shop owner picks it from a search box once. After
   that, every future upload finds it automatically - see stockSync.js. */
export default function StockMatcher({ unmatched, ignoredGroups, productOptions, storageReady }) {
  const router = useRouter();
  const [groups, setGroups] = useState(unmatched.groups);
  const [ignored, setIgnored] = useState(ignoredGroups || []);
  const [showIgnored, setShowIgnored] = useState(false);
  const [picked, setPicked] = useState({}); // groupKey -> productId
  const [pending, startTransition] = useTransition();
  const [busyKey, setBusyKey] = useState(null);
  const [message, setMessage] = useState(null);

  const optionsById = useMemo(() => new Map(productOptions.map((o) => [o.id, o])), [productOptions]);

  function unignore(groupKey) {
    setBusyKey(groupKey);
    startTransition(async () => {
      const res = await unignoreStockGroupAction(groupKey);
      setBusyKey(null);
      if (res?.ok) {
        setIgnored((prev) => prev.filter((k) => k !== groupKey));
        setMessage({
          kind: "ok",
          text: "Ignorēšana atcelta. Parādīsies nesaistīto sarakstā pēc nākamās atlikumu faila augšupielādes.",
        });
        router.refresh();
      } else {
        setMessage({ kind: "error", text: "Neizdevās saglabāt." });
      }
    });
  }

  if (!storageReady || (!groups.length && !ignored.length)) return null;

  function link(group) {
    const productId = picked[group.groupKey];
    if (!productId || !optionsById.has(productId)) return;
    setBusyKey(group.groupKey);
    startTransition(async () => {
      const res = await linkStockGroupAction({ groupKey: group.groupKey, codes: group.codes, productId });
      setBusyKey(null);
      if (res?.ok) {
        setGroups((prev) => prev.filter((g) => g.groupKey !== group.groupKey));
        setMessage({ kind: "ok", text: `Piesaistīts: ${optionsById.get(productId)?.name || productId}` });
        router.refresh();
      } else {
        setMessage({ kind: "error", text: "Neizdevās saglabāt piesaisti." });
      }
    });
  }

  function ignore(group) {
    setBusyKey(group.groupKey);
    startTransition(async () => {
      const res = await linkStockGroupAction({ groupKey: group.groupKey, ignore: true });
      setBusyKey(null);
      if (res?.ok) {
        setGroups((prev) => prev.filter((g) => g.groupKey !== group.groupKey));
      } else {
        setMessage({ kind: "error", text: "Neizdevās saglabāt." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-5">
      {message ? (
        <p className={`mb-3 text-[13px] ${message.kind === "error" ? "text-red-700" : "text-emerald-800"}`}>
          {message.text}
        </p>
      ) : null}
      {groups.length ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
        <h2 className="text-[15px] font-semibold text-amber-900">
          Atlikumu piesaiste - {groups.length} nesaistīti modeļi
        </h2>
        <p className="mt-1 text-[13px] text-amber-900/80">
          Šie nosaukumi no jaunākā atlikumu faila neatbilst nevienam zināmam produktam. Piesaisti katru vienreiz -
          turpmākajos failos tas tiks atpazīts automātiski. Ieraksti, kas nav durvju modeļi (piem. aplodes, furnitūra),
          vari ignorēt.
        </p>
        <ul className="mt-3 divide-y divide-amber-200">
          {groups.map((group) => (
            <li key={group.groupKey} className="flex flex-wrap items-center gap-2 py-2.5">
              <div className="min-w-[240px] flex-1">
                <div className="text-[14px] font-medium text-neutral-900">{group.name}</div>
                <div className="text-[12px] text-neutral-500">
                  {group.codes.length} kods{group.codes.length === 1 ? "" : "i"} · kopā {group.totalQty} gab.
                </div>
              </div>
              <input
                list="stock-matcher-products"
                placeholder="Meklē produktu..."
                className="w-[280px] rounded-md border border-neutral-300 px-2 py-1.5 text-[13px]"
                onChange={(e) => {
                  const opt = productOptions.find((o) => o.name === e.target.value);
                  setPicked((prev) => ({ ...prev, [group.groupKey]: opt?.id || "" }));
                }}
              />
              <button
                type="button"
                disabled={pending || !picked[group.groupKey]}
                onClick={() => link(group)}
                className="rounded-md bg-emerald-800 px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40"
              >
                {busyKey === group.groupKey ? "..." : "Piesaistīt"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => ignore(group)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-white disabled:opacity-40"
              >
                Ignorēt
              </button>
            </li>
          ))}
        </ul>
        <datalist id="stock-matcher-products">
          {productOptions.map((o) => (
            <option key={o.id} value={o.name} />
          ))}
        </datalist>
        </div>
      ) : null}

      {ignored.length ? (
        <div className={`rounded-lg border border-neutral-200 bg-white p-4 ${groups.length ? "mt-4" : ""}`}>
          <button
            type="button"
            onClick={() => setShowIgnored((v) => !v)}
            className="text-[14px] font-medium text-neutral-700"
          >
            {showIgnored ? "▾" : "▸"} Ignorētie ieraksti ({ignored.length})
          </button>
          {showIgnored ? (
            <>
              <p className="mt-1 text-[13px] text-neutral-500">
                Šie nosaukumi bija atzīmēti kā "nav durvju modelis" un tāpēc vairs nerādās nesaistīto sarakstā, pat ja
                tie ir jaunākajā atlikumu failā. Atceļot ignorēšanu, tie atkal parādīsies nesaistīto sarakstā nākamajā
                atlikumu faila apstrādē (vai uzreiz, ja augšupielādē to pašu failu manuāli augšā).
              </p>
              <ul className="mt-3 divide-y divide-neutral-100">
                {ignored.map((groupKey) => (
                  <li key={groupKey} className="flex flex-wrap items-center gap-2 py-2">
                    <div className="min-w-[240px] flex-1 text-[13px] text-neutral-700">{groupKey}</div>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => unignore(groupKey)}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                    >
                      {busyKey === groupKey ? "..." : "Atcelt ignorēšanu"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
