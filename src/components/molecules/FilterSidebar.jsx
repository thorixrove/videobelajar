import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuLayers, LuTag, LuClock, LuCheck } from "react-icons/lu";

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-[13px] text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? "border-brand-green bg-brand-green" : "border-line bg-white"
        }`}
      >
        {checked && <LuCheck size={11} strokeWidth={3} className="text-white" aria-hidden="true" />}
      </span>
      {label}
    </label>
  );
}

function FilterSection({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="border border-line rounded-lg bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-[13px] font-semibold text-brand-green">
          <Icon size={15} aria-hidden="true" />
          {title}
        </span>
        {open ? (
          <LuChevronUp size={15} className="text-brand-green" aria-hidden="true" />
        ) : (
          <LuChevronDown size={15} className="text-muted" aria-hidden="true" />
        )}
      </button>
      {open && <div className="space-y-0.5 border-t border-line px-3 py-2">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  priceRanges,
  selectedPriceRanges,
  onTogglePrice,
  durationRanges = [],
  selectedDurations = [],
  onToggleDuration,
  onReset,
}) {
  // Desktop: semua section terbuka. Mobile: tertutup (sesuai mockup).
  const [openSections, setOpenSections] = useState(() => {
    const isDesktop =
      typeof window === "undefined" || window.matchMedia("(min-width: 768px)").matches;
    return { bidangStudi: isDesktop, harga: isDesktop, durasi: isDesktop };
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filter</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-brand-orange hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <FilterSection
          title="Bidang Studi"
          icon={LuLayers}
          open={openSections.bidangStudi}
          onToggle={() => toggleSection("bidangStudi")}
        >
          {categories.map((category) => (
            <CheckboxItem
              key={category}
              label={category}
              checked={selectedCategories.includes(category)}
              onChange={() => onToggleCategory(category)}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Harga"
          icon={LuTag}
          open={openSections.harga}
          onToggle={() => toggleSection("harga")}
        >
          {priceRanges.map((range) => (
            <CheckboxItem
              key={range.id}
              label={range.label}
              checked={selectedPriceRanges.includes(range.id)}
              onChange={() => onTogglePrice(range.id)}
            />
          ))}
        </FilterSection>

        {durationRanges.length > 0 && (
          <FilterSection
            title="Durasi"
            icon={LuClock}
            open={openSections.durasi}
            onToggle={() => toggleSection("durasi")}
          >
            {durationRanges.map((range) => (
              <CheckboxItem
                key={range.id}
                label={range.label}
                checked={selectedDurations.includes(range.id)}
                onChange={() => onToggleDuration(range.id)}
              />
            ))}
          </FilterSection>
        )}
      </div>
    </aside>
  );
}