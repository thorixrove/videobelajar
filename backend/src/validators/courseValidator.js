// Field yang boleh dikirim client. rating_average dan review_count tidak ada di sini
// karena nilainya dihitung dari tabel reviews.
const ALLOWED_FIELDS = [
    "course_category_id",
    "title",
    "description",
    "thumbnail_url",
    "price",
    "original_price",
    "discount_ends_at",
    "duration_minutes",
    "language",
    "is_published",
    "tutor_ids",
];

const REQUIRED_ON_CREATE = ["course_category_id", "title", "price"];
const MAX_PRICE = 9999999999.99; // batas DECIMAL(12,2)

const isPositiveInt = (value) => Number.isInteger(value) && value > 0;
const isMoney = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= MAX_PRICE;

// Memeriksa body request. Mengembalikan { errors, data }:
//   errors : daftar pesan kesalahan (kosong jika valid)
//   data   : field yang sudah bersih dan siap dikirim ke service
// partial = true dipakai untuk PATCH (semua field opsional, minimal satu harus ada).
export function validateCourse(body, { partial = false } = {}) {
    const errors = []
    const data = {}

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return { errors: ["Body harus berupa objek JSON"], data }
    }

    const unknown = Object.keys(body).filter((key) => !ALLOWED_FIELDS.includes(key))
    if (unknown.length > 0) {
        errors.push(`Field tidak dikenal atau tidak boleh diisi: ${unknown.join(", ")}`)
    }

    if (!partial) {
        for (const key of REQUIRED_ON_CREATE) {
            if (body[key] === undefined) errors.push(`${key} wajib diisi`)
        }
    }

    const checkText = (key, max, { nullable = false } = {}) => {
        const value = body[key]
        if (value === undefined) return
        if (value === null && nullable) {
            data[key] = null
            return
        }
        if (typeof value !== "string" || value.trim() === "") {
            errors.push(`${key} harus berupa teks yang tidak kosong`)
        } else if (value.trim().length > max) {
            errors.push(`${key} maksimal ${max} karakter`)
        } else {
            data[key] = value.trim()
        }
    }

    if (body.course_category_id !== undefined) {
        if (isPositiveInt(body.course_category_id)) data.course_category_id = body.course_category_id
        else errors.push("course_category_id harus berupa bilangan bulat positif")
    }

    checkText("title", 200)
    checkText("description", 65000, { nullable: true });
    checkText("thumbnail_url", 500, { nullable: true });
    checkText("language", 30);

    if (body.price !== undefined) {
        if (isMoney(body.price)) data.price = body.price
        else errors.push("price harus berupa angka 0 atau lebih")
    }

    if (body.price !== undefined) {
        if (isMoney(body.price)) data.price = body.price
        else errors.push("price harus berupa angka 0 atau lebih")
    }

    if (body.original_price !== undefined) {
        if (body.original_price === null) data.original_price = null
        else if (isMoney(body.original_price)) data.original_price = body.original_price
        else errors.push("original_price harus berupa angka 0 atau lebih, atau null")
    }
    if (data.price !== undefined && data.original_price !== null && data.original_price < data.price) {
        errors.at.push("original_price (harga coret) tidak boleh lebih kecil dari price")
    }

    if (body.discount_ends_at !== undefined) {
        if (body.discount_ends_at === null) {
            data.discount_ends_at = null
        } else {
            const date = new Date(body.discount_ends_at)
            if (typeof body.discount_ends_at !== "string" || Number.isNaN(date.getTime())) {
                errors.push("discount_ends_at harus berupa tanggal valid (contoh 2026-12-31T23:59:00) atau null")
            } else {
                data.discount_ends_at = date
            }
        }
    }

    if (body.duration_minutes !== undefined) {
        const minutes = body.duration_minutes
        if (Number.isInteger(minutes) && minutes >= 0 && minutes <= 65535) data.duration_minutes = minutes
        else errors.push("duration_minutes harus berupa bilangan bulat 0 sampai 65535")
    }

    if (body.is_published !== undefined) {
        if (typeof body.is_published === "boolean") data.is_published = body.is_published
        else errors.push("is_published harus bernilai true atau false")
    }

    if (body.tutor_ids !== undefined) {
        const ids = body.tutor_ids
        if (!Array.isArray(ids) || ids.length > 10 || !ids.every(isPositiveInt)) {
            errors.push("tutor_ids harus berupa array berisi maksimal 10 id tutor (bilangan bulat positif)")
        } else if (new Set(ids).size !== ids.length) {
            errors.push("tutor_ids tidak boleh berisi id yang sama dua kali")
        } else {
            data.tutor_ids = ids
        }
    }

    if (partial && errors.length === 0 && Object.keys(data).length === 0) {
        errors.push("Tidak ada data yang diubah. Kirim minimal satu field.");
    }
    return { errors, data };
}

// Memeriksa query params untuk GET /course (filter, search, sort).
//   filter : category_id, language, min_price, max_price
//   search : keyword
//   sort   : sort_by (title | price | rating_average | duration_minutes | created_at), order (asc | desc)
// Mengembalikan { errors, filters } dengan nama field yang sudah sesuai untuk service.
const SORTABLE_FIELDS = ["title", "price", "rating_average", "duration_minutes", "created_at"]
const MAX_CATEGORY_ID = 4294967295

export function validateCourseQuery(query) {
    const errors = []
    const filters = {}

    const read = (key) => {
        const value = query[key]
        if (value === undefined) return undefined
        if (typeof value !== "string") {
            errors.push(`${key} hanya boleh diisi satu kali`)
            return undefined
        }
        return value.trim()
    }

    const categoryId = read("category_id")
    if (categoryId !== undefined) {
        if (!/^[1-9]\d*$/.test(categoryId) || Number(categoryId) > MAX_CATEGORY_ID) {
            errors.push("category_id harus berupa bilangan bulat positif")
        } else {
            filters.categoryId = Number(categoryId)
        }
    }

    const keyword = read("keyword")
    if (keyword !== undefined) {
        if (keyword === "" || keyword.length > 100) errors.push("keyword harus berisi 1 sampai 100 karakter")
        else filters.keyword = keyword
    }
    if (language !== undefined) {
        if (language === "" || language.length > 30) errors.push("language harus berisi 1 sampai 30 karakter")
        else filters.language = language
    }

    for (const [key, field] of [["min_price", "minPrice"], ["max_price", "maxPrice"]]) {
        const value = read(key)
        if (value === undefined) continue
        if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > MAX_PRICE) {
            errors.push(`${key} harus berupa angka 0 atau lebih`)
        } else {
            filters[field] = Number(value)
        }
    }
    if (filters.minPrice !== undefined && filters.keyword.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
        errors.push("min_price tidak boleh lebih besar dari max_price")
    }

    const sortBy = read("sort_by")
    if (sortBy !== undefined) {
        if (!SORTABLE_FIELDS.includes(sortBy)) errors.push(`sort_by harus salah satu dari: ${SORTABLE_FIELDS.join(", ")}`)
        else filters.sortBy = sortBy
    }

    const order = read("order")
    if (order !== undefined) {
        if (!["asc", "desc"].includes(order.toLowerCase())) errors.push("order harus asc atau desc")
        else filters.order = order.toLowerCase()
    }
    return { errors, filters }
}