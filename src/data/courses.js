// Data kursus statis. Ganti URL gambar dengan aset dari mockup jika sudah ada.
import fotoSaya from "../assets/logo.jpg";

const img = (seed) => `https://picsum.photos/seed/${seed}/640/400`;
const face = (n) => `https://i.pravatar.cc/96?img=${n}`;

export const HERO_IMAGE = "https://picsum.photos/seed/vb-hero/1600/700";
export const NEWSLETTER_IMAGE = "https://picsum.photos/seed/vb-newsletter/1600/600";
export const CURRENT_USER = { name: "Thorix", avatar: fotoSaya };

export const categories = [
  "Semua Kelas",
  "Pemasaran",
  "Desain",
  "Pengembangan Diri",
  "Bisnis",
];

export const courses = [
  {
    id: 1,
    category: "Bisnis",
    title: "Big 4 Auditor Financial Analyst",
    description:
      "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan sumber belajar yang fleksibel.",
    image: img("vb-course-1"),
    rating: 3.5,
    reviews: 86,
    price: 300000,
    author: { name: "Cik Imah", role: "Senior Accountant di Gojek", avatar: face(47) },
  },
  {
    id: 2,
    category: "Pemasaran",
    title: "Digital Marketing untuk Pemula",
    description:
      "Woilah Cik pelajari dasar iklan digital, analitik, dan strategi kampanye yang bisa langsung dipraktikkan, 'Salam Kapal Karam'",
    image: img("vb-course-2"),
    rating: 4.0,
    reviews: 124,
    price: 250000,
    author: { name: "Wak Doleh", role: "Head of Growth di e-commerce", avatar: face(12) },
  },
  {
    id: 3,
    category: "Desain",
    title: "Dasar UI/UX dengan Figma",
    description:
      "Dari wireframe sampai prototipe interaktif, belajar merancang antarmuka yang mudah dipakai.",
    image: img("vb-course-3"),
    rating: 4.5,
    reviews: 210,
    price: 350000,
    author: { name: "Tuti", role: "Product Designer di startup fintech", avatar: face(32) },
  },
  {
    id: 4,
    category: "Pengembangan Diri",
    title: "Public Speaking Percaya Diri",
    description:
      "Atasi gugup, susun materi yang runtut, dan sampaikan gagasan dengan meyakinkan di depan siapa pun.",
    image: img("vb-course-4"),
    rating: 3.5,
    reviews: 58,
    price: 200000,
    author: { name: "Si Imoetz", role: "Pelatih Komunikasi", avatar: face(15) },
  },
  {
    id: 5,
    category: "Bisnis",
    title: "Dasar Akuntansi untuk Startup",
    description:
      "Kelola pembukuan, arus kas, dan laporan keuangan sederhana untuk bisnis yang baru berjalan.",
    image: img("vb-course-5"),
    rating: 4.0,
    reviews: 97,
    price: 300000,
    author: { name: "Wa Nina", role: "Finance Manager", avatar: face(44) },
  },
  {
    id: 6,
    category: "Desain",
    title: "Desain Grafis untuk Bisnis Kecil",
    description:
      "Buat logo, materi promosi, dan konten media sosial yang konsisten tanpa harus jadi desainer.",
    image: img("vb-course-6"),
    rating: 5.0,
    reviews: 173,
    price: 275000,
    author: { name: "Rusdi Rongawi", role: "Art Director", avatar: face(8) },
  },
  {
    id: 7,
    category: "Pemasaran",
    title: "Strategi Konten Media Sosial",
    description:
      "Rancang kalender konten, ukur performa unggahan, dan bangun audiens yang loyal secara bertahap.",
    image: img("vb-course-7"),
    rating: 4.5,
    reviews: 141,
    price: 225000,
    author: { name: "Astuti", role: "Content Strategist", avatar: face(23) },
  },
  {
    id: 8,
    category: "Pengembangan Diri",
    title: "Manajemen Waktu dan Fokus",
    description:
      "Atur prioritas, kurangi distraksi, dan bangun rutinitas kerja yang produktif setiap hari.",
    image: img("vb-course-8"),
    rating: 3.5,
    reviews: 66,
    price: 175000,
    author: { name: "mr Ambarawi", role: "Konsultan Produktivitas", avatar: face(60) },
  },
  {
    id: 9,
    category: "Bisnis",
    title: "Analisis Laporan Keuangan",
    description:
      "Baca neraca, laba rugi, dan rasio keuangan untuk mengambil keputusan bisnis yang lebih tepat.",
    image: img("vb-course-9"),
    rating: 4.0,
    reviews: 89,
    price: 325000,
    author: { name: "Sasimok", role: "Financial Analyst", avatar: face(5) },
  },
];
