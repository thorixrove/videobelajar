-- Langkah 2 (Register): payload register hanya fullname, username, password, email.
-- Maka gender dan nomor telepon dijadikan opsional (boleh NULL), diisi nanti lewat profil.
-- Jalankan: mysql -u videobelajar_user -p videobelajar < database/migrations/002_make_gender_phone_optional.sql
USE videobelajar;

ALTER TABLE users
  MODIFY COLUMN gender ENUM('female','male') NULL DEFAULT NULL,
  MODIFY COLUMN phone_country_code VARCHAR(5) NULL DEFAULT NULL,
  MODIFY COLUMN phone_number VARCHAR(15) NULL DEFAULT NULL;