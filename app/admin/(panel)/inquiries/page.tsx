import type { Metadata } from "next";
import Link from "next/link";
import { InquiryList } from "@/components/admin/inquiry-list";
import { getInquiries, type InquiryFilter } from "@/lib/data/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Inquiries" };

const EMPTY: Record<InquiryFilter, string> = {
  new: "No new inquiries — you're all caught up.",
  handled: "No handled inquiries yet.",
  all: "No inquiries yet. They'll appear here when someone uses a contact form on the website.",
};

export default async function InquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  const show = (await searchParams).show;
  const filter: InquiryFilter = show === "handled" || show === "all" ? show : "new";
  // One query for everything; filter and count here
  const all = await getInquiries();
  const fresh = all.filter((i) => !i.handled);
  const handled = all.filter((i) => i.handled);
  const inquiries = filter === "new" ? fresh : filter === "handled" ? handled : all;

  const tabs: { id: InquiryFilter; label: string; count: number }[] = [
    { id: "new", label: "New", count: fresh.length },
    { id: "handled", label: "Handled", count: handled.length },
    { id: "all", label: "All", count: all.length },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">Inquiries</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Messages from the contact page and property pages, newest first.
        </p>
      </header>

      <nav aria-label="Filter inquiries" className="inline-flex rounded-lg border bg-card p-1">
        {tabs.map(({ id, label, count }) => (
          <Link
            key={id}
            href={id === "new" ? "/admin/inquiries" : `/admin/inquiries?show=${id}`}
            aria-current={filter === id ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              filter === id ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label} <span className="opacity-70">({count})</span>
          </Link>
        ))}
      </nav>

      <InquiryList inquiries={inquiries} emptyText={EMPTY[filter]} />
    </div>
  );
}
