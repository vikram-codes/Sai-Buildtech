import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/admin/listing-form/listing-form";
import { getAdminProperty } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({ params }: PageProps<"/admin/listings/[id]/edit">) {
  const property = await getAdminProperty((await params).id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">Edit listing</h1>
        <p className="mt-2 truncate text-sm text-muted-foreground">{property.title}</p>
      </header>
      {/* key: a fresh form if you navigate from one listing's edit page to another */}
      <ListingForm key={property.id} property={property} />
    </div>
  );
}
