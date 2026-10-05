import Link from "next/link";
import { MapPin } from "lucide-react";
import { FeaturedBadge, ListingTypeBadge, StatusBadge } from "@/components/property/listing-badges";
import { PropertyImageCarousel } from "@/components/property/property-image-carousel";
import { PropertySpecs } from "@/components/property/property-specs";
import type { PropertyCardData } from "@/lib/data/properties";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  property: PropertyCardData;
  /** "grid": photo on top (default). "list": photo left, details right (from 640px up). */
  layout?: "grid" | "list";
  /** Load the cover photo immediately — for cards visible without scrolling. */
  priority?: boolean;
  className?: string;
};

export function PropertyCard({ property, layout = "grid", priority, className }: Props) {
  const href = `/listings/${property.slug}`;
  const isList = layout === "list";

  return (
    <article
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0",
        isList && "sm:flex-row",
        className,
      )}
    >
      <div className={cn("relative", isList && "sm:w-2/5 sm:shrink-0")}>
        <PropertyImageCarousel
          images={property.images}
          alt={property.title}
          href={href}
          priority={priority}
          sizes={
            isList
              ? "(min-width: 1152px) 460px, (min-width: 640px) 40vw, 100vw"
              : "(min-width: 1152px) 370px, (min-width: 768px) 50vw, 100vw"
          }
          className={cn("aspect-[4/3]", isList && "sm:aspect-auto sm:h-full sm:min-h-56")}
        />
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          <ListingTypeBadge type={property.listing_type} />
          {property.featured && <FeaturedBadge />}
          <StatusBadge status={property.status} />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col gap-2 p-5", isList && "sm:justify-center sm:p-6")}>
        <p className="font-serif text-2xl text-gold">{formatPrice(property.price, property.listing_type)}</p>
        <h3 className={cn("line-clamp-2 font-sans text-base leading-snug font-semibold", isList && "sm:text-lg")}>
          <Link href={href} className="hover:underline focus-visible:underline focus-visible:outline-none">
            {property.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-gold" />
          {property.location}, {property.city}
        </p>
        <PropertySpecs
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          area_sqft={property.area_sqft}
          property_type={property.property_type}
          className="mt-auto border-t pt-3"
        />
      </div>
    </article>
  );
}

/** Grey placeholder with the card's shape, shown while listings load. */
export function PropertyCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  const isList = layout === "list";
  return (
    <div
      aria-hidden
      className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", isList && "sm:flex-row")}
    >
      <div className={cn("aspect-[4/3] animate-pulse bg-muted", isList && "sm:aspect-auto sm:min-h-56 sm:w-2/5")} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-7 w-28 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
