import { cacheLife, cacheTag } from "next/cache";
import type { PostgrestError } from "@supabase/supabase-js";
import { PAGE_SIZE, type ListingFilters } from "@/lib/data/filters";
import { CITIES, type City } from "@/lib/site-config";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

/*
 * Every public read of listings goes through this file.
 *
 * Caching: each function is cached ("use cache") and tagged "properties".
 * Admin edits (Phases 11–12) call updateTag(PROPERTIES_TAG) so changes show immediately.
 * Errors: thrown with the function name, e.g. "[getProperties] 42703: column … does not exist".
 */

export const PROPERTIES_TAG = "properties";

export type Property = Tables<"properties">;

/** Columns a card needs — skips the long description and timestamps. */
const CARD_COLUMNS =
  "id, slug, title, listing_type, price, location, city, property_type, status, bedrooms, bathrooms, area_sqft, images, featured";

export type PropertyCardData = Pick<
  Property,
  | "id"
  | "slug"
  | "title"
  | "listing_type"
  | "price"
  | "location"
  | "city"
  | "property_type"
  | "status"
  | "bedrooms"
  | "bathrooms"
  | "area_sqft"
  | "images"
  | "featured"
>;

export type PropertyPage = {
  items: PropertyCardData[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function fail(fn: string, error: PostgrestError): never {
  throw new Error(`[${fn}] ${error.code}: ${error.message}`);
}

/** Featured listings for the homepage, newest first. */
export async function getFeaturedProperties(limit = 6): Promise<PropertyCardData[]> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("properties")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) fail("getFeaturedProperties", error);
  return data;
}

/** Every published slug — used to pre-build the detail pages at deploy time. */
export async function getPublishedSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient().from("properties").select("slug").eq("is_published", true);
  if (error) fail("getPublishedSlugs", error);
  return data.map((row) => row.slug);
}

/** Number of published listings in each city, e.g. { Delhi: 8, Noida: 3, Gurugram: 4 }. */
export async function getCityCounts(): Promise<Record<City, number>> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient().from("properties").select("city").eq("is_published", true);
  if (error) fail("getCityCounts", error);

  const counts = Object.fromEntries(CITIES.map((city) => [city, 0])) as Record<City, number>;
  for (const { city } of data) counts[city] += 1;
  return counts;
}

/** The catalogue query with all filters applied (no ordering/paging). */
function filteredQuery(filters: ListingFilters, options: { count: "exact"; head?: boolean }) {
  const { city, type, status, beds, minPrice, maxPrice, q } = filters;

  let query = createPublicClient().from("properties").select(CARD_COLUMNS, options).eq("is_published", true);

  if (city) query = query.eq("city", city);
  if (type) query = query.eq("property_type", type);
  if (status) query = query.eq("status", status);
  if (beds) query = query.gte("bedrooms", beds);
  if (minPrice) query = query.gte("price", minPrice);
  if (maxPrice) query = query.lte("price", maxPrice);
  // Budgets are sale prices. Without this, "Under ₹1 Cr" would match monthly rents (₹45,000 < ₹1 Cr).
  if (minPrice || maxPrice) query = query.eq("listing_type", "Sale");
  // `q` is already stripped to letters/numbers/spaces/hyphens in filters.ts, so it's safe inside or()
  if (q) query = query.or(`location.ilike.%${q}%,title.ilike.%${q}%`);

  return query;
}

/** One page of catalogue results for the given filters, newest first. */
export async function getProperties(
  filters: ListingFilters,
  { pageSize = PAGE_SIZE }: { pageSize?: number } = {},
): Promise<PropertyPage> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  const { page } = filters;
  const from = (page - 1) * pageSize;

  const { data, count, error } = await filteredQuery(filters, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id") // tie-breaker so paging is stable
    .range(from, from + pageSize - 1);

  let total = count ?? 0;
  if (error?.code === "PGRST103") {
    // Asked for a page past the end (e.g. ?page=50). Supabase returns no count in that case,
    // so fetch the count on its own — the page can then say "15 results" and offer page 1.
    const counted = await filteredQuery(filters, { count: "exact", head: true });
    if (counted.error) fail("getProperties", counted.error);
    total = counted.count ?? 0;
  } else if (error) {
    fail("getProperties", error);
  }

  return {
    items: data ?? [],
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Full listing for the detail page, or null if it doesn't exist / isn't published. */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  // Skip the database for URLs that can't be a real slug
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;

  const { data, error } = await createPublicClient()
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) fail("getPropertyBySlug", error);
  return data;
}

/**
 * Up to `limit` other listings like this one. Same type AND city ranks first,
 * then same type, then same city.
 */
export async function getSimilarProperties(
  property: Pick<Property, "id" | "city" | "property_type">,
  limit = 3,
): Promise<PropertyCardData[]> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("properties")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .neq("id", property.id)
    .or(`city.eq."${property.city}",property_type.eq."${property.property_type}"`)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) fail("getSimilarProperties", error);

  const score = (p: PropertyCardData) =>
    (p.property_type === property.property_type ? 2 : 0) + (p.city === property.city ? 1 : 0);

  // Array.sort is stable, so equal scores keep newest-first order
  return data.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
