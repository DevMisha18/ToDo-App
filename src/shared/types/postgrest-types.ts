import { createClient } from "@/shared/utils/supabase/client";

const supabase = createClient();

const PostgrestFilterBuilder = supabase.from("todos").select("*");
export type PostgrestFilterBuilder = typeof PostgrestFilterBuilder;
