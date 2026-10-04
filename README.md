# videobelajar

Website berbasis React untuk halaman **Login**, **Registrasi**, **Beranda**, dan **Semua Produk** (CRUD).
Dibuat dengan Vite, React, React Router, Tailwind CSS, dan Axios. Data course diambil dari Firebase Realtime Database (REST API).

## Konfigurasi API

1. Buat file `.env` di root project.
2. Isi `VITE_API_BASE_URL` dengan URL Firebase Realtime Database (tanpa `/` di akhir).
3. Pastikan Rules database mengizinkan `.read` dan `.write` (test mode).
4. Saat pertama kali dibuka dan database masih kosong, data awal dari `src/data/courses.js` otomatis dikirim ke Firebase.

```
src/
├─ services/api/    axiosClient.js (base URL dari .env + interceptor), courseService.js (GET/ADD/UPDATE/DELETE)
└─ hooks/           useCourses.js (state courses + loading/error + aksi CRUD)
```

| Operasi | Method | Endpoint |
| ------- | ------ | -------- |
| GET     | GET    | `/courses.json` |
| ADD     | POST   | `/courses.json` |
| UPDATE  | PATCH  | `/courses/{id}.json` |
| DELETE  | DELETE | `/courses/{id}.json` |

## Menjalankan

Butuh Node.js 20.19+ atau 22.12+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil build di folder dist
npm run preview  # coba hasil build
```

## Rute

| Rute        | Halaman   |
| ----------- | --------- |
| `/`         | Beranda   |
| `/login`    | Login     |
| `/register` | Registrasi|

Alur: Registrasi → Login (dengan notifikasi berhasil) → Beranda. Tombol **Keluar** di menu akun kembali ke Login.
Form login dan registrasi divalidasi di sisi klien saja; hanya data course yang dikirim ke API.

## Struktur (atomic design)

```
src/
├─ components/
│  ├─ atoms/        Button, Logo, Field, FormInput, SelectInput, PhoneInput,
│  │                Divider, GoogleButton, Rating, Avatar
│  ├─ molecules/    AuthCard, CourseCard, CategoryTabs, UserDropdown, FooterColumn
│  ├─ organisms/    Navbar, HeroBanner, CourseSection, NewsletterSection, Footer
│  └─ templates/    AuthLayout
├─ pages/           Login, Register, Home
├─ data/            courses, navigation, countries
└─ utils/           validators, format
```

Komponen reusable menerima data lewat props, misalnya `CourseCard` menerima satu objek `course`,
dan `FormInput` menerima `label`, `value`, `onChange`, `error`.

## Responsif

Memakai breakpoint Tailwind (`md` = 768px, `lg` = 1024px):
navbar berubah menjadi hamburger, kartu kursus berubah dari grid 3 kolom menjadi daftar satu kolom,
dan kolom footer menjadi accordion di layar kecil.

## Mengganti gambar

Gambar kursus, hero, newsletter, dan avatar masih berupa placeholder dari internet.
Ganti URL-nya di `src/data/courses.js` dengan aset dari mockup (simpan di folder `public/`,
lalu tulis sebagai `/nama-file.jpg`).

## Deploy ke Vercel

1. Push proyek ke GitHub.
2. Di vercel.com pilih **Add New → Project**, lalu impor repository.
3. Di **Environment Variables**, tambahkan `VITE_API_BASE_URL` dengan URL Firebase yang sama (file `.env` tidak ikut di-push).
4. Vercel mengenali Vite otomatis (build `npm run build`, output `dist`). Klik **Deploy**.

File `vercel.json` sudah disertakan agar membuka atau me-refresh `/login` dan `/register` langsung tidak 404.