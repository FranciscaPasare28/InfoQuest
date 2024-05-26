// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { messageSlice } from '../message';

const initialState = {
  showVacationButton: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleVacationButton: (state, { payload }) => {
      state.showVacationButton = payload;
    },
  },
});

export const { toggleVacationButton } = uiSlice.actions;

export const selectShowVacationButton = (state) => state.ui.showVacationButton;
export const uiReducer = uiSlice.reducer;
