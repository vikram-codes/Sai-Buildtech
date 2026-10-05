"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { siteConfig } from "@/lib/site-config";
import {
  MIN_FILL_TIME_MS,
  inquirySubmissionSchema,
  type InquiryInput,
} from "@/lib/validation/inquiry";

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof InquiryInput, string>> };

/**
 * Save an inquiry from the contact form or a property page.
 * Everything is re-checked here — never trust what the browser sends.
 */
export async function submitInquiry(input: unknown): Promise<InquiryResult> {
  const parsed = inquirySubmissionSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof InquiryInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof InquiryInput;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const { name, phone, email, message, propertyId, source, website, elapsedMs } = parsed.data;

  // Spam checks. Bots get a normal "thanks" so they don't learn what gave them away.
  const tooFast = elapsedMs < MIN_FILL_TIME_MS;
  if (website || tooFast) {
    console.warn(`[submitInquiry] dropped likely spam (${website ? "honeypot" : "too fast"})`);
    return { ok: true };
  }

  const { error } = await createPublicClient()
    .from("inquiries")
    .insert({
      name,
      phone,
      email: email || null,
      message: message || null,
      property_id: propertyId ?? null,
      source,
    });

  if (error) {
    console.error(`[submitInquiry] ${error.code}: ${error.message}`);
    return {
      ok: false,
      error: `Sorry, we couldn't send your message. Please call or WhatsApp us on ${siteConfig.contact.phoneDisplay}.`,
    };
  }

  return { ok: true };
}
