import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "@/features/supabaseBaseQuery";
import type { todo } from "@/types/todo";
import type { CreateTodo } from "@/types/todo";
import type { SupabaseBasicFilter } from "@/features/supabaseBaseQuery";
import { type Database } from "@/types/database.type";
import type { SupabaseArgs } from "@/features/supabaseBaseQuery";

import { BaseQueryFn } from "@reduxjs/toolkit/query";

type SupabaseError = {
  data: string;
  status: string;
};

type SupabaseQueryFn<TTableName extends keyof Database["public"]["Tables"]> =
  BaseQueryFn<
    SupabaseArgs<TTableName>,
    Database["public"]["Tables"][TTableName]["Row"][],
    SupabaseError
  >;

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: supabaseBaseQuery<"todos"> as SupabaseQueryFn<"todos">,
  endpoints: (build) => ({
    getTodos: build.query<todo[], void>({
      query: () => ({
        method: "select",
        table: "todos",
        selectColumns: "*",
        orders: [{ column: "created_at", ascending: false }],
      }),
    }),
    addTodo: build.mutation({
      query: ({ todo }: { todo: CreateTodo }) => ({
        method: "insert",
        table: "todos",
        payload: todo,
      }),
    }),
    updateTodo: build.mutation({
      query: ({
        todo,
        filters,
      }: {
        todo: CreateTodo;
        filters: SupabaseBasicFilter<"todos">[];
      }) => ({
        method: "update",
        table: "todos",
        payload: todo,
        filters: filters,
      }),
    }),
    deleteTodo: build.mutation({
      query: ({ filters }: { filters: SupabaseBasicFilter<"todos">[] }) => ({
        method: "delete",
        table: "todos",
        filters: filters,
      }),
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
