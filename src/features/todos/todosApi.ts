import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "@/features/supabaseBaseQuery";
import type { todo } from "@/types/todo";
import type { CreateTodo, UpdateTodo } from "@/types/todo";
import type {
  SupabaseBasicFilter,
  SupabaseArgs,
  SupabaseBaseReturnError,
} from "@/features/supabaseBaseQuery";
import { type Database } from "@/types/database.type";
import { BaseQueryFn, TagDescription } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { updateToast } from "@/utils/toast";

type SupabaseError = SupabaseBaseReturnError["error"];

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
      onQueryStarted: async (
        args: { todo: CreateTodo },
        { dispatch, queryFulfilled }
      ) => {
        const loadingToastId = toast.loading("Creating your todo");
        const tempId = Date.now() * -1;
        const patchedResult = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.push({
              ...args.todo,
              created_at: new Date().toISOString(),
              id: tempId,
              user_id: "",
            });
          })
        );
        try {
          const { data: todos } = await queryFulfilled;
          if (!Array.isArray(todos) || todos.length === 0) {
            if (patchedResult) {
              patchedResult.undo();
            }
            updateToast(loadingToastId, "error", "Failed to create todo");
            return;
          }
          updateToast(loadingToastId, "success", "Created successfully!");
          dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((t) => t.id === tempId);
              if (index !== -1) {
                draft.splice(index, 1, todos[0]);
              } else {
                draft.push(todos[0]);
              }
            })
          );
        } catch (err) {
          patchedResult.undo();
          updateToast(
            loadingToastId,
            "error",
            `Network error: ${err?.message || "Could not reach server."}`
          );
        }
      },
      invalidatesTags: (
        todos: todo[] | undefined,
        error: SupabaseError | undefined,
        arg: { todo: CreateTodo }
      ) => {
        if (error) return [];
        return [{ type: "Todo" as const, id: "LIST" }];
      },
    }),
    updateTodo: build.mutation<
      todo[],
      { todo: UpdateTodo; filters: SupabaseBasicFilter<"todos">[] }
    >({
      query: ({
        todo,
        filters,
      }: {
        todo: UpdateTodo;
        filters: SupabaseBasicFilter<"todos">[];
      }) => ({
        method: "update",
        table: "todos",
        payload: todo,
        filters: filters,
      }),
      /**
       * TODO: Again, works only if filtered by id
       */
      onQueryStarted: async (
        args: { todo: UpdateTodo; filters: SupabaseBasicFilter<"todos">[] },
        { dispatch, queryFulfilled }
      ) => {
        const loadingToastId = toast.loading("Updating your todo..");
        const todoIdToUpdate = args.filters.find(
          (f: SupabaseBasicFilter<"todos">) => f.column === "id"
        )?.value as number | undefined;
        const patchedResult = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const index = draft.findIndex((todo) => todo.id === todoIdToUpdate);
            if (index !== -1) {
              draft.splice(index, 1, { ...draft[index], ...args.todo });
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          if (!Array.isArray(data) || data.length === 0) {
            if (patchedResult) {
              patchedResult.undo();
            }
            updateToast(loadingToastId, "error", "Failed to update todo");
          } else {
            updateToast(loadingToastId, "success", "Updated sucessfully!");
          }
        } catch (err) {
          patchedResult.undo();
          updateToast(
            loadingToastId,
            "error",
            `Network error: ${err?.message || "Could not reach server."}`
          );
        }
      },
      invalidatesTags: (
        todos: todo[] | undefined,
        error: SupabaseError | undefined,
        args: {
          todo: UpdateTodo;
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
            /**
             * params: endpoint's name, endpoint's query args, immer patch func (immer - package)
             * endpoint's name & args used for identifying which cache to twick
             */
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
              updateToast(loadingToastId, "error", "Failed to delete todo");
            } else {
              updateToast(loadingToastId, "success", "Deleted successfully");
            }
          } catch (err) {
            patchedResult.undo();
            updateToast(
              loadingToastId,
              "error",
              `Network error: ${err?.message || "Could not reach server."}`
            );
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
