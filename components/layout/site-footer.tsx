import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Constants } from "@/types/database";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Footer labels: "Builder Floor" → "Builder Floors", but "Commercial" stays as is
const plural = (type: string) => (type === "Commercial" ? "Commercial" : `${type}s`);

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-gold uppercase">{children}</h2>;
}

// Copyright year, cached so the footer can be prerendered (refreshes daily, so it rolls over on 1 Jan)
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="border-t bg-card/50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}. Buying, selling and renting homes and commercial spaces across{" "}
            {siteConfig.cities.join(", ").replace(/, ([^,]*)$/, " and $1")}.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-2.5">
            {siteConfig.nav.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
            {siteConfig.cities.map((city) => (
              <li key={city}>
                <Link href={`/listings?city=${city}`} className={linkClass}>
                  Properties in {city}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Property types */}
        <div>
          <FooterHeading>Property types</FooterHeading>
          <ul className="space-y-2.5">
            {Constants.public.Enums.property_type.map((type) => (
              <li key={type}>
                <Link href={`/listings?type=${encodeURIComponent(type)}`} className={linkClass}>
                  {plural(type)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <FooterHeading>Visit or call</FooterHeading>
          <address className="space-y-3 text-sm not-italic text-muted-foreground">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {contact.address.line1}
                <br />
                {contact.address.line2}
              </span>
            </p>
            <a href={contact.phoneHref} className={`flex items-center gap-3 ${linkClass}`}>
              <Phone className="size-4 shrink-0 text-gold" />
              {contact.phoneDisplay}
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 ${linkClass}`}
            >
              <WhatsAppIcon className="size-4 shrink-0 text-gold" />
              WhatsApp us
            </a>
            <a href={`mailto:${contact.email}`} className={`flex items-center gap-3 ${linkClass}`}>
              <Mail className="size-4 shrink-0 text-gold" />
              {contact.email}
            </a>
            <p className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-gold" />
              {contact.hours}
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t">
        {/* Extra bottom padding on phones so the floating WhatsApp button doesn't cover this row */}
        <Container className="flex flex-col items-center justify-between gap-2 pt-5 pb-24 text-xs text-muted-foreground sm:flex-row sm:pb-5">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <Link href="/admin/login" className="transition-colors hover:text-foreground">
            Admin login
          </Link>
        </Container>
      </div>
    </footer>
  );
}
