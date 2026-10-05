import { z } from "zod";
import { Constants } from "@/types/database";

export const PAGE_SIZE = 12;

const { city, property_type, property_status } = Constants.public.Enums;

/** Turn "" / junk into undefined, so a bad value is ignored instead of breaking the page. */
const optional = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined);

/**
 * Catalogue filters as they arrive from the URL (?city=Noida&beds=3&page=2 …).
 * Every field is optional and validated: `?city=Paris` or `?page=-5` are simply ignored.
 */
export const listingFiltersSchema = z.object({
  city: optional(z.enum(city)),
  type: optional(z.enum(property_type)),
  status: optional(z.enum(property_status)),
  /** Minimum bedrooms ("3+") */
  beds: optional(z.coerce.number().int().min(1).max(10)),
  /** Whole rupees */
  minPrice: optional(z.coerce.number().int().positive()),
  maxPrice: optional(z.coerce.number().int().positive()),
  /** Locality / title search. Only letters, numbers, spaces and hyphens survive (keeps the query safe). */
  q: optional(
    z
      .string()
      .transform((s) => s.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().slice(0, 60))
      .pipe(z.string().min(1)),
  ),
  page: z.coerce.number().int().min(1).max(1000).catch(1).default(1),
});

export type ListingFilters = z.infer<typeof listingFiltersSchema>;

type SearchParams = Record<string, string | string[] | undefined>;

/** Parse a page's `searchParams` into safe, typed filters. */
export function parseListingFilters(searchParams: SearchParams): ListingFilters {
  // ?city=Delhi&city=Noida → take the first value
  const flat = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  return listingFiltersSchema.parse(flat);
}
