import { Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Temporary placeholder for pages that are planned but not built yet. Keeps the menu free of dead ends. */
export function ComingSoon({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="flex flex-1 items-center">
      <Container className="py-24 text-center sm:py-32">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        <div className="mx-auto mt-6 h-px w-24 bg-gold/60" />
        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">{description}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="whatsapp" className="w-full sm:w-auto">
            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href={siteConfig.contact.phoneHref}>
              <Phone /> {siteConfig.contact.phoneDisplay}
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
