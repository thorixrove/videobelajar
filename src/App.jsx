import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SemuaProduk from "./pages/SemuaProduk.jsx";
import { courses as initialCourses } from "./data/courses.js";

const STORAGE_KEY = "videobelajar:courses";

function loadCourses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // abaikan: pakai data awal
  }
  return initialCourses;
}

export default function App() {
  // State array of objects di parent, di-passing sebagai props ke halaman.
  const [courses, setCourses] = useState(loadCourses);

  // Simpan ke localStorage supaya data tidak hilang saat refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // abaikan jika storage penuh / diblokir
    }
  }, [courses]);

  // CREATE
  const addCourse = (data) =>
    setCourses((prev) => [{ id: Date.now(), rating: 0, reviews: 0, duration: 1, ...data }, ...prev]);

  // UPDATE
  const updateCourse = (id, data) =>
    setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, ...data } : course)));

  // DELETE
  const deleteCourse = (id) =>
    setCourses((prev) => prev.filter((course) => course.id !== id));

  return (
    <Routes>
      <Route path="/" element={<Home courses={courses} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/produk"
        element={
          <SemuaProduk
            courses={courses}
            onAddCourse={addCourse}
            onUpdateCourse={updateCourse}
            onDeleteCourse={deleteCourse}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}