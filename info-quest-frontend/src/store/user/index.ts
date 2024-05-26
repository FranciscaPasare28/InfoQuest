// import { createSlice } from '@reduxjs/toolkit';
// import type { RootState } from '../..';
//
// const initialState = {
//   tokens: {
//     accessToken: '',
//     refreshToken: '',
//   },
//   data: {},
//   role: -1,
// };
//
// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     addUser: (state, { payload }) => {
//       state = payload;
//     },
//     logout: (state) => {
//       (state.tokens = { accessToken: '', refreshToken: '' }),
//       (state.data = {}),
//       (state.role = -1);
//     },
//
//     setAccessToken: (state, { payload }) => {
//       state.tokens.accessToken = payload;
//     },
//
//     setRefreshToken: (state, { payload }) => {
//       state.tokens.refreshToken = payload;
//     },
//
//     setRole: (state, { payload }) => {
//       state.role = payload;
//     },
//   },
// });
//
// export const {
//   addUser, logout, setAccessToken, setRefreshToken, setRole,
// } = userSlice.actions;
//
// export const selectUser = (state: RootState) => state.users;
//
// export const userReducer = userSlice.reducer;
import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../..';

interface UserState {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  data: Record<string, any>;
  role: number;
  id: number;
}

const initialState: UserState = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  data: {},
  role: -1,
  id: -1,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, { payload }: { payload: Partial<UserState> }) => {
      Object.assign(state, payload);
    },
    logout: (state) => {
      (state.tokens = { accessToken: '', refreshToken: '' }),
      (state.data = {}),
      (state.role = -1),
      (state.id = -1);
    },
    setAccessToken: (state, { payload }: { payload: string }) => {
      state.tokens.accessToken = payload;
    },
    setRefreshToken: (state, { payload }: { payload: string }) => {
      state.tokens.refreshToken = payload;
    },
    setRole: (state, { payload }: { payload: number }) => {
      state.role = payload;
    },
    setId: (state, { payload }: { payload: string }) => {
      state.id = payload;
    },
  },
});

export const {
  updateUser, logout, setAccessToken, setRefreshToken, setRole, setId,
} = userSlice.actions;

const selectUserState = (state: RootState) => state.users;

export const selectUser = createSelector(selectUserState, (user) => user);

export const userReducer = userSlice.reducer;
