import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !phone || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const text = [`Vārds: ${name}`, `Telefons: ${phone}`, `E-pasts: ${email}`, "", "Ziņa:", message].join("\n");
  const html = `
    <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
    <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
    <p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>
    <p><strong>Ziņa:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendFormEmail({
      subject: `Jauna ziņa no kontaktu formas — ${name}`,
      replyTo: email,
      text,
      html,
    });
  } catch (err) {
    console.error("contact form send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
