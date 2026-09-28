import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import Footer from "../components/organisms/Footer.jsx";
import ProductCatalog from "../components/organisms/ProductCatalog.jsx";
import CourseFormModal from "../components/organisms/CourseFormModal.jsx";
import ConfirmModal from "../components/organisms/ConfirmModal.jsx";
import { CURRENT_USER, categories } from "../data/courses.js";
import { userMenu } from "../data/navigation.js";

export default function SemuaProduk({ courses, onAddCourse, onUpdateCourse, onDeleteCourse }) {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [deletingCourse, setDeletingCourse] = useState(null)

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
            onUpdateCourse(editingCourse.id, data)
        } else {
            onAddCourse(data)
        }
        closeModal()
    }

    const handleDelete = (id) => {
        setDeletingCourse(courses.find((course) => course.id === id) ?? null)
    }

    const confirmDelete = () => {
        if (deletingCourse) onDeleteCourse(deletingCourse.id)
        setDeletingCourse(null)
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

            <ConfirmModal
                open={deletingCourse !== null}
                title="Hapus Produk?"
                message={`Produk "${deletingCourse?.title ?? ""}" akan dihapus. Lanjutkan?`}
                confirmLabel="Ya"
                cancelLabel="Tidak"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingCourse(null)}
            />
        </div>
    )
}