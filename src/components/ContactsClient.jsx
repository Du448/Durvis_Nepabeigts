"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/data/products";
import { usePathname } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { getLocaleFromPathname, withLocaleHref, t, trData } from "@/lib/i18n";

export default function ContactsClient() {
  const locale = getLocaleFromPathname(usePathname());
  const searchParams = useSearchParams();
  const productId = searchParams.get("produkts");

  const product = useMemo(() => (productId ? getProductById(productId) : null), [productId]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(() =>
    product ? `${t(locale, "contacts.prefill")} ${trData(locale, product.name)}` : ""
  );
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message }),
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
                <iframe
                  title={t(locale, "contacts.mapTitle")}
                  src="https://www.google.com/maps?q=D%C5%BE%C5%ABk%C5%B3%20g.%2017%2C%20%C5%A0veicarijos%20k.%2C%20LT-55301%20Jonavos%20r.&output=embed"
                  className="w-full h-[280px] sm:h-[340px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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
