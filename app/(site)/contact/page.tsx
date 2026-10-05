import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/coming-soon";
import { siteConfig } from "@/lib/site-config";

// Placeholder until the contact page is built (Phase 9)
export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <ComingSoon
      eyebrow="Contact"
      title="Let's talk about your next property"
      description={`Call or WhatsApp us, or visit our office at ${siteConfig.contact.address.full}. ${siteConfig.contact.hours}.`}
    />
  );
}
