import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/*
 * Early homepage (Phase 0). Grows into the full homepage in Phase 6
 * (hero imagery, search bar, featured properties, why choose us).
 */

export default function HomePage() {
  const { contact } = siteConfig;

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      {/* Soft gold glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-120 w-225 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="font-serif text-2xl tracking-tight">
          Sai <span className="text-gold">Buildtech</span>
        </span>
        <ThemeToggle />
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
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
            <Button asChild size="lg" className="w-full bg-[#25D366] text-white hover:bg-[#25D366]/90 sm:w-auto">
              <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> Chat on WhatsApp
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
      </main>

      <footer className="relative border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <span className="flex items-center gap-2 text-center">
            <MapPin className="size-4 shrink-0 text-gold" /> {contact.address.full}
          </span>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-foreground">
            <Mail className="size-4 text-gold" /> {contact.email}
          </a>
        </div>
      </footer>
    </div>
  );
}
