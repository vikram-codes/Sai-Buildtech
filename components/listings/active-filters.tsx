import Link from "next/link";
import { X } from "lucide-react";
import { budgetLabel, catalogueUrl, type CatalogueState } from "@/lib/listings-url";

/**
 * Removable chips for each active filter. Plain links (no JavaScript needed):
 * each chip links to the same search without that filter.
 */
export function ActiveFilters({ state }: { state: CatalogueState }) {
  const { city, type, beds, minPrice, maxPrice, status, q } = state;
  const chips: { label: string; without: Partial<CatalogueState> }[] = [];

  if (city) chips.push({ label: city, without: { city: undefined } });
  if (type) chips.push({ label: type, without: { type: undefined } });
  if (beds) chips.push({ label: `${beds}+ beds`, without: { beds: undefined } });
  if (minPrice || maxPrice)
    chips.push({ label: budgetLabel(minPrice, maxPrice)!, without: { minPrice: undefined, maxPrice: undefined } });
  if (status) chips.push({ label: status, without: { status: undefined } });
  if (q) chips.push({ label: `“${q}”`, without: { q: undefined } });

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map(({ label, without }) => (
        <li key={label}>
          <Link
            href={catalogueUrl({ ...state, ...without, page: 1 })}
            scroll={false}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 py-1 pr-2 pl-3 text-sm text-foreground transition-colors hover:border-gold/60"
            aria-label={`Remove filter: ${label}`}
          >
            {label}
            <X className="size-3.5 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
