"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff, Search } from "lucide-react";
import {
  FeaturedToggle,
  PublishedSwitch,
  RowLinks,
  StatusSelect,
  useListingControls,
} from "@/components/admin/listing-row-actions";
import { TimeAgo } from "@/components/admin/time-ago";
import type { AdminProperty } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "hidden", label: "Hidden" },
  { id: "featured", label: "Featured" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

function Thumb({ property, className }: { property: AdminProperty; className?: string }) {
  const src = property.images[0];
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-md bg-muted", className)}>
      {src ? (
        <Image src={src} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        <ImageOff className="absolute inset-0 m-auto size-4 text-muted-foreground" />
      )}
    </div>
  );
}

function Summary({ property }: { property: AdminProperty }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium">{property.title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {property.property_type} · {property.listing_type === "Rent" ? "For Rent" : "For Sale"} · {property.location}, {property.city}
      </p>
    </div>
  );
}

/** One table row (desktop). */
function Row({ property }: { property: AdminProperty }) {
  const controls = useListingControls(property);
  return (
    <tr className={cn("border-b last:border-0", !controls.state.is_published && "bg-muted/40")}>
      <td className="py-3 pr-3 pl-4">
        <div className="flex items-center gap-3">
          <Thumb property={property} className={cn("h-12 w-16", !controls.state.is_published && "opacity-50")} />
          <Summary property={property} />
        </div>
      </td>
      <td className="px-3 py-3 font-serif text-lg whitespace-nowrap text-gold">
        {formatPrice(property.price, property.listing_type)}
      </td>
      <td className="px-3 py-3">
        <StatusSelect controls={controls} title={property.title} />
      </td>
      <td className="px-3 py-3">
        <FeaturedToggle controls={controls} title={property.title} />
      </td>
      <td className="px-3 py-3">
        <PublishedSwitch controls={controls} title={property.title} />
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        <TimeAgo iso={property.updated_at} />
      </td>
      <td className="py-3 pr-4 pl-3">
        <RowLinks property={property} />
      </td>
    </tr>
  );
}

/** One card (phones). Same controls as the table row. */
function Card({ property }: { property: AdminProperty }) {
  const controls = useListingControls(property);
  return (
    <li className={cn("space-y-3 rounded-xl border bg-card p-4", !controls.state.is_published && "bg-muted/40")}>
      <div className="flex gap-3">
        <Thumb property={property} className={cn("h-16 w-20", !controls.state.is_published && "opacity-50")} />
        <div className="min-w-0 flex-1">
          <Summary property={property} />
          <p className="mt-1 font-serif text-lg text-gold">{formatPrice(property.price, property.listing_type)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <PublishedSwitch controls={controls} title={property.title} />
        <div className="flex items-center gap-1">
          <FeaturedToggle controls={controls} title={property.title} />
          <StatusSelect controls={controls} title={property.title} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Updated <TimeAgo iso={property.updated_at} />
        </span>
        <RowLinks property={property} />
      </div>
    </li>
  );
}

/** All listings with search + filter (done in the browser — fast, and the list is small). */
export function ListingsTable({ properties }: { properties: AdminProperty[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (filter === "live" && !p.is_published) return false;
      if (filter === "hidden" && p.is_published) return false;
      if (filter === "featured" && !p.featured) return false;
      if (!q) return true;
      return [p.title, p.location, p.city, p.property_type].some((field) => field.toLowerCase().includes(q));
    });
  }, [properties, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or locality"
            aria-label="Search listings"
            className="h-10 w-full rounded-md border bg-card pr-3 pl-9 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
        <div className="inline-flex rounded-lg border bg-card p-1" role="group" aria-label="Filter listings">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                filter === id ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No listings match.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
            <table className="w-full text-left">
              <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="py-3 pr-3 pl-4 font-medium">Listing</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Featured</th>
                  <th className="px-3 py-3 font-medium">On website</th>
                  <th className="px-3 py-3 font-medium">Updated</th>
                  <th className="py-3 pr-4 pl-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <Row key={p.id} property={p} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone / tablet cards */}
          <ul className="grid gap-3 lg:hidden">
            {visible.map((p) => (
              <Card key={p.id} property={p} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
