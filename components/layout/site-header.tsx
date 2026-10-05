"use client";

import { Suspense, useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ActiveNavLinks, NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  // See-through at the very top, solid with a blur once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border bg-background/85 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/70"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          {/* Only the link list reads the URL, so only it waits; the rest of the header pre-builds */}
          <Suspense fallback={<NavLinks />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={siteConfig.contact.phoneHref}
            className="mr-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <Phone className="size-4 text-gold" />
            {siteConfig.contact.phoneDisplay}
          </a>
          <ThemeToggle />
          <Button asChild variant="whatsapp" className="hidden md:inline-flex">
            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
