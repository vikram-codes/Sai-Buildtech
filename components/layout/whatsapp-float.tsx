import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Round WhatsApp button pinned bottom-right on every public page.
 * Pass `message` to pre-fill something specific (e.g. a property name on its detail page).
 */
export function WhatsAppFloat({ message }: { message?: string }) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg ring-1 ring-black/10 transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-whatsapp/40 focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      {/* Soft pulse to draw the eye, disabled for people who prefer reduced motion */}
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-20 motion-reduce:hidden" />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
