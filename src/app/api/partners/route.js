import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";
import { HONEYPOT_FIELD, honeypotResponse, isHoneypotFilled, rateLimited } from "@/lib/formGuard";

export async function POST(request) {
  const limited = rateLimited(request, "partners");
  if (limited) return limited;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (isHoneypotFilled(body[HONEYPOT_FIELD])) return honeypotResponse();

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
    ["Įmonė", company],
    ["Kontaktinis asmuo", person],
    ["Telefonas", phone],
    ["El. paštas", email],
    ["Miestas / regionas", city],
    ["Svetainė", website || "-"],
    ["Veiklos sritis", activity],
  ];

  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Komentaras:",
    message,
  ].join("\n");

  const html = `
    ${fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("\n")}
    <p><strong>Komentaras:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendFormEmail({
      subject: `Naujas partnerio prašymas - ${company}`,
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
