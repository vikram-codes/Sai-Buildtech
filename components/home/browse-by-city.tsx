import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCityCounts } from "@/lib/data/properties";
import { CITIES } from "@/lib/site-config";
import { CITY_IMAGES } from "@/lib/site-images";

export async function BrowseByCity() {
  const counts = await getCityCounts();

  return (
    <section className="bg-card/60 py-20 sm:py-24">
      <Container className="space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Browse by city"
            description="From Lutyens' bungalows to Gurugram high-rises and Noida's green sectors."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {CITIES.map((city) => {
            const count = counts[city];
            return (
              <Reveal key={city}>
                <Link
                  href={`/listings?city=${city}`}
                  className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-2xl text-white sm:aspect-[3/4]"
                >
                  <Image
                    src={CITY_IMAGES[city].src}
                    alt={CITY_IMAGES[city].alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  <div className="flex w-full items-end justify-between gap-4 p-6">
                    <div>
                      <h3 className="text-3xl">{city}</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {count} {count === 1 ? "property" : "properties"}
                      </p>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-gold-bright group-hover:text-slate-950">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
