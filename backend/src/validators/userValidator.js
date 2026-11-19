const ALLOWED_FIELDS = ["fullname", "username", "password", "email"];
const USERNAME_PATTERN = /^[A-Za-z0-9_.]{3,50}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_PASSWORD_BYTES = 72; // bcrypt hanya memakai 72 byte pertama password

// Memeriksa body register. Mengembalikan { errors, data }.
export function validateRegister(body) {
    const errors = []
    const data = {}

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return { errors: ["Body harus berupa objek JSON", data] }
    }

    const unknown = Object.keys(body).filter((key) => !ALLOWED_FIELDS.includes(key))
    if (unknown.length > 0) {
        errors.push(`Field tidak dikenal atau tidak boleh diisi: ${unknown.join(", ")}`)
    }

    for (const key of ALLOWED_FIELDS) {
        if (body[key] === undefined) errors.push(`${key} wajib diisi`)
    }

    const { fullname, username, password, email } = body

    if (fullname !== undefined) {
        if (typeof fullname !== "string" || fullname.trim() === "") {
            errors.push("fullname harus berupa teks yang tidak kosong")
        } else if (fullname.trim().length > 100) {
            errors.push("fullname maksimal 100 karakter")
        } else {
            data.fullname = fullname.trim()
        }
    }

    if (username !== undefined) {
        if (typeof username !== "string" || !USERNAME_PATTERN.test(username.trim())) {
            errors.push("username harus 3-50 karakter dan hanya berisi huruf, angka, titik, atau underscore")
        } else {
            data.username = username.trim()
        }
    }

    if (email !== undefined) {
        if (typeof email !== "string" || email.trim().length > 255 || !EMAIL_PATTERN.test(email.trim())) {
            errors.push("email tidak valid")
        } else {
            data.email = email.trim().toLowerCase()
        }
    }

    if (password !== undefined) {
        if (typeof password !== "string" || password.length < MIN_PASSWORD) {
            errors.push(`password minimal ${MIN_PASSWORD} karakter`)
        } else if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
            errors.push(`password maksimal ${MAX_PASSWORD_BYTES} byte`)
        } else {
            data.password = password
        }
    }

    return { errors, data }
}

// Memeriksa body login. Mengembalikan { errors, data }.
export function validateLogin(body) {
    const errors = []
    const data = {}

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return { errors: ["Body harus berupa objek JSON"], data }
    }

    const unknown = Object.keys(body).filter((key) => !["email", "password"].includes(key))
    if (unknown.length > 0) {
        errors.push(`Field tidak dikenal atau tidak boleh diisi: ${unknown.join(", ")}`)
    }

    if (typeof body.email !== "string" || body.email.trim() === "") {
        errors.push("email wjib diisi")
    } else {
        data.email = body.email.trim().toLowerCase()
    }

    if (typeof body.password !== "string" || body.password === "") {
        errors.push("password whib diisi")
    } else {
        data.password = body.password
    }
    return { errors, data }
}