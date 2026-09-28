import { createContext, useContext, useEffect, useState } from "react";
import { courses as initialCourses } from "../data/courses.js";

const STORAGE_KEY = "videobelajar:courses";
const CoursesContext = createContext(null);

function loadCourses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // abaikan: pakai data awal
  }
  return initialCourses;
}

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(loadCourses);

  // Simpan otomatis ke localStorage setiap data berubah.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // abaikan jika storage penuh / diblokir
    }
  }, [courses]);

  const addCourse = (data) =>
    setCourses((prev) => [{ id: Date.now(), rating: 0, reviews: 0, duration: 1, ...data }, ...prev]);

  const updateCourse = (id, data) =>
    setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, ...data } : course)));

  const deleteCourse = (id) =>
    setCourses((prev) => prev.filter((course) => course.id !== id));

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses harus dipakai di dalam <CoursesProvider>");
  return ctx;
}