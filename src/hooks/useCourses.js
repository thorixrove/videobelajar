import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourse as addCourseThunk,
  deleteCourse as deleteCourseThunk,
  fetchCourses,
  updateCourse as updateCourseThunk,
} from "../store/redux/coursesSlice.js";

// Hook ini menjadi jembatan antara komponen dan Redux store.
// Data dibaca dengan useSelector, aksi dikirim dengan dispatch.
// Error dari CRUD dilempar kembali (unwrap) agar bisa ditangkap halaman.
export default function useCourses() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.items);
  const loading = useSelector((state) => state.courses.loading);
  const error = useSelector((state) => state.courses.error);

  const refetch = useCallback(() => dispatch(fetchCourses()), [dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addCourse = async (data) => {
    try {
      await dispatch(addCourseThunk(data)).unwrap();
    } catch (message) {
      throw new Error(message);
    }
  };

  const updateCourse = async (id, data) => {
    try {
      await dispatch(updateCourseThunk({ id, data })).unwrap();
    } catch (message) {
      throw new Error(message);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await dispatch(deleteCourseThunk(id)).unwrap();
    } catch (message) {
      throw new Error(message);
    }
  };

  return { courses, loading, error, refetch, addCourse, updateCourse, deleteCourse };
}