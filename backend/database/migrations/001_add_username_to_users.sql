-- Langkah 1 (Autentikasi): tambah atribut username pada entitas User
-- Jalankan: mysql -u videobelajar_user -p videobelajar < database/migrations/001_add_username_to_users.sql
-- Catatan: asumsi tabel users masih kosong (seed.sql tidak mengisi users).
USE videobelajar;

ALTER TABLE users
  ADD COLUMN username VARCHAR(50) NOT NULL AFTER full_name,
  ADD UNIQUE KEY idx_users_username (username);