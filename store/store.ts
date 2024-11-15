'use client';

import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markerSlice';  // 여기서 import
import layoutReducer from './layoutSlice';

export const store = configureStore({
  reducer: {
    marker: markerReducer,  // 여기서 사용
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;