import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";

// Keeps the raw SMTP client's message size sane - mail servers commonly cap
// total message size well below this, so we reject oversized uploads here
// rather than let the send fail after the visitor has already waited.
const MAX_ATTACHMENTS_BYTES = 15 * 1024 * 1024;

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let name, phone, email, message, attachments;

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

    const files = form.getAll("files").filter((f) => f && typeof f.arrayBuffer === "function" && f.size > 0);
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
  }

  if (!name || !phone || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const text = [`Vardas: ${name}`, `Telefonas: ${phone}`, `El. paštas: ${email}`, "", "Žinutė:", message].join("\n");
  const html = `
    <p><strong>Vardas:</strong> ${escapeHtml(name)}</p>
    <p><strong>Telefonas:</strong> ${escapeHtml(phone)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(email)}</p>
    <p><strong>Žinutė:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendFormEmail({
      subject: `Nauja žinutė iš kontaktų formos - ${name}`,
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
