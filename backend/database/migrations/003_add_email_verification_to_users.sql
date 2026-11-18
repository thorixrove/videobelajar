-- Langkah 6 (Kirim email): kolom untuk token verifikasi email.
-- verification_token : token unik (UUID) yang dikirim lewat email; dikosongkan setelah terverifikasi.
-- email_verified_at  : waktu email diverifikasi; NULL berarti belum diverifikasi.
-- Jalankan: mysql -u videobelajar_user -p videobelajar < database/migrations/003_add_email_verification_to_users.sql
USE videobelajar;

ALTER TABLE users
  ADD COLUMN verification_token CHAR(36) NULL DEFAULT NULL AFTER password_hash,
  ADD COLUMN email_verified_at DATETIME NULL DEFAULT NULL AFTER verification_token,
  ADD UNIQUE KEY idx_users_verification_token (verification_token);