import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_LOGIN } from "@/lib/admin-paths";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/**
 * Runs on every page request (via /proxy.ts). Refreshes an expiring login session and
 * writes the new cookies to both the request (for Server Components) and the response (for the browser).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
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
  const { data } = await supabase.auth.getClaims();

  // First line of defence for the admin area: no valid session → login page.
  // (The admin layout then checks the user is actually an admin, and the database checks again.)
  const { pathname, search } = request.nextUrl;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminArea && pathname !== ADMIN_LOGIN && !data?.claims) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    const redirect = NextResponse.redirect(url);
    // Carry over any refreshed cookies, or the browser and server get out of sync
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  // Always return `response` as-is, or the refreshed cookies are lost and the admin gets logged out.
  return response;
}
