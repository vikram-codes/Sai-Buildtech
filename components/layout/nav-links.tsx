"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Desktop menu links. `pathname` decides which one gets the gold underline (none if empty). */
export function NavLinks({ pathname = "" }: { pathname?: string }) {
  return (
    <ul className="flex items-center gap-8">
      {siteConfig.nav.map(({ label, href }) => {
        const active = pathname !== "" && isActiveLink(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative py-2 text-sm font-medium transition-colors hover:text-foreground",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300",
                active ? "text-foreground after:scale-x-100" : "text-muted-foreground after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * NavLinks with the current page highlighted. Reads the URL, so it must sit inside <Suspense>
 * (Next 16 rule: on pages like /listings/[slug] the URL is only known at request time).
 * The Suspense fallback is <NavLinks /> without a highlight, so nothing jumps.
 */
export function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}
