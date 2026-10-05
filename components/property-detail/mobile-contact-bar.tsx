import { MessageSquareText, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Phone-only bar pinned to the bottom of a listing page: WhatsApp · Call · Enquire.
 * `data-hide-whatsapp-float` tells globals.css to hide the round WhatsApp button so they don't overlap.
 */
export function MobileContactBar({ whatsappMessage }: { whatsappMessage: string }) {
  return (
    <div
      data-hide-whatsapp-float
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-3 gap-2">
        <Button asChild variant="whatsapp">
          <a href={buildWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={siteConfig.contact.phoneHref}>
            <Phone /> Call
          </a>
        </Button>
        <Button asChild>
          <a href="#enquire">
            <MessageSquareText /> Enquire
          </a>
        </Button>
      </div>
    </div>
  );
}
