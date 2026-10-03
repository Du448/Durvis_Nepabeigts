import { NextResponse } from "next/server";
import { sendFormEmail } from "@/lib/mailer";
import { HONEYPOT_FIELD, honeypotResponse, isHoneypotFilled, rateLimited } from "@/lib/formGuard";
import { locales, defaultLocale, t } from "@/lib/i18n";
import { phones, company } from "@/lib/site";
import { buildCustomerEmail, buildShopEmail } from "@/lib/orderEmail";
import { buildOrderItems } from "@/lib/orderItems";
import { formatPrice } from "@/lib/product-utils";

// No payment step (see @/components/OrderClient): the shop confirms the
// final price after measurement, so placing an order here just books the
// request with the shop and confirms receipt to the customer - modelled on
// rdveikals.lv's own /order page, minus its payment section.
//
// The browser only sends its cart lines; names, prices, the total, images
// and links are rebuilt from the catalogue by buildOrderItems().

const MAX_TEXT = 300;

function clip(value, max = MAX_TEXT) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function makeOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NT-${date}-${rand}`;
}

const ITEM_ROW_LABELS = {
  lt: {
    size: "Dydis",
    direction: "Pusė",
    qty: "Kiekis",
    price: "Kaina",
    services: "Paslaugos",
    jambColor: "Angokraščio tonas",
  },
  lv: {
    size: "Izmērs",
    direction: "Virziens",
    qty: "Daudzums",
    price: "Cena",
    services: "Pakalpojumi",
    jambColor: "Ailes tonis",
  },
  en: {
    size: "Size",
    direction: "Direction",
    qty: "Qty",
    price: "Price",
    services: "Services",
    jambColor: "Jamb colour",
  },
  ru: {
    size: "Размер",
    direction: "Направление",
    qty: "Кол-во",
    price: "Цена",
    services: "Услуги",
    jambColor: "Оттенок откосов",
  },
};

function itemRows(item, labels) {
  return [
    [labels.size, item.size],
    [labels.direction, item.direction],
    [labels.qty, String(item.qty)],
    [labels.price, item.price],
    [labels.services, item.services],
    [labels.jambColor, item.jambColor],
    ...item.config.map((row) => {
      const i = row.indexOf(": ");
      return i > 0 ? [row.slice(0, i), row.slice(i + 2)] : ["", row];
    }),
  ].filter(([, value]) => value);
}

export async function POST(request) {
  // A loose per-IP cap here, matching the Vercel Firewall rule (an office can
  // share one IP); the real 5-per-10-minutes limit is per e-mail address,
  // below, once the body is read.
  const ipLimited = rateLimited(request, "order-ip", { max: 15 });
  if (ipLimited) return ipLimited;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const trap = body[HONEYPOT_FIELD];
  if (isHoneypotFilled(trap)) return honeypotResponse();

  const locale = locales.includes(body.locale) ? body.locale : defaultLocale;
  const customerType = body.customerType === "business" ? "business" : "private";
  const firstName = clip(body.firstName, 100);
  const lastName = clip(body.lastName, 100);
  const companyName = clip(body.companyName, 150);
  const companyCode = clip(body.companyCode, 40);
  const vatCode = clip(body.vatCode, 40);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const deliveryMethod = body.deliveryMethod === "courier" ? "courier" : "pickup";
  const address = {
    city: clip(body.address?.city, 100),
    street: clip(body.address?.street, 150),
    postalCode: clip(body.address?.postalCode, 20),
  };
  const comment = clip(body.comment, 500);
  const consent = Boolean(body.consent);
  const items = await buildOrderItems(body.lines, locale);
  const subtotal = items.length ? formatPrice({ currency: "EUR" }, items.reduce((sum, item) => sum + item.total, 0)) : "";

  if (!email || !phone || !consent || !items.length) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (customerType === "private" && (!firstName || !lastName)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (customerType === "business" && !companyName) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (deliveryMethod === "courier" && (!address.city || !address.street)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const limited = rateLimited(request, "order-email", { key: email.toLowerCase() });
  if (limited) return limited;

  const orderNumber = makeOrderNumber();
  const customerName = customerType === "business" ? companyName : `${firstName} ${lastName}`.trim();
  const labels = ITEM_ROW_LABELS[locale] || ITEM_ROW_LABELS.lt;

  const deliveryLine =
    deliveryMethod === "pickup"
      ? `${t(locale, "order.deliveryPickup")} - ${company.address}`
      : [t(locale, "order.deliveryCourier"), address.city, address.street, address.postalCode].filter(Boolean).join(", ");

  // --- Internal notification to the shop -----------------------------------
  const shopItemBlocks = items.map((item, i) => [`${i + 1}. ${item.name}`, ...itemRows(item, labels).map(([l, v]) => `  ${l}: ${v}`)]);
  const shopText = [
    `Užsakymo Nr.: ${orderNumber}`,
    `Klientas: ${customerType === "business" ? "Įmonė" : "Privatus asmuo"}`,
    customerType === "business" ? `Įmonė: ${companyName}` : null,
    customerType === "business" && companyCode ? `Įmonės kodas: ${companyCode}` : null,
    customerType === "business" && vatCode ? `PVM kodas: ${vatCode}` : null,
    customerType === "private" ? `Vardas Pavardė: ${firstName} ${lastName}` : null,
    `El. paštas: ${email}`,
    `Telefonas: ${phone}`,
    "",
    `Gavimas: ${deliveryLine}`,
    comment ? `Komentaras: ${comment}` : null,
    "",
    "Prekės:",
    ...shopItemBlocks.flat(),
    subtotal ? `Tarpinė suma: ${subtotal}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const shopHtml = buildShopEmail({ orderNumber, customerType, customerName, companyCode, vatCode, email, phone, deliveryLine, comment, items, itemRows, labels: ITEM_ROW_LABELS.lt, subtotal });

  try {
    await sendFormEmail({
      subject: `Naujas užsakymas Nr. ${orderNumber} - ${customerName}`,
      replyTo: email,
      text: shopText,
      html: shopHtml,
    });
  } catch (err) {
    console.error("order notification send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // --- Confirmation to the customer, in their own language -----------------
  try {
    const greetName = customerType === "business" ? companyName : firstName || customerName;
    const custText = [
      t(locale, "order.mailGreeting").replace("{name}", greetName),
      "",
      t(locale, "order.mailThanks"),
      `${t(locale, "order.mailOrderNumber")}: ${orderNumber}`,
      "",
      `${t(locale, "order.mailItemsHeading")}:`,
      ...shopItemBlocks.flat(),
      subtotal ? `${t(locale, "cart.subtotal")}: ${subtotal}` : null,
      "",
      `${t(locale, "order.mailDeliveryHeading")}: ${deliveryLine}`,
      "",
      t(locale, "order.mailNote"),
      "",
      `${t(locale, "order.mailContactHeading")}: ${phones.map((p) => p.label).join(", ")} · ${company.email}`,
      "",
      t(locale, "order.mailSignature"),
    ]
      .filter((line) => line !== null)
      .join("\n");

    // The visitor's own comment is left out of the confirmation on purpose:
    // it is the one free-text field that would otherwise go to whatever
    // address was typed in. The shop still gets it above.
    const custHtml = buildCustomerEmail({ locale, greetName, orderNumber, items, itemRows, labels, subtotal, deliveryLine });

    await sendFormEmail({
      to: email,
      subject: t(locale, "order.mailSubjectCustomer").replace("{n}", orderNumber),
      replyTo: company.email,
      text: custText,
      html: custHtml,
    });
  } catch (err) {
    // The shop already has the order - a failed customer confirmation
    // shouldn't make the visitor think the order itself failed.
    console.error("order confirmation email failed:", err);
  }

  return NextResponse.json({ ok: true, orderNumber });
}
