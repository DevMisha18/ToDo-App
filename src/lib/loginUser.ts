import { createClient } from "@/utils/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type loginResult = {
  user: User | null;
  session: Session | null;
  error: string | null;
};

export const loginUser = async (loginCredentials: {
  email: string;
  password: string;
}): Promise<loginResult> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(
    loginCredentials
  );

  if (error) return { user: null, session: null, error: error.message };

  return { user: data.user, session: data.session, error: null };
};
