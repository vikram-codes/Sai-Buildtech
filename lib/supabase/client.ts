import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/** Supabase client for Client Components ("use client") — e.g. login form, image uploads. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
