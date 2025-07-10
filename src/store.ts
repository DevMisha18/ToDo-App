import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "@/features/auth/authSlice";
import { todoSlice } from "@/features/todos/todoSlice";

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    todos: todoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
