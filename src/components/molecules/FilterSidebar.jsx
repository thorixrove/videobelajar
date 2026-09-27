
export default function FilterSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  priceRanges,
  selectedPriceRanges,
  onTogglePrice,
  onReset,
}) {
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

      <div className="mt-4">
        <p className="text-xs font-medium text-muted">Bidang Studi</p>
        <ul className="mt-2 space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                  className="size-4 rounded border-line accent-brand-green"
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-muted">Harga</p>
        <ul className="mt-2 space-y-2">
          {priceRanges.map((range) => (
            <li key={range.id}>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.includes(range.id)}
                  onChange={() => onTogglePrice(range.id)}
                  className="size-4 rounded border-line accent-brand-green"
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}