// Respons untuk alamat yang tidak punya route.
export function notFound(req, res) {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });
}

// Pemetaan error MySQL (berdasarkan nomor errno) menjadi respons HTTP yang jelas.
// Nomor errno dipakai karena stabil di MySQL maupun MariaDB.
const DATABASE_ERRORS = {
  1452: [400, "Kategori atau tutor yang dipilih tidak ditemukan"], // foreign key tujuan tidak ada
  1451: [409, "Data tidak dapat dihapus karena masih dipakai data lain (pesanan, kelas pengguna, atau ulasan)"],
  1062: [409, "Data sudah ada (duplikat)"],
  3819: [400, "Data melanggar aturan database (contoh: harga coret lebih kecil dari harga)"], // CHECK di MySQL
  4025: [400, "Data melanggar aturan database (contoh: harga coret lebih kecil dari harga)"], // CHECK di MariaDB
  1264: [400, "Ada nilai angka yang di luar batas yang diizinkan"],
  1406: [400, "Ada teks yang terlalu panjang"],
};

// Error handler utama. Dipasang paling akhir di app.js.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  // JSON pada body request rusak atau terlalu besar.
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Body bukan JSON yang valid" });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Body terlalu besar" });
  }

  // Error dari database.
  const mapped = DATABASE_ERRORS[error.errno];
  if (mapped) {
    return res.status(mapped[0]).json({ message: mapped[1] });
  }

  // Error tak terduga: detail hanya ditulis di log server, tidak dikirim ke client.
  console.error("Error tak terduga:", error);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}