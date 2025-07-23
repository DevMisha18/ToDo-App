import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "@/features/supabaseBaseQuery";
import type { todo } from "@/types/todo";
import type { CreateTodo } from "@/types/todo";
import type {
  SupabaseBasicFilter,
  SupabaseArgs,
} from "@/features/supabaseBaseQuery";
import { type Database } from "@/types/database.type";
import { BaseQueryFn, TagDescription } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";

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
  tagTypes: ["Todo"],
  endpoints: (build) => ({
    getTodos: build.query<todo[], void>({
      query: () => ({
        method: "select",
        table: "todos",
        selectColumns: "*",
        orders: [{ column: "created_at", ascending: false }],
      }),
      providesTags: (
        todos: todo[] | undefined,
        error: SupabaseError | undefined
      ) => {
        const tags: TagDescription<"Todo">[] = [
          { type: "Todo" as const, id: "LIST" },
        ];
        if (error) return tags;
        todos!.forEach((todo) =>
          tags.push({ type: "Todo" as const, id: todo.id })
        );
        return tags;
      },
    }),
    addTodo: build.mutation<todo[], { todo: CreateTodo }>({
      query: ({ todo }: { todo: CreateTodo }) => ({
        method: "insert",
        table: "todos",
        payload: todo,
      }),
      invalidatesTags: (
        todo: todo[] | undefined,
        error: SupabaseError | undefined,
        arg: { todo: CreateTodo }
      ) => {
        if (error) return [];
        return [{ type: "Todo" as const, id: "LIST" }];
      },
    }),
    updateTodo: build.mutation<
      todo[],
      { todo: CreateTodo; filters: SupabaseBasicFilter<"todos">[] }
    >({
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
      invalidatesTags: (
        todos: todo[] | undefined,
        error: SupabaseError | undefined,
        args: {
          todo: CreateTodo;
          filters: SupabaseBasicFilter<"todos">[];
        }
      ) => {
        if (error) return [];
        return todos!.map((todo) => ({ type: "Todo" as const, id: todo.id }));
      },
    }),
    deleteTodo: build.mutation<
      todo[],
      { filters: SupabaseBasicFilter<"todos">[] }
    >({
      query: ({ filters }: { filters: SupabaseBasicFilter<"todos">[] }) => ({
        method: "delete",
        table: "todos",
        filters: filters,
      }),
      /**
       * TODO: onQueryStarted has to work with any filter not only id
       * Though you have delete button, and you delete only by id
       * Either only delete by id, or onQueryStarted has to work with any filter
       */
      onQueryStarted: async (
        args: { filters: SupabaseBasicFilter<"todos">[] },
        { dispatch, queryFulfilled }
      ) => {
        const loadingToastId = toast.loading("Deleting your todo..");
        const todoIdToDelete = args.filters.find(
          (f: SupabaseBasicFilter<"todos">) => f.column === "id"
        )?.value as number | undefined;

        if (todoIdToDelete !== undefined) {
          const patchedResult = dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex(
                (todo) => todo.id === todoIdToDelete
              );
              if (index !== -1) {
                draft.splice(index, 1);
              }
            })
          );
          try {
            // The promise of sent request
            const { data } = await queryFulfilled;
            if (!Array.isArray(data) || data.length === 0) {
              if (patchedResult) {
                patchedResult.undo();
              }
              toast.update(loadingToastId, {
                render: "Failed to delete todo",
                type: "error",
                isLoading: false,
                closeOnClick: true,
                autoClose: 2000,
              });
            } else {
              toast.update(loadingToastId, {
                render: "Deleted successfully!",
                type: "success",
                isLoading: false,
                closeOnClick: true,
                autoClose: 2000,
              });
            }
          } catch (err) {
            patchedResult.undo();
            toast.update(loadingToastId, {
              render: `Network error: ${
                err?.message || "Could not reach server."
              }`,
              type: "error",
              isLoading: false,
              closeOnClick: true,
              autoClose: 2000,
            });
          }
        }
      },
      invalidatesTags: (
        todos: todo[] | undefined,
        error: SupabaseError | undefined,
        args: { filters: SupabaseBasicFilter<"todos">[] }
      ) => {
        if (error) return [];
        return todos!.map((todo) => ({ type: "Todo" as const, id: todo.id }));
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
