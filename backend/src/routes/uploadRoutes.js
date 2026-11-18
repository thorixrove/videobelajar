import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../services/uploadService.js";

// =====================================================================
//   POST /upload -> unggah satu gambar (form-data, field: image)
//   Membutuhkan header: Authorization: Bearer <token>
// =====================================================================

const router = Router()

router.post("/", verifyToken, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File gambar wajib diunggah pada field 'image'" })
    }

    const { filename, mimeType, size } = req.file
    res.status(201).json({
        message: 'Upload berhasil',
        data: { filename, mimeType, size, url: `/uploads/${filename}` }
    })
})

export default router