# Panduan Pengujian API dengan Postman (Langkah 4)

Koleksi `videobelajar.postman_collection.json` berisi 20 request yang menguji semua endpoint `/course`.
Setiap request punya skrip pengujian otomatis (tab **Tests**) yang menampilkan Pass/Fail.

## 1. Persiapan

1. Pastikan database sudah dibuat (`schema.sql` dan `seed.sql`) dan file `.env` sudah diisi.
2. Jalankan server dari folder `backend`:
   ```
   npm start
   ```
   Harus muncul tulisan `Server berjalan di http://localhost:3000`. Biarkan terminal ini terbuka.
3. Buka Postman, klik **Import**, lalu pilih file `postman/videobelajar.postman_collection.json`.

Alamat server disimpan di variabel koleksi `baseUrl` (bawaan `http://localhost:3000`).
Ubah di tab **Variables** koleksi jika portnya berbeda.

## 2. Menjalankan pengujian

**Cara A, satu per satu (cocok untuk bukti per endpoint):**
klik sebuah request, tekan **Send**, lihat status di kanan atas dan hasil di tab **Test Results**.
Jalankan berurutan dari atas ke bawah, karena `POST tambah kelas (valid)` menyimpan id kelas baru ke
variabel `{{createdId}}` yang dipakai request PATCH dan DELETE setelahnya.

**Cara B, sekaligus:** klik kanan koleksi, pilih **Run collection**, lalu **Run**.
Hasil akhir yang diharapkan: **20 request, semua test Pass**. Koleksi aman dijalankan berulang kali
karena kelas yang dibuat akan dihapus lagi di akhir.

## 3. Hasil yang diharapkan

| Folder | Request | Status | Yang dibuktikan |
|---|---|---|---|
| 1. GET | GET semua kelas | 200 | Daftar kelas, lengkap dengan kategori dan tutor |
| | GET kelas berdasarkan id | 200 | Satu kelas (`/course/1`) |
| | GET filter kategori | 200 | Semua hasil berkategori 1 |
| | GET cari judul | 200 | Semua judul memuat kata "Marketing" |
| | GET id tidak ada | 404 | Pesan "tidak ditemukan" |
| | GET id bukan angka | 400 | Id tidak valid ditolak |
| 2. POST | POST tambah kelas (valid) | 201 | Kelas baru tersimpan, id masuk ke `{{createdId}}` |
| | POST body kosong | 400 | Daftar field wajib muncul |
| | POST field terlarang | 400 | `rating_average` tidak boleh diisi dari luar |
| | POST kategori tidak ada | 400 | Foreign key ditolak database |
| | GET kelas yang baru dibuat | 200 | Data benar-benar tersimpan |
| 3. PATCH | PATCH ubah judul dan harga | 200 | Hanya field yang dikirim yang berubah |
| | PATCH ganti tutor | 200 | Daftar tutor diganti |
| | PATCH body kosong | 400 | Tidak ada yang diubah |
| | PATCH id tidak ada | 404 | Id tidak ditemukan |
| | PATCH harga salah tipe | 400 | Harga berupa teks ditolak |
| 4. DELETE | DELETE kelas | 200 | Kelas terhapus |
| | DELETE kelas yang sama lagi | 404 | Sudah tidak ada |
| | GET kelas yang sudah dihapus | 404 | Data benar-benar hilang |
| | DELETE id bukan angka | 400 | Id tidak valid ditolak |

## 4. Bukti pengujian untuk dikumpulkan

Ambil tangkapan layar yang memperlihatkan **URL, method, status, body respons, dan tab Test Results** untuk:

- [ ] GET semua kelas (200)
- [ ] GET kelas berdasarkan id (200)
- [ ] POST tambah kelas (201)
- [ ] PATCH ubah kelas (200)
- [ ] DELETE kelas (200)
- [ ] Hasil **Run collection** (20 request, 0 gagal)

## 5. Jika ada masalah

| Gejala | Penyebab dan solusi |
|---|---|
| `Could not send request` / `ECONNREFUSED` | Server belum jalan. Jalankan `npm start`. |
| `500` pada semua request | Koneksi database gagal. Jalankan `npm run db:test` dan cek `.env`. |
| `GET semua kelas` hasilnya kosong | `seed.sql` belum dijalankan. |
| `404` pada request PATCH/DELETE kelas baru | Request POST belum dijalankan, sehingga `{{createdId}}` masih kosong. |
| `400` pada POST kategori 5 | Data seed belum ada, atau tabel `course_categories` kosong. |