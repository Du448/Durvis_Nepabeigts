import { NextResponse } from "next/server";
import { parseStockPdf } from "@/lib/stockPdf";
import { syncStock } from "@/lib/stockSync";

/* Telegram webhook for the weekly "Atlikumi" stock PDF. The URL's own path
   segment is the shared secret - simpler than wiring up Telegram's
   X-Telegram-Bot-Api-Secret-Token header, and just as effective since the
   full URL is only ever given to api.telegram.org via setWebhook. Add the
   bot to the warehouse's Telegram group (or forward the file to it) and any
   PDF it receives there is parsed and applied automatically; every other
   message is acknowledged and ignored. */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const FILE_API = `https://api.telegram.org/file/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  if (!chatId) return;
  try {
    await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error("telegram stock webhook: sendMessage failed", err);
  }
}

function summaryText(summary) {
  const lines = [
    `Atlikumi atjaunoti: ${summary.rowCount} ieraksti no faila.`,
    `Pieejami: ${summary.inStockCount} · Beigušies: ${summary.outOfStockCount}.`,
  ];
  if (summary.unmatched.length) {
    lines.push(`Nesaistīti modeļi: ${summary.unmatched.length} - piesaisti tos /admin panelī ("Atlikumu piesaiste").`);
  }
  return lines.join("\n");
}

export async function POST(request, { params }) {
  const { secret } = await params;
  if (!BOT_TOKEN || !WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  let update;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true }); // not our concern - ack so Telegram stops retrying
  }

  const message = update.message || update.channel_post;
  const document = message?.document;
  const chatId = message?.chat?.id;

  // Not a document post (a text message, a reaction, ...) - nothing to do.
  if (!document) return NextResponse.json({ ok: true });

  const isPdf =
    document.mime_type === "application/pdf" || /\.pdf$/i.test(document.file_name || "");
  if (!isPdf) return NextResponse.json({ ok: true });

  try {
    const fileRes = await fetch(`${API}/getFile?file_id=${encodeURIComponent(document.file_id)}`);
    const fileData = await fileRes.json();
    const filePath = fileData?.result?.file_path;
    if (!filePath) throw new Error("getFile returned no file_path");

    const pdfRes = await fetch(`${FILE_API}/${filePath}`);
    const bytes = new Uint8Array(await pdfRes.arrayBuffer());

    const rows = await parseStockPdf(bytes);
    if (!rows.length) {
      await sendMessage(chatId, "Saņēmu PDF, bet tajā neizdevās atrast nevienu atlikumu rindu.");
      return NextResponse.json({ ok: true });
    }

    const summary = await syncStock(rows);
    await sendMessage(chatId, summaryText(summary));
  } catch (err) {
    console.error("telegram stock webhook: processing failed", err);
    await sendMessage(chatId, "Neizdevās apstrādāt atlikumu failu - pārbaudi serveri.");
  }

  return NextResponse.json({ ok: true });
}
