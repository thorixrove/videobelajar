import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SemuaProduk from "./pages/SemuaProduk.jsx";
import useCourses from "./hooks/useCourses.js";

export default function App() {
  // Data courses diambil dari API (Firebase) lewat custom hook.
  // State tetap di parent, lalu di-passing sebagai props ke halaman.
  const { courses, loading, error, refetch, addCourse, updateCourse, deleteCourse } = useCourses();

  return (
    <Routes>
      <Route path="/" element={<Home courses={courses} loading={loading} error={error} onRetry={refetch} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/produk"
        element={
          <SemuaProduk
            courses={courses}
            loading={loading}
            error={error}
            onRetry={refetch}
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