import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// =====================================================================
// Konfigurasi multer untuk upload gambar
//   destination : folder `uploads` di root aplikasi (backend/uploads)
//   filename    : nama acak (uuid), bukan nama asli, supaya aman dan tidak bentrok
//   filter      : hanya gambar JPEG, PNG, atau WebP
//   batas       : 2 MB per file
// =====================================================================

export const UPLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${ALLOWED_TYPES[file.mimetype]}`)
})

function fileFilter(req, file, cb) {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true)

    const error = new Error("File harus berupa gambar JPEG, PNG, atau WebP")
    error.status = 400
    error.expose = true
    cb(error)
}

// Dipakai di route: upload.single("file") menerima satu file pada field "file".
export const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE, files: 1 } });