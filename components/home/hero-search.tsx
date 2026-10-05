"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, IndianRupee, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUDGETS } from "@/lib/budgets";
import { buildListingsUrl } from "@/lib/listings-url";
import { CITIES } from "@/lib/site-config";
import { Constants } from "@/types/database";

// Radix Select can't use "" as a value, so "any" stands for "no filter"
const ANY = "any";

type FieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  anyLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
};

function SearchField({ id, label, icon, anyLabel, value, onChange, options }: FieldProps) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-1">
      <label htmlFor={id} className="flex items-center gap-1.5 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {icon}
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-11 w-full border-0 bg-transparent text-base shadow-none focus-visible:ring-0 dark:bg-transparent">
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

/** City · Type · Budget → /listings with those filters. */
export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState(ANY);
  const [type, setType] = useState(ANY);
  const [budget, setBudget] = useState(ANY);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pick = (v: string) => (v === ANY ? undefined : v);
    router.push(buildListingsUrl({ city: pick(city), type: pick(type), budget: pick(budget) }));
  };

  const iconClass = "size-3.5 text-gold";

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Search properties"
      className="flex flex-col gap-2 rounded-2xl border bg-background/95 p-3 text-foreground shadow-2xl backdrop-blur md:flex-row md:items-end md:divide-x md:p-2"
    >
      <SearchField
        id="search-city"
        label="City"
        icon={<MapPin className={iconClass} />}
        anyLabel="All cities"
        value={city}
        onChange={setCity}
        options={CITIES.map((c) => ({ value: c, label: c }))}
      />
      <SearchField
        id="search-type"
        label="Property type"
        icon={<Building2 className={iconClass} />}
        anyLabel="All types"
        value={type}
        onChange={setType}
        options={Constants.public.Enums.property_type.map((t) => ({ value: t, label: t }))}
      />
      <SearchField
        id="search-budget"
        label="Budget"
        icon={<IndianRupee className={iconClass} />}
        anyLabel="Any budget"
        value={budget}
        onChange={setBudget}
        options={BUDGETS.map((b) => ({ value: b.id, label: b.label }))}
      />
      <div className="md:pl-2">
        <Button type="submit" size="lg" className="h-12 w-full md:w-auto md:px-8">
          <Search /> Search
        </Button>
      </div>
    </form>
  );
}
