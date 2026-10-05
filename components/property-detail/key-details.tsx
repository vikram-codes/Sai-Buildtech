import { Bath, BedDouble, Building2, CircleCheck, Ruler } from "lucide-react";
import type { Property } from "@/lib/data/properties";
import { formatArea } from "@/lib/format";

type Props = Pick<Property, "bedrooms" | "bathrooms" | "area_sqft" | "property_type" | "status">;

/** Beds · baths · area · type · status. Missing values (e.g. bedrooms on a plot) are left out. */
export function KeyDetails({ bedrooms, bathrooms, area_sqft, property_type, status }: Props) {
  const items = [
    bedrooms ? { icon: BedDouble, label: "Bedrooms", value: String(bedrooms) } : null,
    bathrooms ? { icon: Bath, label: "Bathrooms", value: String(bathrooms) } : null,
    area_sqft ? { icon: Ruler, label: "Area", value: formatArea(area_sqft) } : null,
    { icon: Building2, label: "Type", value: property_type },
    { icon: CircleCheck, label: "Status", value: status },
  ].filter((item) => item !== null);

  return (
    // Items wrap and stretch to fill each row, so values never get cut off and rows have no gaps
    <dl className="flex flex-wrap gap-px overflow-hidden rounded-xl border bg-border">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex min-w-[9.5rem] flex-1 items-center gap-3 bg-card px-4 py-4">
          <Icon className="size-5 shrink-0 text-gold" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-semibold whitespace-nowrap">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
