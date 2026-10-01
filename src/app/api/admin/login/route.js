import { NextResponse } from "next/server";
import { loginBlocked, passwordMatches, recordFailure, startSession } from "@/lib/adminAuth";

/* Price-panel login. A route of its own (rather than a server action posted
   to /admin, like the panel's other actions) so the Vercel Firewall can
   rate-limit login attempts by path across every instance, without also
   throttling the shop's own saves. The in-memory throttle in @/lib/adminAuth
   stays as a second layer. */
export async function POST(request) {
  if (await loginBlocked()) return NextResponse.json({ error: "blocked" }, { status: 429 });
  let password = "";
  try {
    password = String((await request.json())?.password || "");
  } catch {
    return NextResponse.json({ error: "wrong" }, { status: 400 });
  }
  if (!passwordMatches(password)) {
    await recordFailure();
    return NextResponse.json({ error: "wrong" }, { status: 401 });
  }
  await startSession();
  return NextResponse.json({ ok: true });
}
