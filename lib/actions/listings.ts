"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { PROPERTIES_TAG } from "@/lib/data/properties";
import { createClient } from "@/lib/supabase/server";
import { listingSchema, STORAGE_PREFIX, type ListingInput } from "@/lib/validation/listing";

/*
 * Create / update a listing. Server Actions are reachable by anyone, so each one:
 *   1. re-checks the caller is an admin,  2. re-validates every field,
 *   3. only accepts photos from our own bucket (or photos the listing already had).
 * The database's security rules then check the admin again.
 */

export type SaveListingResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ListingInput, string>> };

const SESSION_EXPIRED: SaveListingResult = { ok: false, error: "Your session has expired. Please sign in again." };

type Supabase = Awaited<ReturnType<typeof createClient>>;

function invalid(error: z.ZodError): SaveListingResult {
  const fieldErrors: Partial<Record<keyof ListingInput, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof ListingInput;
    fieldErrors[field] ??= issue.message;
  }
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
}

/** Photos must be in our bucket, unless the listing already had them (e.g. sample Unsplash photos). */
function checkImages(images: string[], alreadyOnListing: string[] = []): SaveListingResult | null {
  const foreign = images.filter((url) => !url.startsWith(STORAGE_PREFIX) && !alreadyOnListing.includes(url));
  if (foreign.length === 0) return null;
  return {
    ok: false,
    error: "Some photos aren't from your uploads.",
    fieldErrors: { images: "Remove photos that weren't uploaded here, then try again." },
  };
}

/** "Web address taken" → suggest the first free "-2", "-3", … variant. */
async function slugTaken(supabase: Supabase, slug: string): Promise<SaveListingResult> {
  const { data } = await supabase.from("properties").select("slug").like("slug", `${slug}-%`);
  const used = new Set((data ?? []).map((row) => row.slug));
  let n = 2;
  while (used.has(`${slug}-${n}`)) n++;
  return {
    ok: false,
    error: "Another listing already uses this web address.",
    fieldErrors: { slug: `Already in use — try "${slug}-${n}"` },
  };
}

function toRow(input: ListingInput) {
  return {
    ...input,
    description: input.description || null,
  };
}

function saveFailed(action: string, error: { code: string; message: string }): SaveListingResult {
  console.error(`[${action}] ${error.code}: ${error.message}`);
  return { ok: false, error: "Couldn't save the listing. Please try again." };
}

export async function createProperty(id: unknown, input: unknown): Promise<SaveListingResult> {
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid request." };
  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (!(await getAdmin())) return SESSION_EXPIRED;

  const imageProblem = checkImages(parsed.data.images);
  if (imageProblem) return imageProblem;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .insert({ id: parsedId.data, ...toRow(parsed.data) })
    .select("id, slug")
    .single();

  if (error?.code === "23505" && error.message.includes("slug")) return slugTaken(supabase, parsed.data.slug);
  if (error) return saveFailed("createProperty", error);

  updateTag(PROPERTIES_TAG); // public site shows it immediately
  return { ok: true, id: data.id, slug: data.slug };
}

export async function updateProperty(id: unknown, input: unknown): Promise<SaveListingResult> {
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid request." };
  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (!(await getAdmin())) return SESSION_EXPIRED;

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("properties")
    .select("images")
    .eq("id", parsedId.data)
    .maybeSingle();
  if (readError) return saveFailed("updateProperty", readError);
  if (!existing) return { ok: false, error: "This listing no longer exists." };

  const imageProblem = checkImages(parsed.data.images, existing.images);
  if (imageProblem) return imageProblem;

  const { data, error } = await supabase
    .from("properties")
    .update(toRow(parsed.data))
    .eq("id", parsedId.data)
    .select("id, slug")
    .single();

  if (error?.code === "23505" && error.message.includes("slug")) return slugTaken(supabase, parsed.data.slug);
  if (error) return saveFailed("updateProperty", error);

  // Delete photos that were removed — only our own uploads, and only now that the save succeeded
  const removed = existing.images
    .filter((url) => url.startsWith(STORAGE_PREFIX) && !parsed.data.images.includes(url))
    .map((url) => url.slice(STORAGE_PREFIX.length));
  if (removed.length) {
    const { error: storageError } = await supabase.storage.from("property-images").remove(removed);
    if (storageError) console.error(`[updateProperty] removed photos not deleted: ${storageError.message}`);
  }

  updateTag(PROPERTIES_TAG);
  return { ok: true, id: data.id, slug: data.slug };
}
