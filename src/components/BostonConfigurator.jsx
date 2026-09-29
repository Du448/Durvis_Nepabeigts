"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Info } from "lucide-react";
import {
  BOSTON_PAINT,
  DECOLUX_FULL,
  DECOLUX_INSERTS,
  SLAT_TONES,
  METAL_FINISHES,
  HARDWARE_TYPES,
  GLASS_TINTS,
  LAYOUTS,
  PANORAMIC_TINTS,
  GRILLE_TINTS,
} from "@/data/boston-config-options";
import { blockSize, casingLength, colorsForType, layoutOf, normalize, priceBoston, sizeOptions, stripSteelAllowed } from "@/lib/boston-config";
import {
  bt,
  paintName,
  metalName,
  decoluxName,
  insertName,
  glassName,
  slatName,
  hwName,
  lineLabel,
} from "@/lib/boston-config-i18n";

const eur = (n) => `${Math.round(n).toLocaleString("lv-LV")} €`;
const signed = (n) => (n > 0 ? `+${eur(n)}` : n < 0 ? `−${eur(-n)}` : "");

export function Swatch({ image, hex, label, selected, onClick, badge, size = 48 }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`relative shrink-0 border-2 p-0.5 transition-colors ${
        selected ? "border-[color:var(--color-accent)]" : "border-transparent hover:border-[color:var(--color-line-strong)]"
      }`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <span className="relative block h-full w-full overflow-hidden ring-1 ring-black/10" style={{ backgroundColor: hex || "#eee" }}>
        {image ? <Image src={image} alt="" fill sizes={`${size}px`} unoptimized className="object-cover" /> : null}
      </span>
      {selected ? (
        <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center bg-[color:var(--color-accent)] text-white">
          <Check size={11} strokeWidth={3} />
        </span>
      ) : null}
      {badge ? (
        <span className="absolute -right-1.5 -top-1.5 bg-[color:var(--color-alt)] px-1 text-[9px] font-bold leading-[14px] text-black">{badge}</span>
      ) : null}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="mb-2 text-[13px] font-medium text-[color:var(--color-title)]">
        {label}
        {hint ? <span className="font-normal text-muted"> — {hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          className={`min-h-11 border px-3 py-2 text-left text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            value === o.value
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/[0.06] text-[color:var(--color-title)]"
              : "border-line bg-white text-ink hover:border-[color:var(--color-line-strong)]"
          }`}
        >
          <span className="block font-medium">{o.label}</span>
          {o.hint ? <span className="mt-0.5 block text-[12px] leading-snug text-muted">{o.hint}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* A millimetre input that lets the visitor type freely and only clamps to
   the allowed range once they leave the field. */
export function MmInput({ label, value, min, max, onCommit, locale }) {
  const id = useId();
  const [text, setText] = useState(String(value));
  const [shown, setShown] = useState(value);
  if (shown !== value) {
    setShown(value);
    setText(String(value));
  }
  const commit = () => {
    const n = Number(text.replace(/\D/g, ""));
    onCommit(Number.isFinite(n) && n > 0 ? Math.min(max, Math.max(min, n)) : value);
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[12px] text-muted">
        {label} <span className="whitespace-nowrap">({bt(locale, "range", { min, max })})</span>
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="field w-full pr-10"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted">mm</span>
      </div>
    </div>
  );
}

const pctFromTable = (table, v) => (table.find(([max]) => v <= max) || table[table.length - 1])[1];

function MmSelect({ label, value, options, pctOf, extraOf, onChange }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[12px] text-muted">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))} className="field w-full">
        {options.map((o) => {
          const extra = extraOf?.(o);
          const pct = extra ? 0 : pctOf(o);
          return (
            <option key={o} value={o}>
              {o} mm{extra ? ` (${extra})` : pct ? ` (+${pct}%)` : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function Step({ n, title, summary, open, done, onToggle, children, onNext, nextLabel, stepRef }) {
  return (
    <section
      ref={stepRef}
      className={`border-t border-line transition-colors duration-300 first:border-t-0 ${done ? "bg-[color:var(--color-accent)]/[0.07]" : ""}`}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center text-[13px] font-semibold ${
            open || done ? "bg-[color:var(--color-accent)] text-white" : "bg-[--color-soft-2] text-[color:var(--color-title)]"
          }`}
        >
          {done && !open ? <Check size={15} strokeWidth={3} /> : n}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[color:var(--color-title)]">{title}</span>
          {!open && summary ? <span className="mt-0.5 block truncate text-[13px] text-muted">{summary}</span> : null}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="px-4 pb-5 sm:px-5">
          {children}
          {onNext ? (
            <button type="button" onClick={onNext} className="btn btn-outline-dark mt-5 min-h-10 px-5 py-2 text-[13px]">
              {nextLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/* Schematic of the door block as seen from one side: leaf (or leaves),
   side-lights and toplight in proportion, filled with the chosen finish. */
function BlockPreview({ config, fillImage, fillHex, handleHex, mirrored, label }) {
  const pid = useId().replace(/:/g, "");
  const block = blockSize(config);
  const layout = layoutOf(config);
  const W = block.width;
  const H = block.height;
  const f = 60; // frame
  const leftSide = layout.sides === 2 || (layout.sides === 1 && config.sidePos === "left");
  const rightSide = layout.sides === 2 || (layout.sides === 1 && config.sidePos === "right");
  const leftW = layout.sides === 2 ? config.sideW : leftSide ? config.sideW : 0;
  const rightW = layout.sides === 2 ? config.sideW2 : rightSide ? config.sideW : 0;
  const topH = layout.top ? config.topH : 0;
  const doorX = leftW;
  const doorY = topH;
  // Drawn as seen from outside; the inside view is the same drawing mirrored.
  // The active leaf hangs on the hinge side, its lock edge meets the passive leaf.
  const lockOnLeft = config.hinge === "right";
  const passiveW = config.leaf === "double" ? Math.round(config.width * 0.36) : 0;
  const active = lockOnLeft ? { x: doorX + passiveW, w: config.width - passiveW } : { x: doorX, w: config.width - passiveW };
  const leaves = [active];
  if (passiveW) leaves.push(lockOnLeft ? { x: doorX, w: passiveW } : { x: doorX + config.width - passiveW, w: passiveW });
  const handleX = lockOnLeft ? active.x + 110 : active.x + active.w - 110;
  const tint = GLASS_TINTS[config.panoTint]?.image;
  const glassPanels = [];
  if (leftW) glassPanels.push({ x: 0, y: topH, w: leftW, h: config.height });
  if (rightW) glassPanels.push({ x: W - rightW, y: topH, w: rightW, h: config.height });
  if (topH) glassPanels.push({ x: 0, y: 0, w: W, h: topH });

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox={`-20 -20 ${W + 40} ${H + 40}`} className="h-44 w-auto max-w-full" role="img" aria-label={label}>
        <defs>
          {fillImage ? (
            <pattern id={`fill-${pid}`} patternUnits="userSpaceOnUse" width="400" height="400">
              <image href={fillImage} width="400" height="400" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          ) : null}
          {tint ? (
            <pattern id={`glass-${pid}`} patternUnits="userSpaceOnUse" width="500" height="500">
              <image href={tint} width="500" height="500" preserveAspectRatio="xMidYMid slice" opacity="0.9" />
            </pattern>
          ) : null}
        </defs>
        <g transform={mirrored ? `translate(${W},0) scale(-1,1)` : undefined}>
          <rect x={0} y={0} width={W} height={H} fill={fillHex} stroke="#1f1f1f" strokeWidth="14" />
          {glassPanels.map((p, i) => (
            <rect key={i} x={p.x + f} y={p.y + f} width={Math.max(0, p.w - 2 * f)} height={Math.max(0, p.h - 2 * f)} fill={tint ? `url(#glass-${pid})` : "#cfd8dc"} stroke="#111" strokeWidth="10" />
          ))}
          {leaves.map((l, i) => (
            <rect
              key={i}
              x={l.x + f}
              y={doorY + f}
              width={l.w - 2 * f}
              height={config.height - f - 10}
              fill={fillImage ? `url(#fill-${pid})` : fillHex}
              stroke="#111"
              strokeWidth="10"
            />
          ))}
          <rect
            x={handleX - 22}
            y={doorY + config.height * 0.38}
            width="44"
            height={Math.min(620, config.height * 0.3)}
            fill={handleHex}
            stroke="#000"
            strokeWidth="6"
          />
        </g>
      </svg>
      <figcaption className="mt-1 text-[12px] text-muted">{label}</figcaption>
    </figure>
  );
}

export default function BostonConfigurator({ spec, config, onChange, locale }) {
  const c = normalize(spec, config);
  const apply = (patch) => onChange(normalize(spec, { ...c, ...patch }));
  // Steps the visitor has actually made a choice in (or confirmed with "Next").
  const [done, setDone] = useState(() => new Set());
  const markDone = (key) => setDone((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  const priced = priceBoston(spec, c);
  const priceOf = (patch) => priceBoston(spec, { ...c, ...patch }).total;
  const f = spec.features;
  const R = spec.rules;
  const sizes = sizeOptions(spec, c.leaf);
  const layout = layoutOf(c);
  const block = blockSize(c);
  const L = (k, v) => bt(locale, k, v);

  const steps = [
    { key: "size", title: L("stepSize") },
    { key: "opening", title: L("stepOpening") },
    { key: "exterior", title: L("stepExterior") },
    { key: "interior", title: L("stepInterior") },
    spec.glass ? { key: "glass", title: L("stepGlass") } : null,
    { key: "hardware", title: L("stepHardware") },
    R.casings.length || (f.bottomPlate && R.bottomPlatePerM) || (f.capital && R.glazing) ? { key: "extras", title: L("stepExtras") } : null,
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
    const idx = steps.findIndex((s) => s.key === key);
    const nextKey = steps[idx + 1]?.key;
    setOpen((prev) => {
      const next = new Set(prev);
      next.delete(key);
      if (nextKey) next.add(nextKey);
      return next;
    });
    if (nextKey) requestAnimationFrame(() => refs.current[nextKey]?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const paint = (k) => BOSTON_PAINT.find((p) => p.key === k);
  const slatImage = (v) => SLAT_TONES.find((s) => `tone:${s.key}` === v)?.image || null;
  const extFill =
    spec.series === "decolux"
      ? { image: DECOLUX_FULL.find((d) => d.key === c.ext)?.image, hex: "#5a3d26" }
      : spec.series === "inserts"
        ? { image: DECOLUX_INSERTS.find((d) => d.key === c.insertExt)?.image, hex: paint(c.ext)?.hex }
        : { image: f.slatsExt ? slatImage(c.slatExt) : null, hex: paint(c.ext)?.hex };
  const intFillImage = f.slatsInt ? slatImage(c.slatInt) : f.insertInt ? DECOLUX_INSERTS.find((d) => d.key === c.insertInt)?.image : null;
  const frameHexExt = spec.series === "decolux" ? "#3b2a1c" : paint(c.ext)?.hex;
  const handleHex = METAL_FINISHES[c.hwColor]?.hex || "#1e1e1e";

  const extSummary = [
    spec.series === "decolux" ? `Decolux ${decoluxName(c.ext, locale)}` : paintName(c.ext, locale),
    f.slatsExt ? slatName(c.slatExt, locale) : null,
    spec.series === "inserts" ? insertName(c.insertExt, locale) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const summaries = {
    size: `${L(c.leaf === "double" ? "leafDouble" : "leafSingle")}, ${c.width} × ${c.height} mm${layout.key !== "1" ? ` · ${L(`layout${layout.key}`)}` : ""}`,
    opening: `${L(c.hinge === "left" ? "hingeLeft" : "hingeRight")}, ${L(c.opening === "in" ? "openIn" : "openOut").toLowerCase()}`,
    exterior: extSummary,
    interior: [paintName(c.int, locale), f.slatsInt ? slatName(c.slatInt, locale) : null].filter(Boolean).join(" · "),
    glass: glassName(c.glass, locale),
    hardware: c.hw ? hwName(c.hw, c.hwColor, locale) : "«CBA» PSL-2",
    extras: [c.casing !== "none" ? L(`casing_${c.casing}`) : null, c.bottomPlate ? L("bottomPlate") : null, c.eStrike ? L("eStrike") : null].filter(Boolean).join(" · ") || "—",
  };

  const paintSwatches = (value, onPick) => (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {spec.palette.map((p) => (
        <Swatch
          key={p.key}
          image={p.image}
          hex={p.hex}
          label={`${paintName(p.key, locale)}${p.premium ? ` (${L("premium", { pct: R.premiumPct })})` : ""}`}
          selected={value === p.key}
          onClick={() => onPick(p.key)}
          badge={p.premium ? `+${R.premiumPct}%` : null}
        />
      ))}
    </div>
  );
  const slatPicker = (value, onPick) => (
    <>
      <div className="mb-1 text-[12px] text-muted">{L("slatTones")}</div>
      <div className="flex flex-wrap gap-1.5" role="radiogroup">
        {SLAT_TONES.map((s) => (
          <Swatch key={s.key} image={s.image} label={slatName(`tone:${s.key}`, locale)} selected={value === `tone:${s.key}`} onClick={() => onPick(`tone:${s.key}`)} />
        ))}
      </div>
      <div className="mb-1 mt-3 text-[12px] text-muted">{L("slatPaint")}</div>
      {paintSwatches(value?.startsWith("paint:") ? value.slice(6) : null, (k) => onPick(`paint:${k}`))}
    </>
  );
  const metalPicker = (value, keys, onPick, disabled = []) => (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={value === k}
          disabled={disabled.includes(k)}
          onClick={() => onPick(k)}
          className={`inline-flex min-h-10 items-center gap-2 border px-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-40 ${
            value === k ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]" : "border-line text-ink hover:border-[color:var(--color-line-strong)]"
          }`}
        >
          <span className="h-4 w-4 ring-1 ring-black/15" style={{ background: METAL_FINISHES[k].hex }} />
          {metalName(k, locale)}
        </button>
      ))}
    </div>
  );
  const selectedName = (text) => <p className="mt-2 text-[13px] text-muted">{text}</p>;

  const renderStep = (key) => {
    const set = (patch) => {
      markDone(key);
      apply(patch);
    };
    switch (key) {
      case "size":
        return (
          <>
            <Field label={L("dType")}>
              <Segmented
                value={c.leaf}
                onChange={(leaf) => set({ leaf, size: "std" })}
                options={[
                  {
                    value: "single",
                    label: L("leafSingle"),
                    hint: R.customSize
                      ? L("leafSingleHint", { w: sizeOptions(spec, "single").widths?.at(-1) ?? R.single.maxW, h: R.single.maxH })
                      : L("leafSingleStdHint", { w: spec.widths.join(" / "), h: R.stdH }),
                  },
                  {
                    value: "double",
                    label: L("leafDouble"),
                    hint: R.customSize
                      ? L("leafDoubleHint", { w1: sizeOptions(spec, "double").widths[0], w2: R.double.maxW, h: R.double.maxH })
                      : L("leafDoubleStdHint", { w: R.double.stdW, h: R.stdH }),
                  },
                ]}
              />
            </Field>
            <Field label={L("dSize")}>
              <div className="flex flex-wrap gap-2">
                {(c.leaf === "double" ? [R.double.stdW] : spec.widths).map((w) => {
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
                      {w} × {R.stdH}
                    </button>
                  );
                })}
                {R.customSize ? (
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
              {R.customSize ? null : <p className="mt-2 text-[12px] text-muted">{L("sizeStdOnly")}</p>}
              {c.size === "custom" ? (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {sizes.widths ? (
                      <MmSelect
                        label={L("width")}
                        value={c.width}
                        options={sizes.widths}
                        pctOf={(w) =>
                          c.leaf === "double"
                            ? w <= R.double.stdW && spec.variants.some((v) => v.double)
                              ? 0
                              : pctFromTable(R.double.widthPct, w)
                            : R.single.widths?.find(([x]) => x === w)?.[1] ?? 0
                        }
                        extraOf={
                          c.leaf === "double"
                            ? (w) => (w > R.double.stdW ? signed(priceOf({ width: w }) - priceOf({ width: R.double.stdW })) : "")
                            : undefined
                        }
                        onChange={(width) => set({ width })}
                      />
                    ) : (
                      <MmInput label={L("width")} value={c.width} min={sizes.minW} max={sizes.maxW} onCommit={(width) => set({ width })} locale={locale} />
                    )}
                    <MmSelect label={L("height")} value={c.height} options={sizes.heights} pctOf={(h) => pctFromTable(R.heightPct, h)} onChange={(height) => set({ height })} />
                  </div>
                  <p className="mt-2 text-[12px] text-muted">{L("sizeStepNote")}</p>
                </>
              ) : null}
            </Field>
            {R.glazing ? (
            <Field label={L("layoutTitle")}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    role="radio"
                    aria-checked={c.layout === l.key}
                    onClick={() => set({ layout: l.key })}
                    className={`flex flex-col items-center border p-1.5 text-center ${c.layout === l.key ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/[0.05]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                  >
                    <span className="relative block h-16 w-full">
                      <Image src={l.image} alt="" fill sizes="80px" unoptimized className="object-contain" />
                    </span>
                    <span className="mt-1 text-[11px] leading-tight text-ink">{L(`layout${l.key}`)}</span>
                  </button>
                ))}
              </div>
              {layout.key !== "1" ? (
                <div className="mt-3 space-y-3 border-l-2 border-[color:var(--color-accent)]/30 pl-3">
                  {layout.sides === 1 ? (
                    <div className="flex flex-wrap items-center gap-2 text-[13px]">
                      <span className="text-muted">{L("sidePos")}:</span>
                      {["left", "right"].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          role="radio"
                          aria-checked={c.sidePos === pos}
                          onClick={() => set({ sidePos: pos })}
                          className={`min-h-9 border px-3 ${c.sidePos === pos ? "border-[color:var(--color-accent)]" : "border-line"}`}
                        >
                          {L(pos === "left" ? "posLeft" : "posRight")}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-3">
                    {layout.sides >= 1 ? (
                      <MmInput label={L(layout.sides === 2 ? "sideWLeft" : "sideW")} value={c.sideW} min={R.glazingMin} max={R.glazingMax} onCommit={(sideW) => set({ sideW })} locale={locale} />
                    ) : null}
                    {layout.sides === 2 ? (
                      <MmInput label={L("sideWRight")} value={c.sideW2} min={R.glazingMin} max={R.glazingMax} onCommit={(sideW2) => set({ sideW2 })} locale={locale} />
                    ) : null}
                    {layout.top ? (
                      <MmInput label={L("topH")} value={c.topH} min={R.glazingMin} max={R.glazingMax} onCommit={(topH) => set({ topH })} locale={locale} />
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-1 text-[12px] text-muted">{L("panoTint")}</div>
                    <div className="flex flex-wrap gap-1.5" role="radiogroup">
                      {[
                        ...PANORAMIC_TINTS.map((k) => ({ k, grille: false, image: GLASS_TINTS[k].image, label: glassName(k, locale) })),
                        ...Object.entries(GRILLE_TINTS).map(([k, image]) => ({ k, grille: true, image, label: `${glassName(k, locale)} ${L("grilleShort")}` })),
                      ].map((o) => (
                        <Swatch
                          key={`${o.k}-${o.grille}`}
                          image={o.image}
                          label={o.label}
                          selected={c.panoTint === o.k && c.panoGrille === o.grille}
                          onClick={() => set({ panoTint: o.k, panoGrille: o.grille })}
                        />
                      ))}
                    </div>
                    {selectedName(`${glassName(c.panoTint, locale)}${c.panoGrille ? ` ${L("grilleShort")}` : ""}`)}
                    {c.panoGrille && R.grilleOnRequest ? <p className="mt-1 text-[12px] text-muted">{L("panoGrille")} ({L("onRequest")})</p> : null}
                  </div>
                  <p className="text-[13px] font-medium text-[color:var(--color-title)]">{L("blockSize", { w: block.width, h: block.height })}</p>
                </div>
              ) : null}
            </Field>
            ) : null}
          </>
        );
      case "opening":
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
            </Field>
            <Field label={L("openDir")}>
              <Segmented
                value={c.opening}
                onChange={(opening) => set({ opening })}
                options={[
                  { value: "out", label: L("openOut") },
                  { value: "in", label: L("openIn"), hint: spec.smart ? null : signed(priceOf({ opening: "in" }) - priceOf({ opening: "out" })), disabled: spec.smart },
                ]}
              />
              <p className="mt-2 text-[12px] text-muted">{L(spec.smart ? "openInSmart" : "openInHint")}</p>
            </Field>
          </>
        );
      case "exterior":
        return (
          <>
            {spec.series === "decolux" ? (
              <Field label={L("decolux")}>
                <div className="flex flex-wrap gap-1.5" role="radiogroup">
                  {DECOLUX_FULL.map((d) => (
                    <Swatch key={d.key} image={d.image} label={decoluxName(d.key, locale)} selected={c.ext === d.key} onClick={() => set({ ext: d.key })} size={56} />
                  ))}
                </div>
                {selectedName(decoluxName(c.ext, locale))}
                <p className="mt-1 text-[12px] text-muted">{L("decoluxNote")}</p>
              </Field>
            ) : (
              <Field label={L("extPaint")}>
                {paintSwatches(c.ext, (ext) => set({ ext }))}
                {selectedName(paintName(c.ext, locale))}
              </Field>
            )}
            {spec.series === "inserts" ? (
              <Field label={L("insertExt")}>
                <div className="flex flex-wrap gap-1.5" role="radiogroup">
                  {DECOLUX_INSERTS.map((d) => (
                    <Swatch key={d.key} image={d.image} label={insertName(d.key, locale)} selected={c.insertExt === d.key} onClick={() => set({ insertExt: d.key })} />
                  ))}
                </div>
                {selectedName(insertName(c.insertExt, locale))}
              </Field>
            ) : null}
            {f.slatsExt ? (
              <Field label={L("slatExt")}>
                {slatPicker(c.slatExt, (slatExt) => set({ slatExt }))}
                {selectedName(slatName(c.slatExt, locale))}
              </Field>
            ) : null}
            {f.decorStrip ? (
              <Field label={L("strip")}>
                {metalPicker(c.strip, ["black", "steel"], (strip) => set({ strip }), stripSteelAllowed(c) ? [] : ["steel"])}
                <p className="mt-1.5 text-[12px] text-muted">{L("stripSteelNote")}</p>
              </Field>
            ) : null}
            {f.knocker ? (
              <Field label={L("knocker")}>{metalPicker(c.knocker, f.knockerBlackOnly ? ["black"] : ["black", "gold", "bronze"], (knocker) => set({ knocker }))}</Field>
            ) : null}
            {f.forging ? <Field label={L("forging")}>{metalPicker(c.forging, ["black", "gold", "bronze"], (forging) => set({ forging }))}</Field> : null}
            {f.lacobel ? <p className="mt-4 text-[13px] text-muted">{L("lacobel")}</p> : null}
          </>
        );
      case "interior":
        return (
          <>
            <Field label={L("intPaint")}>
              {spec.series !== "decolux" ? (
                <button
                  type="button"
                  onClick={() => set({ int: c.ext })}
                  disabled={c.int === c.ext}
                  className="mb-2 inline-flex min-h-9 items-center gap-1.5 border border-line px-3 text-[13px] text-ink hover:border-[color:var(--color-line-strong)] disabled:opacity-50"
                >
                  {c.int === c.ext ? <Check size={14} /> : null}
                  {L("sameAsExt")}
                </button>
              ) : null}
              {paintSwatches(c.int, (int) => set({ int }))}
              {selectedName(paintName(c.int, locale))}
              <p className="mt-1 text-[12px] text-muted">{L("twoTone")}</p>
            </Field>
            {f.insertInt ? (
              <Field label={L("insertInt")}>
                <div className="flex flex-wrap gap-1.5" role="radiogroup">
                  {DECOLUX_INSERTS.map((d) => (
                    <Swatch key={d.key} image={d.image} label={insertName(d.key, locale)} selected={c.insertInt === d.key} onClick={() => set({ insertInt: d.key })} />
                  ))}
                </div>
                {selectedName(insertName(c.insertInt, locale))}
              </Field>
            ) : null}
            {f.slatsInt ? (
              <Field label={L("slatInt")}>
                {slatPicker(c.slatInt, (slatInt) => set({ slatInt }))}
                {selectedName(slatName(c.slatInt, locale))}
              </Field>
            ) : null}
            {f.mirror ? <p className="mt-4 text-[13px] text-muted">{L("mirrorInt")}</p> : null}
          </>
        );
      case "glass":
        return (
          <Field label={spec.glass.options.length > 1 ? L("glassPick") : L("glassFixed")} hint={spec.glass.code || null}>
            <div className="flex flex-wrap gap-2" role="radiogroup">
              {spec.glass.options.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={c.glass === k}
                  onClick={() => set({ glass: k })}
                  className={`flex w-24 flex-col items-center border p-1.5 ${c.glass === k ? "border-[color:var(--color-accent)]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                >
                  <span className="relative block h-16 w-full bg-[--color-soft]">
                    {GLASS_TINTS[k]?.image ? (
                      <Image src={GLASS_TINTS[k].image} alt="" fill sizes="96px" unoptimized className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-gradient-to-br from-sky-200 via-amber-100 to-rose-200 text-[10px] text-ink/70">UV</span>
                    )}
                  </span>
                  <span className="mt-1 text-[12px] text-ink">{glassName(k, locale)}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-muted">
              {[spec.glass.mirror ? L("glassMirror") : null, spec.glass.grille ? L("glassGrille") : null].filter(Boolean).join(", ")}
              {spec.glass.mirror || spec.glass.grille ? ". " : ""}
              {L("glassInfo")}
            </p>
          </Field>
        );
      case "hardware":
        if (!spec.types.length) {
          return <p className="text-[14px] text-ink">{spec.smart ? L("hwSmart") : L("hwIncluded")}</p>;
        }
        return (
          <>
            <Field label={L("hwType")}>
              <div className={`grid grid-cols-1 gap-2 ${spec.types.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {spec.types.map((type) => {
                  const def = HARDWARE_TYPES[type];
                  const colors = colorsForType(spec, type);
                  const color = type === c.hw ? c.hwColor : colors[0];
                  const img = def.images[color] || Object.values(def.images)[0];
                  const delta = type === c.hw ? 0 : priceOf({ hw: type, hwColor: colors[0] }) - priced.total;
                  const on = type === c.hw;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set({ hw: type, hwColor: colors.includes(c.hwColor) ? c.hwColor : colors[0] })}
                      className={`flex gap-3 border p-2.5 text-left transition-colors ${on ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/[0.05]" : "border-line bg-white hover:border-[color:var(--color-line-strong)]"}`}
                    >
                      <span className="relative h-20 w-20 shrink-0 bg-[--color-soft]">
                        {img ? (
                          <Image src={img} alt="" fill sizes="80px" unoptimized className="object-contain p-1" />
                        ) : (
                          <span className="flex h-full items-center justify-center px-1 text-center text-[10px] leading-tight text-muted">{def.label}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-[14px] font-semibold text-[color:var(--color-title)]">{def.label}</span>
                          <span className={`text-[13px] font-medium ${on ? "text-[color:var(--color-accent)]" : "text-ink"}`}>{on ? <Check size={16} /> : signed(delta) || "±0 €"}</span>
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted">{def.desc[locale] || def.desc.lv}</span>
                        {def.onOrder ? <span className="mt-1 inline-block bg-[color:var(--color-stock-order-soft)] px-1.5 text-[10px] font-semibold uppercase text-[color:var(--color-stock-order)]">{L("hwOnOrder")}</span> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
            {colorsForType(spec, c.hw).length > 1 ? (
              <Field label={L("hwColor")}>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {colorsForType(spec, c.hw).map((k) => {
                    const delta = k === c.hwColor ? 0 : priceOf({ hwColor: k }) - priced.total;
                    return (
                      <button
                        key={k}
                        type="button"
                        role="radio"
                        aria-checked={c.hwColor === k}
                        onClick={() => set({ hwColor: k })}
                        className={`inline-flex min-h-10 items-center gap-2 border px-3 text-[13px] ${c.hwColor === k ? "border-[color:var(--color-accent)] text-[color:var(--color-title)]" : "border-line hover:border-[color:var(--color-line-strong)]"}`}
                      >
                        <span className="h-4 w-4 ring-1 ring-black/15" style={{ background: METAL_FINISHES[k].hex }} />
                        {metalName(k, locale)}
                        {delta ? <span className="text-muted">{signed(delta)}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </Field>
            ) : null}
            <p className="mt-3 text-[12px] text-muted">{L(spec.smart ? "hwSmart" : "hwIncluded")}</p>
            {HARDWARE_TYPES[c.hw]?.latch ? (
              <label className="mt-3 flex items-center gap-2 text-[13px] text-ink">
                <input type="checkbox" checked={c.eStrike} onChange={(e) => set({ eStrike: e.target.checked })} className="h-4 w-4 accent-[color:var(--color-accent)]" />
                {L("eStrike")} <span className="text-muted">({L("onRequest")})</span>
              </label>
            ) : null}
          </>
        );
      case "extras": {
        const casingM = casingLength(block);
        const capM = Math.round(((block.width - c.width) / 1000) * 100) / 100;
        const plateM = Math.round((c.width / 1000) * 100) / 100;
        return (
          <div className="space-y-4">
            <Field label={L("casingTitle")}>
              <div className="space-y-2" role="radiogroup">
                {[{ key: "none" }, ...R.casings].map((k) => (
                  <label key={k.key} className="flex items-start gap-2 text-[14px] text-ink">
                    <input
                      type="radio"
                      name="boston-casing"
                      checked={c.casing === k.key}
                      onChange={() => set({ casing: k.key })}
                      className="mt-1 h-4 w-4 accent-[color:var(--color-accent)]"
                    />
                    <span>
                      {L(k.key === "none" ? "casingNone" : `casing_${k.key}`)}
                      {k.perM ? (
                        <span className="block text-[12px] text-muted">
                          {L("perMeter", { m: casingM, p: k.perM })} = {eur(casingM * k.perM)}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
            {f.bottomPlate && R.bottomPlatePerM ? (
              <div>
                <label className="flex items-start gap-2 text-[14px] text-ink">
                  <input type="checkbox" checked={c.bottomPlate} onChange={(e) => set({ bottomPlate: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[color:var(--color-accent)]" />
                  <span>
                    {L("bottomPlate")}
                    <span className="block text-[12px] text-muted">
                      {L("perMeter", { m: plateM, p: R.bottomPlatePerM })} = {eur(plateM * R.bottomPlatePerM)} · {L("bottomPlateHint")}
                    </span>
                  </span>
                </label>
                {c.bottomPlate ? <div className="ml-6 mt-2">{metalPicker(c.plateColor, ["black", "steel"], (plateColor) => set({ plateColor }))}</div> : null}
              </div>
            ) : null}
            {f.capital && block.sides ? (
              <label className="flex items-start gap-2 text-[14px] text-ink">
                <input type="checkbox" checked={c.capitalExtend} onChange={(e) => set({ capitalExtend: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[color:var(--color-accent)]" />
                <span>
                  {L("capitalExtend")}
                  <span className="block text-[12px] text-muted">
                    +{L("perMeter", { m: capM, p: R.capitalPerM })} = {eur(capM * R.capitalPerM)}
                  </span>
                </span>
              </label>
            ) : null}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 border border-line bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      <div className="border-b border-line bg-[--color-soft] px-4 py-3.5 sm:px-5">
        <h2 className="text-[17px] font-semibold text-[color:var(--color-title)]">{L("title")}</h2>
        <p className="mt-0.5 text-[13px] text-muted">{L("intro")}</p>
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
        <div className="mt-3 grid grid-cols-2 gap-2 bg-white py-3">
          <BlockPreview config={c} fillImage={extFill.image} fillHex={frameHexExt || extFill.hex} handleHex={handleHex} label={L("dExt")} />
          <BlockPreview config={c} fillImage={intFillImage} fillHex={paint(c.int)?.hex} handleHex={handleHex} mirrored label={L("dInt")} />
        </div>
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {priced.lines.map((line, i) => (
            <li key={`${line.id}-${i}`} className="flex items-baseline justify-between gap-3">
              <span className="text-ink">{lineLabel(line, locale)}</span>
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
            {L("requestItems")}: {priced.onRequest.map((k) => (k === "eStrike" ? L("eStrike") : L("panoGrille"))).join(", ")}
          </p>
        ) : null}
        {priced.notes.length ? (
          <ul className="mt-2 space-y-1">
            {priced.notes.map((n) => (
              <li key={n} className="flex gap-1.5 text-[12px] text-muted">
                <Info size={13} className="mt-0.5 shrink-0" />
                {L(n === "twoK" ? "noteTwoK" : n === "hinges" ? "noteHinges" : "noteCastCasing")}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
