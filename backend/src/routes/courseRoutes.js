import { Router } from "express"
import * as courseController from "../controllers/courseController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

// Semua endpoint di bawah ini membutuhkan header: Authorization: Bearer <token>
// =====================================================================
//   GET    /course        -> semua kelas, dengan query params (semua opsional):
//                            filter: ?topic= &language= &minPrice= &maxPrice=
//                            search: ?search=
//                            sort  : ?sortBy=title|price|rating_average|duration_minutes|created_at &order=asc|desc
//   GET    /course/:id    -> satu kelas berdasarkan id
//   POST   /course        -> tambah kelas
//   PATCH  /course/:id    -> ubah kelas by id
//   DELETE /course/:id    -> hapus kelas by id
// Logika tiap endpoint ada di controllers/courseController.js
// =====================================================================

const router = Router()

router.get("/", verifyToken, courseController.getList)
router.get("/:id", verifyToken, courseController.getById)
router.post("/", verifyToken, courseController.create)
router.patch("/:id", verifyToken, courseController.update)
router.delete("/:id", verifyToken, courseController.remove)

export default router