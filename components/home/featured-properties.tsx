import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/property-card";
import { Reveal } from "@/components/shared/reveal";
import { ScrollRow } from "@/components/shared/scroll-row";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/lib/data/properties";

// ~85% wide on phones (next card peeks in), 2 across on tablets, 3 on desktop
const ITEM_WIDTH = "w-[85%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]";

function Header() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <SectionHeading
        eyebrow="Featured"
        title="Handpicked properties"
        description="A selection of standout homes and spaces across Delhi NCR, chosen by our team."
      />
      <Button asChild variant="outline" className="shrink-0">
        <Link href="/listings">
          View all listings <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties(6);
  if (properties.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-10">
        <Reveal>
          <Header />
        </Reveal>
        <ScrollRow label="Featured properties" itemClassName={ITEM_WIDTH}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} className="h-full" />
          ))}
        </ScrollRow>
      </Container>
    </section>
  );
}

/** Shown while featured listings load. */
export function FeaturedPropertiesSkeleton() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-10">
        <Header />
        <div className="flex gap-5 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`shrink-0 ${ITEM_WIDTH}`}>
              <PropertyCardSkeleton />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
