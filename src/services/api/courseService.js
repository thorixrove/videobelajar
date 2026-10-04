import apiClient from "./axiosClient.js";
 
const COURSES_PATH = "/courses.json";
const coursePath = (id) => `/courses/${id}.json`;
const SEEDED_PATH = "/meta/seeded.json";

function toList(data) {
    if (!data) return []
    return Object.entries(data)
    .filter(([, value]) => value)
    .map(([id, value]) => ({ id, ...value}))
}

export async function getCourses() {
    const {data} = await apiClient.get(COURSES_PATH)
    return toList(data)
}

export async function addCourse(course) {
    const payload = { rating: 0, reviews: 0, duration: 1, ...course}
    const {data} = await apiClient.post(COURSES_PATH, payload)
    return { id: data.name, ...payload}
}

export async function updateCourse(id, changes) {
    await apiClient.patch(coursePath(id), changes)
    return { id, ...changes}
}

export async function deleteCourse(id) {
    await apiClient.delete(coursePath(id))
    return id
}

export async function seedCoursesIfNeeded(initialCourses) {
    const { data: seeded } = await apiClient.get(SEEDED_PATH)
    if (seeded) return false

    const { data: existing} = await apiClient.get(COURSES_PATH)
    if (!existing) {
        const body = Object.fromEntries(
            initialCourses.map(({ id, ...rest}) => [`course-${id}`, rest]),
        )
        await apiClient.put(COURSES_PATH, body)
    }
    await apiClient.put(SEEDED_PATH, true)
    return true
}

