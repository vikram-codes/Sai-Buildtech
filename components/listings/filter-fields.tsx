"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUDGETS } from "@/lib/budgets";
import { budgetIdFor, budgetLabel, type CatalogueState } from "@/lib/listings-url";
import { CITIES } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Constants } from "@/types/database";

// Radix Select can't use "" as a value, so "any" stands for "no filter"
const ANY = "any";
const CUSTOM = "custom"; // a price range that isn't one of the presets (e.g. typed into the URL)

const BED_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ beds` }));
const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Under Offer", label: "Under offer" },
  { value: "Sold", label: "Sold" },
];

type FieldProps = {
  id: string;
  label: string;
  anyLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  stacked?: boolean;
};

function FilterSelect({ id, label, anyLabel, value, onChange, options, stacked }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", !stacked && "min-w-0 flex-1")}>
      <label htmlFor={id} className={cn("text-xs font-medium text-muted-foreground", !stacked && "sr-only")}>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-10 w-full bg-card" aria-label={stacked ? undefined : label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Locality search: waits until typing pauses (~400ms) before updating results. */
function LocalitySearch({
  value,
  onChange,
  stacked,
}: {
  value?: string;
  onChange: (q: string | undefined) => void;
  stacked?: boolean;
}) {
  const [text, setText] = useState(value ?? "");
  const [lastValue, setLastValue] = useState(value);

  // Keep the box in sync when the search changes elsewhere (chip removed, "Clear all", Back button).
  // Done during render (React's recommended pattern) so the input never loses focus.
  if (value !== lastValue) {
    setLastValue(value);
    setText(value ?? "");
  }

  const commit = useEffectEvent((q: string | undefined) => onChange(q));

  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed === (value ?? "")) return;
    const id = setTimeout(() => commit(trimmed || undefined), 400);
    return () => clearTimeout(id);
  }, [text, value]);

  return (
    <div className={cn("flex flex-col gap-1.5", !stacked && "min-w-0 flex-[1.4]")}>
      <label htmlFor="filter-q" className={cn("text-xs font-medium text-muted-foreground", !stacked && "sr-only")}>
        Locality
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="filter-q"
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search locality"
          maxLength={60}
          className="h-10 w-full rounded-md border bg-card pr-3 pl-9 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
    </div>
  );
}

/**
 * All catalogue filters. `stacked` = labelled fields in a column (phone panel);
 * otherwise a single row (desktop bar).
 */
export function FilterFields({
  state,
  onChange,
  stacked,
}: {
  state: CatalogueState;
  onChange: (changes: Partial<CatalogueState>) => void;
  stacked?: boolean;
}) {
  const pick = <T extends string>(v: string) => (v === ANY ? undefined : (v as T));
  const budgetId = budgetIdFor(state.minPrice, state.maxPrice);
  const hasCustomBudget = !budgetId && !!(state.minPrice || state.maxPrice);

  const budgetOptions = [
    ...BUDGETS.map((b) => ({ value: b.id as string, label: b.label })),
    ...(hasCustomBudget ? [{ value: CUSTOM, label: budgetLabel(state.minPrice, state.maxPrice)! }] : []),
  ];

  return (
    <div className={cn(stacked ? "flex flex-col gap-4" : "flex items-center gap-2")}>
      <FilterSelect
        id="filter-city"
        label="City"
        anyLabel="All cities"
        stacked={stacked}
        value={state.city ?? ANY}
        onChange={(v) => onChange({ city: pick(v) })}
        options={CITIES.map((c) => ({ value: c, label: c }))}
      />
      <FilterSelect
        id="filter-type"
        label="Property type"
        anyLabel="All types"
        stacked={stacked}
        value={state.type ?? ANY}
        onChange={(v) => onChange({ type: pick(v) })}
        options={Constants.public.Enums.property_type.map((t) => ({ value: t, label: t }))}
      />
      <FilterSelect
        id="filter-beds"
        label="Bedrooms"
        anyLabel="Any beds"
        stacked={stacked}
        value={state.beds ? String(state.beds) : ANY}
        onChange={(v) => onChange({ beds: v === ANY ? undefined : Number(v) })}
        options={BED_OPTIONS}
      />
      <FilterSelect
        id="filter-budget"
        label="Budget (for sale)"
        anyLabel="Any budget"
        stacked={stacked}
        value={budgetId ?? (hasCustomBudget ? CUSTOM : ANY)}
        onChange={(v) => {
          if (v === CUSTOM) return;
          const range = BUDGETS.find((b) => b.id === v);
          onChange({ minPrice: range?.min, maxPrice: range?.max });
        }}
        options={budgetOptions}
      />
      <FilterSelect
        id="filter-status"
        label="Status"
        anyLabel="Any status"
        stacked={stacked}
        value={state.status ?? ANY}
        onChange={(v) => onChange({ status: pick(v) })}
        options={STATUS_OPTIONS}
      />
      <LocalitySearch value={state.q} onChange={(q) => onChange({ q })} stacked={stacked} />
    </div>
  );
}
