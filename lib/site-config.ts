/**
 * Single source of truth for business details.
 * Change a phone number, address or link here and it updates everywhere.
 */

import { Constants, type Enums } from "@/types/database";

// Comes from the database's `city` list — add a city with a migration, not here.
export const CITIES = Constants.public.Enums.city;
export type City = Enums<"city">;

export const siteConfig = {
  name: "Sai Buildtech",
  tagline: "Premium Properties across Delhi NCR",
  description:
    "Sai Buildtech helps you buy, sell and rent premium apartments, villas, builder floors and commercial spaces across Delhi, Noida and Gurugram.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    phoneDisplay: "+91 82878 29725",
    phoneHref: "tel:+918287829725",
    // Digits only, with country code — format required by wa.me links
    whatsapp: "918287829725",
    email: "info@saibuildtech.com", // placeholder until the real address is confirmed
    address: {
      line1: "70 Radhey Shyam Park, Parwana Road",
      line2: "Krishna Nagar, Delhi 110051",
      full: "70 Radhey Shyam Park, Parwana Road, Krishna Nagar, Delhi 110051",
    },
    // ⚠️ PLACEHOLDER — real opening hours not confirmed yet. Update both lines together.
    hours: "Mon – Sat, 10:00 AM – 7:00 PM",
    /** Same hours in machine-readable form (for Google's business listing data on /contact). */
    openingHours: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  },

  cities: CITIES,

  nav: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
