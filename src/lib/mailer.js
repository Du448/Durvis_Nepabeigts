import net from "node:net";
import tls from "node:tls";

// Minimal dependency-free SMTP client for the site's forms (kontakti,
// sadarbiba). nodemailer (both v6 and v10) hangs indefinitely on this host's
// network when opening an SMTPS connection - a raw socket handshake to the
// same server works fine, so this talks the protocol directly instead.
// Configure via env vars (see .env.example) - sendFormEmail() throws until
// SMTP_HOST/SMTP_USER/SMTP_PASS are set, instead of silently no-op'ing.

const RESPONSE_TIMEOUT_MS = 15000;

function waitForResponse(socket, timeoutMs = RESPONSE_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n").filter(Boolean);
      const last = lines[lines.length - 1];
      if (last && /^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), raw: buffer.trim() });
      }
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("SMTP timeout waiting for a response"));
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      socket.removeListener("data", onData);
      socket.removeListener("error", onError);
    }
    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendCommand(socket, line, expectedCodes, label) {
  socket.write(`${line}\r\n`);
  const resp = await waitForResponse(socket);
  if (!expectedCodes.includes(resp.code)) {
    throw new Error(`${label} failed (${resp.code}): ${resp.raw}`);
  }
  return resp;
}

function upgradeToTLS(socket, host, rejectUnauthorized) {
  return new Promise((resolve, reject) => {
    const tlsSocket = tls.connect({ socket, host, servername: host, rejectUnauthorized });
    tlsSocket.once("secureConnect", () => resolve(tlsSocket));
    tlsSocket.once("error", reject);
  });
}

function encodeMimeWord(value) {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64Body(value) {
  const b64 = Buffer.from(value || "", "utf8").toString("base64");
  return b64.replace(/.{1,76}/g, (line) => `${line}\r\n`).trimEnd();
}

function base64Buffer(buffer) {
  return buffer.toString("base64").replace(/.{1,76}/g, (line) => `${line}\r\n`).trimEnd();
}

function buildMessage({ from, to, replyTo, subject, text, html, attachments = [] }) {
  const altBoundary = `----=_Alt_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
  const mixedBoundary = `----=_Mixed_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeMimeWord(subject)}`,
    "MIME-Version: 1.0",
    attachments.length
      ? `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`
      : `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
  ].filter(Boolean);

  const altPart = [
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Body(text),
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    base64Body(html),
    `--${altBoundary}--`,
  ].join("\r\n");

  if (!attachments.length) {
    return `${headers.join("\r\n")}\r\n\r\n${altPart}`;
  }

  const attachmentParts = attachments.map((att) => {
    const filename = encodeMimeWord(att.filename || "attachment");
    return [
      `--${mixedBoundary}`,
      `Content-Type: ${att.contentType || "application/octet-stream"}; name="${filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${filename}"`,
      "",
      base64Buffer(att.content),
    ].join("\r\n");
  });

  const body = [
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    "",
    altPart,
    ...attachmentParts,
    `--${mixedBoundary}--`,
  ].join("\r\n");

  return `${headers.join("\r\n")}\r\n\r\n${body}`;
}

export async function sendFormEmail({ subject, replyTo, text, html, attachments }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP nav nokonfigurēts - iestatiet SMTP_HOST, SMTP_USER un SMTP_PASS (skatiet .env.example)."
    );
  }
  const port = Number(SMTP_PORT) || 587;
  const secure = SMTP_SECURE === "true" || port === 465;
  const to = process.env.CONTACT_TO_EMAIL || SMTP_USER;
  const from = process.env.CONTACT_FROM_EMAIL || SMTP_USER;

  // Only for local dev machines whose antivirus/network intercepts TLS with
  // its own certificate (e.g. AVG) - never set this in production.
  const rejectUnauthorized = process.env.SMTP_ALLOW_INSECURE_TLS !== "true";

  let socket = secure
    ? tls.connect({ host: SMTP_HOST, port, servername: SMTP_HOST, rejectUnauthorized })
    : net.connect({ host: SMTP_HOST, port });

  try {
    await new Promise((resolve, reject) => {
      socket.once(secure ? "secureConnect" : "connect", resolve);
      socket.once("error", reject);
      socket.once("timeout", () => reject(new Error("SMTP connection timeout")));
      socket.setTimeout(RESPONSE_TIMEOUT_MS);
    });
    socket.setTimeout(0);

    const greeting = await waitForResponse(socket);
    if (greeting.code !== 220) throw new Error(`Unexpected SMTP greeting: ${greeting.raw}`);

    await sendCommand(socket, `EHLO ${SMTP_HOST}`, [250], "EHLO");

    if (!secure) {
      await sendCommand(socket, "STARTTLS", [220], "STARTTLS");
      socket = await upgradeToTLS(socket, SMTP_HOST, rejectUnauthorized);
      await sendCommand(socket, `EHLO ${SMTP_HOST}`, [250], "EHLO (TLS)");
    }

    await sendCommand(socket, "AUTH LOGIN", [334], "AUTH LOGIN");
    await sendCommand(socket, Buffer.from(SMTP_USER, "utf8").toString("base64"), [334], "AUTH username");
    await sendCommand(socket, Buffer.from(SMTP_PASS, "utf8").toString("base64"), [235], "AUTH password");

    await sendCommand(socket, `MAIL FROM:<${from}>`, [250], "MAIL FROM");
    await sendCommand(socket, `RCPT TO:<${to}>`, [250, 251], "RCPT TO");
    await sendCommand(socket, "DATA", [354], "DATA");

    const message = buildMessage({ from, to, replyTo, subject, text, html, attachments });
    const dotStuffed = message
      .split("\r\n")
      .map((line) => (line.startsWith(".") ? `.${line}` : line))
      .join("\r\n");
    await sendCommand(socket, `${dotStuffed}\r\n.`, [250], "Message body");

    await sendCommand(socket, "QUIT", [221], "QUIT").catch(() => {});
  } finally {
    socket.destroy();
  }
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
