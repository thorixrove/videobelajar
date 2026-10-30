-- =====================================================================
-- Perintah untuk bukti pengujian: melihat isi data di MySQL
-- Dijalankan di terminal MySQL setelah memilih database videobelajar.
-- =====================================================================

-- 1. Daftar kelas (judul dipotong 40 karakter agar tabel muat di layar)
SELECT id, LEFT(title, 40) AS title, price, duration_minutes, is_published
FROM courses
ORDER BY id;

-- 2. Jumlah kelas
SELECT COUNT(*) AS jumlah_kelas FROM courses;

-- 3. Kelas beserta kategori dan tutornya (membuktikan relasi antar tabel)
SELECT c.id, LEFT(c.title, 30) AS title, cc.name AS kategori, t.full_name AS tutor
FROM courses c
JOIN course_categories cc ON cc.id = c.course_category_id
LEFT JOIN course_tutors ct ON ct.course_id = c.id
LEFT JOIN tutors t ON t.id = ct.tutor_id
ORDER BY c.id, t.id;