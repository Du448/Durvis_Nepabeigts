/* The IndexNow key file (https://www.indexnow.org). Bing, Yandex, Seznam
   and Naver fetch it to confirm that a URL submission really comes from this
   site; tools/indexnow.mjs submits with keyLocation pointing here. Bing's
   index feeds ChatGPT search and Copilot, so new and changed pages reach AI
   answers within hours instead of waiting for a crawl. */
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
