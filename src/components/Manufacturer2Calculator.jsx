"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import {
  CURRENCY,
  basePurposes,
  baseSizes,
  openingDirections,
  openingSides,
  doorTiers,
  lockSets,
  furnitureOptions,
  peepholeOptions,
  additionalOptions,
} from "@/data/manufacturer2Calculator";
import { manufacturer2Sections } from "@/data/manufacturer2";

/* Ražotājs-2 door calculator: a from-scratch analog of the manufacturer's own
   calculator (bulat-doors.com.ua/calculator/) — base filters, matching
   product tiers, then a per-tier configurator (locks, hardware colour, leaf
   design/colour outside+inside, frame coating, peephole, extra options).
   Prices are still the manufacturer's own reference figures (see data file);
   the summary is deliberately framed as a request, not a checkout total. */

function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Money({ value }) {
  return (
    <span>
      {value.toLocaleString("lv-LV")} {CURRENCY}
    </span>
  );
}

function SwatchGrid({ items, selected, onSelect, columns = "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" }) {
  return (
    <div className={`grid ${columns} gap-3`}>
      {items.map((item) => {
        const isActive = selected === item.image;
        return (
          <button
            key={item.image}
            type="button"
            onClick={() => onSelect(item)}
            className={`group block text-left ${isActive ? "" : ""}`}
          >
            <span
              className={`relative block aspect-square overflow-hidden border-2 bg-white ${
                isActive ? "border-[color:var(--color-accent)]" : "border-line"
              }`}
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                unoptimized
                loading="lazy"
                sizes="140px"
                className="object-cover"
              />
            </span>
            <span className={`mt-1.5 block text-[12px] leading-snug ${isActive ? "font-semibold text-[color:var(--color-accent)]" : "text-ink"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DesignPicker({ label, groups, seriesTitle, onSeriesChange, designImage, onDesignChange }) {
  const group = groups.find((g) => g.title === seriesTitle) || groups[0];
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="t-widget text-[color:var(--color-title)]">{label}</h4>
        <select
          value={group.title}
          onChange={(e) => {
            const g = groups.find((x) => x.title === e.target.value);
            onSeriesChange(e.target.value);
            onDesignChange(g.items[0]);
          }}
          className="border border-line bg-white px-3 py-1.5 text-[13px]"
        >
          {groups.map((g) => (
            <option key={g.title} value={g.title}>
              {g.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <SwatchGrid items={group.items} selected={designImage} onSelect={onDesignChange} />
      </div>
    </div>
  );
}

function FilmPicker({ label, groups, groupTitle, onGroupChange, filmImage, onFilmChange }) {
  const group = groups.find((g) => g.title === groupTitle) || groups[0];
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="t-widget text-[color:var(--color-title)]">{label}</h4>
        {groups.length > 1 ? (
          <select
            value={group.title}
            onChange={(e) => {
              const g = groups.find((x) => x.title === e.target.value);
              onGroupChange(e.target.value);
              onFilmChange(g.items[0]);
            }}
            className="border border-line bg-white px-3 py-1.5 text-[13px]"
          >
            {groups.map((g) => (
              <option key={g.title} value={g.title}>
                {g.title}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <div className="mt-4 max-h-[340px] overflow-y-auto pr-1">
        <SwatchGrid items={group.items} selected={filmImage} onSelect={onFilmChange} />
      </div>
    </div>
  );
}

export default function Manufacturer2Calculator() {
  const [step, setStep] = useState("filter");

  const [filterPurpose, setFilterPurpose] = useState(new Set());
  const [filterSize, setFilterSize] = useState(new Set());
  const [filterDirection, setFilterDirection] = useState(new Set());
  const [filterSide, setFilterSide] = useState(new Set());

  const [selectedTierId, setSelectedTierId] = useState(null);

  const dizainsSection = manufacturer2Sections.find((s) => s.key === "dizains");
  const krasasSection = manufacturer2Sections.find((s) => s.key === "krasas");
  const ralSection = manufacturer2Sections.find((s) => s.key === "ral");

  const selectedTier = doorTiers.find((t) => t.id === selectedTierId) || null;

  const filmGroupsForTier = useMemo(() => {
    if (!selectedTier) return krasasSection.groups;
    return selectedTier.target === "house"
      ? krasasSection.groups.filter((g) => g.title.includes("ielas"))
      : krasasSection.groups.filter((g) => g.title.includes("dzīvoklī"));
  }, [selectedTier, krasasSection]);

  const [config, setConfig] = useState(null);

  const resetFilters = () => {
    setFilterPurpose(new Set());
    setFilterSize(new Set());
    setFilterDirection(new Set());
    setFilterSide(new Set());
  };

  const matchingTiers = useMemo(() => {
    return doorTiers.filter((tier) => {
      if (filterPurpose.size && !filterPurpose.has(tier.target)) return false;
      if (filterDirection.size) {
        const wantsOutside = filterDirection.has("outside");
        const wantsInside = filterDirection.has("inside");
        if (wantsOutside && !tier.canOpenOutside) return false;
        if (wantsInside && !tier.canOpenInside) return false;
      }
      if (filterSize.size) {
        const wantsCustom = filterSize.has("custom");
        const wantsFixed = [...filterSize].some((v) => v !== "custom");
        const hasFixedMatch = tier.sizes.some((s) => filterSize.has(String(s.w)));
        const hasCustomMatch = wantsCustom && tier.customSizeSupported;
        if (!(hasFixedMatch || hasCustomMatch)) return false;
        if (wantsFixed && !hasFixedMatch && !hasCustomMatch) return false;
      }
      return true;
    });
  }, [filterPurpose, filterDirection, filterSize]);

  const startConfiguring = (tier) => {
    const defaultFilm = filmGroupsForTierFor(tier).groups[0].items[0];
    const defaultDesign = dizainsSection.groups[0].items[0];
    const defaultRalGroup = ralSection.groups[0];
    setSelectedTierId(tier.id);
    setConfig({
      size: tier.sizes[0] || { w: null, h: null, price: tier.basePrice || 0 },
      openingDirection: tier.canOpenOutside ? "outside" : "inside",
      openingSide: "left",
      lockIds: new Set(),
      furnitureId: "black-matte",
      outerSeriesTitle: dizainsSection.groups[0].title,
      outerDesign: defaultDesign,
      innerSeriesTitle: dizainsSection.groups[0].title,
      innerDesign: defaultDesign,
      outerFilmGroupTitle: filmGroupsForTierFor(tier).groups[0].title,
      outerFilm: defaultFilm,
      innerFilmGroupTitle: filmGroupsForTierFor(tier).groups[0].title,
      innerFilm: defaultFilm,
      frameGroupTitle: defaultRalGroup.title,
      frameSwatch: defaultRalGroup.items[0],
      peepholeId: "standard",
      extraOptions: new Set(),
    });
    setStep("configure");
  };

  function filmGroupsForTierFor(tier) {
    return {
      groups:
        tier.target === "house"
          ? krasasSection.groups.filter((g) => g.title.includes("ielas"))
          : krasasSection.groups.filter((g) => g.title.includes("dzīvoklī")),
    };
  }

  const total = useMemo(() => {
    if (!selectedTier || !config) return 0;
    let sum = config.size?.price ?? selectedTier.basePrice ?? 0;
    const lockSet = lockSets[selectedTier.lockSet] || [];
    for (const lockId of config.lockIds) {
      const lock = lockSet.find((l) => l.id === lockId);
      if (lock) sum += lock.price;
    }
    const peephole = peepholeOptions.find((p) => p.id === config.peepholeId);
    if (peephole) sum += peephole.price;
    for (const optId of config.extraOptions) {
      const opt = additionalOptions.find((o) => o.id === optId);
      if (opt) sum += opt.price;
    }
    return sum;
  }, [selectedTier, config]);

  /* Step 1 — base filters */
  if (step === "filter") {
    return (
      <div className="container py-12 lg:py-16">
        <div className="max-w-[760px]">
          <h2 className="t-section">Durvju kalkulators</h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink">
            Atzīmē vēlamos pamatparametrus — piedāvāsim sērijas, kas atbilst tieši Tavam pieprasījumam. Cenas ir
            mazumtirdzniecības cenas, kas spēkā no 01.08.2024.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="t-widget mb-3 text-[color:var(--color-title)]">Durvju pielietojums</h3>
            <div className="space-y-2">
              {basePurposes.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-[14px] text-ink">
                  <input
                    type="checkbox"
                    checked={filterPurpose.has(p.id)}
                    onChange={() => setFilterPurpose((s) => toggleInSet(s, p.id))}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="t-widget mb-3 text-[color:var(--color-title)]">Vēlamais izmērs</h3>
            <div className="space-y-2">
              {baseSizes.map((s) => {
                const value = s.w ? String(s.w) : "custom";
                return (
                  <label key={value} className="flex items-center gap-2 text-[14px] text-ink">
                    <input
                      type="checkbox"
                      checked={filterSize.has(value)}
                      onChange={() => setFilterSize((set) => toggleInSet(set, value))}
                    />
                    {s.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="t-widget mb-3 text-[color:var(--color-title)]">Vēršanās virziens</h3>
            <div className="space-y-2">
              {openingDirections.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-[14px] text-ink">
                  <input
                    type="checkbox"
                    checked={filterDirection.has(d.id)}
                    onChange={() => setFilterDirection((s) => toggleInSet(s, d.id))}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="t-widget mb-3 text-[color:var(--color-title)]">Vēršanās puse</h3>
            <div className="space-y-2">
              {openingSides.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-[14px] text-ink">
                  <input
                    type="checkbox"
                    checked={filterSide.has(d.id)}
                    onChange={() => setFilterSide((s) => toggleInSet(s, d.id))}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={resetFilters} className="border border-line px-6 py-3 text-[14px] font-medium text-ink hover:border-[color:var(--color-accent)]">
            Notīrīt filtru
          </button>
          <button
            type="button"
            onClick={() => setStep("results")}
            className="bg-[color:var(--color-accent)] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-90"
          >
            Atlasīt durvis
          </button>
        </div>
      </div>
    );
  }

  /* Step 2 — matching tiers */
  if (step === "results") {
    return (
      <div className="container py-12 lg:py-16">
        <button
          type="button"
          onClick={() => setStep("filter")}
          className="mb-6 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
        >
          <ChevronLeft size={16} /> Atpakaļ
        </button>

        <h2 className="t-section">Šīs sērijas atbilst Tavam pieprasījumam</h2>
        <p className="mt-2 text-[13px] text-muted">{matchingTiers.length} sērijas</p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matchingTiers.map((tier) => {
            const minPrice = tier.sizes.length ? Math.min(...tier.sizes.map((s) => s.price)) : tier.basePrice;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => startConfiguring(tier)}
                className="group flex flex-col border border-line bg-white text-left transition-colors hover:border-[color:var(--color-accent)]"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-[--color-soft]">
                  <Image src={tier.image} alt={tier.name} fill unoptimized sizes="360px" className="object-cover" />
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="t-widget text-[color:var(--color-title)]">{tier.name}</span>
                  <span className="mt-1 text-[13px] text-muted">
                    {tier.sizeNote || tier.sizes.map((s) => `${s.w}×${s.h}`).join(", ")}
                  </span>
                  <span className="mt-1 text-[13px] text-muted">
                    {tier.target === "house" ? "Durvis privātmājai" : "Durvis dzīvoklim"}
                  </span>
                  <span className="mt-3 text-[15px] font-semibold text-[color:var(--color-accent)]">
                    no <Money value={minPrice} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {matchingTiers.length === 0 ? (
          <p className="mt-8 text-[14px] text-muted">Neviena sērija neatbilst izvēlētajiem filtriem. Mēģini paplašināt kritērijus.</p>
        ) : null}
      </div>
    );
  }

  /* Step 3 — configure the chosen tier */
  if (step === "configure" && selectedTier && config) {
    const lockSet = lockSets[selectedTier.lockSet] || [];
    const activePeephole = peepholeOptions.find((p) => p.id === config.peepholeId);

    return (
      <div className="container py-12 lg:py-16">
        <button
          type="button"
          onClick={() => setStep("results")}
          className="mb-6 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
        >
          <ChevronLeft size={16} /> Atpakaļ pie sērijām
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
          <div>
            <span className="relative block aspect-[4/5] overflow-hidden border border-line bg-[--color-soft]">
              <Image src={selectedTier.image} alt={selectedTier.name} fill unoptimized sizes="380px" className="object-cover" />
            </span>

            <div className="mt-6 border border-line bg-white p-5">
              <h2 className="t-section !text-[24px]">{selectedTier.name}</h2>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink">{selectedTier.intro}</p>
              <p className="mt-3 text-[13px] text-muted">
                <strong className="text-ink">Garantija:</strong> {selectedTier.warranty}
              </p>
              <ul className="mt-3 space-y-1.5 border-l-2 border-line pl-4 text-[13px] leading-[1.6] text-muted">
                {selectedTier.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            {/* Size */}
            <div className="border border-line bg-white p-4">
              <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Izmērs</h4>
              {selectedTier.sizes.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTier.sizes.map((s) => (
                    <button
                      key={`${s.w}x${s.h}`}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, size: s }))}
                      className={`border px-4 py-2 text-[13px] font-medium ${
                        config.size?.w === s.w
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                          : "border-line text-ink hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      {s.w}×{s.h} mm — <Money value={s.price} />
                    </button>
                  ))}
                  {selectedTier.customSizeSupported ? (
                    <span className="self-center text-[13px] text-muted">
                      + individuāls izmērs, {selectedTier.sqmPrice.toLocaleString("lv-LV")} {CURRENCY}/m²
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="text-[13px] text-muted">{selectedTier.sizeNote}</p>
              )}
              {selectedTier.sizes.length && selectedTier.sizeNote ? (
                <p className="mt-2 text-[12px] text-muted">{selectedTier.sizeNote}</p>
              ) : null}
            </div>

            {/* Opening direction / side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-line bg-white p-4">
                <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Vēršanās virziens</h4>
                <div className="flex flex-wrap gap-2">
                  {openingDirections
                    .filter((d) => (d.id === "outside" ? selectedTier.canOpenOutside : selectedTier.canOpenInside))
                    .map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setConfig((c) => ({ ...c, openingDirection: d.id }))}
                        className={`border px-4 py-2 text-[13px] font-medium ${
                          config.openingDirection === d.id
                            ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                            : "border-line text-ink hover:border-[color:var(--color-accent)]"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                </div>
              </div>
              <div className="border border-line bg-white p-4">
                <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Vēršanās puse</h4>
                <div className="flex flex-wrap gap-2">
                  {openingSides.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, openingSide: d.id }))}
                      className={`border px-4 py-2 text-[13px] font-medium ${
                        config.openingSide === d.id
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                          : "border-line text-ink hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Locks — multiple upgrades can be combined, same as the source calculator */}
            {!selectedTier.smartLock ? (
              <div className="border border-line bg-white p-4">
                <h4 className="t-widget mb-1 text-[color:var(--color-title)]">Papildu opcija maiņai — slēdzenes un cilindri</h4>
                <p className="mb-3 text-[12px] text-muted">Var atzīmēt vairākas — cenas summējas ar bāzes komplektāciju.</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {lockSet.map((lock) => {
                    const isChecked = config.lockIds.has(lock.id);
                    return (
                      <label
                        key={lock.id}
                        className={`block cursor-pointer border p-3 text-left text-[13px] ${
                          isChecked ? "border-[color:var(--color-accent)]" : "border-line hover:border-[color:var(--color-accent)]"
                        }`}
                      >
                        <span className="mb-2 flex items-start justify-between gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setConfig((c) => ({ ...c, lockIds: toggleInSet(c.lockIds, lock.id) }))}
                          />
                        </span>
                        {lock.image ? (
                          <span className="relative mb-2 block aspect-square w-full overflow-hidden bg-[--color-soft]">
                            <Image src={lock.image} alt={lock.name} fill unoptimized sizes="120px" className="object-contain" />
                          </span>
                        ) : null}
                        <span className="block font-medium text-ink">{lock.name}</span>
                        <span className="text-[color:var(--color-accent)]">
                          +<Money value={lock.price} />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-line bg-white p-4 text-[13px] text-muted">
                Šai sērijai ir iekļauta viedā slēdzene — atsevišķa cilindra jaunināšana nav nepieciešama.
              </div>
            )}

            {/* Hardware colour */}
            <div className="border border-line bg-white p-4">
              <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Furnitūras krāsa</h4>
              <div className="flex flex-wrap gap-2">
                {furnitureOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, furnitureId: f.id }))}
                    className={`border px-4 py-2 text-[13px] font-medium ${
                      config.furnitureId === f.id
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                        : "border-line text-ink hover:border-[color:var(--color-accent)]"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaf design: outer + inner */}
            <div>
              <h3 className="t-widget mb-4 text-[color:var(--color-title)]">Dvertņu vērtnes dizains</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DesignPicker
                  label="Zīmējums — ārpuse"
                  groups={dizainsSection.groups}
                  seriesTitle={config.outerSeriesTitle}
                  onSeriesChange={(title) => setConfig((c) => ({ ...c, outerSeriesTitle: title }))}
                  designImage={config.outerDesign.image}
                  onDesignChange={(item) => setConfig((c) => ({ ...c, outerDesign: item }))}
                />
                <DesignPicker
                  label="Zīmējums — iekšpuse"
                  groups={dizainsSection.groups}
                  seriesTitle={config.innerSeriesTitle}
                  onSeriesChange={(title) => setConfig((c) => ({ ...c, innerSeriesTitle: title }))}
                  designImage={config.innerDesign.image}
                  onDesignChange={(item) => setConfig((c) => ({ ...c, innerDesign: item }))}
                />
              </div>
            </div>

            {/* Film colour: outer + inner */}
            <div>
              <h3 className="t-widget mb-4 text-[color:var(--color-title)]">Pārklājuma plēves krāsa</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FilmPicker
                  label="Plēve — ārpuse"
                  groups={filmGroupsForTier}
                  groupTitle={config.outerFilmGroupTitle}
                  onGroupChange={(title) => setConfig((c) => ({ ...c, outerFilmGroupTitle: title }))}
                  filmImage={config.outerFilm.image}
                  onFilmChange={(item) => setConfig((c) => ({ ...c, outerFilm: item }))}
                />
                <FilmPicker
                  label="Plēve — iekšpuse"
                  groups={filmGroupsForTier}
                  groupTitle={config.innerFilmGroupTitle}
                  onGroupChange={(title) => setConfig((c) => ({ ...c, innerFilmGroupTitle: title }))}
                  filmImage={config.innerFilm.image}
                  onFilmChange={(item) => setConfig((c) => ({ ...c, innerFilm: item }))}
                />
              </div>
            </div>

            {/* Frame coating */}
            <div className="border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="t-widget text-[color:var(--color-title)]">Kārbas pārklājums</h4>
                <select
                  value={config.frameGroupTitle}
                  onChange={(e) => {
                    const g = ralSection.groups.find((x) => x.title === e.target.value);
                    setConfig((c) => ({ ...c, frameGroupTitle: e.target.value, frameSwatch: g.items[0] }));
                  }}
                  className="border border-line bg-white px-3 py-1.5 text-[13px]"
                >
                  {ralSection.groups.map((g) => (
                    <option key={g.title} value={g.title}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <SwatchGrid
                  items={ralSection.groups.find((g) => g.title === config.frameGroupTitle).items}
                  selected={config.frameSwatch.image}
                  onSelect={(item) => setConfig((c) => ({ ...c, frameSwatch: item }))}
                />
              </div>
            </div>

            {/* Peephole */}
            <div className="border border-line bg-white p-4">
              <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Skata acs</h4>
              <div className="flex flex-wrap gap-2">
                {peepholeOptions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, peepholeId: p.id }))}
                    className={`border px-4 py-2 text-[13px] font-medium ${
                      config.peepholeId === p.id
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                        : "border-line text-ink hover:border-[color:var(--color-accent)]"
                    }`}
                  >
                    {p.name}
                    {p.price ? (
                      <>
                        {" "}
                        +<Money value={p.price} />
                      </>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional options */}
            <div className="border border-line bg-white p-4">
              <h4 className="t-widget mb-3 text-[color:var(--color-title)]">Papildu opcijas</h4>
              <div className="space-y-2.5">
                {additionalOptions.map((opt) => (
                  <label key={opt.id} className="flex items-start justify-between gap-4 text-[14px] text-ink">
                    <span className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={config.extraOptions.has(opt.id)}
                        onChange={() => setConfig((c) => ({ ...c, extraOptions: toggleInSet(c.extraOptions, opt.id) }))}
                      />
                      {opt.name}
                    </span>
                    <span className="whitespace-nowrap font-medium text-[color:var(--color-accent)]">
                      +<Money value={opt.price} />
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-2 border-[color:var(--color-accent)] bg-[--color-soft] p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="t-widget text-[color:var(--color-title)]">Provizoriskā summa</span>
                <span className="text-[26px] font-semibold text-[color:var(--color-accent)]">
                  <Money value={total} />
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-[1.6] text-muted">
                Cena aprēķināta pēc mazumtirdzniecības cenrāža (spēkā no 01.08.2024). Galīgā cena tiek apstiprināta
                pasūtījuma noformēšanas brīdī. Skata acs: {activePeephole?.name}.
              </p>
              <a
                href="/kontakti"
                className="btn btn-accent mt-4 inline-block"
              >
                Pieprasīt piedāvājumu
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
