import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const company = String(body.company || "").trim();
  const person = String(body.person || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const city = String(body.city || "").trim();
  const website = String(body.website || "").trim();
  const activity = String(body.activity || "").trim();
  const message = String(body.message || "").trim();
  const consent = Boolean(body.consent);

  if (!company || !person || !phone || !email || !city || !consent) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const fields = [
    ["Uzņēmums", company],
    ["Kontaktpersona", person],
    ["Telefons", phone],
    ["E-pasts", email],
    ["Pilsēta / reģions", city],
    ["Vietne", website || "—"],
    ["Darbības joma", activity],
  ];

  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Komentārs:",
    message,
  ].join("\n");

  const html = `
    ${fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("\n")}
    <p><strong>Komentārs:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendFormEmail({
      subject: `Jauns partnera pieteikums — ${company}`,
      replyTo: email,
      text,
      html,
    });
  } catch (err) {
    console.error("partners form send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
