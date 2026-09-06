"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { getLocaleFromPathname, t } from "@/lib/i18n";

/* Partner application page — the destination of the hero's "Sadarbība"
   button. Same understated form styling as the contacts page. */

export default function PartnersClient() {
  const locale = getLocaleFromPathname(usePathname());
  const [form, setForm] = useState({
    company: "",
    person: "",
    phone: "",
    email: "",
    city: "",
    website: "",
    activity: "salon",
    message: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const benefits = ["benefit1", "benefit2", "benefit3", "benefit4"];
  const activities = [
    ["salon", "activitySalon"],
    ["installer", "activityInstaller"],
    ["builder", "activityBuilder"],
    ["designer", "activityDesigner"],
    ["other", "activityOther"],
  ];

  return (
    <>
      <PageTitle
        title={t(locale, "partners.title")}
        description={t(locale, "partners.lead")}
        image="https://images.unsplash.com/photo-1613544723301-176686aa9f09?auto=format&fit=crop&w=2000&q=60"
      />

      <section>
        <div className="container grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* What we offer */}
          <div>
            <h2 className="t-section">{t(locale, "partners.benefitsTitle")}</h2>
            <ul className="mt-6 space-y-4">
              {benefits.map((key) => (
                <li key={key} className="flex gap-3">
                  <Check
                    size={18}
                    strokeWidth={2}
                    className="mt-[3px] shrink-0 text-[color:var(--color-accent)]"
                  />
                  <span>{t(locale, `partners.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application form */}
          <div>
            <h2 className="t-section">{t(locale, "partners.formTitle")}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-6 space-y-4 border border-line bg-white p-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-company">
                    {t(locale, "partners.company")}
                  </label>
                  <input id="p-company" className="field" value={form.company} onChange={set("company")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-person">
                    {t(locale, "partners.person")}
                  </label>
                  <input id="p-person" className="field" value={form.person} onChange={set("person")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-phone">
                    {t(locale, "partners.phone")}
                  </label>
                  <input id="p-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-email">
                    {t(locale, "partners.email")}
                  </label>
                  <input id="p-email" type="email" className="field" value={form.email} onChange={set("email")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-city">
                    {t(locale, "partners.city")}
                  </label>
                  <input id="p-city" className="field" value={form.city} onChange={set("city")} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-muted" htmlFor="p-website">
                    {t(locale, "partners.website")}
                  </label>
                  <input id="p-website" className="field" value={form.website} onChange={set("website")} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-muted" htmlFor="p-activity">
                  {t(locale, "partners.activity")}
                </label>
                <select id="p-activity" className="field" value={form.activity} onChange={set("activity")}>
                  {activities.map(([value, key]) => (
                    <option key={value} value={value}>
                      {t(locale, `partners.${key}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-muted" htmlFor="p-message">
                  {t(locale, "partners.message")}
                </label>
                <textarea
                  id="p-message"
                  rows={5}
                  className="field"
                  placeholder={t(locale, "partners.messagePlaceholder")}
                  value={form.message}
                  onChange={set("message")}
                />
              </div>

              <label className="flex items-start gap-2 text-[13px] text-muted">
                <input
                  type="checkbox"
                  className="mt-[3px]"
                  checked={form.consent}
                  onChange={set("consent")}
                  required
                />
                <span>{t(locale, "partners.consent")}</span>
              </label>

              <button type="submit" className="btn btn-accent">
                {t(locale, "partners.submit")}
              </button>

              {submitted ? <div className="text-ink">{t(locale, "partners.thanks")}</div> : null}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
