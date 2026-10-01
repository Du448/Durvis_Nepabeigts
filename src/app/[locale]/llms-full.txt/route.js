import { notFound } from "next/navigation";
import { buildLlmsFullTxt, TEXT_HEADERS } from "@/lib/llms";
import { locales } from "@/lib/i18n";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return new Response(await buildLlmsFullTxt(locale), { headers: TEXT_HEADERS });
}
