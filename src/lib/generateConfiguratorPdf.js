// Builds the "Lejupielādēt" PDF for the Ražotājs-2 configurator: the chosen
// door's photo(s), full specification and the itemised price, laid out as a
// one-page offer sheet a salesperson or customer can save or print.
//
// Two things make this more than "print the page":
// - Baltic text (ā, č, ž, ų, ė…) needs a Unicode font — jsPDF's built-in
//   fonts only cover WinAnsi, so we fetch Montserrat's own TTFs (already
//   used on the site) from /fonts and register them as a custom jsPDF font.
// - Product photos live on ImageKit/bulat-doors.com.ua, so they're fetched
//   and inlined as data URLs; if a fetch fails the sheet still renders,
//   just without that picture, rather than throwing.

const CHROME = {
  lv: {
    docTitle: "Individuālais piedāvājums",
    date: "Datums",
    specification: "Specifikācija",
    installDelivery: "Montāža un piegāde",
    noServices: "Nav izvēlēta neviena montāžas vai piegādes opcija.",
    priceBreakdown: "Cenas aprēķins",
    total: "Kopā",
    disclaimer:
      "Cena aprēķināta pēc mazumtirdzniecības cenrāža. Galīgā cena tiek apstiprināta pasūtījuma noformēšanas brīdī.",
    outsideImage: "Ārpuse",
    insideImage: "Iekšpuse",
    page: "Lappuse",
    company: "DURYS",
    tagline: "Uzticamas un ilgmūžīgas durvis jūsu mājoklim",
  },
  lt: {
    docTitle: "Individualus pasiūlymas",
    date: "Data",
    specification: "Specifikacija",
    installDelivery: "Montavimas ir pristatymas",
    noServices: "Nepasirinkta jokia montavimo ar pristatymo paslauga.",
    priceBreakdown: "Kainos skaičiavimas",
    total: "Iš viso",
    disclaimer:
      "Kaina apskaičiuota pagal mažmeninį kainoraštį. Galutinė kaina patvirtinama užsakymo įforminimo metu.",
    outsideImage: "Išorė",
    insideImage: "Vidus",
    page: "Puslapis",
    company: "DURYS",
    tagline: "Patikimos ir ilgaamžės durys jūsų namams",
  },
  en: {
    docTitle: "Individual offer",
    date: "Date",
    specification: "Specification",
    installDelivery: "Installation and delivery",
    noServices: "No installation or delivery option was selected.",
    priceBreakdown: "Price breakdown",
    total: "Total",
    disclaimer:
      "The price is calculated from the retail price list. The final price is confirmed when the order is placed.",
    outsideImage: "Outside",
    insideImage: "Inside",
    page: "Page",
    company: "DURYS",
    tagline: "Reliable, long-lasting doors for your home",
  },
};

const ACCENT = [3, 119, 67];
const INK = [34, 34, 34];
const MUTED = [118, 118, 118];
const LINE = [225, 225, 225];
const SOFT = [247, 247, 247];

let fontsRegisteredOn = null;

async function fetchAsBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`font fetch failed: ${url}`);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function registerMontserrat(doc) {
  if (fontsRegisteredOn === doc) return;
  const [regular, bold] = await Promise.all([
    fetchAsBase64("/fonts/Montserrat-Regular.ttf"),
    fetchAsBase64("/fonts/Montserrat-Bold.ttf"),
  ]);
  doc.addFileToVFS("Montserrat-Regular.ttf", regular);
  doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");
  doc.addFileToVFS("Montserrat-Bold.ttf", bold);
  doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");
  doc.setFont("Montserrat", "normal");
  fontsRegisteredOn = doc;
}

async function fetchImageBlob(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) return await res.blob();
  } catch {
    // falls through to the same-origin proxy below
  }
  // Some catalogue hosts answer a page's own fetch() inconsistently even
  // when their headers allow it — retry once through our own API route,
  // which fetches server-side and hands the bytes back same-origin.
  try {
    const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
    if (res.ok) return await res.blob();
  } catch {
    // both attempts failed — caller treats a null asset as "skip the image"
  }
  return null;
}

async function loadImageAsset(url) {
  if (!url) return null;
  try {
    const blob = await fetchImageBlob(url);
    if (!blob) return null;
    const format = blob.type.includes("png") ? "PNG" : blob.type.includes("webp") ? "WEBP" : "JPEG";
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = dataUrl;
    });
    return { dataUrl, format, ...dims };
  } catch {
    return null;
  }
}

// Places an image inside a maxW×maxH box, centred, preserving aspect ratio.
function drawContainedImage(doc, asset, x, y, maxW, maxH) {
  if (!asset) return;
  const ratio = Math.min(maxW / asset.width, maxH / asset.height);
  const w = asset.width * ratio;
  const h = asset.height * ratio;
  doc.addImage(asset.dataUrl, asset.format, x + (maxW - w) / 2, y + (maxH - h) / 2, w, h, undefined, "FAST");
}

const money = (v) => `${Number(v || 0).toLocaleString("lv-LV")} €`;

/**
 * @param {object} data
 * @param {"lv"|"lt"|"en"} data.locale
 * @param {string} data.tierName
 * @param {string} [data.tierIntro]
 * @param {string} [data.tierTarget] — already-translated "Dzīvoklim"/"Privātmājai" badge text
 * @param {string} [data.mainImageUrl]
 * @param {{label:string,url:string}} [data.secondaryImage]
 * @param {Array<{label:string,value:string}>} data.specRows
 * @param {Array<{label:string,on:boolean}>} data.serviceOptions
 * @param {Array<{label:string,price:number}>} data.priceLines
 * @param {number} data.total
 * @param {{phone?:string,email?:string,address?:string}} [data.contact]
 * @param {string} [data.fileName]
 */
export async function generateConfiguratorPdf(data) {
  const { jsPDF } = await import("jspdf");
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default;

  const t = CHROME[data.locale] || CHROME.lv;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await registerMontserrat(doc);
  doc.setFont("Montserrat", "normal");

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;

  const [mainImage, secondaryImage] = await Promise.all([
    loadImageAsset(data.mainImageUrl),
    loadImageAsset(data.secondaryImage?.url),
  ]);

  // ---- Header band -------------------------------------------------------
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(18);
  doc.text(t.company, margin, 12);
  doc.setFont("Montserrat", "normal");
  doc.setFontSize(9);
  doc.text(t.tagline, margin, 19);

  doc.setFont("Montserrat", "bold");
  doc.setFontSize(11);
  doc.text(t.docTitle, pageW - margin, 12, { align: "right" });
  doc.setFont("Montserrat", "normal");
  doc.setFontSize(9);
  const dateStr = new Date().toLocaleDateString(data.locale === "en" ? "en-GB" : `${data.locale}-${data.locale.toUpperCase()}`);
  doc.text(`${t.date}: ${dateStr}`, pageW - margin, 19, { align: "right" });

  let y = 36;

  // ---- Title + intro -------------------------------------------------------
  doc.setTextColor(...INK);
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(17);
  doc.text(data.tierName || "", margin, y);
  if (data.tierTarget) {
    doc.setFont("Montserrat", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    const badgeW = doc.getTextWidth(data.tierTarget) + 6;
    doc.setDrawColor(...LINE);
    doc.roundedRect(pageW - margin - badgeW, y - 5.5, badgeW, 7, 1.5, 1.5, "S");
    doc.text(data.tierTarget, pageW - margin - badgeW / 2, y - 1, { align: "center" });
  }
  y += 7;

  if (data.tierIntro) {
    doc.setFont("Montserrat", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(data.tierIntro, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 4.6 + 4;
  } else {
    y += 3;
  }

  // ---- Photos --------------------------------------------------------------
  const photoTop = y;
  const photoH = 62;
  if (mainImage && secondaryImage) {
    const boxW = (contentW - 4) / 2;
    doc.setDrawColor(...LINE);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, photoTop, boxW, photoH, 1.5, 1.5, "FD");
    drawContainedImage(doc, mainImage, margin + 2, photoTop + 2, boxW - 4, photoH - 8);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(t.outsideImage, margin + boxW / 2, photoTop + photoH - 3, { align: "center" });

    const x2 = margin + boxW + 4;
    doc.roundedRect(x2, photoTop, boxW, photoH, 1.5, 1.5, "FD");
    drawContainedImage(doc, secondaryImage, x2 + 2, photoTop + 2, boxW - 4, photoH - 8);
    doc.text(t.insideImage, x2 + boxW / 2, photoTop + photoH - 3, { align: "center" });
    y = photoTop + photoH + 6;
  } else if (mainImage) {
    doc.setDrawColor(...LINE);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, photoTop, contentW, photoH, 1.5, 1.5, "FD");
    drawContainedImage(doc, mainImage, margin + 2, photoTop + 2, contentW - 4, photoH - 4);
    y = photoTop + photoH + 6;
  }

  // ---- Specification table ---------------------------------------------
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(t.specification, margin, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { font: "Montserrat", fontSize: 9.5, textColor: INK, cellPadding: { top: 2, bottom: 2, left: 0, right: 2 } },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 52, textColor: MUTED },
      1: { cellWidth: contentW - 52 },
    },
    body: data.specRows.map((row) => [row.label, row.value]),
    didParseCell: (hook) => {
      if (hook.section === "body") {
        hook.cell.styles.lineWidth = { bottom: 0.1 };
        hook.cell.styles.lineColor = LINE;
      }
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // ---- Installation & delivery -------------------------------------------
  if (y > pageH - 70) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(12);
  doc.text(t.installDelivery, margin, y);
  y += 6;
  const selected = data.serviceOptions.filter((o) => o.on);
  doc.setFont("Montserrat", "normal");
  doc.setFontSize(9.5);
  if (selected.length) {
    for (const opt of selected) {
      doc.setFillColor(...ACCENT);
      doc.circle(margin + 1, y - 1.3, 1, "F");
      doc.setTextColor(...INK);
      doc.text(opt.label, margin + 5, y);
      y += 5.5;
    }
  } else {
    doc.setTextColor(...MUTED);
    doc.text(t.noServices, margin, y);
    y += 5.5;
  }
  y += 4;

  // ---- Price breakdown -----------------------------------------------------
  if (y > pageH - 70) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(t.priceBreakdown, margin, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { font: "Montserrat", fontSize: 9.5, textColor: INK, cellPadding: { top: 1.8, bottom: 1.8, left: 0, right: 2 } },
    columnStyles: {
      0: { cellWidth: contentW - 30 },
      1: { cellWidth: 30, halign: "right" },
    },
    body: data.priceLines.map((line) => [line.label, money(line.price)]),
    didParseCell: (hook) => {
      if (hook.section === "body") {
        hook.cell.styles.lineWidth = { bottom: 0.1 };
        hook.cell.styles.lineColor = LINE;
      }
    },
  });
  y = doc.lastAutoTable.finalY + 4;

  doc.setFillColor(...SOFT);
  doc.rect(margin, y, contentW, 12, "F");
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentW, y);
  doc.setFont("Montserrat", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(t.total, margin + 3, y + 8);
  doc.setTextColor(...ACCENT);
  doc.setFontSize(14);
  doc.text(money(data.total), margin + contentW - 3, y + 8, { align: "right" });
  y += 18;

  doc.setFont("Montserrat", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const disclaimerLines = doc.splitTextToSize(t.disclaimer, contentW);
  doc.text(disclaimerLines, margin, y);

  // ---- Footer on every page -------------------------------------------------
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const footerY = pageH - 12;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    doc.setFont("Montserrat", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const contactBits = [data.contact?.phone, data.contact?.email, data.contact?.address].filter(Boolean);
    doc.text(contactBits.join("   ·   "), margin, footerY);
    doc.text(`${t.page} ${i}/${pageCount}`, pageW - margin, footerY, { align: "right" });
  }

  doc.save(data.fileName || "piedavajums.pdf");
}
