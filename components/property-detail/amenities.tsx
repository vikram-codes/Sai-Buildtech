import { Check } from "lucide-react";

export function Amenities({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) return null;
  return (
    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {amenities.map((amenity) => (
        <li key={amenity} className="flex items-center gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Check className="size-3.5" />
          </span>
          {amenity}
        </li>
      ))}
    </ul>
  );
}
