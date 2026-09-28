import { useMemo, useState } from "react";
import { LuChevronDown, LuPlus, LuSearch } from "react-icons/lu";
import FilterSidebar from "../molecules/FilterSidebar.jsx";
import ProductCard from "../molecules/ProductCard.jsx";
import Button from "../atoms/Button.jsx";
import { priceRanges, durationRanges, sortOptions } from "../../data/courses.js";


const PAGE_SIZE = 6;

export default function ProductCatalog({ courses, categories, onAdd, onEdit, onDelete }) {
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
    const [selectedDurations, setSelectedDurations] = useState([])
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState("default")
    const [page, setPage] = useState(1)

    const filterableCategories = categories.filter((category) => category !== "Semua Kelas")

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        )
        setPage(1)
    }

    const togglePriceRange = (id) => {
        setSelectedPriceRanges((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )
        setPage(1)
    }

    const toggleDuration = (id) => {
        setSelectedDurations((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        )
        setPage(1)
    }

    const resetFilters = () => {
        setSelectedCategories([])
        setSelectedPriceRanges([])
        setSelectedDurations([])
        setSearch("")
        setSort("default")
        setPage(1)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        setPage(1)
    }

    const filtered = useMemo(() => {
        let result = courses

        const query = search.trim().toLowerCase()
        if (query) {
            result = result.filter((course) =>
                course.title.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query) ||
                course.author.name.toLowerCase().includes(query)
            )
        }

        if (selectedCategories.length > 0) {
            result = result.filter((course) => selectedCategories.includes(course.category))
        }

        if (selectedPriceRanges.length > 0) {
            const activeRanges = priceRanges.filter((range) => selectedPriceRanges.includes(range.id))
            result = result.filter((course) => activeRanges.some((range) => range.test(course.price)))
        }

        if (selectedDurations.length > 0) {
            const activeRanges = durationRanges.filter((range) => selectedDurations.includes(range.id))
            result = result.filter((course) => activeRanges.some((range) => range.test(course.duration)))
        }

        const sorted = [...result]
        if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price)
        if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price)
        if (sort === "rating-desc") sorted.sort((a, b) => b.rating - a.rating)

        return sorted
    }, [courses, search, selectedCategories, selectedPriceRanges, selectedDurations, sort])

    const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPage)
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    return (
        <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="font-heading text-2xl font-semibold leading-tight md:text-[32px]">
                        Koleksi Video Pembelajaran Unggulan
                    </h1>
                    <p className="mt-1 text-xs text-muted md:text-sm">
                        Jelajahi Dunia Pengetahuan Melalui Pilihan Kami !
                    </p>
                </div>

                <Button variant="primary" onClick={onAdd}>
                    <LuPlus size={16} aria-hidden="true"/>
                    Tambah Produk
                </Button>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row">
                <FilterSidebar
                    categories={filterableCategories}
                    selectedCategories={selectedCategories}
                    onToggleCategory={toggleCategory}
                    priceRanges={priceRanges}
                    selectedPriceRanges={selectedPriceRanges}
                    onTogglePrice={togglePriceRange}
                    durationRanges={durationRanges}
                    selectedDurations={selectedDurations}
                    onToggleDuration={toggleDuration}
                    onReset={resetFilters}
                />

                <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted md:text-sm">{filtered.length} produk ditemukan</p>

                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <div className="relative flex-1 sm:w-40 sm:flex-none">
                                <label htmlFor="sort-course" className="sr-only">
                                    Urutkan
                                </label>
                                <select
                                    id="sort-course"
                                    name="sort"
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value)}
                                    className="h-10 w-full appearance-none rounded-md border border-line bg-white pl-3 pr-9 text-sm text-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <LuChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>

                            <div className="relative flex-1 sm:w-56 sm:flex-none">
                                <label htmlFor="search-course" className="sr-only">
                                    Cari kelas
                                </label>
                                <input
                                    id="search-course"
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Cari Kelas"
                                    className="h-10 w-full rounded-md border border-line bg-white pl-3 pr-9 text-sm text-ink placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
                                />
                                <LuSearch
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {visible.length === 0 ? (
                        <p className="mt-10 text-center text-sm text-muted">Belum ada produk yang cocok.</p>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visible.map((course) => (
                                <ProductCard key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </div>
                    )}

                    {totalPage > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-1.5">
                            {Array.from({ length: totalPage }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPage(n)}
                                    aria-current={n === currentPage ? "page" : undefined}
                                    className={`flex size-8 items-center justify-center rounded-md text-sm ${n === currentPage ? "bg-brand-green text-white" : "text-muted hover:bg-gray-50"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>


    )
}