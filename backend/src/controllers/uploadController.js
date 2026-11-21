// =====================================================================
// Controller upload: file sudah disimpan oleh multer (uploadService),
// controller hanya memeriksa hasilnya dan mengirim respons.
// =====================================================================

// POST /upload -> hasil unggah satu gambar (field: file).
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File gambar wajib diunggah pada field 'file'" });
    }

    const { filename, mimetype, size } = req.file;
    res.status(201).json({
        message: "Upload berhasil",
        data: { filename, mimetype, size, url: `/uploads/${filename}` },
    });
};