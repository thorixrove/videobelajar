import { useCallback, useEffect, useState } from "react";
import * as courseService from "../services/api/courseService.js";
import { courses as initialCourses } from "../data/courses.js";


export default function useCourses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchCourses= useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            await courseService.seedCoursesIfNeeded(initialCourses)
            setCourses(await courseService.getCourses())
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    const addCourse = async (data) => {
        const created = await courseService.addCourse(data)
        setCourses((prev) => [created, ...prev])
    }

    const updateCourse = async (id, data) => {
        const updated = await courseService.updateCourse(id, data)
        setCourses((prev) =>
        prev.map((course) => (course.id === id ? { ...course, ...updated} : course)),
        )
    }

    const deleteCourse = async (id) => {
        await courseService.deleteCourse(id)
        setCourses((prev) => prev.filter((course) => course.id !== id))
    }

    return { courses, loading, error, refetch: fetchCourses, addCourse, updateCourse, deleteCourse };
}