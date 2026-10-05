import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Amenities } from "@/components/property-detail/amenities";
import { ContactCard, propertyWhatsAppMessage } from "@/components/property-detail/contact-card";
import { Gallery } from "@/components/property-detail/gallery";
import { KeyDetails } from "@/components/property-detail/key-details";
import { LocationMap } from "@/components/property-detail/location-map";
import { MobileContactBar } from "@/components/property-detail/mobile-contact-bar";
import { FeaturedBadge, ListingTypeBadge, StatusBadge } from "@/components/property/listing-badges";
import { PropertyCard } from "@/components/property/property-card";
import { getPropertyBySlug, getPublishedSlugs, getSimilarProperties, type Property } from "@/lib/data/properties";
import { formatPrice } from "@/lib/format";
import { catalogueUrl } from "@/lib/listings-url";

/** Pre-build every published listing. Listings added later are built on their first visit. */
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  // Cache Components needs at least one entry; an unknown slug simply renders the 404 page
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "no-listings-yet" }];
}

export async function generateMetadata({ params }: PageProps<"/listings/[slug]">): Promise<Metadata> {
  const property = await getPropertyBySlug((await params).slug);
  if (!property) return { title: "Listing not found" };

  const summary = (property.description ?? "").replace(/\s+/g, " ").trim();
  const description = `${formatPrice(property.price, property.listing_type)} · ${property.location}, ${property.city}. ${summary}`.slice(0, 160);

  return {
    title: property.title,
    description,
    alternates: { canonical: `/listings/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      type: "website",
      url: `/listings/${property.slug}`,
      images: property.images[0] ? [{ url: property.images[0], alt: property.title }] : [],
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 border-t pt-10">
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

async function SimilarProperties({ property }: { property: Property }) {
  const similar = await getSimilarProperties(property);
  if (similar.length === 0) return null;
  return (
    <section className="mt-20 space-y-8">
      <h2 className="text-3xl">Similar properties</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}

export default async function PropertyPage({ params }: PageProps<"/listings/[slug]">) {
  const property = await getPropertyBySlug((await params).slug);
  if (!property) notFound();

  const paragraphs = (property.description ?? "").split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <Container className="pt-6 pb-28 sm:pt-8 md:pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "Home", href: "/" },
            { label: "Listings", href: "/listings" },
            { label: property.city, href: catalogueUrl({ city: property.city }) },
          ].map(({ label, href }) => (
            <li key={href} className="flex items-center gap-1.5">
              <Link href={href} className="hover:text-foreground">
                {label}
              </Link>
              <ChevronRight className="size-3.5" aria-hidden />
            </li>
          ))}
          <li aria-current="page" className="max-w-[16rem] truncate text-foreground">
            {property.title}
          </li>
        </ol>
      </nav>

      <Gallery images={property.images} title={property.title} />

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-10">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <ListingTypeBadge type={property.listing_type} />
              {property.featured && <FeaturedBadge />}
              <StatusBadge status={property.status} />
            </div>
            <h1 className="text-3xl leading-tight sm:text-5xl">{property.title}</h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-gold" />
              {property.location}, {property.city}
            </p>
            {/* Price is in the contact card on desktop; repeat it here for phones */}
            <p className="font-serif text-3xl text-gold lg:hidden">{formatPrice(property.price, property.listing_type)}</p>
          </header>

          <KeyDetails
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area_sqft={property.area_sqft}
            property_type={property.property_type}
            status={property.status}
          />

          {paragraphs.length > 0 && (
            <Section title="About this property">
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Section>
          )}

          {property.amenities.length > 0 && (
            <Section title="Amenities">
              <Amenities amenities={property.amenities} />
            </Section>
          )}

          <Section title="Location">
            <p className="text-muted-foreground">
              {property.location}, {property.city}. Exact address shared on enquiry.
            </p>
            <LocationMap location={property.location} city={property.city} />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ContactCard property={property} />
        </aside>
      </div>

      <Suspense>
        <SimilarProperties property={property} />
      </Suspense>

      <MobileContactBar whatsappMessage={propertyWhatsAppMessage(property)} />
    </Container>
  );
}
