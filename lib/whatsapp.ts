import { siteConfig } from "@/lib/site-config";

const DEFAULT_MESSAGE = `Hi ${siteConfig.name}, I'd like to know more about your properties.`;

/** Builds a WhatsApp chat link to the business number with a pre-filled message. */
export function buildWhatsAppLink(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
