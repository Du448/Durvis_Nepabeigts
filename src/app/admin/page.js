import { products } from "@/data/products";
import { isInStock } from "@/lib/product-utils";
import { trData } from "@/lib/i18n-data";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { blobConfigured, readOverridesFresh } from "@/lib/priceOverrides";
import LoginForm from "./LoginForm";
import PriceEditor from "./PriceEditor";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { slug: "ardurvis-dzivoklim", name: "Входные двери для квартиры" },
  { slug: "ardurvis-privatmajai", name: "Входные двери для дома" },
  { slug: "ieksdurvis", name: "Межкомнатные двери" },
  { slug: "sleptas-durvis", name: "Скрытые двери" },
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
      <Notice title="Панель не настроена">
        В настройках проекта Vercel нужно задать переменные ADMIN_PASSWORD и ADMIN_SESSION_SECRET (не короче 32
        символов).
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
      loadError = "Не удалось загрузить сохранённые цены. Попробуйте обновить страницу.";
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

  return (
    <PriceEditor
      rows={rows}
      initialOverrides={overrides}
      categories={CATEGORIES}
      storageReady={blobConfigured()}
      loadError={loadError}
    />
  );
}
