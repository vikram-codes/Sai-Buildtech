import { createClient } from "@/lib/supabase/server";

/*
 * Reads for the admin area. These use the logged-in admin's session (cookies), so they see
 * hidden listings and inquiries — and are never cached. Call only after requireAdmin().
 */

export async function getAdminStats() {
  const supabase = await createClient();
  const [listings, hidden, inquiries] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("handled", false),
  ]);

  for (const [name, result] of Object.entries({ listings, hidden, inquiries })) {
    if (result.error) throw new Error(`[getAdminStats:${name}] ${result.error.code}: ${result.error.message}`);
  }

  return {
    listings: listings.count ?? 0,
    hiddenListings: hidden.count ?? 0,
    newInquiries: inquiries.count ?? 0,
  };
}
