import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/admin/listing-form/listing-form";
import { Toaster } from "@/components/ui/sonner";
import { createPublicClient } from "@/lib/supabase/public";
import { CompressSelfTest } from "./compress-self-test";

/*
 * Developer-only preview of the listing form (/dev/listing-form) for layout checks without logging in,
 * plus a self-test of the in-browser photo shrinker. Saving/uploading here fails (no admin session).
 * Add ?edit=<slug> to preview the form filled in with an existing listing, and ?selftest=1 to run the
 * shrinker self-test (it's CPU-heavy, so off by default). Returns 404 in production.
 */

export const metadata: Metadata = { title: "Listing form preview", robots: { index: false, follow: false } };

async function Preview({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const slug = (await searchParams).edit;
  let property;
  if (typeof slug === "string") {
    const { data } = await createPublicClient().from("properties").select("*").eq("slug", slug).maybeSingle();
    property = data ?? undefined;
  }
  return <ListingForm property={property} />;
}

async function SelfTest({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if ((await searchParams).selftest !== "1") return null;
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Photo shrinker self-test</h2>
      <CompressSelfTest />
    </section>
  );
}

export default function ListingFormPreview(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-8 sm:px-6">
      <Suspense>
        <SelfTest searchParams={props.searchParams} />
      </Suspense>
      <Suspense>
        <Preview searchParams={props.searchParams} />
      </Suspense>
      <Toaster />
    </main>
  );
}
