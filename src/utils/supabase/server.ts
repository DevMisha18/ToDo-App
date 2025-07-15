// In utils/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next"; // Import NextApiRequest and NextApiResponse
import { serialize } from "cookie"; // Import serialize and parse from 'cookie'
import type { Database } from "@/types/database.type";

// This createClient function is now specifically for Pages Router API routes
export const createClient = (req: NextApiRequest, res: NextApiResponse) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Get cookies from the incoming request's headers
          // req.cookies already provides parsed cookies for NextApiRequest
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookies by adding a 'Set-Cookie' header to the response
          const cookieHeader = serialize(name, value, options);
          // Use res.setHeader to set the cookie. If there are existing Set-Cookie headers, append to them.
          const existingSetCookies = res.getHeader("Set-Cookie");
          if (Array.isArray(existingSetCookies)) {
            res.setHeader("Set-Cookie", [...existingSetCookies, cookieHeader]);
          } else if (existingSetCookies) {
            res.setHeader("Set-Cookie", [
              existingSetCookies as string,
              cookieHeader,
            ]);
          } else {
            res.setHeader("Set-Cookie", cookieHeader);
          }
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie by setting its maxAge to -1
          res.setHeader(
            "Set-Cookie",
            serialize(name, "", { ...options, maxAge: -1 })
          );
        },
      },
    }
  );
};
