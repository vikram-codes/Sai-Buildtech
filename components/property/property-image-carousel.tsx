"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  href: string;
  /** Tells the browser how wide the image will be shown, so it downloads the right size. */
  sizes: string;
  /** Load the first photo immediately (use for cards visible without scrolling). */
  priority?: boolean;
  className?: string;
};

/**
 * Swipeable photo strip for property cards. Uses the browser's own scroll-snap (no library):
 * swipe on touch screens, arrows + dots on hover for mouse users.
 * Each photo links to the listing; the arrows sit outside the links so they don't navigate.
 */
export function PropertyImageCarousel({ images, alt, href, sizes, priority, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (i + count) % count; // wrap around at both ends
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (count === 0) {
    return (
      <Link
        href={href}
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
        aria-label={alt}
      >
        <ImageOff className="size-8" />
      </Link>
    );
  }

  return (
    <div className={cn("group/carousel relative overflow-hidden bg-muted", className)}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex size-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <Link
            key={src}
            href={href}
            tabIndex={i === 0 ? 0 : -1}
            aria-label={i === 0 ? alt : undefined}
            aria-hidden={i === 0 ? undefined : true}
            className="relative size-full shrink-0 snap-start overflow-hidden"
          >
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Arrows: mouse users only (hidden on touch screens, which swipe instead) */}
          {[
            { label: "Previous photo", Icon: ChevronLeft, step: -1, side: "left-2" },
            { label: "Next photo", Icon: ChevronRight, step: 1, side: "right-2" },
          ].map(({ label, Icon, step, side }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => scrollTo(index + step)}
              className={cn(
                "absolute top-1/2 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-opacity [@media(hover:hover)]:flex",
                "opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100",
                side,
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}

          {/* Dots */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={cn(
                  "h-1.5 rounded-full bg-white shadow transition-all duration-300",
                  i === index ? "w-4 opacity-100" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
