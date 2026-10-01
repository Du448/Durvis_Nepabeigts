import { buildLlmsFullTxt, TEXT_HEADERS } from "@/lib/llms";

// English full digest; /lt/llms-full.txt and /lv/llms-full.txt carry the others.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsFullTxt("en"), { headers: TEXT_HEADERS });
}
