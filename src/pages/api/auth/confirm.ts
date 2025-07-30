import type { NextApiRequest, NextApiResponse } from "next/";
import { createClient } from "@/utils/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const { code } = req.query;
  if (code) {
    const supabase = createClient(req, res);

    // Exchange the code for a session (which contains access and refresh tokens)
    const { error } = await supabase.auth.exchangeCodeForSession(
      code as string
    );

    if (!error) {
      // The session data (data.session) will contain the access and refresh tokens.
      // Supabase's SSR client automatically stores these in cookies.

      // Optionally, you can log or inspect data.session to see the tokens
      // console.log("Session data:", data.session);

      // Redirect user to specified redirect URL or root of app
      return res.redirect(307, "/");
    } else {
      console.error("Error exchanging code for session:", error);
    }
  }

  // If no code is present or other issues, redirect to an error page
  return res.redirect(307, "/error");
}
