import { ExternalLink } from "lucide-react";

/**
 * Google Map of the LOCALITY (e.g. "Vasant Vihar, Delhi") — never an exact address.
 * Uses Google's keyless embed. loading="lazy" means it only loads when scrolled near.
 */
export function LocationMap({ location, city }: { location: string; city: string }) {
  const query = encodeURIComponent(`${location}, ${city}, India`);

  return (
    <div className="space-y-3">
      <div className="aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
        <iframe
          title={`Map of ${location}, ${city}`}
          src={`https://www.google.com/maps?q=${query}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        Open in Google Maps <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}
