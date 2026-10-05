import Image from "next/image";
import { Container } from "@/components/layout/container";
import { HeroSearch } from "@/components/home/hero-search";
import { RotatingWord } from "@/components/home/rotating-word";
import { siteConfig } from "@/lib/site-config";
import { HERO_IMAGE } from "@/lib/site-images";

const WORDS = ["home", "villa", "penthouse", "builder floor", "office"] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <Image
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Darken the photo so white text stays readable — strongest on the left and bottom */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

      <Container className="flex min-h-[min(88svh,780px)] flex-col justify-end gap-10 pt-28 pb-10 sm:pb-14">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-semibold tracking-[0.3em] text-gold-bright uppercase">
            {siteConfig.cities.join(" · ")}
          </p>

          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {/* Screen readers get one stable sentence; the animated version is hidden from them */}
            <span className="sr-only">Find your next home in Delhi NCR</span>
            <span aria-hidden>
              Find your next
              <br />
              <RotatingWord words={WORDS} />
              <br />
              in Delhi NCR
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base text-white/80 sm:text-lg">
            Handpicked apartments, villas, builder floors and commercial spaces — with honest advice from people who
            know every neighbourhood.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <HeroSearch />
        </div>
      </Container>
    </section>
  );
}
