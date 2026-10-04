import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Runs on every page request (via /proxy.ts). Refreshes an expiring login session and
 * writes the new cookies to both the request (for Server Components) and the response (for the browser).
 * Admin route protection is added here in Phase 10.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Cache headers stop a CDN from caching a response that carries someone's session
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Keep this call directly after createServerClient — it's what refreshes the session.
  // getClaims() verifies the token's signature; never trust getSession() on the server.
  await supabase.auth.getClaims();

  // Always return `response` as-is, or the refreshed cookies are lost and the admin gets logged out.
  return response;
}
