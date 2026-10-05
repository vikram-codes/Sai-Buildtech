import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/coming-soon";

// Placeholder until the catalogue is built (Phase 7)
export const metadata: Metadata = { title: "Listings" };

export default function ListingsPage() {
  return (
    <ComingSoon
      eyebrow="Listings"
      title="Our property catalogue is almost ready"
      description="Browse apartments, villas, builder floors and commercial spaces across Delhi, Noida and Gurugram — launching shortly. In the meantime, tell us what you're looking for and we'll share matching properties."
    />
  );
}
