"use client";

import { useEffect, useMemo, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/data/products";
import { usePathname } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import ConsentMap from "@/components/ConsentMap";
import { getLocaleFromPathname, withLocaleHref, t, trData } from "@/lib/i18n";

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
  const searchParams = useSearchParams();
  const productId = searchParams.get("produkts");

  const product = useMemo(() => (productId ? getProductById(productId) : null), [productId]);
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
  const [message, setMessage] = useState(() => {
    if (!product) return "";
    const base = `${t(locale, "contacts.prefill")} ${trData(locale, product.name)}`;
    return selectedServices.length
      ? `${base}\n${t(locale, "contacts.servicesLabel")}: ${selectedServices.join(", ")}`
      : base;
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

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
      formData.append("message", message);
      formData.append("consent", consent ? "1" : "");
      formData.append("fax_number", honeypot);
      files.forEach((file) => formData.append("files", file, file.name));
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("send_failed");
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
          <Link className="text-ink underline" href={withLocaleHref(locale, `/produkts/${product.id}`)}>
            {trData(locale, product.name)}
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
                    <a className="block text-ink" href="tel:+37066213171">+370 662 13171</a>
                    <a className="block text-ink" href="tel:+37060557978">+370 605 57978</a>
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
                    <div className="text-ink">9:00–18:00</div>
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                {submitted && (
                  <div className="text-ink">
                    {t(locale, "contacts.thanks")}
                  </div>
                )}
                {error && (
                  <div className="text-[color:var(--color-accent)]">
                    {t(locale, "contacts.error")}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
