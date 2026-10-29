export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Kategori kelas"
      className="-mx-4 flex gap-6 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0"
    >
      {categories.map((category) => {
        const selected = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category)}
            className={`-mb-px shrink-0 border-b-[3px] pb-3 text-[13px] transition-colors md:text-sm ${
              selected
                ? "border-brand-orange font-medium text-brand-orange"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
