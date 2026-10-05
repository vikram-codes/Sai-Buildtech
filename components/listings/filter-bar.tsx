"use client";

import { useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { FilterFields } from "@/components/listings/filter-fields";
import { useCatalogueNav } from "@/components/listings/use-catalogue-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CatalogueState } from "@/lib/listings-url";

/** Number of filters in use (shown on the phone "Filters (n)" button). */
function activeCount({ city, type, beds, minPrice, maxPrice, status, q }: CatalogueState) {
  return [city, type, beds, minPrice || maxPrice, status, q].filter(Boolean).length;
}

/**
 * Catalogue filters. Desktop: one row. Phone: a "Filters" button opening a panel from the bottom.
 * Current values come from the server (parsed from the URL) — this component never reads the URL itself.
 */
export function FilterBar({ state, total }: { state: CatalogueState; total: number }) {
  const { update, pending } = useCatalogueNav(state);
  const [open, setOpen] = useState(false);
  const count = activeCount(state);
  const clearAll = () =>
    update({ city: undefined, type: undefined, beds: undefined, minPrice: undefined, maxPrice: undefined, status: undefined, q: undefined });

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden items-center gap-3 rounded-xl border bg-card/60 p-2 md:flex">
        <div className="min-w-0 flex-1">
          <FilterFields state={state} onChange={update} />
        </div>
        {count > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="shrink-0">
            Clear all
          </Button>
        )}
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1">
              <SlidersHorizontal /> Filters{count > 0 && ` (${count})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90svh] gap-0 overflow-y-auto rounded-t-2xl p-0">
            <div className="border-b px-5 py-4">
              <SheetTitle className="font-serif text-2xl font-normal">Filters</SheetTitle>
              <SheetDescription className="sr-only">Narrow down the property listings</SheetDescription>
            </div>
            <div className="px-5 py-5">
              <FilterFields state={state} onChange={update} stacked />
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t bg-background px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button variant="outline" className="flex-1" onClick={clearAll} disabled={count === 0}>
                Clear all
              </Button>
              <Button className="flex-[2]" onClick={() => setOpen(false)}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                Show {total} {total === 1 ? "result" : "results"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        {count > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear
          </Button>
        )}
      </div>

      {pending && (
        <p role="status" className="absolute -bottom-7 left-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" /> Updating results…
        </p>
      )}
    </div>
  );
}
