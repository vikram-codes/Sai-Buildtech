import { Bath, BedDouble, Building2, LandPlot, Ruler } from "lucide-react";
import type { Property } from "@/lib/data/properties";
import { formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";

type SpecsProps = Pick<Property, "bedrooms" | "bathrooms" | "area_sqft" | "property_type"> & { className?: string };

/**
 * Beds · baths · area. Plots and commercial spaces have no bedrooms, so they show
 * their type instead (never "0 beds").
 */
export function PropertySpecs({ bedrooms, bathrooms, area_sqft, property_type, className }: SpecsProps) {
  const TypeIcon = property_type === "Plot" ? LandPlot : Building2;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground", className)}>
      {bedrooms != null && bedrooms > 0 ? (
        <li className="flex items-center gap-1.5" title="Bedrooms">
          <BedDouble className="size-4 text-gold" />
          {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
        </li>
      ) : (
        <li className="flex items-center gap-1.5">
          <TypeIcon className="size-4 text-gold" />
          {property_type}
        </li>
      )}
      {bathrooms != null && bathrooms > 0 && (
        <li className="flex items-center gap-1.5" title="Bathrooms">
          <Bath className="size-4 text-gold" />
          {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
        </li>
      )}
      {area_sqft != null && (
        <li className="flex items-center gap-1.5" title="Area">
          <Ruler className="size-4 text-gold" />
          {formatArea(area_sqft)}
        </li>
      )}
    </ul>
  );
}
