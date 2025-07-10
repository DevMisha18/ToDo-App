import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";
import type { RootState } from "@/store";

export type sessionState = {
  session: Session | null;
};

const initialState: sessionState = {
  session: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export const selectSession = (state: RootState) => state.session;
