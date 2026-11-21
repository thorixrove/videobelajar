import { Router } from "express";
import * as authController from "../controllers/authController.js";

// =====================================================================
//   POST /register     -> daftar pengguna baru
//   Body: { fullname, username, email, password }
//   GET  /verify-email?token=... -> verifikasi email dari link yang dikirim
//                                   (alias lama: /verifikasi-email)
//   POST /login        -> masuk, mengembalikan token JWT
//   Body: { email, password }
// Logika tiap endpoint ada di controllers/authController.js
// =====================================================================

const router = Router();

router.post("/register", authController.register);
router.get(["/verify-email", "/verifikasi-email"], authController.verifyEmail);
router.post("/login", authController.login);

export default router;
