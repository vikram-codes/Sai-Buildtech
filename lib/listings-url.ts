import { BUDGETS } from "@/lib/budgets";
import type { ListingFilters } from "@/lib/data/filters";

/*
 * The one place that turns catalogue state into /listings URLs and readable text.
 * Used by the homepage search, filter bar, chips, pagination and page titles.
 */

export type CatalogueView = "grid" | "list";

/** Filters + layout. Everything optional; page defaults to 1, view to "grid". */
export type CatalogueState = Partial<ListingFilters> & { view?: CatalogueView };

export function parseView(value: string | string[] | undefined): CatalogueView {
  return (Array.isArray(value) ? value[0] : value) === "list" ? "list" : "grid";
}

/** Build a /listings URL. Defaults (page 1, grid view) are left out to keep links short. */
export function catalogueUrl({ city, type, status, beds, minPrice, maxPrice, q, page, view }: CatalogueState) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (type) params.set("type", type);
  if (beds) params.set("beds", String(beds));
  if (minPrice) params.set("minPrice", String(minPrice));
  if (maxPrice) params.set("maxPrice", String(maxPrice));
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (view === "list") params.set("view", "list");
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}

/** Homepage search → URL (budget given as a BUDGETS id). */
export function buildListingsUrl({ city, type, budget }: { city?: string; type?: string; budget?: string }) {
  const range = BUDGETS.find((b) => b.id === budget);
  return catalogueUrl({
    city: city as ListingFilters["city"],
    type: type as ListingFilters["type"],
    minPrice: range?.min,
    maxPrice: range?.max,
  });
}

/** The BUDGETS id matching a min/max pair, or undefined if it's not one of the presets. */
export function budgetIdFor(minPrice?: number, maxPrice?: number) {
  if (!minPrice && !maxPrice) return undefined;
  return BUDGETS.find((b) => b.min === minPrice && b.max === maxPrice)?.id;
}

/** Human label for the price filter, e.g. "₹5 – 10 Cr" (falls back to a generic range). */
export function budgetLabel(minPrice?: number, maxPrice?: number) {
  const id = budgetIdFor(minPrice, maxPrice);
  if (id) return BUDGETS.find((b) => b.id === id)!.label;
  const cr = (n: number) => `₹${+(n / 1_00_00_000).toFixed(2)} Cr`;
  if (minPrice && maxPrice) return `${cr(minPrice)} – ${cr(maxPrice)}`;
  if (minPrice) return `From ${cr(minPrice)}`;
  if (maxPrice) return `Up to ${cr(maxPrice)}`;
  return undefined;
}

const PLURAL_TYPES: Record<string, string> = {
  Apartment: "Apartments",
  Villa: "Villas",
  Penthouse: "Penthouses",
  "Builder Floor": "Builder Floors",
  Plot: "Plots",
  Commercial: "Commercial spaces",
};

/** Headline for the current filters: "Villas in Noida", "Properties in Delhi", "Properties". */
export function describeFilters({ city, type }: Pick<CatalogueState, "city" | "type">) {
  const what = type ? PLURAL_TYPES[type] : "Properties";
  return city ? `${what} in ${city}` : what;
}

/** One-line summary for a WhatsApp message, e.g. "a Villa in Noida, 4+ bedrooms, ₹5 – 10 Cr". */
export function describeSearch({ city, type, beds, minPrice, maxPrice, q }: CatalogueState) {
  const parts = [
    `${type ? `a ${type}` : "a property"}${city ? ` in ${city}` : ""}${q ? ` (${q})` : ""}`,
    beds ? `${beds}+ bedrooms` : undefined,
    budgetLabel(minPrice, maxPrice),
  ];
  return parts.filter(Boolean).join(", ");
}
