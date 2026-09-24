"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Paperclip, Phone, X } from "lucide-react";
import { useUrlSearchParams } from "@/lib/useUrlSearchParams";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { formatPrice } from "@/lib/product-utils";
import { paths } from "@/lib/routes";
import { usePathname } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import ConsentMap from "@/components/ConsentMap";
import { getLocaleFromPathname, withLocaleHref, t } from "@/lib/i18n";
import { phones, mainPhone, hoursFor } from "@/lib/site";

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "heic", "doc", "docx"];
const MAX_FILES = 5;

// Key the "Pieprasīt piedāvājumu" button (Ražotājs-2 calculator) writes to
// sessionStorage before navigating here: a base64 data URL of the offer PDF
// it just generated, so this form can auto-attach it without a round trip
// through a server upload.
const PENDING_PDF_KEY = "pendingOfferPdf";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Maps the "pakalpojumi" query codes (written by the product page's
// fulfilment toggles) to the same translation keys those toggles show, so
// the prefilled message states in words what the visitor picked.
const SERVICE_OPTION_KEYS = {
  pickup: "product.optionPickup",
  measurement: "product.optionMeasurement",
  deliveryOnly: "product.optionDeliveryOnly",
  installDelivery: "product.optionInstallDelivery",
};

export default function ContactsClient() {
  const locale = getLocaleFromPathname(usePathname());
  const searchParams = useUrlSearchParams();
  const productId = searchParams.get("produkts");

  // The product arrives from /api/products (already translated), so the
  // catalogue doesn't have to ship with this page.
  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();
    fetch(`/api/products?locale=${locale}&ids=${encodeURIComponent(productId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => setProduct(data.products?.[0] || null))
      .catch(() => {});
    return () => controller.abort();
  }, [productId, locale]);
  const selectedServices = useMemo(() => {
    const raw = searchParams.get("pakalpojumi");
    if (!raw) return [];
    return raw
      .split(",")
      .map((code) => SERVICE_OPTION_KEYS[code])
      .filter(Boolean)
      .map((key) => t(locale, key));
  }, [searchParams, locale]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // What the visitor was looking at on the product page, so the enquiry
  // arrives with the exact variant instead of just a model name.
  const offer = useMemo(() => {
    if (!product) return null;
    return {
      name: product.name,
      color: (product.colorLabels || []).join(" / "),
      size: searchParams.get("izmers") || product.sizes?.[0] || "",
      price: formatPrice(product),
    };
  }, [product, searchParams]);

  const [message, setMessage] = useState("");
  const [messageTouched, setMessageTouched] = useState(false);

  /* Prefilled once the product has loaded; after the visitor edits the field
     their text wins. */
  const prefill = useMemo(() => {
    if (!offer) return "";
    const lines = [`${t(locale, "contacts.prefill")} ${offer.name}`];
    if (offer.color) lines.push(`${t(locale, "contacts.colorLabel")}: ${offer.color}`);
    if (offer.size) lines.push(`${t(locale, "contacts.sizeLabel")}: ${offer.size}`);
    if (offer.price) lines.push(`${t(locale, "contacts.priceLabel")}: ${offer.price}`);
    if (selectedServices.length) lines.push(`${t(locale, "contacts.servicesLabel")}: ${selectedServices.join(", ")}`);
    return lines.join("\n");
  }, [offer, selectedServices, locale]);
  const messageValue = messageTouched ? message : prefill;
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const confirmRef = useRef(null);

  // The confirmation is much shorter than the form it replaces, so bring it
  // into view instead of leaving the visitor looking at the page below it.
  useEffect(() => {
    if (submitted) confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  function resetForm() {
    setMessage("");
    setMessageTouched(true);
    setFiles([]);
    setRejected([]);
    setConsent(false);
    setSubmitted(false);
  }

  // Picks up the PDF the Ražotājs-2 calculator's "Pieprasīt piedāvājumu"
  // button stashed in sessionStorage right before navigating here, and
  // attaches it automatically - the visitor doesn't have to re-download and
  // re-upload their own configured offer.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_PDF_KEY);
      if (!raw) return;
      sessionStorage.removeItem(PENDING_PDF_KEY);
      const { name: fileName, dataUrl } = JSON.parse(raw);
      if (!dataUrl) return;
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], fileName || "piedavajums.pdf", { type: "application/pdf" });
          setFiles((prev) => [...prev, file]);
        })
        .catch(() => {});
    } catch {
      // sessionStorage can throw in private-browsing/locked-down contexts -
      // the form still works without the auto-attached PDF.
    }
  }, []);

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const ok = incoming.filter((f) => ALLOWED_EXTENSIONS.includes(f.name.split(".").pop().toLowerCase()));
    setRejected(incoming.filter((f) => !ok.includes(f)).map((f) => f.name));
    setFiles((prev) => [...prev, ...ok].slice(0, MAX_FILES));
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("message", messageValue);
      formData.append("consent", consent ? "1" : "");
      formData.append("fax_number", honeypot);
      if (product && offer) {
        formData.append("product_id", product.id);
        formData.append("product_name", offer.name);
        formData.append("product_color", offer.color);
        formData.append("product_size", offer.size);
        formData.append("product_price", offer.price);
        formData.append("product_url", `${window.location.origin}${withLocaleHref(locale, paths.product(product.id))}`);
        formData.append("services", selectedServices.join(", "));
      }
      files.forEach((file) => formData.append("files", file, file.name));
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("send_failed");
      track("lead_submit", { form: "contact", product: product?.id || "none", locale });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <PageTitle
        title={t(locale, "contacts.title")}
        image="https://images.unsplash.com/photo-1697653568339-e8f8a5dd7318?auto=format&fit=crop&w=2000&q=60"
      />
      {product ? (
        <div className="container pt-8 text-sm text-muted">
          {t(locale, "contacts.relatedToProduct")}{" "}
          <Link className="text-ink underline" href={withLocaleHref(locale, paths.product(product.id))}>
            {product.name}
          </Link>
        </div>
      ) : null}

      <section>
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: contact info + map */}
            <div className="space-y-4">
              <div className="border border-line bg-white p-4">
                <div className="text-sm font-semibold tracking-wide text-ink mb-2">{t(locale, "contacts.contactUs")}</div>
                <div className="text-[15px] text-ink">
                  <div className="mb-2">
                    <div className="text-muted">{t(locale, "contacts.phone")}</div>
                    {phones.map((p) => (
                      <a key={p.href} className="block text-ink" href={p.href}>{p.label}</a>
                    ))}
                  </div>
                  <div className="mb-2">
                    <div className="text-muted">{t(locale, "contacts.email")}</div>
                    <a className="block text-ink" href="mailto:info@tnbaltic.lt">info@tnbaltic.lt</a>
                  </div>
                  <div className="mb-2">
                    <div className="text-muted">{t(locale, "contacts.showroom")}</div>
                    <div className="text-ink">Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r.</div>
                  </div>
                  <div>
                    <div className="text-muted">{t(locale, "contacts.hours")}</div>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 text-ink">
                      {hoursFor(locale).map((row) => (
                        <div key={row.days} className="contents">
                          <dt>{row.days}</dt>
                          <dd>{row.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              <div className="border border-line overflow-hidden">
                <ConsentMap
                  locale={locale}
                  title={t(locale, "contacts.mapTitle")}
                  query="Džūkų g. 17, Šveicarijos k., LT-55301 Jonavos r."
                />
              </div>
            </div>

            {/* Right: form */}
            <div>
              {submitted ? (
                <div
                  ref={confirmRef}
                  role="status"
                  className="border border-line bg-white p-6 sm:p-8"
                >
                  <CheckCircle2 size={40} className="text-[color:var(--color-accent)]" aria-hidden />
                  <h2 className="mt-4 text-[22px] font-medium text-[color:var(--color-title)]">
                    {t(locale, "contacts.thanksTitle")}
                  </h2>
                  <p className="mt-2 text-[15px] text-ink">{t(locale, "contacts.responseTime")}</p>
                  {offer ? (
                    <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-line pt-4 text-[14px]">
                      <dt className="text-muted">{t(locale, "contacts.productLabel")}</dt>
                      <dd className="text-ink">{offer.name}</dd>
                      {offer.color ? (
                        <>
                          <dt className="text-muted">{t(locale, "contacts.colorLabel")}</dt>
                          <dd className="text-ink">{offer.color}</dd>
                        </>
                      ) : null}
                      {offer.size ? (
                        <>
                          <dt className="text-muted">{t(locale, "contacts.sizeLabel")}</dt>
                          <dd className="text-ink">{offer.size}</dd>
                        </>
                      ) : null}
                      {offer.price ? (
                        <>
                          <dt className="text-muted">{t(locale, "contacts.priceLabel")}</dt>
                          <dd className="text-ink">{offer.price}</dd>
                        </>
                      ) : null}
                    </dl>
                  ) : null}
                  <div className="mt-6 border-t border-line pt-4 text-[14px] text-muted">
                    {t(locale, "contacts.urgentCall")}{" "}
                    <a href={mainPhone.href} className="inline-flex items-center gap-1 font-semibold text-ink underline">
                      <Phone size={14} aria-hidden />
                      {mainPhone.label}
                    </a>
                  </div>
                  <button type="button" onClick={resetForm} className="btn btn-outline-dark mt-6">
                    {t(locale, "contacts.sendAnother")}
                  </button>
                </div>
              ) : (
              <form onSubmit={onSubmit} className="border border-line bg-white p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">{t(locale, "contacts.formName")}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">{t(locale, "contacts.formPhone")}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">{t(locale, "contacts.formEmail")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">{t(locale, "contacts.formMessage")}</label>
                  <textarea
                    value={messageValue}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setMessageTouched(true);
                    }}
                    rows={5}
                    className="field"
                    placeholder={t(locale, "contacts.formPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">{t(locale, "contacts.attachments")}</label>
                  {files.length > 0 && (
                    <ul className="mb-2 space-y-1">
                      {files.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between gap-2 border border-line bg-[--color-soft] px-3 py-1.5 text-[13px] text-ink"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Paperclip size={14} className="shrink-0 text-muted" />
                            <span className="truncate">{file.name}</span>
                            <span className="shrink-0 text-muted">({formatFileSize(file.size)})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            aria-label={t(locale, "contacts.removeFile")}
                            className="shrink-0 text-muted hover:text-ink"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <label className="btn btn-outline-dark inline-flex cursor-pointer items-center gap-2">
                    <Paperclip size={14} />
                    {t(locale, "contacts.addFiles")}
                    <input
                      type="file"
                      multiple
                      accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",")}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <p className="mt-2 text-[12px] text-muted">{t(locale, "legal.fileTypesHint")}</p>
                  {rejected.length > 0 && (
                    <p className="mt-1 text-[13px] text-[color:var(--color-accent)]">
                      {t(locale, "legal.fileRejected")} {rejected.join(", ")}
                    </p>
                  )}
                </div>
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Fax
                    <input
                      type="text"
                      name="fax_number"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>
                <label className="flex items-start gap-2 text-[13px] text-muted">
                  <input
                    type="checkbox"
                    className="mt-[3px]"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    {t(locale, "legal.contactConsent")}{" "}
                    <Link href={withLocaleHref(locale, "/privatumo-politika")} className="underline" target="_blank">
                      {t(locale, "legal.privacyLink")}
                    </Link>
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <button type="submit" disabled={sending} className="btn btn-accent disabled:opacity-60">
                    {sending ? t(locale, "contacts.sending") : t(locale, "contacts.submit")}
                  </button>
                </div>
                {error && (
                  <div className="text-[color:var(--color-accent)]">
                    {t(locale, "contacts.error")}
                  </div>
                )}
              </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
