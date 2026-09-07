import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SplitProductSlider from "@/components/SplitProductSlider";
import HeroSlider from "@/components/HeroSlider";
import RevealGrid from "@/components/anim/RevealGrid";
import { headers } from "next/headers";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const pick = (locale, obj) => obj[locale] ?? obj.lt;

/* Homepage structure mirrors m-lux.by: a cinematic hero followed by
   alternating 50/50 blocks — full-bleed photography on one half, a white
   editorial panel with a headline, a short paragraph and two models on the
   other.

   The photography half lives in public/scenes/<slug>.webp and shows the
   category's real catalogue door installed in a room, so the door in the
   scene is the door in the slider beside it. See tools/scenes.config.mjs for
   which product anchors which scene and how they are produced. `image` below
   stays as the stock fallback that shows through if a scene file is missing. */

const HERO = [
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/t4IY7.jpg",
    kicker: { lt: "VIDAUS DURYS", lv: "IEKŠDURVIS", en: "INTERIOR DOORS" },
    title: {
      lt: "PATIKIMI SPRENDIMAI JŪSŲ SAUGUMUI",
      lv: "UZTICAMI RISINĀJUMI JŪSU DROŠĪBAI",
      en: "RELIABLE SOLUTIONS FOR YOUR SECURITY",
    },
  },
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/fH7VH.jpg",
    kicker: { lt: "LAUKO DURYS", lv: "ĀRDURVIS", en: "ENTRANCE DOORS" },
    title: {
      lt: "SUSTIPRINTA KONSTRUKCIJA IR ŠILUMOS IZOLIACIJA",
      lv: "PASTIPRINĀTA KONSTRUKCIJA UN SILTUMA IZOLĀCIJA",
      en: "REINFORCED STRUCTURE AND THERMAL INSULATION",
    },
  },
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/gvXG2.jpg",
    kicker: { lt: "SALONAS", lv: "SALONS", en: "SHOWROOM" },
    title: {
      lt: "NESTANDARTINIAI SPRENDIMAI IR INDIVIDUALŪS PROJEKTAI",
      lv: "NESTANDARTA RISINĀJUMI UN INDIVIDUĀLI PROJEKTI",
      en: "NON-STANDARD SOLUTIONS AND CUSTOM PROJECTS",
    },
  },
];

const BLOCKS = [
  {
    slug: "ardurvis-dzivoklim",
    image:
      "https://images.unsplash.com/photo-1771354959667-96360bf59eab?auto=format&fit=crop&w=1600&q=80",
    title: {
      lt: "Buto lauko durys — svarbus žingsnis saugumo link",
      lv: "Ārdurvis dzīvoklim — svarīgs solis drošībai",
      en: "Apartment entrance doors — a key step towards safety",
    },
    text: {
      lt: "Patikima konstrukcija su standumo briaunomis, kelių kontūrų sandarinimas ir dviguba spynų sistema. Apgalvota apsauga nuo jėga vykdomo įsilaužimo.",
      lv: "Uzticama konstrukcija ar stingruma ribām, vairāku kontūru blīvējums un divu slēdzeņu sistēma. Pārdomāta aizsardzība pret spēka metodēm.",
      en: "A dependable structure with stiffening ribs, multi-contour sealing and a double lock system. Considered protection against forced entry.",
    },
  },
  {
    slug: "ardurvis-privatmajai",
    reverse: true,
    image:
      "https://images.unsplash.com/photo-1613544723301-176686aa9f09?auto=format&fit=crop&w=1600&q=80",
    title: {
      lt: "Termo durys namams — šiluma, tyla, garantija",
      lv: "Termodurvis privātmājai — siltums, klusums, garantija",
      en: "Thermal doors for houses — warmth, quiet, warranty",
    },
    text: {
      lt: "Termo pertrauka, sustiprintas užpildas ir atsparios orui dangos. Suteikiame garantiją ir prisiimame visus įsipareigojimus dėl aptarnavimo.",
      lv: "Termopārrāvums, pastiprināts pildījums un laikapstākļiem izturīgi pārklājumi. Sniedzam garantiju un uzņemamies visas servisa saistības.",
      en: "A thermal break, reinforced core and weather-resistant finishes. We provide a warranty and take on all after-sales obligations.",
    },
  },
  {
    slug: "ieksdurvis",
    image:
      "https://images.unsplash.com/photo-1603673298820-40d77252226d?auto=format&fit=crop&w=1600&q=80",
    title: {
      lt: "Vidaus durys — vientisas interjero sprendimas",
      lv: "Iekšdurvis — vienots interjera risinājums",
      en: "Interior doors — a coherent interior solution",
    },
    text: {
      lt: "Gaminame duris nestandartinių matmenų, efektingus modelius su sieninėmis plokštėmis ir įgyvendiname dizaino projektus pagal jūsų pageidavimus.",
      lv: "Izgatavojam durvis nestandarta izmēros, efektīgus modeļus ar sienas paneļiem un īstenojam dizaina projektus pēc jūsu vēlmēm.",
      en: "We build doors in non-standard sizes, striking models with wall panelling, and realise design projects to your brief.",
    },
  },
  {
    slug: "sleptas-durvis",
    reverse: true,
    image: "/scenes/sleptas-durvis.webp",
    title: {
      lt: "Paslėptos durys - siena be staktos",
      lv: "Slēptās durvis - siena bez redzamas kārbas",
      en: "Hidden doors - a wall with no visible frame",
    },
    text: {
      lt: "Aliumininė stakta paslepiama pertvaroje, o varčia užsidaro viename lygyje su siena. Varčia pristatoma gruntuota, todėl dažoma arba tapetuojama kartu su siena. Komplekte - stakta, varčia ir paslėpti Otlav vyriai.",
      lv: "Alumīnija kārbu iebūvē starpsienā, un vērtne aizveras vienā līmenī ar sienu. Vērtne nāk gruntēta, tāpēc to krāso vai tapetē kopā ar sienu. Komplektā - kārba, vērtne un slēptās Otlav eņģes.",
      en: "The aluminium frame is buried in the partition and the leaf closes flush with the wall. It arrives primed, so it is painted or papered together with the wall. The set includes frame, leaf and concealed Otlav hinges.",
    },
  },
];

/* Twelve models per split block - six pages of two. They are picked
   round-robin across the category's collections rather than straight off the
   top of the list, so the block shows the breadth of the range instead of six
   variants of the same model. Models held at the manufacturer's warehouse are
   left out: their prices are still the factory's hryvnia ones and would sit
   oddly next to the euro prices beside them. */
const SPLIT_SLIDER_ITEMS = 12;

/* The pool of twelve rotates on a fixed window so a repeat visitor does not
   keep meeting the same dozen models. `rotation` is a whole number that steps
   once per window (see ROTATION_WINDOW_MS); each collection's queue is turned
   by that amount before the round-robin pick, so a different slice of every
   collection surfaces each window. */
const ROTATION_WINDOW_MS = 1000 * 60 * 30; // 30 minutes

function splitSliderItems(slug, rotation = 0) {
  const byCollection = new Map();
  for (const p of products) {
    if (p.category !== slug || p.stockSource === "factory") continue;
    const key = p.collection || "";
    if (!byCollection.has(key)) byCollection.set(key, []);
    byCollection.get(key).push(p);
  }

  const queues = [...byCollection.values()].map((list) => {
    if (list.length < 2) return [...list];
    const off = (((rotation % list.length) + list.length) % list.length);
    return [...list.slice(off), ...list.slice(0, off)];
  });
  const picked = [];
  while (picked.length < SPLIT_SLIDER_ITEMS && queues.some((q) => q.length)) {
    for (const queue of queues) {
      if (!queue.length) continue;
      picked.push(queue.shift());
      if (picked.length === SPLIT_SLIDER_ITEMS) break;
    }
  }
  return picked;
}

export default async function Home() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || "/";
  const locale = getLocaleFromPathname(pathname);

  /* Both hero slides carry the same pair of translucent calls to action:
     into the catalogue, and to the partner application page. */
  const heroCta = [
    {
      label: t(locale, "hero.chooseDoors"),
      href: withLocaleHref(locale, "/kategorija/ardurvis-dzivoklim"),
      variant: "glass-accent",
    },
    {
      label: t(locale, "hero.partnership"),
      href: withLocaleHref(locale, "/sadarbiba"),
      variant: "glass",
    },
  ];

  const slides = HERO.map((s) => ({
    image: s.image,
    kicker: pick(locale, s.kicker),
    title: pick(locale, s.title),
    cta: heroCta,
  }));

  const viewAll = { lt: "Žiūrėti visus", lv: "Skatīt visus", en: "View all" }[locale] || "Žiūrėti visus";

  /* Steps once per rotation window; page is force-dynamic, so every request
     recomputes and a fresh slice of the range shows through. */
  const rotation = Math.floor(Date.now() / ROTATION_WINDOW_MS);

  return (
    <main>
      <HeroSlider slides={slides} />

      {BLOCKS.map((block) => {
        const items = splitSliderItems(block.slug, rotation);
        /* Two layers rather than one: a missing generated scene simply fails
           to paint and the stock fallback underneath shows through, so the
           block is never a blank half-screen. */
        const media = (
          <div
            className="split-media"
            style={{
              backgroundImage: `url("/scenes/${block.slug}.webp"), url("${block.image}")`,
            }}
            role="img"
            aria-label={pick(locale, block.title)}
          />
        );

        return (
          <section key={block.slug} className="split group">
            {block.reverse ? null : media}

            <div className="split-body">
              <h2 className="t-section max-w-[560px]">{pick(locale, block.title)}</h2>
              <p className="mt-5 max-w-[560px] text-[color:var(--color-ink)]">
                {pick(locale, block.text)}
              </p>

              {items.length ? (
                <SplitProductSlider className="mt-9 max-w-[600px]" products={items} />
              ) : null}

              <div className="mt-8">
                <Link
                  href={withLocaleHref(locale, `/kategorija/${block.slug}`)}
                  className="btn btn-outline-dark"
                >
                  {viewAll}
                </Link>
              </div>
            </div>

            {block.reverse ? media : null}
          </section>
        );
      })}

      {/* New arrivals — full-width row, as on the reference site */}
      <section className="section-soft py-16">
        <div className="container">
          <h2 className="t-section mb-8 text-center">{t(locale, "home.newArrivals")}</h2>
          <RevealGrid className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {products
              .filter((p) => p.isNew)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </RevealGrid>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-[color:var(--color-title)] py-14 text-white">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-[760px] text-[22px] font-medium leading-[1.4] text-white sm:text-[28px]">
            {t(locale, "home.ctaTitle")}
          </h2>
          <Link href={withLocaleHref(locale, "/kontakti")} className="btn btn-accent">
            {t(locale, "home.ctaButton")}
          </Link>
        </div>
      </section>
    </main>
  );
}
