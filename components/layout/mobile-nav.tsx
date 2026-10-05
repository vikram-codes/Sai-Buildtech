"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { isActiveLink } from "@/lib/nav";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Phone/tablet menu: slides in from the right. Hidden from md (768px) up. */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { contact } = siteConfig;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <div className="flex items-center gap-2.5 border-b px-6 py-5">
          <LogoMark className="size-6" />
          <SheetTitle className="font-serif text-xl font-normal">
            Sai <span className="text-gold">Buildtech</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation and contact options</SheetDescription>
        </div>

        <nav aria-label="Main" className="flex-1 px-6 py-6">
          <ul className="space-y-1">
            {siteConfig.nav.map(({ label, href }) => {
              const active = isActiveLink(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 py-3 font-serif text-3xl transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className={cn("h-px w-5 bg-gold transition-opacity", active ? "opacity-100" : "opacity-0")} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-3 border-t px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <Button asChild size="lg" variant="whatsapp" className="w-full">
            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <a href={contact.phoneHref}>
              <Phone /> {contact.phoneDisplay}
            </a>
          </Button>
          <p className="pt-2 text-center text-xs text-muted-foreground">{contact.hours}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
