"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { PROPERTIES_TAG } from "@/lib/data/properties";
import { createClient } from "@/lib/supabase/server";
import { Constants } from "@/types/database";

/*
 * Admin quick actions. Server Actions can be called directly by anyone who knows their ID,
 * so EVERY action re-checks the caller is an admin (and the database's security rules check again).
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

const id = z.uuid();
const SESSION_EXPIRED: ActionResult = { ok: false, error: "Your session has expired. Please sign in again." };

/** Admin check + input validation. Returns an error result, or null when it's OK to proceed. */
async function guard(input: unknown, schema: z.ZodType): Promise<ActionResult | null> {
  if (!schema.safeParse(input).success) return { ok: false, error: "Invalid request." };
  if (!(await getAdmin())) return SESSION_EXPIRED;
  return null;
}

function failed(action: string, error: { code: string; message: string }): ActionResult {
  console.error(`[${action}] ${error.code}: ${error.message}`);
  return { ok: false, error: "Couldn't save the change. Please try again." };
}

/** After a listing changes: expire the public cache (site updates immediately) and refresh this page. */
function listingsChanged() {
  updateTag(PROPERTIES_TAG);
  refresh();
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

async function updateProperty(
  action: string,
  propertyId: string,
  changes: { is_published?: boolean; featured?: boolean; status?: (typeof Constants.public.Enums.property_status)[number] },
): Promise<ActionResult> {
  const supabase = await createClient();
  // .select() so we can tell "no row changed" (e.g. already deleted) apart from success
  const { data, error } = await supabase.from("properties").update(changes).eq("id", propertyId).select("id");
  if (error) return failed(action, error);
  if (!data.length) return { ok: false, error: "That listing no longer exists. Refresh the page." };
  listingsChanged();
  return { ok: true };
}

export async function setPublished(propertyId: string, published: boolean): Promise<ActionResult> {
  const denied = await guard({ propertyId, published }, z.object({ propertyId: id, published: z.boolean() }));
  if (denied) return denied;
  return updateProperty("setPublished", propertyId, { is_published: published });
}

export async function setFeatured(propertyId: string, featured: boolean): Promise<ActionResult> {
  const denied = await guard({ propertyId, featured }, z.object({ propertyId: id, featured: z.boolean() }));
  if (denied) return denied;
  return updateProperty("setFeatured", propertyId, { featured });
}

export async function setStatus(propertyId: string, status: string): Promise<ActionResult> {
  const schema = z.object({ propertyId: id, status: z.enum(Constants.public.Enums.property_status) });
  const denied = await guard({ propertyId, status }, schema);
  if (denied) return denied;
  return updateProperty("setStatus", propertyId, { status: schema.parse({ propertyId, status }).status });
}

export async function deleteProperty(propertyId: string): Promise<ActionResult> {
  const denied = await guard(propertyId, id);
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").delete().eq("id", propertyId).select("images");
  if (error) return failed("deleteProperty", error);
  if (!data.length) return { ok: false, error: "That listing no longer exists. Refresh the page." };

  // Remove its uploaded photos from our storage bucket (sample photos from Unsplash are just links)
  const marker = "/storage/v1/object/public/property-images/";
  const paths = data[0].images.filter((url) => url.includes(marker)).map((url) => url.split(marker)[1]);
  if (paths.length) {
    const { error: storageError } = await supabase.storage.from("property-images").remove(paths);
    if (storageError) console.error(`[deleteProperty] photos not removed: ${storageError.message}`);
  }

  listingsChanged();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------

export async function setInquiryHandled(inquiryId: string, handled: boolean): Promise<ActionResult> {
  const denied = await guard({ inquiryId, handled }, z.object({ inquiryId: id, handled: z.boolean() }));
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase.from("inquiries").update({ handled }).eq("id", inquiryId).select("id");
  if (error) return failed("setInquiryHandled", error);
  if (!data.length) return { ok: false, error: "That inquiry no longer exists. Refresh the page." };
  refresh();
  return { ok: true };
}

export async function deleteInquiry(inquiryId: string): Promise<ActionResult> {
  const denied = await guard(inquiryId, id);
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase.from("inquiries").delete().eq("id", inquiryId).select("id");
  if (error) return failed("deleteInquiry", error);
  if (!data.length) return { ok: false, error: "That inquiry no longer exists. Refresh the page." };
  refresh();
  return { ok: true };
}
