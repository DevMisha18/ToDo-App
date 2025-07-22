/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import type { Database } from "@/types/database.type";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

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

type SupabaseArgsSelect<TTableName extends keyof Database["public"]["Tables"]> =
  {
    method: "select";
    table: TTableName;
    selectColumns?: string | string[];
    filters?: SupabaseBasicFilter<TTableName>[];
    orders?: Order<TTableName>[];
    range?: { from: number; to: number };
    limit?: number;
    payload?: never;
  };

type SupabaseArgsInsert<TTableName extends keyof Database["public"]["Tables"]> =
  {
    method: "insert";
    table: TTableName;
    payload: Database["public"]["Tables"][TTableName]["Insert"];
    filters?: never;
  };

type SupabaseArgsUpdate<TTableName extends keyof Database["public"]["Tables"]> =
  {
    method: "update";
    table: TTableName;
    payload: Database["public"]["Tables"][TTableName]["Insert"];
    filters: SupabaseBasicFilter<TTableName>[];
  };

type SupabaseArgsDelete<TTableName extends keyof Database["public"]["Tables"]> =
  {
    method: "delete";
    table: TTableName;
    filters: SupabaseBasicFilter<TTableName>[];
  };

type SupabaseArgs<TTableName extends keyof Database["public"]["Tables"]> =
  | SupabaseArgsSelect<TTableName>
  | SupabaseArgsInsert<TTableName>
  | SupabaseArgsUpdate<TTableName>
  | SupabaseArgsDelete<TTableName>;
type SupabaseExtraOptions = object;

type SupabaseBaseReturnError = {
  error: {
    message: string;
    code: string;
    details?: string;
    hint?: string;
  };
};
type SupabaseBaseReturnData<
  TTableName extends keyof Database["public"]["Tables"]
> = {
  data:
    | Database["public"]["Tables"][TTableName]["Row"]
    | Database["public"]["Tables"][TTableName]["Row"][];
};

type SupabaseBaseReturnContent<
  TTableName extends keyof Database["public"]["Tables"]
> = Promise<SupabaseBaseReturnData<TTableName> | SupabaseBaseReturnError>;

const applyFilters = <TTableName extends keyof Database["public"]["Tables"]>(
  queryBuilder: PostgrestFilterBuilder<
    Database["public"],
    Database["public"]["Tables"][TTableName],
    Database["public"]["Tables"][TTableName]["Row"],
    Database["public"]["Tables"][TTableName]["Row"][]
  >,
  filters: SupabaseBasicFilter<TTableName>[]
) => {
  let currentBuilder = queryBuilder;
  for (const filter of filters) {
    switch (filter.type) {
      case "eq":
        currentBuilder = currentBuilder.eq(
          filter.column as string,
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
  extraOptions: SupabaseExtraOptions
): SupabaseBaseReturnContent<TTableName> => {
  const supabase = createClient();
  const queryBuilder = supabase.from(args.table);
  const { signal } = api;

  let finalBuilder: PostgrestFilterBuilder<
    Database["public"],
    Database["public"]["Tables"][TTableName],
    Database["public"]["Tables"][TTableName]["Row"],
    Database["public"]["Tables"][TTableName]["Row"][]
  >;

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
        finalBuilder = queryBuilder.insert(args.payload).select();
        break;
      case "update":
        if (!args.filters || args.filters.length === 0) {
          return {
            data: null,
            error: {
              message:
                "Update operation requires filters to specify which rows to update.",
              code: "MISSING_FILTERS",
            },
          };
        }
        finalBuilder = applyFilters(
          queryBuilder.update(args.payload),
          args.filters
        ).select();
        break;
      case "delete":
        if (!args.filters || args.filters.length === 0) {
          return {
            data: null,
            error: {
              message:
                "Delete operation requires filters to specify which rows to delete.",
              code: "MISSING_FILTERS",
            },
          };
        }
        finalBuilder = applyFilters(
          queryBuilder.delete(),
          args.filters
        ).select();
        break;
    }
    const { data, error } = await finalBuilder.abortSignal(signal);
    return { data, error };
  } catch (err: any) {
    return {
      error: {
        message: err?.message || "An unknown client-side error occurred.",
        code: "CLIENT_ERROR",
      },
    };
  }
};
