import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import Button from "../atoms/Button.jsx";
import FormInput from "../atoms/FormInput.jsx";
import SelectInput from "../atoms/SelectInput.jsx";


const emptyForm = {
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
    authorName: "",
    authorRole: "",
};

export default function CourseFormModal({ open, categories, initialData, onSubmit, onClose }) {
    const [form, setForm] = useState(emptyForm)
    const [error, setErrors] = useState({})

    useEffect(() => {
        if (!open) return

        if (initialData) {
            setForm({
                title: initialData.title,
                category: initialData.category,
                price: String(initialData.price),
                description: initialData.description,
                image: initialData.image,
                authorName: initialData.author.name,
                authorRole: initialData.author.role,
            })
        } else {
            setForm(emptyForm)
        }
        setErrors({})
    }, [open, initialData])

    if (!open) return null

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        const next = {}
        if (!form.title.trim()) next.title = "Judul wajib diisi";
        if (!form.category) next.category = "Pilih kategori";
        if (!form.price || Number(form.price) <= 0) next.price = "Harga harus lebih dari 0";
        if (!form.authorName.trim()) next.authorName = "Nama pengajar wajib diisi";
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!validate()) return

        onSubmit({
            title: form.title.trim(),
            category: form.category,
            price: Number(form.price),
            description: form.description.trim(),
            image: form.image.trim() || `https://picsum.photos/seed/course-${Date.now()}/640/400`,
            author: {
                name: form.authorName.trim(),
                role: form.authorRole.trim(),
                avatar: initialData?.author.avatar ?? `https://i.pravatar.cc/96?img=${(Date.now() % 70) + 1}`,
            },
        })
    }

    const categoryOptions = categories
        .filter((category) => category !== "Semua Kelas")
        .map((category) => ({ value: category, label: category }))


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-form-title"
        >
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 md:p-6">
                <div className="flex items-center justify-between">
                    <h2 id="course-form-title" className="font-heading text-lg font-semibold">
                        {initialData ? "Edit Produk" : "Tambah Produk"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-gray-50"
                    >
                        <LuX size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <FormInput
                        label="Judul Kursus"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        error={errors.title}
                        required
                    />

                    <SelectInput
                        label="Kategori"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        options={[{ value: "", label: "Pilih kategori" }, ...categoryOptions]}
                        error={errors.category}
                        required
                    />

                    <FormInput
                        label="Harga (Rp)"
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        error={errors.price}
                        required
                    />

                    <FormInput
                        label="URL Gambar"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://..."
                    />

                    <FormInput
                        label="Nama Pengajar"
                        name="authorName"
                        value={form.authorName}
                        onChange={handleChange}
                        error={errors.authorName}
                        required
                    />

                    <FormInput
                        label="Jabatan Pengajar"
                        name="authorRole"
                        value={form.authorRole}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="mb-1.5 block text-[13px] text-muted" htmlFor="description">
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" block onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" block>
                            {initialData ? "Simpan Perubahan" : "Tambah Produk"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}