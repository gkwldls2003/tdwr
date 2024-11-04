'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Markers, MarkerState } from './types/marker';

const initialState: MarkerState = {
  allMarkers: [],
  visibleMarkers: [],
  isLoading: false,
  error: null,
};

const markerSlice = createSlice({
  name: 'marker',
  initialState,
  reducers: {
    setAllMarkers: (state, action: PayloadAction<Markers[]>) => {
      state.allMarkers = action.payload;
    },
    setVisibleMarkers: (state, action: PayloadAction<Markers[]>) => {
      state.visibleMarkers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMarkers: (state) => {
      state.allMarkers = [];
      state.visibleMarkers = [];
    },
    addMarker: (state, action: PayloadAction<Markers>) => {
      state.allMarkers.push(action.payload);
    },
    removeMarker: (state, action: PayloadAction<number>) => {
      state.allMarkers = state.allMarkers.filter(
        marker => marker.id !== action.payload
      );
      state.visibleMarkers = state.visibleMarkers.filter(
        marker => marker.id !== action.payload
      );
    },
  },
});

// 액션 생성자들 export
export const {
  setAllMarkers,
  setVisibleMarkers,
  setLoading,
  setError,
  clearMarkers,
  addMarker,
  removeMarker,
} = markerSlice.actions;

// 선택자(Selectors) export
export const selectAllMarkers = (state: { marker: MarkerState }) => state.marker.allMarkers;
export const selectVisibleMarkers = (state: { marker: MarkerState }) => state.marker.visibleMarkers;
export const selectIsLoading = (state: { marker: MarkerState }) => state.marker.isLoading;
export const selectError = (state: { marker: MarkerState }) => state.marker.error;

// reducer export - 이것이 바로 markerReducer입니다
export default markerSlice.reducer;  // markerReducer