/**
 * Standard amenity names. Listings use these exact strings so wording stays consistent
 * across the site (and filters/checkboxes in the admin form can rely on them).
 * Add new ones here rather than typing free text into a listing.
 */
export const AMENITIES = [
  // Building & security
  "Lift",
  "Power backup",
  "24×7 security",
  "Gated community",
  "Covered parking",
  "Visitor parking",
  "Fire safety",

  // Inside the home
  "Modular kitchen",
  "Italian marble flooring",
  "Wooden flooring",
  "Central air conditioning",
  "Home automation",
  "Servant room",
  "Private terrace",
  "Private garden",
  "Private pool",

  // Society / community
  "Club house",
  "Swimming pool",
  "Gym",
  "Kids' play area",
  "Jogging track",

  // Location & plot
  "Park facing",
  "Corner property",
  "Vastu compliant",
  "Metro nearby",
  "Freehold",
  "Wide road access",

  // Commercial
  "High footfall",
  "Pantry",
  "Washrooms",
] as const;

export type Amenity = (typeof AMENITIES)[number];
