import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const SELLER_MESSAGE = `Hi ${siteConfig.name}, I'd like to list my property with you.`;

/*
 * Always-dark band. The `dark` class switches this section to the dark colour tokens
 * even when the rest of the site is in light mode.
 */
export function CtaBanner() {
  return (
    <section className="dark bg-background py-20 text-foreground sm:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-gold/30 bg-card p-8 sm:p-10">
              <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">For owners</p>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Selling or renting out your property?</h2>
              <p className="mt-4 text-muted-foreground">
                List with us for genuine buyers and tenants, honest pricing advice and a hassle-free deal.
              </p>
              <div className="mt-8 flex flex-1 items-end">
                <Button asChild size="lg" variant="whatsapp">
                  <a href={buildWhatsAppLink(SELLER_MESSAGE)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-5" /> List your property
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl border bg-card p-8 sm:p-10">
              <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">For buyers & tenants</p>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Looking to buy or rent?</h2>
              <p className="mt-4 text-muted-foreground">
                Browse our latest listings, or tell us what you need and we&apos;ll shortlist the right options for you.
              </p>
              <div className="mt-8 flex flex-1 flex-wrap items-end gap-3">
                <Button asChild size="lg">
                  <Link href="/listings">
                    Browse listings <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={siteConfig.contact.phoneHref}>
                    <Phone /> Call us
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
