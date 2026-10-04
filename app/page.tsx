import { MessageCircle, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatArea, formatPrice, formatPriceFull } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/*
 * TEMPORARY style preview (Phase 0).
 * Used to check fonts, colours, buttons, badges and price formatting in both themes.
 * Replaced by the real homepage in Phase 6.
 */

const swatches = [
  { name: "background", className: "bg-background" },
  { name: "card", className: "bg-card" },
  { name: "muted", className: "bg-muted" },
  { name: "primary", className: "bg-primary" },
  { name: "gold", className: "bg-gold" },
  { name: "emerald", className: "bg-emerald" },
  { name: "foreground", className: "bg-foreground" },
  { name: "destructive", className: "bg-destructive" },
];

const priceSamples = [
  { price: 32_000_000, type: "Sale" },
  { price: 125_000_000, type: "Sale" },
  { price: 8_500_000, type: "Sale" },
  { price: 9_999_999, type: "Sale" },
  { price: 45_000, type: "Rent" },
  { price: 150_000, type: "Rent" },
] as const;

export default function StylePreviewPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-16 px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Style preview</p>
          <h1 className="mt-2 text-4xl sm:text-6xl">{siteConfig.name}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">{siteConfig.description}</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl">Typography</h2>
        <div className="space-y-2 rounded-xl border bg-card p-6">
          <h1 className="text-5xl">Luxury living in Vasant Vihar</h1>
          <h2 className="text-3xl">Featured Properties</h2>
          <h3 className="text-xl">4 BHK Builder Floor</h3>
          <p className="text-muted-foreground">
            Body text in Plus Jakarta Sans. Spacious 4 BHK with a private lift, Italian marble flooring and
            a landscaped terrace overlooking the park.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Colours</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-lg border bg-card">
              <div className={`h-16 border-b ${s.className}`} />
              <p className="px-3 py-2 font-mono text-xs">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Buttons & badges</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Schedule a Visit</Button>
          <Button variant="outline">View Listings</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            For Sale
          </span>
          <span className="rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
            For Rent
          </span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Price formatting</h2>
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Raw value</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Short</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Full</th>
              </tr>
            </thead>
            <tbody>
              {priceSamples.map((s) => (
                <tr key={`${s.price}-${s.type}`} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{s.price}</td>
                  <td className="px-4 py-2">{s.type}</td>
                  <td className="px-4 py-2 font-semibold text-gold">{formatPrice(s.price, s.type)}</td>
                  <td className="hidden px-4 py-2 sm:table-cell">{formatPriceFull(s.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">Area: {formatArea(2400)}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Contact</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
            <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.contact.phoneHref}>
              <Phone /> {siteConfig.contact.phoneDisplay}
            </a>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{siteConfig.contact.address.full}</p>
      </section>
    </main>
  );
}
