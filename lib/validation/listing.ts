import { z } from "zod";
import { AMENITIES } from "@/lib/amenities";
import { SLUG_PATTERN } from "@/lib/slug";
import { Constants } from "@/types/database";

/*
 * Listing form rules — shared by the admin form (instant feedback) and the Server Actions
 * (the real check). They mirror the database's own rules in supabase/migrations/0001_properties.sql.
 */

const { listing_type, property_type, property_status, city } = Constants.public.Enums;

/** Property types that have no bedrooms/bathrooms (the form hides those fields). */
export const NO_ROOMS_TYPES: readonly string[] = ["Plot", "Commercial"];

/** Photos must live in our own storage bucket — or be sample photos already on a listing (checked in the action). */
export const STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/`;

const count = (label: string, max: number) =>
  z
    .number({ error: `Enter the number of ${label}` })
    .int(`Use a whole number of ${label}`)
    .min(0, `Can't be negative`)
    .max(max, `That seems too many ${label}`)
    .nullable();

export const listingSchema = z
  .object({
    title: z.string().trim().min(3, "Give the listing a title (at least 3 characters)").max(200, "Title is too long"),
    listing_type: z.enum(listing_type),
    property_type: z.enum(property_type, { error: "Choose a property type" }),
    status: z.enum(property_status),
    city: z.enum(city, { error: "Choose a city" }),
    location: z.string().trim().min(2, "Enter the locality, e.g. Vasant Vihar").max(200, "Locality is too long"),
    price: z
      .number({ error: "Enter a price" })
      .int()
      .positive("Enter a price")
      .max(100_000_00_00_000, "That price looks too high — check the unit (Lakh / Crore)"),
    bedrooms: count("bedrooms", 50),
    bathrooms: count("bathrooms", 50),
    area_sqft: z
      .number({ error: "Enter the area in sq.ft." })
      .int("Use a whole number")
      .positive("Area must be more than 0")
      .max(10_000_000, "That area looks too large")
      .nullable(),
    description: z.string().trim().max(10_000, "Description is too long"),
    amenities: z.array(z.enum(AMENITIES)).max(40),
    images: z
      .array(z.url("Invalid photo address"))
      .min(1, "Add at least one photo")
      .max(30, "Up to 30 photos per listing"),
    featured: z.boolean(),
    is_published: z.boolean(),
    slug: z
      .string()
      .trim()
      .min(3, "Web address is too short")
      .max(120, "Web address is too long")
      .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens only, e.g. 3-bhk-flat-noida"),
  })
  .superRefine((value, ctx) => {
    if (NO_ROOMS_TYPES.includes(value.property_type)) {
      const what = value.property_type === "Plot" ? "Plots" : "Commercial spaces";
      if (value.bedrooms !== null)
        ctx.addIssue({ code: "custom", path: ["bedrooms"], message: `${what} don't have bedrooms` });
      if (value.bathrooms !== null)
        ctx.addIssue({ code: "custom", path: ["bathrooms"], message: `${what} don't have bathrooms` });
    }
  });

export type ListingInput = z.infer<typeof listingSchema>;
