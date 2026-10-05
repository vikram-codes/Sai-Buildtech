import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

/*
 * Reads for the admin area. These use the logged-in admin's session (cookies), so they see
 * hidden listings and inquiries — and are never cached. Call only after requireAdmin().
 */

function fail(fn: string, error: { code: string; message: string }): never {
  throw new Error(`[${fn}] ${error.code}: ${error.message}`);
}

export type AdminProperty = Pick<
  Tables<"properties">,
  | "id"
  | "slug"
  | "title"
  | "listing_type"
  | "price"
  | "location"
  | "city"
  | "property_type"
  | "status"
  | "featured"
  | "is_published"
  | "images"
  | "updated_at"
>;

/** Every listing, published or not, most recently changed first. */
export async function getAdminProperties(): Promise<AdminProperty[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title, listing_type, price, location, city, property_type, status, featured, is_published, images, updated_at",
    )
    .order("updated_at", { ascending: false });
  if (error) fail("getAdminProperties", error);
  return data;
}

export type InquiryFilter = "new" | "handled" | "all";

export type AdminInquiry = Tables<"inquiries"> & {
  property: { title: string; slug: string } | null;
};

/** Inquiries, newest first, with the title/slug of the listing they're about. */
export async function getInquiries(filter: InquiryFilter): Promise<AdminInquiry[]> {
  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select("*, property:properties(title, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter === "new") query = query.eq("handled", false);
  if (filter === "handled") query = query.eq("handled", true);

  const { data, error } = await query;
  if (error) fail("getInquiries", error);
  return data;
}

/** Counts for the summary row and the "Inquiries (n)" tab. */
export async function getAdminStats() {
  const supabase = await createClient();
  const [listings, hidden, featured, newInquiries, handled] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("handled", false),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("handled", true),
  ]);

  for (const [name, result] of Object.entries({ listings, hidden, featured, newInquiries, handled })) {
    if (result.error) fail(`getAdminStats:${name}`, result.error);
  }

  return {
    listings: listings.count ?? 0,
    hiddenListings: hidden.count ?? 0,
    featuredListings: featured.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
    handledInquiries: handled.count ?? 0,
  };
}
