import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingsTable } from "@/components/admin/listings-table";
import type { AdminProperty } from "@/lib/data/admin";
import { createPublicClient } from "@/lib/supabase/public";

/*
 * Developer-only preview of the admin listings table (/dev/admin-table), so its layout can be
 * checked without logging in. Uses published listings only; the buttons are not wired to an admin
 * session here (actions would be refused). Returns 404 in production.
 */

export const metadata: Metadata = { title: "Admin table preview", robots: { index: false, follow: false } };

async function Preview() {
  const { data, error } = await createPublicClient()
    .from("properties")
    .select("id, slug, title, listing_type, price, location, city, property_type, status, featured, is_published, images, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`[dev/admin-table] ${error.message}`);
  return <ListingsTable properties={data satisfies AdminProperty[]} />;
}

export default function AdminTablePreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    // Same width/padding as the admin area (app/admin/(panel)/layout.tsx)
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <Suspense>
        <Preview />
      </Suspense>
    </main>
  );
}
