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

/**
 * All inquiries (newest first, up to 500) in ONE query — the page filters New/Handled and
 * counts them itself, instead of making a separate round trip to Supabase for each.
 */
export async function getInquiries(): Promise<AdminInquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, property:properties(title, slug)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) fail("getInquiries", error);
  return data;
}

/** How many inquiries are still new — for the "Inquiries (n)" tab. One small query. */
export async function getNewInquiryCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("handled", false);
  if (error) fail("getNewInquiryCount", error);
  return count ?? 0;
}

/** One listing with every field, for the edit form. Null if the id is malformed or not found. */
export async function getAdminProperty(id: string): Promise<Tables<"properties"> | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (error) fail("getAdminProperty", error);
  return data;
}
