/**
 * Indian-market number formatting.
 *   formatPrice(32000000)           → "₹3.2 Cr"
 *   formatPrice(8500000)            → "₹85 L"
 *   formatPrice(45000, "Rent")      → "₹45,000/month"
 *   formatPriceFull(32000000)       → "₹3,20,00,000"
 *   formatArea(2400)                → "2,400 sq.ft."
 */

export type ListingType = "Sale" | "Rent";

const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const upTo2Decimals = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Short price in Lakh / Crore, e.g. "₹2.5 Cr". Rent gets a "/month" suffix. */
export function formatPrice(price: number, listingType: ListingType = "Sale"): string {
  const suffix = listingType === "Rent" ? "/month" : "";

  // Round first, so 99.999 L becomes 1 Cr rather than "100 L"
  const crores = round2(price / CRORE);
  if (crores >= 1) return `₹${upTo2Decimals.format(crores)} Cr${suffix}`;

  const lakhs = round2(price / LAKH);
  if (lakhs >= 1) return `₹${upTo2Decimals.format(lakhs)} L${suffix}`;

  return `₹${inr.format(price)}${suffix}`;
}

/** Full rupee amount with Indian digit grouping, e.g. "₹3,20,00,000". */
export function formatPriceFull(price: number): string {
  return `₹${inr.format(price)}`;
}

export function formatArea(sqft: number): string {
  return `${inr.format(sqft)} sq.ft.`;
}
