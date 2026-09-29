"use client";

import { useId, useRef, useState } from "react";
import { Info } from "lucide-react";
import { Field, MmInput, Segmented, Step } from "@/components/BostonConfigurator";
import { DROP_SEALS, MAX_W, MIN_H, MIN_W, MIRRORS, PRICES, STD_WIDTHS, STOPPER_COLORS, WIDTH_PCT } from "@/data/hidden-door-options";
import { bandFor, dropSealFor, hingeLimits, hiddenSizes, isStdWidth, leafArea, normalizeHidden, priceHidden } from "@/lib/hidden-config";
import { ht, hiddenLineLabel } from "@/lib/hidden-config-i18n";

/* Configurator for the hidden doors (see @/lib/hidden-config): the same
   stepped layout as the Boston configurator, fed by the Eirodurvis price
   list. Made-to-order models get every step; stock models only the size,
   hinge side and the accessories that need no work at the factory. */

const eur = (n) => `${Math.round(n).toLocaleString("lv-LV")} €`;
const signed = (n) => (n > 0 ? `+${eur(n)}` : n < 0 ? `−${eur(-n)}` : "");

const EDGE_HEX = { primer: "#e7e3dc", alu: "#b8bdc3", black: "#1d1d1d" };
const MIRROR_HEX = { silver: ["#e9eef2", "#b9c3cc"], graphite: ["#6d7176", "#3c3f43"], bronze: ["#b99a7a", "#7d5f45"] };
const STOPPER_HEX = { black: "#1e1e1e", bronze: "#8a6a4a", chrome: "#c9ccd0" };

function CheckRow({ checked, onChange, label, hint, price }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1 text-[14px] text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)]" />
      <span className="min-w-0 flex-1">
        {label}
        {hint ? <span className="block text-[12px] leading-snug text-muted">{hint}</span> : null}
      </span>
      {price ? <span className="shrink-0 text-[13px] font-medium tabular-nums text-[color:var(--color-title)]">{price}</span> : null}
    </label>
  );
}

function Choice({ name, checked, onChange, label, hint, price, disabled }) {
  return (
    <label className={`flex items-start gap-2.5 py-1 text-[14px] ${disabled ? "cursor-not-allowed text-muted/70" : "cursor-pointer text-ink"}`}>
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)]" />
      <span className="min-w-0 flex-1">
        {label}
        {hint ? <span className="block text-[12px] leading-snug text-muted">{hint}</span> : null}
      </span>
      {price ? <span className="shrink-0 text-[13px] font-medium tabular-nums text-[color:var(--color-title)]">{price}</span> : null}
    </label>
  );
}

/* The leaf in its wall opening, to scale: frame, leaf in its edge colour
   (and mirror), the hinges on the chosen side and the drilled handle. */
function LeafPreview({ spec, config, hinges, label }) {
  const gid = useId().replace(/:/g, "");
  const { frame } = hiddenSizes(config);
  const W = frame.w;
  const H = frame.h;
  const fw = 24; // frame profile as drawn
  const leaf = { x: fw, y: config.noTopFrame ? 0 : fw, w: W - 2 * fw, h: H - fw - (config.noTopFrame ? 0 : fw) };
  const edge = spec.edge === "black" && config.edgeColor === "ral" ? "#8e949a" : EDGE_HEX[spec.edge];
  const frameHex = spec.edge === "black" ? (config.frameColor === "ral" ? "#8e949a" : "#1d1d1d") : "#a9aeb4";
  const mirror = MIRROR_HEX[config.mirror];
  const hingeX = config.hinge === "left" ? leaf.x : leaf.x + leaf.w - 22;
  const handleX = config.hinge === "left" ? leaf.x + leaf.w - 90 : leaf.x + 90;
  const ys = Array.from({ length: hinges }, (_, i) => leaf.y + 180 + (i * (leaf.h - 360 - 110)) / Math.max(1, hinges - 1));
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox={`-160 -110 ${W + 340} ${H + 330}`} className="h-72 w-auto max-w-full" role="img" aria-label={label}>
        <defs>
          {mirror ? (
            <linearGradient id={`m-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={mirror[0]} />
              <stop offset="1" stopColor={mirror[1]} />
            </linearGradient>
          ) : null}
        </defs>
        <rect x={-160} y={-110} width={W + 320} height={H + 110} fill="#efece7" />
        <rect x={0} y={config.noTopFrame ? -110 : 0} width={W} height={H + (config.noTopFrame ? 110 : 0)} fill={frameHex} />
        <rect x={leaf.x} y={leaf.y} width={leaf.w} height={leaf.h} fill="#fbfaf7" stroke={edge} strokeWidth={spec.edge === "primer" ? 4 : 16} />
        {mirror ? <rect x={leaf.x + 70} y={leaf.y + 70} width={leaf.w - 140} height={leaf.h - 140} fill={`url(#m-${gid})`} opacity="0.9" /> : null}
        {ys.map((y, i) => (
          <rect key={i} x={hingeX} y={y} width="22" height="120" fill="#5f6368" />
        ))}
        {config.handleHole ? <circle cx={handleX} cy={leaf.y + leaf.h * 0.5} r="22" fill="#2b2b2b" /> : null}
        {config.cylinderHole !== "none" ? <circle cx={handleX} cy={leaf.y + leaf.h * 0.5 + 90} r="16" fill="#2b2b2b" /> : null}
        {config.dropSeal !== "none" ? <rect x={leaf.x + 35} y={leaf.y + leaf.h - 18} width={leaf.w - 70} height="12" fill="#6b6f74" /> : null}
        {config.stopper !== "none" ? <rect x={handleX - 14} y={leaf.y + leaf.h - 40} width="28" height="30" fill={STOPPER_HEX[config.stopper]} /> : null}
        <line x1={0} y1={H + 70} x2={W} y2={H + 70} stroke="#6b6f76" strokeWidth="4" />
        <text x={W / 2} y={H + 190} textAnchor="middle" fontSize="120" fill="#3c3f44">
          {config.width}
        </text>
        <line x1={W + 70} y1={leaf.y} x2={W + 70} y2={H} stroke="#6b6f76" strokeWidth="4" />
        <text x={W + 110} y={H / 2} fontSize="120" fill="#3c3f44" transform={`rotate(90 ${W + 110} ${H / 2})`} textAnchor="middle">
          {config.height}
        </text>
      </svg>
      <figcaption className="mt-1 text-[12px] text-muted">{label}</figcaption>
    </figure>
  );
}

export default function HiddenDoorConfigurator({ spec, config, onChange, locale }) {
  const c = normalizeHidden(spec, config);
  const apply = (patch) => onChange(normalizeHidden(spec, { ...c, ...patch }));
  const priced = priceHidden(spec, c);
  const priceOf = (patch) => priceHidden(spec, { ...c, ...patch }).total;
  const delta = (patch) => signed(priceOf(patch) - priced.total);
  const L = (k, v) => ht(locale, k, v);
  const { frame, opening } = hiddenSizes(c);
  const { required, recommended } = hingeLimits(c);

  const [done, setDone] = useState(() => new Set());
  const markDone = (key) => setDone((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  const steps = [
    { key: "size", title: L("stepSize") },
    { key: "hinges", title: L("stepHinges") },
    spec.ral ? { key: "color", title: L("stepColor") } : null,
    spec.order ? { key: "build", title: L("stepBuild") } : null,
    { key: "accessories", title: L("stepAccessories") },
  ].filter(Boolean);
  const [open, setOpen] = useState(() => new Set(["size"]));
  const refs = useRef({});
  const toggle = (key) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const goNext = (key) => {
    markDone(key);
    const nextKey = steps[steps.findIndex((s) => s.key === key) + 1]?.key;
    setOpen((prev) => {
      const next = new Set(prev);
      next.delete(key);
      if (nextKey) next.add(nextKey);
      return next;
    });
    if (nextKey) requestAnimationFrame(() => refs.current[nextKey]?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const surcharge = [
    c.height !== spec.stdHeight ? L("surchargeH", { pct: bandFor(c.height)[1] }) : null,
    !isStdWidth(c.width) ? L("surchargeW", { pct: WIDTH_PCT }) : null,
  ].filter(Boolean);
  const accCount = [c.closer, c.activeStop, c.dropSeal !== "none", c.stopper !== "none", c.reinforcement, c.spacers, !spec.order && (c.handleHole || c.cylinderHole !== "none")].filter(Boolean).length;
  const summaries = {
    size: `${c.width} × ${c.height} × ${spec.thickness} mm${surcharge.length ? ` · ${surcharge.join(", ")}` : ""}`,
    hinges: `${L(c.hinge === "left" ? "hingeLeft" : "hingeRight")}, ${L("hingesN", { n: priced.hinges })}`,
    color: `${L("frameShort")}: ${c.frameColor === "ral" ? `RAL ${c.frameRal || "?"}` : L("black").toLowerCase()} · ${L("edgeShort")}: ${
      c.edgeColor === "ral" ? `RAL ${c.edgeRal || "?"}` : L("black").toLowerCase()
    }`,
    build:
      [c.noTopFrame ? L("noTopFrame") : null, c.thinLeaf ? L("thinLeaf") : null, c.mirror !== "none" ? L(`mirror_${c.mirror}`) : null, c.handleHole ? L("handleHole") : null, c.cylinderHole !== "none" ? L(`cyl_${c.cylinderHole}`) : null]
        .filter(Boolean)
        .join(" · ") || "—",
    accessories: accCount ? priced.lines.filter((l) => ["closer", "activeStop", "dropSeal", "stopper", "reinforcement", "spacers", "handleHole", "cylinderHole"].includes(l.id)).map((l) => hiddenLineLabel(l, locale)).join(" · ") : "—",
  };

  const drillingFields = (set) => (
    <Field label={L("drilling")}>
      <CheckRow checked={c.handleHole} onChange={(v) => set({ handleHole: v })} label={L("handleHole")} price={eur(PRICES.handleHole)} />
      <div className="mt-2 text-[12px] text-muted">{L("cylinderHole")}</div>
      <div className="mt-1.5">
        <Segmented
          value={c.cylinderHole}
          onChange={(cylinderHole) => set({ cylinderHole })}
          options={[
            { value: "none", label: L("cylNone") },
            { value: "pz", label: L("cyl_pz"), hint: `+${eur(PRICES.cylinderHole)}` },
            { value: "wc", label: L("cyl_wc"), hint: `+${eur(PRICES.cylinderHole)}` },
          ]}
        />
      </div>
    </Field>
  );

  const renderStep = (key) => {
    const set = (patch) => {
      markDone(key);
      apply(patch);
    };
    switch (key) {
      case "size":
        return (
          <>
            <Field label={L("sizeStd")}>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {STD_WIDTHS.map((w) => {
                  const on = c.size === "std" && c.width === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set({ size: "std", width: w })}
                      className={`min-h-10 border px-3 text-[14px] ${on ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                    >
                      {w} × {spec.stdHeight}
                    </button>
                  );
                })}
                {spec.order ? (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={c.size === "custom"}
                    onClick={() => set({ size: "custom" })}
                    className={`min-h-10 border px-3 text-[14px] ${c.size === "custom" ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                  >
                    {L("sizeCustom")}
                  </button>
                ) : null}
              </div>
              {spec.order ? null : <p className="mt-2 text-[12px] text-muted">{L("sizeStockOnly")}</p>}
            </Field>
            {c.size === "custom" ? (
              <div className="mt-4 border-l-2 border-[color:var(--color-accent)]/30 pl-3">
                <div className="grid grid-cols-2 gap-3">
                  <MmInput label={L("width")} value={c.width} min={MIN_W} max={MAX_W} onCommit={(width) => set({ width })} locale={locale} />
                  <MmInput label={L("height")} value={c.height} min={MIN_H} max={spec.maxH} onCommit={(height) => set({ height })} locale={locale} />
                </div>
                <p className="mt-2 text-[12px] text-muted">
                  {L("sizeStepNote", { w: MAX_W, h: spec.maxH })} {L("sizeMin")}
                </p>
                {spec.thickness === 40 ? <p className="mt-1 text-[12px] text-muted">{L("size40Max")}</p> : null}
                <p className="mt-2 text-[13px] font-medium text-[color:var(--color-title)]">{surcharge.length ? surcharge.join(", ") : L("surchargeNone")}</p>
              </div>
            ) : null}
            <dl className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
              <div className="bg-[--color-soft] px-3 py-2">
                <dt className="text-[12px] text-muted">{L("frameSize")}</dt>
                <dd className="font-medium tabular-nums text-[color:var(--color-title)]">
                  {frame.w} × {frame.h} mm
                </dd>
              </div>
              <div className="bg-[--color-soft] px-3 py-2">
                <dt className="text-[12px] text-muted">{L("openingSize")}</dt>
                <dd className="font-medium tabular-nums text-[color:var(--color-title)]">
                  {opening.w} × {opening.h} mm
                </dd>
              </div>
            </dl>
          </>
        );
      case "hinges":
        return (
          <>
            <Field label={L("hingeSide")}>
              <Segmented
                value={c.hinge}
                onChange={(hinge) => set({ hinge })}
                options={[
                  { value: "left", label: L("hingeLeft") },
                  { value: "right", label: L("hingeRight") },
                ]}
              />
              <p className="mt-2 text-[12px] text-muted">{L(spec.thickness === 40 ? "hingeSideHint40" : "hingeSideHint52")}</p>
            </Field>
            <Field label={L("hingeCount")}>
              {spec.order ? (
                <>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {Array.from({ length: recommended - required + 2 }, (_, i) => i).map((extra) => {
                      const n = required + extra;
                      const on = c.extraHinges === extra;
                      return (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => set({ extraHinges: extra })}
                          className={`min-h-10 border px-3 text-left text-[14px] ${on ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/[0.06] text-[color:var(--color-title)]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                        >
                          {L("hingesN", { n })}
                          {n === recommended && recommended > required ? (
                            <span className="ml-1.5 text-[11px] font-semibold uppercase text-[color:var(--color-accent)]">{L("recommended")}</span>
                          ) : null}
                          {on ? null : <span className="ml-1.5 text-[12px] text-muted">{delta({ extraHinges: extra })}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[12px] text-muted">{L("hingeCountHint", { req: required, rec: recommended })}</p>
                </>
              ) : (
                <p className="text-[14px] text-ink">{L("hingesStock")}</p>
              )}
            </Field>
          </>
        );
      case "color": {
        const colorField = (label, kindKey, codeKey) => (
          <Field label={label}>
            <Segmented
              value={c[kindKey]}
              onChange={(v) => set({ [kindKey]: v })}
              options={[
                { value: "black", label: L("black") },
                { value: "ral", label: L("ral"), hint: `+${eur(PRICES.ral)}` },
              ]}
            />
            {c[kindKey] === "ral" ? (
              <div className="mt-2 flex items-center gap-2">
                <label className="text-[13px] text-muted" htmlFor={`${codeKey}-input`}>
                  {L("ralCode")}
                </label>
                <span className="text-[14px] text-ink">RAL</span>
                <input
                  id={`${codeKey}-input`}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="7016"
                  value={c[codeKey]}
                  onChange={(e) => set({ [codeKey]: e.target.value })}
                  className="field w-24"
                />
              </div>
            ) : null}
          </Field>
        );
        return (
          <>
            {colorField(L("frameColor"), "frameColor", "frameRal")}
            {colorField(L("edgeColor"), "edgeColor", "edgeRal")}
            <p className="mt-3 text-[12px] text-muted">{L("ralHint")}</p>
            {(c.frameColor === "ral" && !c.frameRal) || (c.edgeColor === "ral" && !c.edgeRal) ? (
              <p className="mt-1 text-[12px] text-[color:var(--color-stock-factory)]">{L("ralMissing")}</p>
            ) : null}
          </>
        );
      }
      case "build": {
        const area = leafArea(c);
        return (
          <>
            {spec.ral ? null : <p className="mb-3 text-[12px] text-muted">{L("ralOtherModels")}</p>}
            <Field label={L("mirror")} hint={L("mirrorArea", { a: area })}>
              <div role="radiogroup">
                <Choice name="hidden-mirror" checked={c.mirror === "none"} onChange={() => set({ mirror: "none" })} label={L("mirrorNone")} />
                {Object.entries(MIRRORS).map(([k, rate]) => (
                  <Choice
                    key={k}
                    name="hidden-mirror"
                    checked={c.mirror === k}
                    onChange={() => set({ mirror: k })}
                    label={L(`mirror_${k}`)}
                    hint={L("perM2", { p: rate })}
                    price={eur(area * rate)}
                  />
                ))}
              </div>
            </Field>
            <Field label={L("stepBuild")}>
              <CheckRow
                checked={c.noTopFrame}
                onChange={(v) => set({ noTopFrame: v })}
                label={L("noTopFrame")}
                hint={L("noTopFrameHint")}
                price={c.noTopFrame ? null : delta({ noTopFrame: true })}
              />
              <CheckRow checked={c.thinLeaf} onChange={(v) => set({ thinLeaf: v })} label={L("thinLeaf")} hint={L("thinLeafHint")} price={eur(PRICES.thinLeaf)} />
            </Field>
            {drillingFields(set)}
          </>
        );
      }
      case "accessories":
        return (
          <>
            {spec.order ? (
              <>
                <Field label={L("closer")}>
                  <CheckRow checked={c.closer} onChange={(v) => set({ closer: v })} label="GEZE Boxer" hint={L("closerHint")} price={eur(PRICES.closer + PRICES.closerRouting)} />
                  <CheckRow checked={c.activeStop} onChange={(v) => set({ activeStop: v })} label={L("activeStop")} hint={L("activeStopHint")} price={eur(PRICES.activeStopRouting)} />
                </Field>
                <Field label={L("dropSeal")}>
                  <div role="radiogroup">
                    <Choice name="hidden-seal" checked={c.dropSeal === "none"} onChange={() => set({ dropSeal: "none" })} label={L("dropSealNone")} />
                    {Object.entries(DROP_SEALS).map(([k, seal]) => {
                      const fit = dropSealFor(k, c.width);
                      return (
                        <Choice
                          key={k}
                          name="hidden-seal"
                          checked={c.dropSeal === k}
                          disabled={!fit}
                          onChange={() => set({ dropSeal: k })}
                          label={seal.label}
                          hint={fit ? L("dropSealLen", { len: fit.length, p: fit.price }) : L("dropSealNA")}
                          price={fit ? eur(fit.price + PRICES.dropSealRouting) : null}
                        />
                      );
                    })}
                  </div>
                </Field>
              </>
            ) : null}
            <Field label={L("stopper")} hint={L("stopperHint")}>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {["none", ...STOPPER_COLORS].map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={c.stopper === k}
                    onClick={() => set({ stopper: k })}
                    className={`inline-flex min-h-10 items-center gap-2 border px-3 text-[13px] ${c.stopper === k ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]" : "border-line text-ink hover:border-[color:var(--color-line-strong)]"}`}
                  >
                    {k === "none" ? null : <span className="h-4 w-4 ring-1 ring-black/15" style={{ background: STOPPER_HEX[k] }} />}
                    {k === "none" ? L("stopperNone") : L(`color_${k}`)}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={L("stepAccessories")}>
              <CheckRow checked={c.reinforcement} onChange={(v) => set({ reinforcement: v })} label={L("reinforcement")} hint={L("perFrame", { p: PRICES.reinforcement })} price={eur(PRICES.reinforcement)} />
              <CheckRow checked={c.spacers} onChange={(v) => set({ spacers: v })} label={L("spacers")} hint={L("perFrame", { p: PRICES.spacers })} price={eur(PRICES.spacers)} />
            </Field>
            {spec.order ? null : (
              <>
                {drillingFields(set)}
                <p className="mt-4 text-[12px] text-muted">{L("orderOnly")}</p>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 border border-line bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      <div className="border-b border-line bg-[--color-soft] px-4 py-3.5 sm:px-5">
        <h2 className="text-[17px] font-semibold text-[color:var(--color-title)]">{L("title")}</h2>
        <p className="mt-0.5 text-[13px] text-muted">{L(spec.order ? "introOrder" : "introStock")}</p>
      </div>

      {steps.map((s, i) => (
        <Step
          key={s.key}
          n={i + 1}
          title={s.title}
          summary={summaries[s.key]}
          open={open.has(s.key)}
          done={done.has(s.key)}
          onToggle={() => toggle(s.key)}
          onNext={i < steps.length - 1 ? () => goNext(s.key) : null}
          nextLabel={L("next")}
          stepRef={(el) => (refs.current[s.key] = el)}
        >
          {renderStep(s.key)}
        </Step>
      ))}

      <div className="border-t border-line bg-[--color-soft] px-4 py-4 sm:px-5">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-title)]">{L("summary")}</h3>
        <div className="mt-3 bg-white py-3">
          <LeafPreview spec={spec} config={c} hinges={priced.hinges} label={L("previewLabel", { w: c.width, h: c.height })} />
        </div>
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {priced.lines.map((line, i) => (
            <li key={`${line.id}-${i}`} className="flex items-baseline justify-between gap-3">
              <span className="text-ink">{hiddenLineLabel(line, locale)}</span>
              <span className="shrink-0 font-medium tabular-nums text-[color:var(--color-title)]">{i === 0 ? eur(line.amount) : `+${eur(line.amount)}`}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-[15px] font-semibold text-[color:var(--color-title)]">{L("total")}</span>
          <span className="text-[22px] font-semibold tabular-nums text-[color:var(--color-accent)]">{eur(priced.total)}</span>
        </div>
        {priced.onRequest.length ? (
          <p className="mt-2 text-[12px] text-[color:var(--color-stock-factory)]">
            {L("requestItems")}: {priced.onRequest.map((k) => L(`req_${k}`)).join(", ")}
          </p>
        ) : null}
        {priced.notes.length ? (
          <ul className="mt-2 space-y-1">
            {priced.notes.map((n) => (
              <li key={n} className="flex gap-1.5 text-[12px] text-muted">
                <Info size={13} className="mt-0.5 shrink-0" />
                {L(n === "rebate" ? "noteRebate" : "noteNoTopFrame")}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
