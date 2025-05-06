import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer } from "./authSlice";
import { transcriptionsApi } from "./transcriptionsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    [transcriptionsApi.reducerPath]: transcriptionsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(transcriptionsApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;