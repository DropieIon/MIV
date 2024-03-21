import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../features/globalStateSlice';

export const store = configureStore({
    reducer: globalReducer
  })