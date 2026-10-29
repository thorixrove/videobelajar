-- =====================================================================
-- videobelajar - Skema database (hasil Mission Intermediate BE 1)
-- DBMS   : MySQL 8.0 (InnoDB, utf8mb4)
-- Tabel  : 12 (11 entitas tugas + course_tutors sebagai tabel penghubung)
-- Cara pakai: jalankan seluruh file ini sekali
--   mysql -u <username> -p < database/schema.sql
-- Peringatan: file ini menghapus (DROP) tabel lama dengan nama yang sama.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS videobelajar
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE videobelajar;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS my_classes;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS pretests;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS course_modules;
DROP TABLE IF EXISTS course_tutors;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS tutors;
DROP TABLE IF EXISTS course_categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- users (User): akun pengguna, login/registrasi, dan profil
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name           VARCHAR(100)    NOT NULL,
  email               VARCHAR(255)    NOT NULL,
  gender              ENUM('female','male') NOT NULL,
  phone_country_code  VARCHAR(5)      NOT NULL,
  phone_number        VARCHAR(15)     NOT NULL,
  password_hash       VARCHAR(255)    NOT NULL,
  avatar_url          VARCHAR(500)    NULL DEFAULT NULL,
  google_id           VARCHAR(64)     NULL DEFAULT NULL,
  is_active           BOOLEAN         NOT NULL DEFAULT 1,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_users_email (email),
  UNIQUE KEY idx_users_google_id (google_id),
  UNIQUE KEY idx_users_phone (phone_country_code, phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- course_categories (Kategori Kelas)
-- ---------------------------------------------------------------------
CREATE TABLE course_categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_course_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- tutors (Tutor): pengajar kelas
-- ---------------------------------------------------------------------
CREATE TABLE tutors (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(100) NOT NULL,
  job_title   VARCHAR(150) NOT NULL,
  avatar_url  VARCHAR(500) NULL DEFAULT NULL,
  bio         TEXT         NULL DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tutors_full_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- courses (Produk/Kelas): katalog kelas
-- ---------------------------------------------------------------------
CREATE TABLE courses (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  course_category_id  INT UNSIGNED  NOT NULL,
  title               VARCHAR(200)  NOT NULL,
  description         TEXT          NULL DEFAULT NULL,
  thumbnail_url       VARCHAR(500)  NULL DEFAULT NULL,
  price               DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  original_price      DECIMAL(12,2) NULL DEFAULT NULL,
  discount_ends_at    DATETIME      NULL DEFAULT NULL,
  duration_minutes    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  language            VARCHAR(30)   NOT NULL DEFAULT 'Bahasa Indonesia',
  rating_average      DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
  review_count        INT UNSIGNED  NOT NULL DEFAULT 0,
  is_published        BOOLEAN       NOT NULL DEFAULT 0,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_courses_course_category_id_price (course_category_id, price),
  KEY idx_courses_price (price),
  KEY idx_courses_rating_average (rating_average),
  KEY idx_courses_duration_minutes (duration_minutes),
  FULLTEXT KEY idx_courses_title_description (title, description),
  CONSTRAINT fk_courses_course_categories FOREIGN KEY (course_category_id)
    REFERENCES course_categories (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_courses_price CHECK (price >= 0),
  CONSTRAINT chk_courses_original_price CHECK (original_price IS NULL OR original_price >= price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- course_tutors: tabel penghubung kelas dan tutor (relasi M:N)
-- ---------------------------------------------------------------------
CREATE TABLE course_tutors (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id   INT UNSIGNED NOT NULL,
  tutor_id    INT UNSIGNED NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_course_tutors_course_id_tutor_id (course_id, tutor_id),
  KEY idx_course_tutors_tutor_id (tutor_id),
  CONSTRAINT fk_course_tutors_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_course_tutors_tutors FOREIGN KEY (tutor_id)
    REFERENCES tutors (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- course_modules (Modul Kelas)
-- ---------------------------------------------------------------------
CREATE TABLE course_modules (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id    INT UNSIGNED NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NULL DEFAULT NULL,
  sort_order   SMALLINT UNSIGNED NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_course_modules_course_id_sort_order (course_id, sort_order),
  CONSTRAINT fk_course_modules_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- materials (Material: video, rangkuman, quiz, ujian akhir)
-- ---------------------------------------------------------------------
CREATE TABLE materials (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_module_id  INT UNSIGNED    NOT NULL,
  title             VARCHAR(200)    NOT NULL,
  material_type     ENUM('video','summary','quiz','final_exam') NOT NULL,
  video_url         VARCHAR(500)    NULL DEFAULT NULL,
  file_url          VARCHAR(500)    NULL DEFAULT NULL,
  duration_minutes  SMALLINT UNSIGNED NULL DEFAULT NULL,
  question_count    TINYINT UNSIGNED  NULL DEFAULT NULL,
  passing_score     TINYINT UNSIGNED  NULL DEFAULT NULL,
  sort_order        SMALLINT UNSIGNED NOT NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_materials_course_module_id_sort_order (course_module_id, sort_order),
  CONSTRAINT fk_materials_course_modules FOREIGN KEY (course_module_id)
    REFERENCES course_modules (id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- pretests (Pretest): maksimal satu per kelas
-- ---------------------------------------------------------------------
CREATE TABLE pretests (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id         INT UNSIGNED NOT NULL,
  title             VARCHAR(200) NOT NULL,
  description       TEXT         NULL DEFAULT NULL,
  question_count    TINYINT UNSIGNED NOT NULL,
  duration_minutes  SMALLINT UNSIGNED NOT NULL,
  passing_score     TINYINT UNSIGNED NULL DEFAULT NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_pretests_course_id (course_id),
  CONSTRAINT fk_pretests_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- orders (Order): pesanan pembelian satu kelas
-- ---------------------------------------------------------------------
CREATE TABLE orders (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  invoice_number  VARCHAR(30)     NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  course_id       INT UNSIGNED    NOT NULL,
  course_price    DECIMAL(12,2)   NOT NULL,
  admin_fee       DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  total_price     DECIMAL(12,2)   NOT NULL,
  status          ENUM('unpaid','paid','failed') NOT NULL DEFAULT 'unpaid',
  expires_at      DATETIME        NOT NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_orders_invoice_number (invoice_number),
  KEY idx_orders_user_id_status (user_id, status),
  KEY idx_orders_course_id (course_id),
  KEY idx_orders_status_expires_at (status, expires_at),
  CONSTRAINT fk_orders_users FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_orders_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_orders_total_price CHECK (total_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- payments (Pembayaran): percobaan pembayaran sebuah pesanan
-- ---------------------------------------------------------------------
CREATE TABLE payments (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id               BIGINT UNSIGNED NOT NULL,
  payment_method         ENUM('bank_transfer','e_wallet','card') NOT NULL,
  payment_channel        VARCHAR(30)     NOT NULL,
  amount                 DECIMAL(12,2)   NOT NULL,
  status                 ENUM('pending','success','failed') NOT NULL DEFAULT 'pending',
  va_number              VARCHAR(30)     NULL DEFAULT NULL,
  transaction_reference  VARCHAR(100)    NULL DEFAULT NULL,
  paid_at                DATETIME        NULL DEFAULT NULL,
  created_at             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_order_id (order_id),
  UNIQUE KEY idx_payments_transaction_reference (transaction_reference),
  KEY idx_payments_status_created_at (status, created_at),
  CONSTRAINT fk_payments_orders FOREIGN KEY (order_id)
    REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- my_classes (Kelas Saya): kelas milik pengguna + progres dan sertifikat
-- ---------------------------------------------------------------------
CREATE TABLE my_classes (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id                 BIGINT UNSIGNED NOT NULL,
  course_id               INT UNSIGNED    NOT NULL,
  order_id                BIGINT UNSIGNED NULL DEFAULT NULL,
  completed_module_count  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  progress_percent        TINYINT UNSIGNED  NOT NULL DEFAULT 0,
  pretest_score           TINYINT UNSIGNED  NULL DEFAULT NULL,
  pretest_taken_at        DATETIME        NULL DEFAULT NULL,
  final_exam_score        TINYINT UNSIGNED  NULL DEFAULT NULL,
  certificate_number      VARCHAR(50)     NULL DEFAULT NULL,
  certificate_issued_at   DATETIME        NULL DEFAULT NULL,
  enrolled_at             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at            DATETIME        NULL DEFAULT NULL,
  created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_my_classes_user_id_course_id (user_id, course_id),
  KEY idx_my_classes_course_id (course_id),
  UNIQUE KEY idx_my_classes_order_id (order_id),
  UNIQUE KEY idx_my_classes_certificate_number (certificate_number),
  CONSTRAINT fk_my_classes_users FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_my_classes_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_my_classes_orders FOREIGN KEY (order_id)
    REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_my_classes_progress_percent CHECK (progress_percent <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- reviews (Review): ulasan dan rating pengguna untuk sebuah kelas
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  course_id   INT UNSIGNED    NOT NULL,
  rating      DECIMAL(2,1)    NOT NULL,
  comment     TEXT            NULL DEFAULT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY idx_reviews_user_id_course_id (user_id, course_id),
  KEY idx_reviews_course_id_created_at (course_id, created_at),
  CONSTRAINT fk_reviews_users FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_reviews_courses FOREIGN KEY (course_id)
    REFERENCES courses (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 0.5 AND 5.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;