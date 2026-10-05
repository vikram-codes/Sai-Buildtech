import type { City } from "@/lib/site-config";

/*
 * Fixed photos used by the homepage (not listing photos — those live in the database).
 * Source: Unsplash (free licence, no attribution required). Swap a URL here to change a photo.
 */

const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=2400&q=80&fm=jpg&fit=crop`;

export const HERO_IMAGE = {
  src: unsplash("photo-1711963383450-44f5d482f25b"),
  alt: "A modern luxury villa lit up at dusk",
};

export const CITY_IMAGES: Record<City, { src: string; alt: string }> = {
  Delhi: { src: unsplash("photo-1587474260584-136574528ed5"), alt: "India Gate, New Delhi, at sunset" },
  Noida: { src: unsplash("photo-1565600444930-9761b1d1fc01"), alt: "The Noida skyline at sunset" },
  Gurugram: { src: unsplash("photo-1689338039987-8a2539194e27"), alt: "Glass office towers in Cyber City, Gurugram" },
};
