import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./coursesSlice.js";

const store = configureStore({
    reducer: {
        courses: coursesReducer,
    },
})

export default store
