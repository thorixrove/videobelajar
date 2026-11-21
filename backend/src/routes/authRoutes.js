import { Router } from "express";
import * as userService from "../services/userService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateLogin, validateRegister } from "../validators/userValidator.js";

// =====================================================================
//   POST /register     -> daftar pengguna baru
//   Body: { fullname, username, email, password }
//   GET  /verify-email?token=... -> verifikasi email dari link yang dikirim
//                                   (alias lama: /verifikasi-email)
//   POST /login        -> masuk, mengembalikan token JWT
//   Body: { email, password }
// =====================================================================

const router = Router()

router.post(
    "/register",
    asyncHandler(async (req, res) => {
        const { errors, data } = validateRegister(req.body)
        if (errors.length > 0) return res.status(400).json({ message: "Data tidak valid", errors })

        const { user, emailSent } = await userService.registerUser(data)
        const message = emailSent
            ? "Registrasi berhasil, silakan cek email untuk verifikasi"
            : "Registrasi berhasil, tetapi email verifikasi gagal dikirim"
        res.status(201).json({ message, data: user })
    })
)


// Token berupa UUID; format yang salah langsung dianggap tidak valid tanpa query database.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get(
    ["/verify-email", "/verifikasi-email"],
    asyncHandler(async (req, res) => {
        const { token } = req.query
        if (typeof token !== "string" || !UUID_PATTERN.test(token)) {
            return res.status(400).json({ message: "Invalid Verification Token" })
        }

        await userService.verifyEmail(token)
        res.status(200).json({ message: "Email Verified Successfully" })
    })
)



router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { errors, data } = validateLogin(req.body)
        if (errors.length > 0) return res.status(400).json({ message: "Data tidak valid", errors })

        const result = await userService.loginUser(data)
        res.status(200).json({ message: "Login berhasil", data: result })
    }),
)

export default router