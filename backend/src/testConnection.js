import pool from "./config/db.js";

// Menguji koneksi ke MySQL dan memastikan 12 tabel hasil Mission BE 1 sudah ada.
const EXPECTED_TABLES = [
  "users",
  "course_categories",
  "tutors",
  "courses",
  "course_tutors",
  "course_modules",
  "materials",
  "pretests",
  "orders",
  "payments",
  "my_classes",
  "reviews",
];

async function main() {
  try {
    const [[info]] = await pool.query("SELECT DATABASE() AS db, VERSION() AS version");
    console.log(`Terhubung ke database "${info.db}" (MySQL ${info.version}).`);

    const [rows] = await pool.query("SHOW TABLES");
    const found = rows.map((row) => Object.values(row)[0]);
    const missing = EXPECTED_TABLES.filter((name) => !found.includes(name));

    if (missing.length === 0) {
      console.log(`Semua ${EXPECTED_TABLES.length} tabel ditemukan.`);
    } else {
      console.log(`Tabel belum ada: ${missing.join(", ")}.`);
      console.log("Jalankan database/schema.sql terlebih dahulu.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Koneksi gagal:", error.code ?? "", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();