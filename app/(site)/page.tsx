import { Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/*
 * Early homepage. Header/footer come from app/(site)/layout.tsx.
 * Grows into the full homepage in Phase 6 (hero imagery, search bar, featured properties, why choose us).
 */

export default function HomePage() {
  const { contact } = siteConfig;

  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
      {/* Soft gold glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-120 w-225 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
      />

      <Container className="relative py-24 text-center sm:py-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            {siteConfig.cities.join(" · ")}
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Find your place in Delhi NCR&apos;s finest addresses
          </h1>

          <div className="mx-auto mt-6 h-px w-24 bg-gold/60" />

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="whatsapp" className="w-full sm:w-auto">
              <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={contact.phoneHref}>
                <Phone /> {contact.phoneDisplay}
              </a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">Our full property catalogue is launching soon.</p>
        </div>
      </Container>
    </section>
  );
}
