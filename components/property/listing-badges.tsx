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

/**
 * Status badge. "Available" needs no badge. "Sold" is deliberately hidden for now
 * (business decision) — to show it, add a case below.
 */
export function StatusBadge({ status, className }: { status: Property["status"]; className?: string }) {
  if (status !== "Under Offer") return null;
  return (
    <span className={cn(base, "border-border bg-background/90 text-foreground", className)}>Under Offer</span>
  );
}
