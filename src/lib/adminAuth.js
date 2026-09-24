import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

/* One shared password for the shop's price panel.
   ADMIN_PASSWORD        - the password the shop types in
   ADMIN_SESSION_SECRET  - a long random string that signs the session cookie
   The cookie holds only an expiry time and its signature, so changing either
   variable in Vercel logs everyone out. */

export const SESSION_COOKIE = "ntd_admin";
const SESSION_DAYS = 30;

export const adminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET || "").length >= 32);

const sha256 = (value) => createHash("sha256").update(String(value)).digest();

function sign(payload) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(`admin:${payload}`).digest("hex");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(input) {
  if (!adminConfigured()) return false;
  // Hash both sides so the comparison is constant-time whatever the lengths.
  return timingSafeEqual(sha256(input), sha256(process.env.ADMIN_PASSWORD));
}

export async function startSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const value = `${expires}.${sign(expires)}`;
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(SESSION_COOKIE)?.value || "";
  const [expires, signature] = raw.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

/* Login throttle: 5 wrong passwords per IP per 15 minutes. Per instance, which
   is enough against casual guessing without a datastore. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map();

async function clientIp() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : h.get("x-real-ip") || "unknown").trim();
}

export async function loginBlocked() {
  const ip = await clientIp();
  const recent = (failures.get(ip) || []).filter((t) => Date.now() - t < WINDOW_MS);
  failures.set(ip, recent);
  return recent.length >= MAX_FAILURES;
}

export async function recordFailure() {
  const ip = await clientIp();
  const recent = (failures.get(ip) || []).filter((t) => Date.now() - t < WINDOW_MS);
  recent.push(Date.now());
  failures.set(ip, recent);
  if (failures.size > 5000) failures.clear();
}
