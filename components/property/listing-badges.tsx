import { Star } from "lucide-react";
import type { Property } from "@/lib/data/properties";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide backdrop-blur-sm";

/** Gold "For Sale" / emerald "For Rent". */
export function ListingTypeBadge({ type, className }: { type: Property["listing_type"]; className?: string }) {
  return type === "Rent" ? (
    <span className={cn(base, "border-emerald/30 bg-background/90 text-emerald", className)}>For Rent</span>
  ) : (
    <span className={cn(base, "border-gold/30 bg-background/90 text-gold", className)}>For Sale</span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span className={cn(base, "border-transparent bg-primary text-primary-foreground", className)}>
      <Star className="size-3 fill-current" /> Featured
    </span>
  );
}

const STATUS_STYLES: Record<Property["status"], string> = {
  Available: "border-emerald/30 bg-background/90 text-emerald",
  "Under Offer": "border-amber-500/40 bg-background/90 text-amber-700 dark:text-amber-400",
  Sold: "border-border bg-muted/90 text-muted-foreground",
};

/** Available (green) · Under Offer (amber) · Sold (grey), with a small dot. */
export function StatusBadge({ status, className }: { status: Property["status"]; className?: string }) {
  return (
    <span className={cn(base, STATUS_STYLES[status], className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
