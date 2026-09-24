import { NextResponse } from "next/server";

export const HONEYPOT_FIELD = "fax_number";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Per-instance memory: on serverless this only throttles bursts hitting one
// warm instance, which is enough to stop naive bots without a datastore.
const hits = new Map();

function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : request.headers.get("x-real-ip") || "unknown").trim();
}

export function rateLimited(request, bucket) {
  const key = `${bucket}:${clientIp(request)}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return null;
}

// Bots that fill the hidden field get a fake success so they don't retry.
export function isHoneypotFilled(value) {
  return String(value || "").trim().length > 0;
}

export const honeypotResponse = () => NextResponse.json({ ok: true });

export const ALLOWED_UPLOAD_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "heic", "doc", "docx"];
const ALLOWED_UPLOAD_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "",
  "application/octet-stream",
]);
export const MAX_UPLOAD_FILES = 5;

export function isAllowedUpload(file) {
  const ext = (file.name || "").split(".").pop().toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.includes(ext) && ALLOWED_UPLOAD_TYPES.has(file.type || "");
}
