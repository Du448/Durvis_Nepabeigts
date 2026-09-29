import { escapeHtml as esc } from "@/lib/mailer";
import { t } from "@/lib/i18n";
import { SITE_URL, phones, hoursFor, company } from "@/lib/site";

/* Customer order confirmation. Table layout with inline styles only - the
   one approach that renders the same in Gmail, Outlook and Apple Mail. */

const INK = "#1c1c1c";
const MUTED = "#6b6f76";
const LINE = "#e8e9eb";
const SOFT = "#f5f6f4";
const ACCENT = "#037743";
const FONT = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

function itemCard(item, index, rows, url) {
  const image = item.image
    ? `<td width="168" valign="top" style="padding:20px 0 20px 20px"><a href="${esc(item.url || url)}"><img src="${esc(item.image)}" width="148" alt="${esc(item.name)}" style="display:block;width:148px;max-width:100%;height:auto;border:0;border-radius:8px;background:${SOFT}"></a></td>`
    : "";
  const specRows = rows
    .map(
      ([label, value]) =>
        `<tr><td valign="top" style="padding:7px 12px 7px 0;font-size:12px;line-height:1.5;color:${MUTED};border-top:1px solid ${LINE};width:38%">${esc(label)}</td><td valign="top" style="padding:7px 0;font-size:13px;line-height:1.5;color:${INK};border-top:1px solid ${LINE}">${esc(value)}</td></tr>`
    )
    .join("");
  return `
    <tr><td style="padding:0 0 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;border-collapse:separate;background:#ffffff">
        <tr>
          ${image}
          <td valign="top" style="padding:20px">
            <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT};font-weight:600">${String(index + 1).padStart(2, "0")}</div>
            <div style="margin:4px 0 12px;font-size:18px;line-height:1.3;font-weight:600;color:${INK}">${esc(item.name)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${specRows}</table>
          </td>
        </tr>
      </table>
    </td></tr>`;
}

export function buildCustomerEmail({ locale, greetName, orderNumber, items, itemRows, labels, subtotal, deliveryLine, comment }) {
  const tr = (key) => t(locale, key);
  const hours = hoursFor(locale)
    .map((r) => `${esc(r.days)}: ${esc(r.time)}`)
    .join("<br>");
  const preheader = `${tr("order.mailOrderNumber")}: ${orderNumber}`;

  const cards = items.map((item, i) => itemCard(item, i, itemRows(item, labels), SITE_URL)).join("");

  return `<!doctype html>
<html lang="${esc(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${SOFT};font-family:${FONT};color:${INK}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT}"><tr><td align="center" style="padding:32px 12px">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%">

      <tr><td style="background:#161616;border-radius:16px 16px 0 0;padding:28px 32px">
        <img src="${SITE_URL}/logo-white.png" height="34" alt="NT Durys" style="display:block;height:34px;width:auto;border:0">
      </td></tr>

      <tr><td style="background:#ffffff;padding:40px 32px 8px">
        <div style="display:inline-block;background:#e7f4ed;color:${ACCENT};font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;padding:6px 12px;border-radius:999px">&#10003;&nbsp;${esc(tr("order.mailOrderNumber"))} ${esc(orderNumber)}</div>
        <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-.01em;color:${INK}">${esc(tr("order.mailGreeting").replace("{name}", greetName))}</h1>
        <p style="margin:0;font-size:15px;line-height:1.65;color:#3c3f44">${esc(tr("order.mailThanks"))}</p>
      </td></tr>

      <tr><td style="background:#ffffff;padding:28px 32px 4px">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:${MUTED};margin-bottom:14px">${esc(tr("order.mailItemsHeading"))}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}</table>
      </td></tr>

      <tr><td style="background:#ffffff;padding:4px 32px 8px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border-radius:12px"><tr>
          <td style="padding:20px 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#b9bcc1">${esc(tr("cart.subtotal"))}</td>
          <td align="right" style="padding:20px 24px;font-size:26px;font-weight:600;color:#ffffff;white-space:nowrap">${esc(subtotal || "")}</td>
        </tr></table>
      </td></tr>

      <tr><td style="background:#ffffff;padding:20px 32px 8px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border-radius:12px"><tr><td style="padding:18px 22px">
          <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:${MUTED};margin-bottom:6px">${esc(tr("order.mailDeliveryHeading"))}</div>
          <div style="font-size:14px;line-height:1.6;color:${INK}">${esc(deliveryLine)}</div>
          ${comment ? `<div style="margin-top:10px;font-size:13px;line-height:1.6;color:${MUTED};font-style:italic">&ldquo;${esc(comment)}&rdquo;</div>` : ""}
        </td></tr></table>
      </td></tr>

      <tr><td style="background:#ffffff;padding:20px 32px 36px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${ACCENT}"><tr><td style="padding:2px 0 2px 16px;font-size:14px;line-height:1.65;color:#3c3f44">${esc(tr("order.mailNote"))}</td></tr></table>
      </td></tr>

      <tr><td style="background:#161616;border-radius:0 0 16px 16px;padding:28px 32px">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#8c9097;margin-bottom:12px">${esc(tr("order.mailContactHeading"))}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td valign="top" style="font-size:14px;line-height:1.7;color:#ffffff">
            ${phones.map((p) => `<a href="tel:${esc(p.label.replace(/[^+\d]/g, ""))}" style="color:#ffffff;text-decoration:none">${esc(p.label)}</a>`).join("<br>")}<br>
            <a href="mailto:${esc(company.email)}" style="color:#7fd1a8;text-decoration:none">${esc(company.email)}</a>
          </td>
          <td valign="top" style="font-size:13px;line-height:1.7;color:#b9bcc1">
            ${esc(company.address)}<br>${hours}
          </td>
        </tr></table>
        <div style="margin-top:22px;padding-top:18px;border-top:1px solid #2c2e31;font-size:13px;color:#8c9097">${esc(tr("order.mailSignature"))}</div>
      </td></tr>

    </table>
  </td></tr></table>
</body></html>`;
}
