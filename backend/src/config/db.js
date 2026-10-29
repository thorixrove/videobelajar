import "dotenv/config";
import mysql from "mysql2/promise";

// Semua pengaturan koneksi dibaca dari file .env (host, username, password, port, database name).
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Hentikan lebih awal dengan pesan jelas jika konfigurasi belum lengkap.
const missing = ["DB_HOST", "DB_USER", "DB_NAME"].filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Konfigurasi database belum lengkap. Isi ${missing.join(", ")} di file .env (lihat .env.example).`,
  );
}

// Pool menyimpan beberapa koneksi yang dipakai ulang, jadi lebih efisien
// daripada membuat koneksi baru untuk setiap permintaan.
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  user: DB_USER,
  password: DB_PASSWORD ?? "",
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // DECIMAL dikembalikan sebagai angka, bukan teks (mis. harga 250000.00 -> 250000).
  decimalNumbers: true,
});

export default pool;