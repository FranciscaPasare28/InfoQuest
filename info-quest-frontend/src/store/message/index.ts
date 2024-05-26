import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { MessageState } from '../../types/Types';

const initialState: MessageState = {
  items: [],
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.items = [...state.items, payload];
    },
    deleteMessages: (state) => {
      state.items = [];
    },
  },
});

export const { addMessage, deleteMessages } = messageSlice.actions;

export const selectMessages = (state: RootState) => state.messages.items;

export const messageReducer = messageSlice.reducer;
