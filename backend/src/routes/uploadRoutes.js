import { Router } from "express";
import * as uploadController from "../controllers/uploadController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../services/uploadService.js";

// =====================================================================
//   POST /upload -> unggah satu gambar (form-data, field: file)
//   Membutuhkan header: Authorization: Bearer <token>
// Urutan: verifyToken -> multer (simpan file) -> controller (kirim respons)
// =====================================================================

const router = Router();

router.post("/", verifyToken, upload.single("file"), uploadController.uploadFile);

export default router;