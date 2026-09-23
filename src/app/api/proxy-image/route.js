import { NextResponse } from "next/server";

// Fetches a catalogue photo server-side and streams it back same-origin -
// a fallback for the PDF generator's image fetch, since some sources
// answer a browser's own cross-origin fetch() inconsistently even when
// their headers claim to allow it. Restricted to the hosts the catalogue
// actually uses, so this can't be turned into an open image proxy.
const ALLOWED_HOSTS = new Set([
  "ik.imagekit.io",
  "www.bulat-doors.com.ua",
  "bulat-doors.com.ua",
  "tedee.com",
  "www.tedee.com",
  "740.com.ua",
  "www.740.com.ua",
  "matteoda.it",
  "www.matteoda.it",
  "ventum.lv",
  "www.ventum.lv",
  "moyzamok.ru",
  "www.moyzamok.ru",
  "gw-assets.assaabloy.com",
]);

export async function GET(request) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "missing_url" }, { status: 400 });

  let target;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "host_not_allowed" }, { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString());
    if (!upstream.ok) return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
