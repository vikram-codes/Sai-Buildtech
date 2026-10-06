"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { AMENITIES, type Amenity } from "@/lib/amenities";

/** Tick boxes for the standard amenities list (lib/amenities.ts), kept in that list's order. */
export function AmenitiesField({ value, onChange }: { value: Amenity[]; onChange: (next: Amenity[]) => void }) {
  const toggle = (amenity: Amenity, checked: boolean) =>
    onChange(AMENITIES.filter((a) => (a === amenity ? checked : value.includes(a))));

  return (
    <fieldset>
      <legend className="sr-only">Amenities</legend>
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map((amenity) => {
          const id = `amenity-${amenity.replace(/\W+/g, "-")}`;
          return (
            <label key={amenity} htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox id={id} checked={value.includes(amenity)} onCheckedChange={(c) => toggle(amenity, c === true)} />
              {amenity}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
