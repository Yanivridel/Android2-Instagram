import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlices'

const store = configureStore({
    reducer: {
        currentUser: userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
