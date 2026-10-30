-- =====================================================================
-- videobelajar - Data contoh untuk pengujian
-- Jalankan SEKALI setelah schema.sql:
--   mysql -u <username> -p < database/seed.sql
-- Isi: 5 kategori, 2 tutor, 6 kelas, dan relasi kelas-tutor.
-- Nama kelas selain "Gapai Karier..." hanyalah contoh, bukan data resmi.
-- =====================================================================

USE videobelajar;

INSERT INTO course_categories (id, name) VALUES
  (1, 'Pemasaran'),
  (2, 'Desain'),
  (3, 'Pengembangan Diri'),
  (4, 'Bisnis'),
  (5, 'Digital & Teknologi');

INSERT INTO tutors (id, full_name, job_title, avatar_url, bio) VALUES
  (1, 'Jenna Ortega', 'Senior Accountant di Gojek', NULL,
   'Praktisi akuntansi dengan pengalaman di perusahaan teknologi dan mengajar analisis keuangan.'),
  (2, 'Gregorius Edrik Lawanto', 'Senior Talent Acquisition di WingsGroup', NULL,
   'Berkarier di bidang HR selama lebih dari 3 tahun. Saat ini bekerja sebagai Senior Talent Acquisition Specialist di Wings Group Indonesia (Sayap Mas Utama) selama hampir 1 tahun.');

INSERT INTO courses
  (id, course_category_id, title, description, thumbnail_url, price, original_price,
   discount_ends_at, duration_minutes, language, rating_average, review_count, is_published)
VALUES
  (1, 2, 'Gapai Karier Impianmu sebagai Seorang UI/UX Designer & Product Manager.',
   'Foundations of User Experience (UX) Design adalah yang pertama dari rangkaian tujuh kursus yang akan membekali Anda dengan keterampilan untuk melamar pekerjaan tingkat pemula dalam desain pengalaman pengguna.',
   NULL, 250000.00, 500000.00, DATE_ADD(NOW(), INTERVAL 2 DAY), 360, 'Bahasa Indonesia', 3.5, 86, 1),
  (2, 4, 'Big 4 Auditor Financial Analyst',
   'Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan kurikulum terbaik.',
   NULL, 300000.00, NULL, NULL, 480, 'Bahasa Indonesia', 3.5, 86, 1),
  (3, 1, 'Dasar-dasar Digital Marketing',
   'Pelajari strategi pemasaran digital dari nol, mulai dari media sosial hingga iklan berbayar.',
   NULL, 150000.00, NULL, NULL, 240, 'Bahasa Indonesia', 4.0, 52, 1),
  (4, 5, 'Belajar Microsoft Office dan Google Workspace untuk Pemula',
   'Kuasai aplikasi perkantoran yang paling sering dipakai di dunia kerja.',
   NULL, 300000.00, NULL, NULL, 300, 'Bahasa Indonesia', 4.5, 120, 1),
  (5, 3, 'Public Speaking untuk Profesional',
   'Latih kepercayaan diri dan teknik berbicara di depan banyak orang.',
   NULL, 200000.00, 250000.00, NULL, 180, 'Bahasa Indonesia', 3.0, 18, 1),
  (6, 1, 'Strategi Branding untuk UMKM',
   'Bangun identitas merek yang kuat dengan anggaran terbatas.',
   NULL, 175000.00, NULL, NULL, 210, 'Bahasa Indonesia', 4.0, 33, 0);

INSERT INTO course_tutors (course_id, tutor_id) VALUES
  (1, 1), (1, 2),
  (2, 1),
  (3, 2),
  (4, 1),
  (5, 2),
  (6, 1);