import { Phone } from "lucide-react";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/data/properties";
import { formatPrice, formatPriceFull } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** The WhatsApp message for a listing, with its name, price and link. */
export function propertyWhatsAppMessage(property: Pick<Property, "title" | "price" | "listing_type" | "slug">) {
  const price = formatPrice(property.price, property.listing_type);
  return `Hi ${siteConfig.name}, I'm interested in "${property.title}" (${price}). ${siteConfig.url}/listings/${property.slug}`;
}

/** Price + WhatsApp + call + call-back form. Sticks in view on desktop. */
export function ContactCard({ property }: { property: Property }) {
  const isRent = property.listing_type === "Rent";

  return (
    <div id="enquire" className="scroll-mt-24 rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        {isRent ? "Monthly rent" : "Asking price"}
      </p>
      <p className="mt-1 font-serif text-4xl text-gold">{formatPrice(property.price, property.listing_type)}</p>
      {!isRent && <p className="mt-1 text-sm text-muted-foreground">{formatPriceFull(property.price)}</p>}

      <div className="mt-6 grid gap-3">
        <Button asChild size="lg" variant="whatsapp">
          <a href={buildWhatsAppLink(propertyWhatsAppMessage(property))} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-5" /> WhatsApp about this property
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={siteConfig.contact.phoneHref}>
            <Phone /> Call {siteConfig.contact.phoneDisplay}
          </a>
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or request a call back
        <span className="h-px flex-1 bg-border" />
      </div>

      <InquiryForm
        source="property"
        propertyId={property.id}
        defaultMessage={`I'm interested in "${property.title}". Please call me with more details.`}
      />
    </div>
  );
}
