import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './pathSlice';
import userReducer from './userSlice';  // Add this import

const store = configureStore({
  reducer: {
    path: pathReducer,
    user: userReducer
  }
});

export default store;