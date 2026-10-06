"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, formatPriceFull, type ListingType } from "@/lib/format";
import { fromRupees, PRICE_UNITS, toRupees, type PriceUnit } from "@/lib/price-units";

/**
 * Amount + unit (₹ / Lakh / Crore). The form stores whole rupees; a live preview shows
 * exactly what visitors will see.
 */
export function PriceField({
  id,
  value,
  onChange,
  listingType,
  invalid,
  describedBy,
}: {
  id: string;
  value: number | null | undefined;
  onChange: (rupees: number | null) => void;
  listingType: ListingType;
  invalid?: boolean;
  describedBy?: string;
}) {
  const initial = value ? fromRupees(value) : { amount: "", unit: (listingType === "Rent" ? "rupees" : "crore") as PriceUnit };
  const [amount, setAmount] = useState(initial.amount);
  const [unit, setUnit] = useState<PriceUnit>(initial.unit);

  const commit = (nextAmount: string, nextUnit: PriceUnit) => onChange(toRupees(nextAmount, nextUnit));
  const rupees = toRupees(amount, unit);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          inputMode="decimal"
          placeholder={unit === "crore" ? "e.g. 2.5" : unit === "lakh" ? "e.g. 85" : "e.g. 45000"}
          value={amount}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            setAmount(e.target.value);
            commit(e.target.value, unit);
          }}
          className="flex-1"
        />
        <Select
          value={unit}
          onValueChange={(next) => {
            setUnit(next as PriceUnit);
            commit(amount, next as PriceUnit);
          }}
        >
          <SelectTrigger className="w-32" aria-label="Price unit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRICE_UNITS.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {rupees ? (
          <>
            Shown as <span className="font-serif text-base text-gold">{formatPrice(rupees, listingType)}</span>
            {listingType === "Sale" && <> · {formatPriceFull(rupees)}</>}
          </>
        ) : (
          <>{listingType === "Rent" ? "Monthly rent." : "Asking price."} Type a number, then pick ₹, Lakh or Crore.</>
        )}
      </p>
    </div>
  );
}
