import { products } from "@/data/products";
import { isInStock } from "@/lib/product-utils";
import { trData } from "@/lib/i18n-data";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { blobConfigured, readOverridesFresh } from "@/lib/priceOverrides";
import { readUnmatchedStock } from "@/lib/stockMap";
import LoginForm from "./LoginForm";
import PriceEditor from "./PriceEditor";
import StockMatcher from "./StockMatcher";

export const dynamic = "force-dynamic";

// Same labels the shop's own site uses for these categories (see @/lib/i18n).
const CATEGORIES = [
  { slug: "ardurvis-dzivoklim", name: { lt: "Buto lauko durys", en: "Apartment Entrance Doors" } },
  { slug: "ardurvis-privatmajai", name: { lt: "Namo lauko durys", en: "House Entrance Doors" } },
  { slug: "ieksdurvis", name: { lt: "Vidaus durys", en: "Interior Doors" } },
  { slug: "sleptas-durvis", name: { lt: "Paslėptos durys", en: "Hidden Doors" } },
];

function Notice({ title, children }) {
  return (
    <main className="mx-auto max-w-[560px] px-4 py-16">
      <h1 className="text-[22px] font-semibold">{title}</h1>
      <div className="mt-3 text-[15px] leading-[1.6] text-neutral-600">{children}</div>
    </main>
  );
}

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <Notice title="Panelis nesukonfigūruotas">
        Vercel projekto nustatymuose reikia nustatyti kintamuosius ADMIN_PASSWORD ir ADMIN_SESSION_SECRET (ne
        trumpesnį kaip 32 simbolių).
      </Notice>
    );
  }

  if (!(await isAdmin())) return <LoginForm />;

  let overrides = {};
  let loadError = null;
  if (blobConfigured()) {
    try {
      overrides = await readOverridesFresh();
    } catch {
      loadError = "Nepavyko įkelti išsaugotų kainų. Pabandykite atnaujinti puslapį.";
    }
  }

  const rows = products.map((p) => ({
    id: p.id,
    name: { lt: trData("lt", p.name), en: trData("en", p.name) },
    collection: p.collection || "",
    category: p.category,
    currency: p.currency === "UAH" ? "₴" : "€",
    base: { price: p.price, oldPrice: p.oldPrice ?? null, inStock: isInStock(p) },
  }));

  const unmatchedStock = blobConfigured() ? await readUnmatchedStock() : { updatedAt: null, groups: [] };
  const productOptions = products.map((p) => ({
    id: p.id,
    name: `${trData("lt", p.name)} — ${p.id}`,
  }));

  return (
    <>
      <StockMatcher unmatched={unmatchedStock} productOptions={productOptions} storageReady={blobConfigured()} />
      <PriceEditor
        rows={rows}
        initialOverrides={overrides}
        categories={CATEGORIES}
        storageReady={blobConfigured()}
        loadError={loadError}
      />
    </>
  );
}
