import type { Metadata } from "next";
import { ListingForm } from "@/components/admin/listing-form/listing-form";

export const metadata: Metadata = { title: "Add listing" };

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">Add listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">Fill in the details and add photos. You can hide it until it&apos;s ready.</p>
      </header>
      <ListingForm />
    </div>
  );
}
