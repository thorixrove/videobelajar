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

const conflict = (message) => messa