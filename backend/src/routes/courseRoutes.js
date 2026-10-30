import { Router } from "express";
import * as courseService from "../services/courseService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateCourse } from "../validators/courseValidator.js";

// =====================================================================
//   GET    /course        -> semua kelas (bisa difilter ?category_id= dan ?keyword=)
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
    asyncHandler(async (req, res) => {
        const { category_id: categoryParams, keyword: keywordParam } = req.query

        let categoryId = null
        if (categoryParams !== undefined) {
            categoryId = parseId(String(categoryParams))
            if (categoryId === null) {
                return res.status(400).json({ message: "category_id harus berupa bilangan bulat positif" })
            }
        }

        let keyword = null
        if (keywordParam !== undefined) {
            keyword = String(keywordParam).trim()
            if (keyword === "" || keyword.length > 100) {
                return res.status(400).json({ message: "keyword harus berisi 1 sampai 100 karakter" })
            }
        }

        let courses
        if (keyword !== null) {
            courses = await courseService.searchCoursesByTitle(keyword)
            if (categoryId !== null) {
                courses = courses.filter((course) => course.course_category_id === categoryId)
            }
        } else if (categoryId !== null) {
            courses = await courseService.getCoursesByCategory(categoryId)
        } else {
            courses = await courseService.getAllCourses()
        }
        res.json({ message: "Berhasil mengambil data kelas", total: courses.length, data: courses })
    }),
)


router.get(
    "/:id",
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
    asyncHandler(async (req, res) => {
        const { errors, data } = validateCourse(req.body)
        if (errors.length > 0) return res.status(400).json({ message: "Data tidak valid", errors })

        const course = await courseService.addCourse(data)
        res.status(201).json({ message: "Kelas berhasil  ditambahkan", data: course })
    })
)

router.patch(
    "/:id",
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
    asyncHandler(async (req, res) => {
        const id = parseId(req.params.id)
        if (id === null) return res.status(400).json({ message: "id harus berupa bilangan bulat positif" })

        const deleted = await courseService.deleteCourse(id)
        if (!deleted) return res.status(404).json(notFound(id))

        res.json({ message: `Kelas dengan id ${id} berhasil dihapus` })
    })
)

export default router;