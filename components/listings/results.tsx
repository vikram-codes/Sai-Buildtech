import Link from "next/link";
import { SearchX } from "lucide-react";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/property-card";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import type { PropertyPage } from "@/lib/data/properties";
import { siteConfig } from "@/lib/site-config";
import { catalogueUrl, describeSearch, type CatalogueState } from "@/lib/listings-url";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const gridClass = (view: CatalogueState["view"]) =>
  view === "list" ? "grid gap-6" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function Message({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
      <SearchX className="size-10 text-gold" />
      <h2 className="mt-4 text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-muted-foreground">{text}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">{children}</div>
    </div>
  );
}

export function Results({ result, state }: { result: PropertyPage; state: CatalogueState }) {
  const { items, total, page } = result;

  // Asked for a page past the end (e.g. ?page=9 when there are only 2 pages)
  if (items.length === 0 && total > 0) {
    return (
      <Message
        title="This page doesn't exist"
        text={`There ${total === 1 ? "is 1 property" : `are ${total} properties`} for this search — but not on page ${page}.`}
      >
        <Button asChild>
          <Link href={catalogueUrl({ ...state, page: 1 })}>Go to page 1</Link>
        </Button>
      </Message>
    );
  }

  // Nothing matches the filters
  if (items.length === 0) {
    const message = `Hi ${siteConfig.name}, I'm looking for ${describeSearch(state)}. Do you have anything suitable?`;
    return (
      <Message
        title="No properties match these filters"
        text="Try removing a filter — or tell us what you're looking for and we'll find options for you."
      >
        <Button asChild variant="outline">
          <Link href={catalogueUrl({ view: state.view })}>Clear filters</Link>
        </Button>
        <Button asChild variant="whatsapp">
          <a href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" /> Tell us what you need
          </a>
        </Button>
      </Message>
    );
  }

  return (
    <div className={gridClass(state.view)}>
      {items.map((property, i) => (
        <PropertyCard key={property.id} property={property} layout={state.view} priority={i < 3} />
      ))}
    </div>
  );
}

/** Placeholder cards while results load. */
export function ResultsSkeleton({ view }: { view?: CatalogueState["view"] }) {
  return (
    <div className={cn(gridClass(view))}>
      {Array.from({ length: 6 }, (_, i) => (
        <PropertyCardSkeleton key={i} layout={view} />
      ))}
    </div>
  );
}
