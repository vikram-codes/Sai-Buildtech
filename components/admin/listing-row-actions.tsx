"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { deleteProperty, setFeatured, setPublished, setStatus, type ActionResult } from "@/lib/actions/admin";
import type { AdminProperty } from "@/lib/data/admin";
import { cn } from "@/lib/utils";
import { Constants } from "@/types/database";

type Controls = Pick<AdminProperty, "is_published" | "featured" | "status">;

/**
 * Quick controls for one listing. Changes show instantly (optimistic) and roll back
 * automatically if the save fails, with a toast either way.
 */
export function useListingControls(property: AdminProperty) {
  const [pending, startTransition] = useTransition();
  const [state, applyOptimistic] = useOptimistic<Controls, Partial<Controls>>(
    { is_published: property.is_published, featured: property.featured, status: property.status },
    (current, patch) => ({ ...current, ...patch }),
  );

  const run = (patch: Partial<Controls>, action: () => Promise<ActionResult>, success: string) =>
    startTransition(async () => {
      applyOptimistic(patch);
      const result = await action();
      if (result.ok) toast.success(success);
      else toast.error(result.error);
    });

  return {
    state,
    pending,
    togglePublished: (value: boolean) =>
      run({ is_published: value }, () => setPublished(property.id, value), value ? "Listing is now live on the website" : "Listing hidden from the website"),
    toggleFeatured: (value: boolean) =>
      run({ featured: value }, () => setFeatured(property.id, value), value ? "Added to featured" : "Removed from featured"),
    changeStatus: (value: string) =>
      run({ status: value as Controls["status"] }, () => setStatus(property.id, value), `Status set to ${value}`),
  };
}

export type ListingControls = ReturnType<typeof useListingControls>;

export function PublishedSwitch({ controls, title }: { controls: ListingControls; title: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch
        checked={controls.state.is_published}
        onCheckedChange={controls.togglePublished}
        aria-label={`Show "${title}" on the website`}
      />
      <span className={controls.state.is_published ? "text-foreground" : "text-muted-foreground"}>
        {controls.state.is_published ? "Live" : "Hidden"}
      </span>
    </label>
  );
}

export function FeaturedToggle({ controls, title }: { controls: ListingControls; title: string }) {
  const on = controls.state.featured;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => controls.toggleFeatured(!on)}
      aria-pressed={on}
      aria-label={on ? `Remove "${title}" from featured` : `Feature "${title}" on the homepage`}
      title={on ? "Featured on the homepage — click to remove" : "Feature on the homepage"}
    >
      <Star className={cn("size-4", on ? "fill-gold text-gold" : "text-muted-foreground")} />
    </Button>
  );
}

export function StatusSelect({ controls, title }: { controls: ListingControls; title: string }) {
  return (
    <Select value={controls.state.status} onValueChange={controls.changeStatus}>
      <SelectTrigger size="sm" className="w-[8.5rem]" aria-label={`Status of "${title}"`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Constants.public.Enums.property_status.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** View on site · Edit (Phase 12) · Delete (with confirmation). */
export function RowLinks({ property }: { property: AdminProperty }) {
  return (
    <div className="flex items-center gap-0.5">
      <Button asChild variant="ghost" size="icon-sm" title="View on website">
        <Link href={`/listings/${property.slug}`} target="_blank" aria-label={`View "${property.title}" on the website`}>
          <ExternalLink />
        </Link>
      </Button>
      <Button variant="ghost" size="icon-sm" disabled title="Editing arrives in the next update" aria-label="Edit (coming soon)">
        <Pencil />
      </Button>
      <ConfirmDialog
        title={`Delete "${property.title}"?`}
        description="This permanently removes the listing and its uploaded photos from the website. It can't be undone. Inquiries about it are kept."
        trigger={
          <Button variant="ghost" size="icon-sm" title="Delete" aria-label={`Delete "${property.title}"`}>
            <Trash2 className="text-destructive" />
          </Button>
        }
        onConfirm={async () => {
          const result = await deleteProperty(property.id);
          if (result.ok) toast.success("Listing deleted");
          else toast.error(result.error);
          return result.ok;
        }}
      />
    </div>
  );
}
