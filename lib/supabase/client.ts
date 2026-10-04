import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

/** Supabase client for Client Components ("use client") — e.g. login form, image uploads. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
