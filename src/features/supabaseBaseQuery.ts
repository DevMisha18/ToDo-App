/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import type { Database } from "@/types/database.type";
import type { PostgrestFilterBuilder } from "@/types/postgrest-types";
// import type { PostgrestFilterBuilder } from "@supabase/postgrest-js"

type BasicComparisonOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

export type SupabaseBasicFilter<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  type: BasicComparisonOperator;
  column: keyof Database["public"]["Tables"][TTableName]["Row"];
  value: Database["public"]["Tables"][TTableName]["Row"][keyof Database["public"]["Tables"][TTableName]["Row"]];
};

export type Order<TTableName extends keyof Database["public"]["Tables"]> = {
  column: keyof Database["public"]["Tables"][TTableName]["Row"];
  ascending: boolean;
};

export type SupabaseArgsSelect<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  method: "select";
  table: TTableName;
  selectColumns?: string | string[];
  filters?: SupabaseBasicFilter<TTableName>[];
  orders?: Order<TTableName>[];
  range?: { from: number; to: number };
  limit?: number;
  payload?: never;
};

export type SupabaseArgsInsert<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  method: "insert";
  table: TTableName;
  payload: Database["public"]["Tables"][TTableName]["Insert"];
  filters?: never;
};

export type SupabaseArgsUpdate<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  method: "update";
  table: TTableName;
  payload: Database["public"]["Tables"][TTableName]["Update"];
  filters: SupabaseBasicFilter<TTableName>[];
};

export type SupabaseArgsDelete<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  method: "delete";
  table: TTableName;
  filters: SupabaseBasicFilter<TTableName>[];
};

export type SupabaseArgs<
  TTableName extends keyof Database["public"]["Tables"]
> =
  | SupabaseArgsSelect<TTableName>
  | SupabaseArgsInsert<TTableName>
  | SupabaseArgsUpdate<TTableName>
  | SupabaseArgsDelete<TTableName>;
type SupabaseExtraOptions = object;

export type SupabaseBaseReturnError = {
  error: {
    data: string;
    status: string;
  };
};
export type SupabaseBaseReturnData<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  data:
    | Database["public"]["Tables"][TTableName]["Row"]
    | Database["public"]["Tables"][TTableName]["Row"][];
};

export type SupabaseBaseQueryResult<
  TTableName extends keyof Database["public"]["Tables"]
> = SupabaseBaseReturnData<TTableName> | SupabaseBaseReturnError;

const applyFilters = <TTableName extends keyof Database["public"]["Tables"]>(
  queryBuilder: PostgrestFilterBuilder,
  filters: SupabaseBasicFilter<TTableName>[]
): PostgrestFilterBuilder => {
  let currentBuilder = queryBuilder;
  for (const filter of filters) {
    switch (filter.type) {
      case "eq":
        currentBuilder = currentBuilder.eq(
          filter.column as string,
          // @ts-expect-error value can be almost anything, not worth strongtyping
          filter.value
        );
        break;
      case "neq":
        currentBuilder = currentBuilder.neq(
          filter.column as string,
          filter.value
        );
        break;
      case "gt":
        currentBuilder = currentBuilder.gt(
          filter.column as string,
          filter.value
        );
        break;
      case "gte":
        currentBuilder = currentBuilder.gte(
          filter.column as string,
          filter.value
        );
        break;
      case "lt":
        currentBuilder = currentBuilder.lt(
          filter.column as string,
          filter.value
        );
        break;
      case "lte":
        currentBuilder = currentBuilder.lte(
          filter.column as string,
          filter.value
        );
        break;
    }
  }
  return currentBuilder;
};

const applyOrders = <TTableName extends keyof Database["public"]["Tables"]>(
  queryBuilder: any,
  orders: Order<TTableName>[]
) => {
  let currentBuilder = queryBuilder;
  for (const order of orders) {
    currentBuilder = currentBuilder.order(order.column, {
      ascending: order.ascending,
    });
  }
  return currentBuilder;
};

export const supabaseBaseQuery = async <
  TTableName extends keyof Database["public"]["Tables"]
>(
  args: SupabaseArgs<TTableName>,
  api: BaseQueryApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extraOptions: SupabaseExtraOptions
): Promise<SupabaseBaseQueryResult<TTableName>> => {
  const supabase = createClient();
  const queryBuilder = supabase.from(args.table);
  const { signal } = api;

  let finalBuilder: PostgrestFilterBuilder;

  try {
    switch (args.method) {
      case "select":
        if (!args.selectColumns) {
          finalBuilder = queryBuilder.select("*");
        } else if (typeof args.selectColumns === "string") {
          finalBuilder = queryBuilder.select(args.selectColumns);
        } else {
          finalBuilder = queryBuilder.select(
            `${args.selectColumns.join(", ")}`
          );
        }
        if (args.filters) {
          finalBuilder = applyFilters(finalBuilder, args.filters);
        }
        if (args.orders) {
          finalBuilder = applyOrders(finalBuilder, args.orders);
        }
        if (args.range) {
          finalBuilder = finalBuilder.range(args.range.from, args.range.to);
        }
        if (args.limit) {
          finalBuilder = finalBuilder.limit(args.limit);
        }
        break;
      case "insert":
        // @ts-expect-error already explaned in earlier code
        finalBuilder = queryBuilder.insert(args.payload).select();
        break;
      case "update":
        if (!args.filters || args.filters.length === 0) {
          return {
            error: {
              data: "Update operation requires filters to specify which rows to update.",
              status: "MISSING_FILTERS",
            },
          };
        }
        // @ts-expect-error already explaned in earlier code
        finalBuilder = applyFilters(
          // @ts-expect-error: Type mismatch due to PostgrestFilterBuilder identity
          // conflict — see notes in types/postgrest-types.ts
          queryBuilder.update(args.payload),
          args.filters
        ).select();
        break;
      case "delete":
        if (!args.filters || args.filters.length === 0) {
          return {
            error: {
              data: "Delete operation requires filters to specify which rows to delete.",
              status: "MISSING_FILTERS",
            },
          };
        }
        // @ts-expect-error already explaned in earlier code
        finalBuilder = applyFilters(
          // @ts-expect-error: Same as above — delete() call triggers
          // a type incompatibility with inferred builder type
          queryBuilder.delete(),
          args.filters
        ).select();
        break;
    }
    const { data, error: supabaseError } = await finalBuilder.abortSignal(
      signal
    );
    if (supabaseError) {
      return {
        error: {
          data: supabaseError.message,
          status: supabaseError.code,
        },
      };
    }
    return { data };
  } catch (err: any) {
    return {
      error: {
        data: err?.message || "An unknown client-side error occurred.",
        status: "CLIENT_ERROR",
      },
    };
  }
};
