import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";
import { jwtExpiresIn, jwtSecret } from "../config/jwt.js";
import { sendVerificationEmail } from "./mailService.js";

// =====================================================================
// Service untuk tabel `users` (Langkah 2: Register)
//   INSERT : registerUser (password di-hash dengan bcrypt sebelum disimpan)
//             lalu mengirim email verifikasi berisi token unik (uuid)
//   UPDATE : verifyEmail (mencocokkan token dari link email, menandai email terverifikasi)
//   SELECT : loginUser (cek email, bandingkan password dengan bcrypt, buat token JWT)
// Query memakai prepared statement (tanda ?) agar aman dari SQL injection.
// =====================================================================


const SALT_ROUND = 10

// Hash palsu untuk membandingkan password saat email tidak ditemukan, supaya waktu
// respons tidak membocorkan apakah sebuah email terdaftar.
const DUMMY_HASH = bcrypt.hashSync("password-palsu", SALT_ROUND)

// Error yang pesannya aman ditampilkan ke client (ditangani errorHandler).
function httpError(status, message) {
    const error = new Error(message)
    error.status = status
    error.expose = true
    return error
}

const conflict = (message) => httpError(409, message)

export async function registerUser({ fullname, username, email, password }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUND)
    const verificationToken = uuidv4()

    let user
    try {
        const [result] = await pool.execute(
            "INSERT INTO users (full_name, username, email, password_hash, verification_token) VALUES (?, ?, ?, ?, ?)",
            [fullname, username, email, passwordHash, verificationToken]
        )

        // password_hash dan verification_token sengaja tidak ikut dikembalikan.
        const [rows] = await pool.execute(
            "SELECT id, full_name AS fullname, username, email, is_active, created_at FROM users WHERE id = ?",
            [result.insertId],
        )
        user = { ...rows[0], is_active: Boolean(rows[0].is_active) }
    } catch (error) {
        if (error.errno === 1062) {
            if (error.sqlMessage?.includes("idx_users_username")) throw conflict("Username sudah dipakai");
            if (error.sqlMessage?.includes("idx_users_email")) throw conflict("Email sudah terdaftar");
            throw conflict("Data sudah terdaftar")
        }
        throw error
    }

    // Kegagalan kirim email tidak membatalkan registrasi (user sudah tersimpan).
    let emailSent = true
    try {
        await sendVerificationEmail({ to: email, fullname, token: verificationToken })
    } catch (error) {
        console.log("Gagal mengirim email verifikasi:", error.message)
    }

    return { user, emailSent }
}

// Mencocokkan token dari link email. UPDATE ... WHERE verification_token = ? sekaligus
// mencari token di database: jika tidak ada baris yang cocok, token tidak valid.
export async function verifyEmail(token) {
    const
        [result] = await pool.execute(
            "UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE verification_token = ?",
            [token]
        )
    if (result.affectedRows === 0) throw httpError(400, "Invalid Verification Token")
}

export async function loginUser({ email, password }) {
    const [rows] = await pool.execute(
        "SELECT id, full_name, username, email, password_hash, is_active FROM users WHERE email = ?",
        [email],
    )
    const user = rows[0]


    // Email tidak ditemukan dan password salah diberi respons yang sama (401).
    const isMatch = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH)
    if (!user || !isMatch) throw httpError(401, "Email atau password salah")
    if (!user.is_active) throw httpError(403, "Akun tidak aktif")

    const token = jwt.sign({ sub: user.id, username: user.username }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    })
    return {
        token,
        user: { id: user.id, fullname: user.full_name, username: user.username, email: user.email },
    }
}