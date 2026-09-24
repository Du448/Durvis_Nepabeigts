import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";
import {
  HONEYPOT_FIELD,
  MAX_UPLOAD_FILES,
  honeypotResponse,
  isAllowedUpload,
  isHoneypotFilled,
  rateLimited,
} from "@/lib/formGuard";

// Keeps the raw SMTP client's message size sane - mail servers commonly cap
// total message size well below this, so we reject oversized uploads here
// rather than let the send fail after the visitor has already waited.
const MAX_ATTACHMENTS_BYTES = 15 * 1024 * 1024;

// Variant the visitor picked on the product page, sent alongside the free-text
// message so it survives even if they rewrite the prefilled text.
const OFFER_FIELDS = [
  ["product_name", "Modelis"],
  ["product_id", "ID"],
  ["product_color", "Spalva"],
  ["product_size", "Dydis"],
  ["product_price", "Kaina"],
  ["services", "Paslaugos"],
  ["product_url", "Nuoroda"],
];

export async function POST(request) {
  const limited = rateLimited(request, "contact");
  if (limited) return limited;

  const contentType = request.headers.get("content-type") || "";
  let name, phone, email, message, attachments, consent, trap;
  let offer = {};

  if (contentType.includes("multipart/form-data")) {
    let form;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
    }
    name = String(form.get("name") || "").trim();
    phone = String(form.get("phone") || "").trim();
    email = String(form.get("email") || "").trim();
    message = String(form.get("message") || "").trim();
    consent = Boolean(form.get("consent"));
    trap = form.get(HONEYPOT_FIELD);
    offer = Object.fromEntries(
      OFFER_FIELDS.map(([key]) => [key, String(form.get(key) || "").replace(/[\r\n]+/g, " ").trim().slice(0, 300)])
    );

    const files = form.getAll("files").filter((f) => f && typeof f.arrayBuffer === "function" && f.size > 0);
    if (files.length > MAX_UPLOAD_FILES) {
      return NextResponse.json({ ok: false, error: "too_many_files" }, { status: 400 });
    }
    if (!files.every(isAllowedUpload)) {
      return NextResponse.json({ ok: false, error: "file_type_not_allowed" }, { status: 415 });
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_ATTACHMENTS_BYTES) {
      return NextResponse.json({ ok: false, error: "attachments_too_large" }, { status: 413 });
    }
    attachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name || "attachment",
        contentType: f.type || "application/octet-stream",
        content: Buffer.from(await f.arrayBuffer()),
      }))
    );
  } else {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }
    name = String(body.name || "").trim();
    phone = String(body.phone || "").trim();
    email = String(body.email || "").trim();
    message = String(body.message || "").trim();
    consent = Boolean(body.consent);
    trap = body[HONEYPOT_FIELD];
  }

  if (isHoneypotFilled(trap)) return honeypotResponse();

  if (!name || !phone || !email || !consent) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const offerRows = OFFER_FIELDS.filter(([key]) => offer[key]);
  const text = [
    `Vardas: ${name}`,
    `Telefonas: ${phone}`,
    `El. paštas: ${email}`,
    ...(offerRows.length ? ["", "Produktas:", ...offerRows.map(([key, label]) => `${label}: ${offer[key]}`)] : []),
    "",
    "Žinutė:",
    message,
  ].join("\n");
  const offerHtml = offerRows.length
    ? `<table cellpadding="4" style="border-collapse:collapse;margin:12px 0;border:1px solid #ddd">${offerRows
        .map(
          ([key, label]) =>
            `<tr><td style="color:#666">${label}</td><td>${
              key === "product_url" && /^https?:\/\//.test(offer[key])
                ? `<a href="${escapeHtml(offer[key])}">${escapeHtml(offer[key])}</a>`
                : escapeHtml(offer[key])
            }</td></tr>`
        )
        .join("")}</table>`
    : "";
  const html = `
    <p><strong>Vardas:</strong> ${escapeHtml(name)}</p>
    <p><strong>Telefonas:</strong> ${escapeHtml(phone)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(email)}</p>
    ${offerHtml}
    <p><strong>Žinutė:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendFormEmail({
      subject: offer.product_name
        ? `Užklausa: ${offer.product_name} - ${name}`
        : `Nauja žinutė iš kontaktų formos - ${name}`,
      replyTo: email,
      text,
      html,
      attachments,
    });
  } catch (err) {
    console.error("contact form send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
