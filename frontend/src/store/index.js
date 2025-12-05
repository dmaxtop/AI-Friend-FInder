// frontend/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';     // Use slice instead of reducer
import profileSlice from './slices/profileSlice';
import matchSlice from './slices/matchSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    matches: matchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
