'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { isLoading: Boolean } = {
  isLoading: false
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<Boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// 액션 생성자들 export
export const {
  setLoading,
} = boardSlice.actions;

// 선택자(Selectors) export
export const selectIsLoading = (state: { board: { isLoading: Boolean } }) => state.board.isLoading;

export default boardSlice.reducer;  