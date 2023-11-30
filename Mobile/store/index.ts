import { configureStore } from '@reduxjs/toolkit';
import jwtReducer from '../features/jwtSlice';

export const store = configureStore({
    reducer: jwtReducer
  })