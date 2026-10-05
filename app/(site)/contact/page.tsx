import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { JsonLd } from "@/components/shared/json-ld";
import { directionsUrl, MapEmbed } from "@/components/shared/map-embed";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const { contact } = siteConfig;

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${contact.phoneDisplay}, WhatsApp us, or visit our office at ${contact.address.full}. ${contact.hours}.`,
  alternates: { canonical: "/contact" },
};

/** Business details for Google (helps the business appear in local results). */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: contact.phoneHref.replace("tel:", ""),
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.address.line1,
    addressLocality: "Krishna Nagar, Delhi",
    postalCode: "110051",
    addressRegion: "Delhi",
    addressCountry: "IN",
  },
  areaServed: siteConfig.cities.map((name) => ({ "@type": "City", name })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: contact.openingHours.days,
      opens: contact.openingHours.opens,
      closes: contact.openingHours.closes,
    },
  ],
};

type Method = {
  icon: React.ReactNode;
  title: string;
  detail: React.ReactNode;
  href: string;
  action: string;
  external?: boolean;
};

const METHODS: Method[] = [
  {
    icon: <WhatsAppIcon className="size-5" />,
    title: "WhatsApp",
    detail: "Fastest way to reach us — send photos, documents or a quick question.",
    href: buildWhatsAppLink(),
    action: "Open chat",
    external: true,
  },
  {
    icon: <Phone className="size-5" />,
    title: "Call",
    detail: contact.phoneDisplay,
    href: contact.phoneHref,
    action: "Call now",
  },
  {
    icon: <Mail className="size-5" />,
    title: "Email",
    detail: contact.email,
    href: `mailto:${contact.email}`,
    action: "Write to us",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Visit our office",
    detail: (
      <>
        {contact.address.line1}
        <br />
        {contact.address.line2}
      </>
    ),
    href: directionsUrl(contact.address.full),
    action: "Get directions",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={businessJsonLd} />

      <Container className="py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Contact</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Let&apos;s talk about your next property</h1>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Buying, selling or renting — tell us what you need and we&apos;ll get back to you within hours.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-12">
          {/* Ways to reach us */}
          <div className="space-y-4">
            <ul className="grid gap-4 sm:grid-cols-2">
              {METHODS.map(({ icon, title, detail, href, action, external }) => (
                <li key={title}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-gold/40"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gold/10 text-gold">{icon}</span>
                    <h2 className="mt-4 font-sans text-lg font-semibold">{title}</h2>
                    <p className="mt-1 flex-1 text-sm wrap-break-word text-muted-foreground">{detail}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                      {action}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-3 rounded-2xl border bg-card px-6 py-4 text-sm">
              <Clock className="size-5 shrink-0 text-gold" />
              <span>
                <span className="font-semibold">Office hours:</span> {contact.hours}
              </span>
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl">Send us a message</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">We usually reply within a few hours.</p>
            <InquiryForm source="contact" submitLabel="Send message" />
          </div>
        </div>

        <section className="mt-16 space-y-5">
          <h2 className="text-3xl">Find us</h2>
          <p className="text-muted-foreground">{contact.address.full}</p>
          <MapEmbed
            query={contact.address.full}
            title={`Map of the ${siteConfig.name} office`}
            linkLabel="Get directions"
            className="aspect-[4/3] sm:aspect-[21/9]"
          />
        </section>
      </Container>
    </>
  );
}
