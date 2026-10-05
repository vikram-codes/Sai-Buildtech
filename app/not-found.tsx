import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

// Handles every unknown URL. Lives outside app/(site), so it adds the site shell itself.
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex flex-1 items-center">
        <Container className="py-24 text-center sm:py-32">
          <p className="font-serif text-7xl text-gold sm:text-8xl">404</p>
          <h1 className="mt-6 text-3xl sm:text-4xl">This page doesn&apos;t exist</h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The link may be old or mistyped. Head back home, or browse our listings.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft /> Back to home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/listings">Browse listings</Link>
            </Button>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
