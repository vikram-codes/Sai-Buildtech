import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/shared/not-found-content";

/*
 * 404 for URLs that match no page at all (e.g. /nope). These render outside app/(site),
 * so this adds the site header/footer itself. 404s *inside* the site (e.g. a hidden listing)
 * use app/(site)/not-found.tsx instead, which is already inside the site frame.
 */
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
