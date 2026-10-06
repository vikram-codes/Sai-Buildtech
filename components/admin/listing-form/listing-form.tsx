"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AmenitiesField } from "@/components/admin/listing-form/amenities-field";
import { PhotoUploader } from "@/components/admin/listing-form/photo-uploader";
import { PriceField } from "@/components/admin/listing-form/price-field";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProperty, updateProperty } from "@/lib/actions/listings";
import { slugify } from "@/lib/slug";
import { listingSchema, NO_ROOMS_TYPES, type ListingInput } from "@/lib/validation/listing";
import { Constants, type Tables } from "@/types/database";

const { property_type, property_status, city } = Constants.public.Enums;

type Props = {
  /** Existing listing (edit) — or undefined to create a new one. */
  property?: Tables<"properties">;
};

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-sans text-lg font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** Empty number inputs become null rather than NaN. */
const numberOrNull = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));

function defaults(property?: Tables<"properties">): ListingInput {
  return {
    title: property?.title ?? "",
    listing_type: property?.listing_type ?? "Sale",
    property_type: property?.property_type ?? "Apartment",
    status: property?.status ?? "Available",
    city: property?.city ?? "Delhi",
    location: property?.location ?? "",
    price: property?.price ?? (undefined as unknown as number),
    bedrooms: property?.bedrooms ?? null,
    bathrooms: property?.bathrooms ?? null,
    area_sqft: property?.area_sqft ?? null,
    description: property?.description ?? "",
    amenities: (property?.amenities ?? []) as ListingInput["amenities"],
    images: property?.images ?? [],
    featured: property?.featured ?? false,
    is_published: property?.is_published ?? true,
    slug: property?.slug ?? "",
  };
}

/** Add / edit a listing. Validated as you go with the same rules the server uses. */
export function ListingForm({ property }: Props) {
  const isEdit = !!property;
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);
  // Storage folder / database id. Edit: the listing's id. New: created on first need (upload or save).
  const [listingId, setListingId] = useState<string | null>(property?.id ?? null);
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [photosUploading, setPhotosUploading] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaults(property),
    mode: "onTouched",
  });

  // useWatch (not watch()) so React's compiler can optimise this component
  const title = useWatch({ control, name: "title" });
  const listingType = useWatch({ control, name: "listing_type" });
  const propertyType = useWatch({ control, name: "property_type" });
  const noRooms = NO_ROOMS_TYPES.includes(propertyType);

  // New listings: keep the web address in step with the title until it's edited by hand
  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(title), { shouldValidate: false });
  }, [title, slugEdited, setValue]);

  // Plots and commercial spaces have no bedrooms/bathrooms
  useEffect(() => {
    if (noRooms) {
      setValue("bedrooms", null, { shouldDirty: true });
      setValue("bathrooms", null, { shouldDirty: true });
    }
  }, [noRooms, setValue]);

  // Warn before leaving with unsaved changes (closing the tab, reload)
  useEffect(() => {
    if (!isDirty || saved) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty, saved]);

  const getListingId = () => {
    if (listingId) return listingId;
    const id = crypto.randomUUID();
    setListingId(id);
    return id;
  };

  const onSubmit = (values: ListingInput) =>
    startSaving(async () => {
      const id = getListingId();
      const result = isEdit ? await updateProperty(id, values) : await createProperty(id, values);
      if (!result.ok) {
        toast.error(result.error);
        const fields = Object.entries(result.fieldErrors ?? {}) as [keyof ListingInput, string][];
        fields.forEach(([field, message]) => setError(field, { message }));
        if (fields[0]) setFocus(fields[0][0]);
        return;
      }
      setSaved(true);
      toast.success(isEdit ? "Listing saved" : "Listing created", {
        action: { label: "View on site", onClick: () => window.open(`/listings/${result.slug}`, "_blank") },
      });
      router.push("/admin/dashboard");
    });

  const onInvalid = (formErrors: FieldErrors<ListingInput>) => {
    toast.error("Please fix the highlighted fields.");
    const first = Object.keys(formErrors)[0] as keyof ListingInput | undefined;
    if (first) document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const err = (name: keyof ListingInput) => errors[name]?.message as string | undefined;
  const aria = (name: keyof ListingInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `field-${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-6 pb-28">
      <Section title="Basics">
        <Field id="field-title" label="Title" error={err("title")} hint="e.g. 3 BHK Builder Floor in Greater Kailash II">
          <Input id="field-title" {...register("title")} {...aria("title")} maxLength={200} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Listing type</Label>
            <Controller
              control={control}
              name="listing_type"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6 pt-2">
                  {(["Sale", "Rent"] as const).map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                      <RadioGroupItem value={t} id={`listing-type-${t}`} /> For {t}
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          </div>
          <Field id="field-property_type" label="Property type" error={err("property_type")}>
            <Controller
              control={control}
              name="property_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="field-property_type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {property_type.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="field-city" label="City" error={err("city")}>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="field-city" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {city.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field id="field-location" label="Locality" error={err("location")} hint="Shown on cards and used for the map, e.g. Sector 150">
              <Input id="field-location" {...register("location")} {...aria("location")} maxLength={200} />
            </Field>
          </div>
        </div>

        <Field id="field-status" label="Status" error={err("status")}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="field-status" className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {property_status.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </Section>

      <Section title="Price">
        <Field id="field-price" label={listingType === "Rent" ? "Monthly rent" : "Asking price"} error={err("price")}>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <PriceField
                id="field-price"
                value={field.value}
                onChange={(rupees) => field.onChange(rupees ?? undefined)}
                listingType={listingType}
                invalid={!!errors.price}
                describedBy={errors.price ? "field-price-error" : undefined}
              />
            )}
          />
        </Field>
      </Section>

      <Section title="Details">
        <div className="grid gap-5 sm:grid-cols-3">
          {!noRooms && (
            <>
              <Field id="field-bedrooms" label="Bedrooms" error={err("bedrooms")}>
                <Input
                  id="field-bedrooms"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  {...register("bedrooms", { setValueAs: numberOrNull })}
                  {...aria("bedrooms")}
                />
              </Field>
              <Field id="field-bathrooms" label="Bathrooms" error={err("bathrooms")}>
                <Input
                  id="field-bathrooms"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  {...register("bathrooms", { setValueAs: numberOrNull })}
                  {...aria("bathrooms")}
                />
              </Field>
            </>
          )}
          <Field id="field-area_sqft" label="Area (sq.ft.)" error={err("area_sqft")} hint={noRooms ? "1 sq. yd = 9 sq.ft." : undefined}>
            <Input
              id="field-area_sqft"
              type="number"
              inputMode="numeric"
              min={1}
              {...register("area_sqft", { setValueAs: numberOrNull })}
              {...aria("area_sqft")}
            />
          </Field>
        </div>
        {noRooms && <p className="text-sm text-muted-foreground">Bedrooms and bathrooms don&apos;t apply to a {propertyType}.</p>}

        <Field
          id="field-description"
          label="Description"
          error={err("description")}
          hint="Leave a blank line between paragraphs — they show as separate paragraphs on the website."
        >
          <Textarea id="field-description" rows={8} {...register("description")} {...aria("description")} />
        </Field>
      </Section>

      <Section title="Amenities" description="Tick everything this property offers.">
        <Controller
          control={control}
          name="amenities"
          render={({ field }) => <AmenitiesField value={field.value} onChange={field.onChange} />}
        />
      </Section>

      <Section title="Photos" description="The first photo is the cover on cards, the homepage and link previews.">
        <div id="field-images">
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <PhotoUploader
                value={field.value}
                onChange={(urls) => field.onChange(urls)}
                getListingId={getListingId}
                onUploadingChange={setPhotosUploading}
                invalid={!!errors.images}
              />
            )}
          />
          {err("images") && (
            <p id="field-images-error" className="mt-2 text-sm text-destructive">
              {err("images")}
            </p>
          )}
        </div>
      </Section>

      <Section title="Visibility">
        <div className="space-y-4">
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <label className="flex items-start gap-3">
                <Switch checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Live on website</span>
                  <span className="block text-sm text-muted-foreground">Turn off to hide it from visitors (you&apos;ll still see it here).</span>
                </span>
              </label>
            )}
          />
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <label className="flex items-start gap-3">
                <Switch checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Featured</span>
                  <span className="block text-sm text-muted-foreground">Show it in the homepage&apos;s featured section.</span>
                </span>
              </label>
            )}
          />
        </div>
      </Section>

      <Section title="Web address">
        <Field
          id="field-slug"
          label="Address"
          error={err("slug")}
          hint={
            isEdit
              ? "⚠️ Changing this breaks links people have already shared."
              : "Made from the title automatically — edit it if you like."
          }
        >
          <div className="flex items-center rounded-md border bg-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <span className="pl-3 text-sm whitespace-nowrap text-muted-foreground">/listings/</span>
            <input
              id="field-slug"
              {...register("slug", { onChange: () => setSlugEdited(true) })}
              {...aria("slug")}
              className="h-9 min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none"
            />
          </div>
        </Field>
      </Section>

      {/* Save bar — always visible at the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="flex items-center gap-2">
            {isDirty && !saved ? (
              <ConfirmDialog
                title="Discard changes?"
                description="Your unsaved changes to this listing will be lost."
                confirmLabel="Discard"
                trigger={
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                }
                onConfirm={async () => {
                  setSaved(true); // stop the leave-page warning
                  router.push("/admin/dashboard");
                  return true;
                }}
              />
            ) : (
              <Button asChild variant="ghost">
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
            )}
            {isEdit && (
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href={`/listings/${property.slug}`} target="_blank">
                  View on site <ExternalLink />
                </Link>
              </Button>
            )}
          </div>
          <Button type="submit" size="lg" disabled={saving || photosUploading > 0}>
            {(saving || photosUploading > 0) && <Loader2 className="animate-spin" />}
            {photosUploading > 0
              ? "Waiting for photos…"
              : saving
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create listing"}
          </Button>
        </div>
      </div>
    </form>
  );
}
