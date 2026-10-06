import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as courseService from "../../services/api/courseService.js";
import { courses as initialCourses } from "../../data/courses.js";

const initialState = {
    items: [],
    loading: true,
    error: "",
}

export const fetchCourses = createAsyncThunk(
    "courses/fetch",
    async (_, { rejectWithValue}) => {
        try {
            await courseService.seedCoursesIfNeeded(initialCourses)
            return await courseService.getCourses()
        } catch (error) {
            return rejectWithValue(error.message)
        }
    },
)

export const addCourse = createAsyncThunk(
    "courses/add",
    async (data, { rejectWithValue}) => {
        try {
            return await courseService.addCourse(data)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    },
)

export const updateCourse = createAsyncThunk(
    "courses/updates",
    async ({ id, data}, {rejectWithValue}) => {
        try {
            return await courseService.updateCourse(id, data)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    },
)

export const deleteCourse = createAsyncThunk(
    "course/delete",
    async (id, { rejectWithValue}) => {
        try {
            return await courseService.deleteCourse(id)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    },
)

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCourses.pending, (state) => {
            state.loading = true,
            state.error = ""
        })
        .addCase(fetchCourses.fulfilled, (state, action) => {
            state.loading = false,
            state.items = action.payload
        })
        .addCase(fetchCourses.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? action.error.message
        })
        .addCase(addCourse.fulfilled, (state, action) => {
            state.items.unshift(action.payload)
        })
        .addCase(updateCourse.fulfilled, (state, action) => {
            const index = state.items.findIndex((c) => c.id === action.payload.id)
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload}
        })
        .addCase(deleteCourse.fulfilled, (state, action) => {
            state.items = state.items.filter((c) => c.id !== action.payload)
        })
    },
})

export default coursesSlice.reducer