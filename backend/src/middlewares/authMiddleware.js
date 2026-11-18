
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

// Memeriksa token JWT pada header Authorization (format: "Bearer <token>").
// Token valid   -> isi token disimpan di req.user, lalu lanjut ke handler berikutnya (next).
// Token salah/tidak ada/kedaluwarsa -> respons 401 "Autentikasi gagal".

export function verifyToken(req, res, next) {
    const headers = req.headers.authorization

    if (!headers) {
        return res.status(401).json({ message: "Autentikasi gagal: token tidak ditemukan" })
    }

    const [scheme, token] = headers.split(" ")
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Autentikasi gagal: format header harus 'Bearer <token>'" })
    }

    try {
        // Memakai secret key yang sama dengan saat token dibuat di login.
        req.user = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] })
        next()
    } catch (error) {
        const reason = error.name === "TokenExpiredError" ? "token sudah kedaluwarsa" : "token tidak valid";
        res.status(401).json({ message: `Autentikasi gagal: ${reason}` })
    }
}