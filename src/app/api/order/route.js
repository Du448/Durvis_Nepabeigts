import { NextResponse } from "next/server";
import { sendFormEmail, escapeHtml } from "@/lib/mailer";
import { HONEYPOT_FIELD, honeypotResponse, isHoneypotFilled, rateLimited } from "@/lib/formGuard";
import { locales, defaultLocale, t } from "@/lib/i18n";
import { phones, hoursFor, company } from "@/lib/site";

// No payment step (see @/components/OrderClient): the shop confirms the
// final price after measurement, so placing an order here just books the
// request with the shop and confirms receipt to the customer - modelled on
// rdveikals.lv's own /order page, minus its payment section.

const MAX_ITEMS = 20;
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
    hardwareType: "Furnitūros tipas",
    colorTone: "Spalvos tonas",
    customSize: "Nestandartinis dydis",
    glassTone: "Stiklo tonavimas",
  },
  lv: {
    size: "Izmērs",
    direction: "Virziens",
    qty: "Daudzums",
    price: "Cena",
    services: "Pakalpojumi",
    jambColor: "Ailes tonis",
    hardwareType: "Furnitūras tips",
    colorTone: "Krāsas tonis",
    customSize: "Nestandarta izmērs",
    glassTone: "Stikla tonējums",
  },
  en: {
    size: "Size",
    direction: "Direction",
    qty: "Qty",
    price: "Price",
    services: "Services",
    jambColor: "Jamb colour",
    hardwareType: "Hardware type",
    colorTone: "Colour tone",
    customSize: "Non-standard size",
    glassTone: "Glass tint",
  },
};

function readItems(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_ITEMS).map((item) => ({
    name: clip(item?.name),
    size: clip(item?.size, 60),
    direction: clip(item?.direction, 30),
    qty: Math.max(1, Math.min(999, Number(item?.qty) || 1)),
    price: clip(item?.price, 30),
    services: clip(item?.services, 200),
    jambColor: clip(item?.jambColor, 60),
    hardwareType: clip(item?.hardwareType, 80),
    colorTone: clip(item?.colorTone, 60),
    customSize: clip(item?.customSize, 100),
    glassTone: clip(item?.glassTone, 60),
    url: clip(item?.url, 300),
  }));
}

function itemRows(item, labels) {
  return [
    [labels.size, item.size],
    [labels.direction, item.direction],
    [labels.qty, String(item.qty)],
    [labels.price, item.price],
    [labels.services, item.services],
    [labels.jambColor, item.jambColor],
    [labels.hardwareType, item.hardwareType],
    [labels.colorTone, item.colorTone],
    [labels.customSize, item.customSize],
    [labels.glassTone, item.glassTone],
  ].filter(([, value]) => value);
}

export async function POST(request) {
  const limited = rateLimited(request, "order");
  if (limited) return limited;

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
  const items = readItems(body.items);
  const subtotal = clip(body.subtotal, 30);

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

  const shopHtml = `
    <p><strong>Užsakymo Nr.:</strong> ${escapeHtml(orderNumber)}</p>
    <p><strong>Klientas:</strong> ${customerType === "business" ? "Įmonė" : "Privatus asmuo"} - ${escapeHtml(customerName)}</p>
    ${customerType === "business" && companyCode ? `<p><strong>Įmonės kodas:</strong> ${escapeHtml(companyCode)}</p>` : ""}
    ${customerType === "business" && vatCode ? `<p><strong>PVM kodas:</strong> ${escapeHtml(vatCode)}</p>` : ""}
    <p><strong>El. paštas:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefonas:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Gavimas:</strong> ${escapeHtml(deliveryLine)}</p>
    ${comment ? `<p><strong>Komentaras:</strong> ${escapeHtml(comment)}</p>` : ""}
    <h3 style="margin:16px 0 8px">Prekės</h3>
    ${items
      .map(
        (item, i) =>
          `<table cellpadding="4" style="border-collapse:collapse;margin:0 0 10px;border:1px solid #ddd"><tr><td colspan="2" style="font-weight:bold">${i + 1}. ${escapeHtml(item.name)}</td></tr>${itemRows(item, labels)
            .map(([l, v]) => `<tr><td style="color:#666">${l}</td><td>${escapeHtml(v)}</td></tr>`)
            .join("")}</table>`
      )
      .join("")}
    ${subtotal ? `<p><strong>Tarpinė suma:</strong> ${escapeHtml(subtotal)}</p>` : ""}
  `;

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
    const custItemBlocks = items.map(
      (item, i) => `<tr><td colspan="2" style="font-weight:bold;padding-top:10px">${i + 1}. ${escapeHtml(item.name)}</td></tr>${itemRows(item, labels)
        .map(([l, v]) => `<tr><td style="color:#666;padding-left:12px">${l}</td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}`
    );
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

    const custHtml = `
      <p>${escapeHtml(t(locale, "order.mailGreeting").replace("{name}", greetName))}</p>
      <p>${escapeHtml(t(locale, "order.mailThanks"))}</p>
      <p><strong>${escapeHtml(t(locale, "order.mailOrderNumber"))}:</strong> ${escapeHtml(orderNumber)}</p>
      <h3 style="margin:16px 0 8px">${escapeHtml(t(locale, "order.mailItemsHeading"))}</h3>
      <table cellpadding="4" style="border-collapse:collapse;border:1px solid #ddd">${custItemBlocks.join("")}</table>
      ${subtotal ? `<p><strong>${escapeHtml(t(locale, "cart.subtotal"))}:</strong> ${escapeHtml(subtotal)}</p>` : ""}
      <p><strong>${escapeHtml(t(locale, "order.mailDeliveryHeading"))}:</strong> ${escapeHtml(deliveryLine)}</p>
      <p style="margin-top:16px;color:#444">${escapeHtml(t(locale, "order.mailNote"))}</p>
      <p style="margin-top:16px"><strong>${escapeHtml(t(locale, "order.mailContactHeading"))}:</strong><br>
        ${phones.map((p) => escapeHtml(p.label)).join("<br>")}<br>
        ${escapeHtml(company.email)}<br>
        ${escapeHtml(company.address)}<br>
        ${hoursFor(locale).map((r) => `${escapeHtml(r.days)}: ${escapeHtml(r.time)}`).join("<br>")}
      </p>
      <p style="margin-top:16px">${escapeHtml(t(locale, "order.mailSignature"))}</p>
    `;

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
