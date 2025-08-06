import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './slices/userProfileSlice';
import documentsReducer from './slices/documentsSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    documents: documentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 