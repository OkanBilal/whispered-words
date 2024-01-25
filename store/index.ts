import { configureStore } from "@reduxjs/toolkit";
import { transcriptionApi } from "@/store/api/transcriptionApi";
import { authApi } from "@/store/api/authApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [transcriptionApi.reducerPath]: transcriptionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(transcriptionApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
