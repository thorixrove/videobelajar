import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import Footer from "../components/organisms/Footer.jsx";
import ProductCatalog from "../components/organisms/ProductCatalog.jsx";
import CourseFormModal from "../components/organisms/CourseFormModal.jsx";
import { CURRENT_USER, categories, courses as initialCourses } from "../data/courses.js";
import { userMenu } from "../data/navigation.js";

export default function SemuaProduk() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState(initialCourses)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)

    const openAddModal = () => {
        setEditingCourse(null)
        setModalOpen(true)
    }

    const openEditModal = (course) => {
        setEditingCourse(course)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingCourse(null)
    }

    const handleSubmit = (data) => {
        if (editingCourse) {
            setCourses((prev) =>
                prev.map((course) => (course.id === editingCourse.id ? { ...course, ...data } : course))
            )
        } else {
            setCourses((prev) => [{ id: Date.now(), rating: 0, reviews: 0, ...data }, ...prev])
        }
        closeModal()
    }

    const handleDelete = (id) => {
        if (window.confirm("Hapus produk in?")) {
            setCourses((prev) => prev.filter((course) => course.id !== id))
        }
    }


    return (
        <div className="min-h-screen">
            <Navbar
                variant="app"
                user={CURRENT_USER}
                menuItems={userMenu}
                onLogout={() => navigate("/login")}
            />

            <main className="mx-auto max-w-[1120px] px-4 pb-12 pt-6 md:px-6 md:pb-16 md:pt-10">
                <ProductCatalog
                    courses={courses}
                    categories={categories}
                    onAdd={openAddModal}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                />
            </main>

            <Footer />

            <CourseFormModal
                open={modalOpen}
                categories={categories}
                initialData={editingCourse}
                onSubmit={handleSubmit}
                onClose={closeModal}
            />
        </div>
    )
}

