import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "@/features/auth/authSlice";
import { todosSlice } from "@/features/todos/todosSlice";

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    todos: todosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
