import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/pricedCatalog";
import ProductCard from "@/components/ProductCard";
import SplitProductSlider from "@/components/SplitProductSlider";
import HeroSlider from "@/components/HeroSlider";
import RevealGrid from "@/components/anim/RevealGrid";
import { withLocaleHref, t } from "@/lib/i18n";
import { cardsFor } from "@/lib/catalog";
import { paths } from "@/lib/routes";
import { localeParams, pageMetadata, resolveLocale, siteTitle, siteDescription } from "@/lib/page";
import { imageProps } from "@/lib/images";
import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getService, serviceSlugs, serviceUi } from "@/data/services";

export const generateStaticParams = localeParams;

/* Static, regenerated every ten minutes so the split blocks move on to the next
   rotation window (ROTATION_WINDOW_MS below; route config has to be a literal). */
export const revalidate = 600;

export async function generateMetadata({ params }) {
  const locale = await resolveLocale(params);
  const meta = pageMetadata({ locale, path: "", description: siteDescription(locale) });
  return {
    ...meta,
    title: siteTitle(locale),
    openGraph: { ...meta.openGraph, title: siteTitle(locale) },
    twitter: { ...meta.twitter, title: siteTitle(locale) },
  };
}

const pick = (locale, obj) => obj[locale] ?? obj.lt;

/* Homepage structure mirrors m-lux.by: a cinematic hero followed by
   alternating 50/50 blocks - full-bleed photography on one half, a white
   editorial panel with a headline, a short paragraph and two models on the
   other.

   The photography half lives in public/scenes/<slug>.webp and shows the
   category's real catalogue door installed in a room, so the door in the
   scene is the door in the slider beside it. See tools/scenes.config.mjs for
   which product anchors which scene and how they are produced. Each block
   renders public/scenes/<slug>.webp, lazily, so none of it competes with the
   hero photo for bandwidth. */

const HERO = [
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/t4IY7.jpg",
    kicker: { lt: "LAUKO DURYS", lv: "ĀRDURVIS", en: "ENTRANCE DOORS", ru: "ВХОДНЫЕ ДВЕРИ" },
    title: {
      lt: "PATIKIMI SPRENDIMAI JŪSŲ SAUGUMUI",
      lv: "UZTICAMI RISINĀJUMI JŪSU DROŠĪBAI",
      en: "RELIABLE SOLUTIONS FOR YOUR SECURITY",
      ru: "НАДЁЖНЫЕ РЕШЕНИЯ ДЛЯ ВАШЕЙ БЕЗОПАСНОСТИ",
    },
  },
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/fH7VH.jpg",
    kicker: { lt: "VIDAUS DURYS", lv: "IEKŠDURVIS", en: "INTERIOR DOORS", ru: "МЕЖКОМНАТНЫЕ ДВЕРИ" },
    title: {
      lt: "TYLA IR ESTETIKA KIEKVIENAME KAMBARYJE",
      lv: "KLUSUMS UN ESTĒTIKA KATRĀ TELPĀ",
      en: "QUIET AND STYLE IN EVERY ROOM",
      ru: "ТИШИНА И ЭСТЕТИКА В КАЖДОЙ КОМНАТЕ",
    },
  },
  {
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/gvXG2.jpg",
    kicker: { lt: "INDIVIDUALŪS SPRENDIMAI", lv: "INDIVIDUĀLI RISINĀJUMI", en: "CUSTOM SOLUTIONS", ru: "ИНДИВИДУАЛЬНЫЕ РЕШЕНИЯ" },
    title: {
      lt: "NESTANDARTINIAI SPRENDIMAI IR INDIVIDUALŪS PROJEKTAI",
      lv: "NESTANDARTA RISINĀJUMI UN INDIVIDUĀLI PROJEKTI",
      en: "NON-STANDARD SOLUTIONS AND CUSTOM PROJECTS",
      ru: "НЕСТАНДАРТНЫЕ РЕШЕНИЯ И ИНДИВИДУАЛЬНЫЕ ПРОЕКТЫ",
    },
  },
];

/* The split photo half is half the viewport wide but at least 736px tall
   (usually ~900px with the product slider), so object-cover scales the
   landscape scene photos up by height: a 3:2 photo in a 900px tall panel is
   ~1350px wide whatever the viewport. "50vw" alone made the browser fetch a
   ~1080px copy and stretch it, which looked blurry. */
const SPLIT_MEDIA_SIZES = "(min-width: 1025px) max(50vw, 1400px), 100vw";

const BLOCKS = [
  {
    slug: "ardurvis-dzivoklim",
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/pic_apartment_hd.jpg",
    title: {
      lt: "Buto lauko durys - svarbus žingsnis saugumo link",
      lv: "Ārdurvis dzīvoklim - svarīgs solis drošībai",
      en: "Apartment entrance doors - a key step towards safety",
      ru: "Входные двери в квартиру - важный шаг к безопасности",
    },
    text: {
      lt: "Patikima konstrukcija su standumo briaunomis, kelių kontūrų sandarinimas ir dviguba spynų sistema. Apgalvota apsauga nuo jėga vykdomo įsilaužimo.",
      lv: "Uzticama konstrukcija ar stingruma ribām, vairāku kontūru blīvējums un divu slēdzeņu sistēma. Pārdomāta aizsardzība pret spēka metodēm.",
      en: "A dependable structure with stiffening ribs, multi-contour sealing and a double lock system. Considered protection against forced entry.",
      ru: "Надёжная конструкция с рёбрами жёсткости, многоконтурное уплотнение и система из двух замков. Продуманная защита от силового взлома.",
    },
  },
  {
    slug: "ardurvis-privatmajai",
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/pic_exterior_d_hd.jpg",
    reverse: true,
    title: {
      lt: "Termo durys namams - šiluma, tyla, garantija",
      lv: "Termodurvis privātmājai - siltums, klusums, garantija",
      en: "Thermal doors for houses - warmth, quiet, warranty",
      ru: "Термодвери для частного дома - тепло, тишина, гарантия",
    },
    text: {
      lt: "Termo pertrauka, sustiprintas užpildas ir atsparios orui dangos. Suteikiame garantiją ir prisiimame visus įsipareigojimus dėl aptarnavimo.",
      lv: "Termopārrāvums, pastiprināts pildījums un laikapstākļiem izturīgi pārklājumi. Sniedzam garantiju un uzņemamies visas servisa saistības.",
      en: "A thermal break, reinforced core and weather-resistant finishes. We provide a warranty and take on all after-sales obligations.",
      ru: "Терморазрыв, усиленное наполнение и атмосферостойкие покрытия. Предоставляем гарантию и берём на себя все сервисные обязательства.",
    },
  },
  {
    slug: "ieksdurvis",
    image: "https://ik.imagekit.io/vbvwdejj5/NTdurys-HOMEPAGE/RV-06whiteultramatte_main.png",
    title: {
      lt: "Vidaus durys - vientisas interjero sprendimas",
      lv: "Iekšdurvis - vienots interjera risinājums",
      en: "Interior doors - a coherent interior solution",
      ru: "Межкомнатные двери - цельное интерьерное решение",
    },
    text: {
      lt: "Gaminame duris nestandartinių matmenų, efektingus modelius su sieninėmis plokštėmis ir įgyvendiname dizaino projektus pagal jūsų pageidavimus.",
      lv: "Izgatavojam durvis nestandarta izmēros, efektīgus modeļus ar sienas paneļiem un īstenojam dizaina projektus pēc jūsu vēlmēm.",
      en: "We build doors in non-standard sizes, striking models with wall panelling, and realise design projects to your brief.",
      ru: "Изготавливаем двери нестандартных размеров, эффектные модели со стеновыми панелями и реализуем дизайн-проекты по вашим пожеланиям.",
    },
  },
  {
    slug: "sleptas-durvis",
    reverse: true,
    title: {
      lt: "Paslėptos durys - siena be staktos",
      lv: "Slēptās durvis - siena bez redzamas kārbas",
      en: "Hidden doors - a wall with no visible frame",
      ru: "Скрытые двери - стена без видимой коробки",
    },
    text: {
      lt: "Aliumininė stakta paslepiama pertvaroje, o varčia užsidaro viename lygyje su siena. Varčia pristatoma gruntuota, todėl dažoma arba tapetuojama kartu su siena. Komplekte - stakta, varčia ir paslėpti Otlav vyriai.",
      lv: "Alumīnija kārbu iebūvē starpsienā, un vērtne aizveras vienā līmenī ar sienu. Vērtne nāk gruntēta, tāpēc to krāso vai tapetē kopā ar sienu. Komplektā - kārba, vērtne un slēptās Otlav eņģes.",
      en: "The aluminium frame is buried in the partition and the leaf closes flush with the wall. It arrives primed, so it is painted or papered together with the wall. The set includes frame, leaf and concealed Otlav hinges.",
      ru: "Алюминиевая коробка встраивается в перегородку, а полотно закрывается заподлицо со стеной. Полотно поставляется загрунтованным, поэтому его красят или оклеивают обоями вместе со стеной. В комплекте - коробка, полотно и скрытые петли Otlav.",
    },
  },
];

/* A fifth split block, cross-cutting rather than category-based: every
   "Smart Lux" and "Smart" Boston model ships with the same CBA biometric
   lock (see boston-smart-models.js), regardless of which category it is
   filed under. The banner is the manufacturer's own showroom photo of that
   lock installed - see the "Konstruktīvs" tab's lifestyle banner - so the
   keypad is visible in the same frame as the doors below it. "View all"
   goes to the search page rather than a category, since the model matches
   by id prefix, not by a single category id. */
const SMART_LOCK_BLOCK = {
  slug: "viedas-slodzenes",
  image: "/images/boston-construction/06-lifestyle-banner.jpg",
  title: {
    lt: "Durys su išmania spyna - saugumas be raktų",
    lv: "Durvis ar viedo slēdzeni - drošība bez atslēgām",
    en: "Doors with a smart lock - security without keys",
    ru: "Двери с умным замком - безопасность без ключей",
  },
  text: {
    lt: "CBA biometrinė spyna su Face ID atpažinimu, atsarginiu cilindru ir programėle telefone. Kiekvienas modelis pasirenkamas su šia spynų sistema.",
    lv: "CBA biometriskā slēdzene ar Face ID atpazīšanu, rezerves cilindru un lietotni tālrunī. Katru modeli var izvēlēties ar šo slēdzeņu sistēmu.",
    en: "A CBA biometric lock with Face ID recognition, a backup cylinder and a phone app. Every model here can be ordered with this lock system.",
    ru: "Биометрический замок CBA с распознаванием Face ID, резервным цилиндром и приложением на телефоне. Любую модель можно заказать с этой системой замков.",
  },
};

const isSmartLockProduct = (p) => p.id.startsWith("boston-smart");

/* Twelve models per split block - six pages of two. Models held at the
   manufacturer's warehouse are left out: their prices are still the factory's
   hryvnia ones and would sit oddly next to the euro prices beside them. */
const SPLIT_SLIDER_ITEMS = 12;

/* The block pages through the category's whole range over the day: every
   window (ROTATION_WINDOW_MS) shows the next models of one fixed, mixed
   order, wrapping round at the end - see splitSliderItems. So a repeat
   visitor meets new models every ten minutes, and even the largest pool
   (Boston's ~130 new models, six per window) comes round within a day. */
const ROTATION_WINDOW_MS = 1000 * 60 * 10; // 10 minutes

/* "Jaunumi" pages through every new model the same way, four per window. */
const NEW_ARRIVALS_ITEMS = 4;

/* Read outside the component: the clock is meant to vary between renders.
   The page is regenerated every `revalidate` seconds (ISR), so each fresh
   render picks up the next window's slice. */
function currentRotation() {
  return Math.floor(Date.now() / ROTATION_WINDOW_MS);
}

/* Spread each group's items evenly through one list - a group with twice as
   many items appears twice as often, but never in a clump at the end the way
   a plain round-robin leaves the biggest group's tail. */
function spreadEvenly(items, keyOf) {
  const groups = new Map();
  for (const item of items) {
    const key = keyOf(item) || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()]
    .flatMap((group) => group.map((item, i) => ({ item, pos: (i + 0.5) / group.length })))
    .sort((x, y) => x.pos - y.pos)
    .map((x) => x.item);
}

// `count` consecutive items of `list` for this window, wrapping round.
function windowSlice(list, rotation, count) {
  const n = list.length;
  const take = Math.min(count, n);
  const start = n ? (((rotation * count) % n) + n) % n : 0;
  return Array.from({ length: take }, (_, i) => list[(start + i) % n]);
}

// Mixed by category first, then by collection within each category.
function mixedOrder(items) {
  const byCategory = new Map();
  for (const p of items) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category).push(p);
  }
  return spreadEvenly(
    [...byCategory.values()].flatMap((list) => spreadEvenly(list, (p) => p.collection)),
    (p) => p.category
  );
}

function splitSliderItems(list, matches, rotation = 0, count = SPLIT_SLIDER_ITEMS) {
  const pool = list.filter((p) => matches(p) && p.stockSource !== "factory");

  /* One collection (Boston) makes up most of some pools - 130 of ~140 new
     models. Mixed strictly in proportion, it would fill nearly every slot, so
     it is capped at half: it pages through its own models in half the slots,
     everything else pages through the other half (and, being fewer, comes
     round several times a day). */
  const sizes = new Map();
  for (const p of pool) sizes.set(p.collection, (sizes.get(p.collection) || 0) + 1);
  const [largest, largestSize = 0] = [...sizes].sort((x, y) => y[1] - x[1])[0] || [];
  if (largestSize * 2 <= pool.length || largestSize === pool.length) {
    return windowSlice(mixedOrder(pool), rotation, count);
  }

  const bigSlots = Math.ceil(count / 2);
  const big = windowSlice(mixedOrder(pool.filter((p) => p.collection === largest)), rotation, bigSlots);
  const rest = windowSlice(mixedOrder(pool.filter((p) => p.collection !== largest)), rotation, count - bigSlots);
  const picked = [];
  for (let i = 0; i < Math.max(big.length, rest.length); i++) {
    if (rest[i]) picked.push(rest[i]);
    if (big[i]) picked.push(big[i]);
  }
  return picked;
}

export default async function Home({ params }) {
  const locale = await resolveLocale(params);

  /* Every hero slide carries the same pair of calls to action: a solid one
     into the catalogue, and a translucent one to the partner application page. */
  const heroCta = [
    {
      label: t(locale, "hero.chooseDoors"),
      href: withLocaleHref(locale, "/kategorija/buto-lauko-durys"),
      variant: "accent",
    },
    {
      label: t(locale, "hero.partnership"),
      href: withLocaleHref(locale, "/bendradarbiavimas"),
      variant: "glass",
    },
  ];

  const slides = HERO.map((s) => ({
    image: s.image,
    kicker: pick(locale, s.kicker),
    title: pick(locale, s.title),
    cta: heroCta,
  }));

  const viewAll = { lt: "Žiūrėti visus", lv: "Skatīt visus", en: "View all", ru: "Смотреть все" }[locale] || "Žiūrėti visus";

  const rotation = currentRotation();
  const products = await getProducts();

  /* The two most-asked questions of each service, answered on the homepage
     too: question-and-answer text is what AI assistants lift into their
     answers, and the homepage is the page they read first. The answers live
     in @/data/services, so they stay the same as on the service pages. */
  const faq = serviceSlugs.flatMap((slug) =>
    getService(slug, locale).faq.slice(0, 2).map((f) => ({ ...f, href: withLocaleHref(locale, paths.service(slug)) }))
  );
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const more = { lt: "Plačiau", lv: "Vairāk", en: "Read more", ru: "Подробнее" }[locale] || "Plačiau";

  return (
    <main>
      <JsonLd data={faqLd} />
      <HeroSlider slides={slides} />

      {BLOCKS.map((block) => {
        const items = cardsFor(splitSliderItems(products, (p) => p.category === block.slug, rotation), locale);
        const mediaSrc = block.image || `/scenes/${block.slug}.webp`;
        const media = (
          <div className="split-media relative overflow-hidden">
            <Image
              src={mediaSrc}
              alt={pick(locale, block.title)}
              fill
              {...imageProps(mediaSrc)}
              sizes={SPLIT_MEDIA_SIZES}
              quality={90}
              className="object-cover"
            />
          </div>
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
                <SplitProductSlider className="mt-9 w-full max-w-[600px]" products={items} />
              ) : null}

              <div className="mt-8">
                <Link
                  href={withLocaleHref(locale, paths.category(block.slug))}
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

      {/* Smart lock block - same split layout as the category blocks above,
          but the pool is every "Smart"/"Smart Lux" Boston model regardless of
          category, and the photo is fixed (the manufacturer's own showroom
          shot of the lock installed) rather than a per-category scene. */}
      {(() => {
        const items = cardsFor(splitSliderItems(products, isSmartLockProduct, rotation), locale);
        if (!items.length) return null;
        return (
          <section className="split group">
            <div className="split-media relative overflow-hidden">
              <Image
                src={SMART_LOCK_BLOCK.image}
                alt={pick(locale, SMART_LOCK_BLOCK.title)}
                fill
                sizes={SPLIT_MEDIA_SIZES}
                quality={90}
                className="object-cover"
              />
            </div>

            <div className="split-body">
              <h2 className="t-section max-w-[560px]">{pick(locale, SMART_LOCK_BLOCK.title)}</h2>
              <p className="mt-5 max-w-[560px] text-[color:var(--color-ink)]">
                {pick(locale, SMART_LOCK_BLOCK.text)}
              </p>

              <SplitProductSlider className="mt-9 w-full max-w-[600px]" products={items} />

              <div className="mt-8">
                <Link
                  href={withLocaleHref(locale, `${paths.search}?q=smart`)}
                  className="btn btn-outline-dark"
                >
                  {viewAll}
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* New arrivals - full-width row, as on the reference site */}
      <section className="section-soft py-16">
        <div className="container">
          <h2 className="t-section mb-8 text-center">{t(locale, "home.newArrivals")}</h2>
          <RevealGrid className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {cardsFor(splitSliderItems(products, (p) => p.isNew, rotation, NEW_ARRIVALS_ITEMS), locale).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </RevealGrid>
        </div>
      </section>

      {/* FAQ - native <details>, so the answers are in the HTML without JS */}
      <section className="py-16">
        <div className="container">
          <h2 className="t-section mb-8 text-center">{serviceUi(locale).faqHeading}</h2>
          <div className="mx-auto max-w-[900px] border-t border-line">
            {faq.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium text-[color:var(--color-title)] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-5 pr-8 text-[15px] leading-[1.7] text-muted">
                  {f.a}{" "}
                  <Link href={f.href} className="font-medium text-[color:var(--color-accent)] hover:underline">
                    {more}
                  </Link>
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-[color:var(--color-title)] py-14 text-white">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-[760px] text-[22px] font-medium leading-[1.4] text-white sm:text-[28px]">
            {t(locale, "home.ctaTitle")}
          </h2>
          <Link href={withLocaleHref(locale, "/kontaktai")} className="btn btn-accent">
            {t(locale, "home.ctaButton")}
          </Link>
        </div>
      </section>
    </main>
  );
}
