import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import type { todo } from "@/types/todo";

export type todoState = Omit<todo, "user_id">;

const initialState: todoState[] = [];

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<todoState>) => {
      state.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<todoState>) => {
      const idx = state.findIndex((todo) => todo.id === action.payload.id);
      if (idx !== -1) {
        state[idx] = action.payload;
      }
    },
    deleteTodoById: (state, action: PayloadAction<string>) => {
      return state.filter((todo) => todo.id === action.payload);
    },
  },
});

export const { addTodo, updateTodo, deleteTodoById } = todoSlice.actions;
export const selectAllTodos = (state: RootState) => state.todos;
export const selectTodoById = (state: RootState, id: string) =>
  state.todos.find((todo) => todo.id === id);
