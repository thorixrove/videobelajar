# videobelajar

Website statis berbasis React untuk halaman **Login**, **Registrasi**, dan **Beranda**.
Dibuat dengan Vite, React, React Router, dan Tailwind CSS. Tidak memakai backend.

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
Form divalidasi di sisi klien saja; tidak ada data yang dikirim ke server.

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
3. Vercel mengenali Vite otomatis (build `npm run build`, output `dist`). Klik **Deploy**.

File `vercel.json` sudah disertakan agar membuka atau me-refresh `/login` dan `/register` langsung tidak 404.
