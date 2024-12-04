import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './pathSlice';

const store = configureStore({
  reducer: {
    path: pathReducer
  }
});

export default store;
