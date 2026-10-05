import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/**
 * Supabase client for PUBLIC reads (listings anyone can see). No cookies, no login session —
 * which is what lets these reads be cached with "use cache" (cookies can't be read inside a cache).
 * Security rules still apply: it only ever sees published listings.
 * For anything that depends on who's logged in, use lib/supabase/server.ts instead.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
