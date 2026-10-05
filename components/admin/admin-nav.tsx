"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/** Tabs under the admin header. The Inquiries tab shows how many are still new. */
export function AdminNav({ newInquiries }: { newInquiries: number }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/admin/dashboard", label: "Listings", icon: Building2, match: ["/admin/dashboard", "/admin/listings"] },
    { href: "/admin/inquiries", label: "Inquiries", icon: Inbox, match: ["/admin/inquiries"], count: newInquiries },
  ];

  return (
    <nav aria-label="Admin" className="border-b bg-background">
      <ul className="mx-auto flex w-full max-w-6xl gap-6 px-4 sm:px-6">
        {tabs.map(({ href, label, icon: Icon, match, count }) => {
          const active = match.some((m) => pathname.startsWith(m));
          return (
            <li key={href}>
              <Link
                href={href}
                // Load the other tab's data in the background (production builds), so switching is instant
                prefetch
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors",
                  active ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
                {!!count && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs leading-none font-semibold text-primary-foreground">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
