import { Router } from "express";
import * as courseService from "../services/courseService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateCourse, validateCourseQuery } from "../validators/courseValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

// Semua endpoint di bawah ini membutuhkan header: Authorization: Bearer <token>
// =====================================================================
//   GET    /course        -> semua kelas, dengan query params (semua opsional):
//                            filter: ?topic= &language= &minPrice= &maxPrice=
//                            search: ?search=
//                            sort  : ?sortBy=title|price|rating_average|duration_minutes|created_at &order=asc|desc
//   GET    /course/:id    -> satu kelas berdasarkan id
//   POST   /course        -> tambah kelas       (service addCourse)
//   PATCH  /course/:id    -> ubah kelas by id   (service updateCourse)
//   DELETE /course/:id    -> hapus kelas by id  (service deleteCourse)
// =====================================================================

const router = Router()
const MAX_ID = 4294967295

function parseId(value) {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null
    const id = Number(value)
    return id <= MAX_ID ? id : null
}

const notFound = (id) => ({ message: `Kelas dengan id ${id} tidak ditemukan` })

router.get(
    "/",
    verifyToken,
    asyncHandler(async (req, res) => {

        const { errors, filters } = validateCourseQuery(req.query)
        if (errors.length > 0) return res.status(400).json({ message: "Query params tidak valid", errors })

        const courses = await courseService.getAllCourses(filters)
        res.json({ message: "Berhasil mengambil data kelas", total: courses.length, data: courses })
    }),
)


router.get(
    "/:id",
    verifyToken,
    asyncHandler(async (req, res) => {
        const id = parseId(req.params.id)
        if (id === null) return res.status(400).json({ message: "id harus berupa bilangan bulat positif" })

        const course = await courseService.getCourseById(id)
        if (!course) return res.status(404).json(notFound(id))

        res.json({ message: "Berhasil mengambil data kelas", data: course })
    }),
)


router.post(
    "/",
    verifyToken,
    asyncHandler(async (req, res) => {
        const { errors, data } = validateCourse(req.body)
        if (errors.length > 0) return res.status(400).json({ message: "Data tidak valid", errors })

        const course = await courseService.addCourse(data)
        res.status(201).json({ message: "Kelas berhasil  ditambahkan", data: course })
    })
)

router.patch(
    "/:id",
    verifyToken,
    asyncHandler(async (req, res) => {
        const id = parseId(req.params.id)
        if (id === null) return res.status(400).json({ message: "id harus beruppa bilanagn bulat positif" })

        const { errors, data } = validateCourse(req.body, { partial: true })
        if (errors.length > 0) return res.status(400).json({ message: "Data tidak valid", errors })

        const course = await courseService.updateCourse(id, data)
        if (!course) return res.status(404).json(notFound(id))

        res.json({ message: "Kelas berhasil diubah", data: course })
    })
)

router.delete(
    "/:id",
    verifyToken,
    asyncHandler(async (req, res) => {
        const id = parseId(req.params.id)
        if (id === null) return res.status(400).json({ message: "id harus berupa bilangan bulat positif" })

        const deleted = await courseService.deleteCourse(id)
        if (!deleted) return res.status(404).json(notFound(id))

        res.json({ message: `Kelas dengan id ${id} berhasil dihapus` })
    })
)

export default router;