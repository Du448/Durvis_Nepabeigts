import { buildLlmsTxt, TEXT_HEADERS } from "@/lib/llms";

// Prices follow the admin panel's overrides, so the digest is rebuilt hourly.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsTxt(), { headers: TEXT_HEADERS });
}
