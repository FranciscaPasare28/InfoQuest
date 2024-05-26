import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from '../api/api';
import { userSlice } from './user';
import { messageReducer } from './message';
import { uiReducer } from './button';

const persistConfig = {
  key: 'root0',
  storage,
  whitelist: ['users', 'ui'],
};

const rootReducer = combineReducers({
  messages: messageReducer,
  users: userSlice.reducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(api.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
