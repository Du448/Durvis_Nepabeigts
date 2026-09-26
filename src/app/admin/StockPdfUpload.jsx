"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncStockPdfAction } from "./actions";

const ERROR_TEXT = {
  auth: "Sesija baigėsi. Prisijunkite iš naujo.",
  storage: "Kainų saugykla nepajungta. Kreipkitės į kūrėją.",
  input: "Izvēlies PDF failu.",
  size: "Fails ir par lielu (maks. 15 MB).",
  empty: "Failā neizdevās atrast nevienu atlikumu rindu.",
  parse: "Neizdevās apstrādāt failu. Pārbaudi, vai tas ir pareizais PDF formāts.",
};

/* Manual counterpart to the Telegram webhook: lets the shop owner re-run
   the same "Atlikumi" PDF by hand - e.g. right after un-ignoring a group in
   the list below, without waiting for next week's automatic upload to see
   it take effect. */
export default function StockPdfUpload({ storageReady }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  if (!storageReady) return null;

  function upload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setMessage({ kind: "error", text: ERROR_TEXT.input });
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    setMessage(null);
    startTransition(async () => {
      const res = await syncStockPdfAction(formData);
      if (res?.ok) {
        const s = res.summary;
        const parts = [`Apstrādāts: ${s.rowCount} ieraksti.`, `Pieejami: ${s.inStockCount} · Beigušies: ${s.outOfStockCount}.`];
        if (s.unmatched.length) parts.push(`Nesaistīti modeļi: ${s.unmatched.length}.`);
        setMessage({ kind: "ok", text: parts.join(" ") });
        if (inputRef.current) inputRef.current.value = "";
        router.refresh();
        return;
      }
      setMessage({ kind: "error", text: ERROR_TEXT[res?.error] || ERROR_TEXT.parse });
    });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-[15px] font-semibold text-neutral-900">Atlikumu PDF augšupielāde</h2>
        <p className="mt-1 text-[13px] text-neutral-500">
          Parasti atlikumus apstrādā Telegram bots automātiski katru nedēļu. Šeit vari manuāli augšupielādēt to pašu
          failu vēlreiz - noderīgi tūlīt pēc "Ignorēt" atcelšanas zemāk, lai nav jāgaida nākamā nedēļa.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input ref={inputRef} type="file" accept="application/pdf" className="text-[13px]" />
          <button
            type="button"
            disabled={pending}
            onClick={upload}
            className="rounded-md bg-emerald-800 px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40"
          >
            {pending ? "Apstrādā…" : "Augšupielādēt"}
          </button>
        </div>
        {message ? (
          <p className={`mt-2 text-[13px] ${message.kind === "error" ? "text-red-700" : "text-emerald-800"}`}>
            {message.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
