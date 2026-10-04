import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 "proxy" (formerly middleware): runs before each matched request.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Everything except Next.js internals, icons and image files (they never need a session).
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
