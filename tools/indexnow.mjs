/* Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam,
   Naver - one call reaches all of them), so they recrawl changed pages
   straight away. Run after a deploy that changes content:

     npm run indexnow     (reads INDEXNOW_KEY from .env.local or the shell)

   INDEXNOW_KEY must be the same value the production site serves at
   /indexnow-key.txt (set it in Vercel's environment variables too).
   SITE_URL defaults to NEXT_PUBLIC_SITE_URL or https://ntdurys.lt. */

const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://ntdurys.lt").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY;

if (!KEY || !/^[A-Za-z0-9-]{8,128}$/.test(KEY)) {
  console.error("Set INDEXNOW_KEY (8-128 letters, digits or dashes). Generate one with:");
  console.error("  node -e \"console.log(require('crypto').randomBytes(16).toString('hex'))\"");
  process.exit(1);
}

const keyLocation = `${SITE_URL}/indexnow-key.txt`;
const served = await fetch(keyLocation).then((r) => (r.ok ? r.text() : null));
if (served?.trim() !== KEY) {
  console.error(`${keyLocation} does not serve this key yet - set INDEXNOW_KEY in Vercel and redeploy first.`);
  process.exit(1);
}

const xml = await fetch(`${SITE_URL}/sitemap.xml`).then((r) => r.text());
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
console.log(`Submitting ${urls.length} URLs from ${SITE_URL}/sitemap.xml`);

// IndexNow takes up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation, urlList: urls.slice(i, i + 10000) }),
  });
  console.log(`Batch ${i / 10000 + 1}: HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 300) {
    console.error(await res.text());
    process.exit(1);
  }
}
