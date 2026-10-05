import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Google Map for any place or address, via Google's keyless embed.
 * loading="lazy" means it only loads when scrolled near.
 * Listing pages pass just the locality (never an exact address); the contact page passes the office address.
 */
export function MapEmbed({
  query,
  title,
  linkLabel = "Open in Google Maps",
  className = "aspect-video",
}: {
  query: string;
  title: string;
  linkLabel?: string;
  /** Size/shape of the map box (default 16:9). */
  className?: string;
}) {
  const q = encodeURIComponent(query);

  return (
    <div className="space-y-3">
      <div className={cn("overflow-hidden rounded-xl border bg-muted", className)}>
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${q}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        {linkLabel} <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

/** Google Maps directions link for an address. */
export function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
