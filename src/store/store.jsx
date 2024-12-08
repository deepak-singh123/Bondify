import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import pathReducer from "./pathSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        path: pathReducer,
        theme: themeReducer
    }
});