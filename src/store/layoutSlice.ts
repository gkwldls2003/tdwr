import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LayoutState } from './types/layout';



const initialState: LayoutState = {
  showLeftSider: true,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setShowLeftSider: (state, action: PayloadAction<boolean>) => {
      state.showLeftSider = action.payload;
    },
    toggleLeftSider: (state) => {
      state.showLeftSider = !state.showLeftSider;
    },
  },
});

export const { setShowLeftSider, toggleLeftSider } = layoutSlice.actions;

export const selectShowLeftSider = (state: { layout: LayoutState }) => 
  state.layout.showLeftSider;

export default layoutSlice.reducer;