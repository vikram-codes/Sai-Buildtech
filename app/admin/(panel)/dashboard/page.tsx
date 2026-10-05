import type { Metadata } from "next";
import Link from "next/link";
import { Building2, EyeOff, Inbox } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Dashboard" };

/* Welcome page for now — Phase 11 turns this into the listings table and inquiries view. */

export default async function DashboardPage() {
  const [user, stats] = await Promise.all([getSessionUser(), getAdminStats()]);

  const cards = [
    { icon: Building2, label: "Listings", value: stats.listings, note: "including hidden" },
    { icon: EyeOff, label: "Hidden listings", value: stats.hiddenListings, note: "not shown on the website" },
    { icon: Inbox, label: "New inquiries", value: stats.newInquiries, note: "not yet marked handled" },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Dashboard</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Signed in as {user?.email}</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value, note }) => (
          <li key={label} className="rounded-2xl border bg-card p-6">
            <Icon className="size-5 text-gold" />
            <p className="mt-4 font-serif text-4xl">{value}</p>
            <p className="mt-1 font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{note}</p>
          </li>
        ))}
      </ul>

      <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
        Managing listings and inquiries arrives next. Meanwhile, the{" "}
        <Link href="/" className="text-gold underline-offset-4 hover:underline">
          public website
        </Link>{" "}
        shows everything that&apos;s published.
      </p>
    </div>
  );
}
