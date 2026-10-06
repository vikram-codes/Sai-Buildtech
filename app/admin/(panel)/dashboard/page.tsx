import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ListingsTable } from "@/components/admin/listings-table";
import { Button } from "@/components/ui/button";
import { getAdminProperties, getNewInquiryCount } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Listings" };

export default async function DashboardPage() {
  // Two queries side by side; listing counts are worked out from the list itself
  const [properties, newInquiries] = await Promise.all([getAdminProperties(), getNewInquiryCount()]);
  const hidden = properties.filter((p) => !p.is_published).length;
  const featured = properties.filter((p) => p.featured).length;

  const summary = [
    `${properties.length} ${properties.length === 1 ? "listing" : "listings"}`,
    `${hidden} hidden`,
    `${featured} featured`,
    `${newInquiries} new ${newInquiries === 1 ? "inquiry" : "inquiries"}`,
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">Listings</h1>
          <p className="mt-2 text-sm text-muted-foreground">{summary.join(" · ")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/listings/new">
            <Plus /> Add listing
          </Link>
        </Button>
      </header>

      <ListingsTable properties={properties} />
    </div>
  );
}
