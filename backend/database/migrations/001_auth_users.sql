-- Migrasi 001: menyiapkan tabel users untuk autentikasi.
-- Jalankan SEKALI pada database yang SUDAH dibuat dari schema.sql lama.
-- Jika database dibuat ulang dari schema.sql yang baru, file ini tidak perlu dijalankan.
--
-- Cara menjalankan:  mysql -u root -p videobelajar < database/migrations/001_auth_users.sql

-- 1. username: ditambah dulu sebagai kolom boleh kosong, diisi untuk baris lama, lalu diwajibkan dan dibuat unik.
ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL AFTER full_name;
UPDATE users SET username = CONCAT('user', id) WHERE username IS NULL;
ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NOT NULL;
ALTER TABLE users ADD UNIQUE KEY idx_users_username (username);

-- 2. Form register hanya mengirim fullname, username, email, password,
--    jadi gender dan nomor telepon tidak boleh lagi wajib diisi.
ALTER TABLE users MODIFY COLUMN gender ENUM('female','male') NULL DEFAULT NULL;
ALTER TABLE users MODIFY COLUMN phone_country_code VARCHAR(5) NULL DEFAULT NULL;
ALTER TABLE users MODIFY COLUMN phone_number VARCHAR(15) NULL DEFAULT NULL;

-- 3. Verifikasi email: penanda sudah terverifikasi dan token sekali pakai.
ALTER TABLE users ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN verification_token CHAR(36) NULL DEFAULT NULL;
ALTER TABLE users ADD UNIQUE KEY idx_users_verification_token (verification_token);