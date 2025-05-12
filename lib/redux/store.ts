import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import reducers
import { authReducer } from "./slices/authSlice";
import { errorReducer } from "./slices/errorSlice";
import { transcriptionsApi } from "./api/transcriptionsApi";

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    error: errorReducer,
    [transcriptionsApi.reducerPath]: transcriptionsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(transcriptionsApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export store types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
