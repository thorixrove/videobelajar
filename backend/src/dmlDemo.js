import pool from "./config/db.js";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  searchCoursesByTitle,
  updateCourse,
} from "./services/courseService.js";

// Mencoba semua service DML satu per satu. Data yang ditambah di sini
// dihapus lagi di akhir, jadi data contoh tidak berubah.
async function main() {
  try {
    console.log("== SELECT ==");
    const all = await getAllCourses();
    console.log(`getAllCourses            -> ${all.length} kelas`);

    const one = await getCourseById(1);
    console.log(`getCourseById(1)         -> "${one.title}" | kategori: ${one.category.name} | tutor: ${one.tutors.length}`);
    console.log(`getCourseById(999999)    -> ${await getCourseById(999999)}`);

    const byCategory = await getCoursesByCategory(1);
    console.log(`getCoursesByCategory(1)  -> ${byCategory.map((c) => c.title).join(" | ")}`);

    const found = await searchCoursesByTitle("Marketing");
    console.log(`searchCoursesByTitle     -> ${found.length} kelas cocok dengan "Marketing"`);

    console.log("\n== INSERT ==");
    const created = await addCourse({
      course_category_id: 5,
      title: "Kelas Percobaan DML",
      description: "Dibuat oleh dmlDemo.js",
      price: 99000,
      duration_minutes: 90,
      tutor_ids: [1, 2],
    });
    console.log(`addCourse                -> id ${created.id}, tutor: ${created.tutors.map((t) => t.full_name).join(", ")}`);

    console.log("\n== UPDATE ==");
    const updated = await updateCourse(created.id, { title: "Kelas Percobaan (diubah)", price: 123000, tutor_ids: [2] });
    console.log(`updateCourse             -> "${updated.title}" | harga ${updated.price} | tutor: ${updated.tutors.map((t) => t.full_name).join(", ")}`);
    console.log(`updateCourse(999999)     -> ${await updateCourse(999999, { title: "x" })}`);

    console.log("\n== DELETE ==");
    console.log(`deleteCourse(${created.id})       -> ${await deleteCourse(created.id)}`);
    console.log(`deleteCourse(${created.id}) lagi  -> ${await deleteCourse(created.id)}`);
    console.log(`getCourseById(${created.id})      -> ${await getCourseById(created.id)}`);
  } catch (error) {
    console.error("Terjadi error:", error.code ?? "", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();