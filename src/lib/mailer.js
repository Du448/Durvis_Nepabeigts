import nodemailer from "nodemailer";

// Shared SMTP transporter for the site's forms (kontakti, sadarbiba).
// Configure via env vars (see .env.example) — sendFormEmail() throws until
// SMTP_HOST/SMTP_USER/SMTP_PASS are set, instead of silently no-op'ing.
let cachedTransporter = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP nav nokonfigurēts — iestatiet SMTP_HOST, SMTP_USER un SMTP_PASS (skatiet .env.example)."
    );
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return cachedTransporter;
}

export async function sendFormEmail({ subject, replyTo, text, html }) {
  const transporter = getTransporter();
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({ from, to, replyTo, subject, text, html });
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
