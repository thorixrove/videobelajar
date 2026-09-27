import { useMemo, useState } from "react";
import { LuPlus } from "react-icons/lu";
import FilterSidebar from "../molecules/FilterSidebar.jsx";
import ProductCard from "../molecules/ProductCard.jsx";
import SelectInput from "../atoms/SelectInput.jsx";
import Button from "../atoms/Button.jsx";
import { priceRanges, sortOptions } from "../../data/courses.js";


const PAGE_SIZE = 6;

export default function ProductCatalog({ courses, categories, onAdd, onEdit, onDelete }) {
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
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

    const resetFilters = () => {
        setSelectedCategories([])
        setSelectedPriceRanges([])
        setPage(1)
    }

    const filtered = useMemo(() => {
        let result = courses

        if (selectedCategories.length > 0) {
            result = result.filter((course) => selectedCategories.includes(course.category))
        }

        if (selectedPriceRanges.length > 0) {
            const activeRanges = priceRanges.filter((range) => selectedPriceRanges.includes(range.id))
            result = result.filter((course) => activeRanges.some((range) => range.test(course.price)))
        }

        const sorted = [...result]
        if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price)
        if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price)
        if (sort === "rating-desc") sorted.sort((a, b) => b.rating - a.rating)

        return sorted
    }, [courses, selectedCategories, selectedPriceRanges, sort])

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
                    onReset={resetFilters}
                />

                <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted md:text-sm">{filtered.length} produk ditemukan</p>
                        <div className="w-44">
                            <SelectInput
                                label="Urutkan"
                                name="sort"
                                value={sort}
                                onChange={(event) => setSort(event.target.value)}
                                options={sortOptions}
                            />
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