import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { ListingsTable } from "@/components/admin/listings-table";
import { Button } from "@/components/ui/button";
import { getAdminProperties, getAdminStats } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Listings" };

export default async function DashboardPage() {
  const [properties, stats] = await Promise.all([getAdminProperties(), getAdminStats()]);

  const summary = [
    `${stats.listings} ${stats.listings === 1 ? "listing" : "listings"}`,
    `${stats.hiddenListings} hidden`,
    `${stats.featuredListings} featured`,
    `${stats.newInquiries} new ${stats.newInquiries === 1 ? "inquiry" : "inquiries"}`,
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">Listings</h1>
          <p className="mt-2 text-sm text-muted-foreground">{summary.join(" · ")}</p>
        </div>
        <Button disabled title="Adding listings arrives in the next update">
          <Plus /> Add listing
        </Button>
      </header>

      <ListingsTable properties={properties} />
    </div>
  );
}
