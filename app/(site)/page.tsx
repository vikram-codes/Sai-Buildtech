import { Suspense } from "react";
import { BrowseByCity } from "@/components/home/browse-by-city";
import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedProperties, FeaturedPropertiesSkeleton } from "@/components/home/featured-properties";
import { Hero } from "@/components/home/hero";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties />
      </Suspense>
      <Suspense>
        <BrowseByCity />
      </Suspense>
      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
