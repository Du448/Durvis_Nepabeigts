import { NextResponse } from "next/server";
import { getFactoryStock } from "@/lib/factoryStock";

export const dynamic = "force-dynamic";

export async function GET() {
  const map = await getFactoryStock();
  const out = {};
  for (const [id, variants] of map) out[id] = Object.fromEntries(variants);
  return NextResponse.json({ count: map.size, out });
}
