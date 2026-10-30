import pool from "../config/db.js";

// =====================================================================
// Service untuk tabel `courses` (Langkah 2: Data Manipulation Language)
//   SELECT : getAllCourses, getCourseById, getCoursesByCategory, searchCoursesByTitle
//   INSERT : addCourse
//   UPDATE : updateCourse (by id)
//   DELETE : deleteCourse (by id)
// Semua query memakai prepared statement (tanda ?) agar aman dari SQL injection.
// =====================================================================

// Kolom yang boleh diisi/diubah dari luar. rating_average dan review_count sengaja
// tidak ada di sini karena nilainya dihitung dari tabel reviews, bukan diisi manual.
const WRITABLE_COLUMNS = [
  "course_category_id",
  "title",
  "description",
  "thumbnail_url",
  "price",
  "original_price",
  "discount_ends_at",
  "duration_minutes",
  "language",
  "is_published",
];

// Bagian SELECT + JOIN yang dipakai bersama oleh semua query baca.
const BASE_SELECT = `
  SELECT c.id, c.course_category_id, cc.name AS category_name,
         c.title, c.description, c.thumbnail_url,
         c.price, c.original_price, c.discount_ends_at,
         c.duration_minutes, c.language,
         c.rating_average, c.review_count, c.is_published,
         c.created_at, c.updated_at
  FROM courses c
  JOIN course_categories cc ON cc.id = c.course_category_id`;

// Mengubah satu baris hasil query menjadi objek yang rapi untuk API.
function formatCourse(row, tutors = []) {
  const { category_name, ...course } = row;
  return {
    ...course,
    is_published: Boolean(course.is_published),
    category: { id: course.course_category_id, name: category_name },
    tutors,
  };
}

// Mengambil tutor untuk sekumpulan kelas sekaligus (satu query, bukan satu per kelas).
async function attachTutors(rows) {
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(", ");
  const [tutorRows] = await pool.execute(
    `SELECT ct.course_id, t.id, t.full_name, t.job_title, t.avatar_url, t.bio
     FROM course_tutors ct
     JOIN tutors t ON t.id = ct.tutor_id
     WHERE ct.course_id IN (${placeholders})
     ORDER BY ct.id`,
    ids,
  );

  const tutorsByCourse = new Map();
  for (const { course_id, ...tutor } of tutorRows) {
    if (!tutorsByCourse.has(course_id)) tutorsByCourse.set(course_id, []);
    tutorsByCourse.get(course_id).push(tutor);
  }
  return rows.map((row) => formatCourse(row, tutorsByCourse.get(row.id) ?? []));
}

// ---------------------------------------------------------------------
// SELECT
// ---------------------------------------------------------------------

// SELECT semua data kelas.
export async function getAllCourses() {
  const [rows] = await pool.execute(`${BASE_SELECT} ORDER BY c.id`);
  return attachTutors(rows);
}

// SELECT berdasarkan id. Mengembalikan null jika tidak ditemukan.
export async function getCourseById(id) {
  const [rows] = await pool.execute(`${BASE_SELECT} WHERE c.id = ?`, [id]);
  if (rows.length === 0) return null;
  const [course] = await attachTutors(rows);
  return course;
}

// SELECT berdasarkan atribut lain: kategori.
export async function getCoursesByCategory(categoryId) {
  const [rows] = await pool.execute(
    `${BASE_SELECT} WHERE c.course_category_id = ? ORDER BY c.id`,
    [categoryId],
  );
  return attachTutors(rows);
}

// SELECT berdasarkan atribut lain: kata kunci pada judul.
export async function searchCoursesByTitle(keyword) {
  // Karakter khusus LIKE (% _ \) di-escape supaya dicari sebagai teks biasa.
  const escaped = String(keyword).replace(/[\\%_]/g, "\\$&");
  const [rows] = await pool.execute(
    `${BASE_SELECT} WHERE c.title LIKE ? ORDER BY c.id`,
    [`%${escaped}%`],
  );
  return attachTutors(rows);
}

// ---------------------------------------------------------------------
// INSERT, UPDATE, DELETE
// ---------------------------------------------------------------------

// Mengambil hanya kolom yang diizinkan dari payload (kolom lain diabaikan).
function pickWritable(data) {
  const picked = {};
  for (const column of WRITABLE_COLUMNS) {
    if (data[column] !== undefined) picked[column] = data[column];
  }
  return picked;
}

// Mengisi ulang relasi kelas-tutor (tabel course_tutors) di dalam transaksi.
async function replaceTutors(connection, courseId, tutorIds) {
  await connection.execute("DELETE FROM course_tutors WHERE course_id = ?", [courseId]);
  for (const tutorId of tutorIds) {
    await connection.execute(
      "INSERT INTO course_tutors (course_id, tutor_id) VALUES (?, ?)",
      [courseId, tutorId],
    );
  }
}

// INSERT: menambah kelas baru. data.tutor_ids (opsional) berisi daftar id tutor.
// Kelas dan relasi tutornya disimpan dalam satu transaksi: jika salah satu gagal,
// keduanya dibatalkan.
export async function addCourse(data) {
  const fields = pickWritable(data);
  const columns = Object.keys(fields);
  const placeholders = columns.map(() => "?").join(", ");

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO courses (${columns.join(", ")}) VALUES (${placeholders})`,
      Object.values(fields),
    );
    const courseId = result.insertId;

    if (Array.isArray(data.tutor_ids)) {
      await replaceTutors(connection, courseId, data.tutor_ids);
    }

    await connection.commit();
    return getCourseById(courseId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// UPDATE: mengubah kelas berdasarkan id. Hanya kolom yang dikirim yang diubah.
// Jika data.tutor_ids dikirim, daftar tutor diganti. Mengembalikan null jika id tidak ada.
export async function updateCourse(id, data) {
  const fields = pickWritable(data);
  const columns = Object.keys(fields);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      "SELECT id FROM courses WHERE id = ? FOR UPDATE",
      [id],
    );
    if (existing.length === 0) {
      await connection.rollback();
      return null;
    }

    if (columns.length > 0) {
      const setClause = columns.map((column) => `${column} = ?`).join(", ");
      await connection.execute(`UPDATE courses SET ${setClause} WHERE id = ?`, [
        ...Object.values(fields),
        id,
      ]);
    }

    if (Array.isArray(data.tutor_ids)) {
      await replaceTutors(connection, id, data.tutor_ids);
    }

    await connection.commit();
    return getCourseById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// DELETE: menghapus kelas berdasarkan id. Mengembalikan true jika ada yang terhapus.
// Modul, material, pretest, dan relasi tutor ikut terhapus (ON DELETE CASCADE).
// Kelas yang sudah punya pesanan, kelas milik pengguna, atau ulasan akan ditolak
// database (ON DELETE RESTRICT) untuk melindungi riwayat transaksi.
export async function deleteCourse(id) {
  const [result] = await pool.execute("DELETE FROM courses WHERE id = ?", [id]);
  return result.affectedRows > 0;
}