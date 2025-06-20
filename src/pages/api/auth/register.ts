import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod/v4";
import { backendSignUpSchema } from "@/schemas/auth";
import { supabase } from "@/lib/supabase";
import { isAuthApiError } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const result = backendSignUpSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ errors: z.treeifyError(result.error) });
        return;
      }

      const { data, error } = await supabase.auth.signUp(result.data);
      // Should create redux toolkit slice and set the user info in it

      if (error && isAuthApiError(error)) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(201).json({ ok: true });
      return;
    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
