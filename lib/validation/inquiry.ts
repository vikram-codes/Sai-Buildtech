import { z } from "zod";

/*
 * Inquiry form rules — used by the form (instant feedback) AND the Server Action (the real check).
 * They match the database's own rules in supabase/migrations/0004_inquiries.sql, so anything that
 * passes here will also be accepted by the database.
 */

const digitCount = (s: string) => s.replace(/\D/g, "").length;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number, e.g. +91 98765 43210")
    .refine((s) => digitCount(s) >= 7 && digitCount(s) <= 15, "Enter a valid phone number, e.g. +91 98765 43210"),
  email: z.union([z.literal(""), z.email("Enter a valid email, or leave it blank").max(254)]),
  message: z.string().trim().max(2000, "Please keep the message under 2,000 characters"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** What the browser sends to the Server Action: the form plus context and spam checks. */
export const inquirySubmissionSchema = inquirySchema.extend({
  propertyId: z.uuid().optional(),
  source: z.enum(["contact", "property"]),
  /** Hidden "honeypot" field. People never see it; bots fill it in. */
  website: z.string().max(200).optional(),
  /** Milliseconds between page load and submit. Under 3 seconds is too fast for a person. */
  elapsedMs: z.number().int().nonnegative(),
});

export type InquirySubmission = z.infer<typeof inquirySubmissionSchema>;

export const MIN_FILL_TIME_MS = 3000;
