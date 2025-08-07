import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "@/utils/supabase/client";
import { setSession } from "@/features/auth/authSlice";

export function AuthUpdater() {
  const dispatch = useDispatch();
  const supabase = createClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setSession(session));
    });
    return subscription.unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
