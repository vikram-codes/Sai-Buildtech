"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Horizontal row of items: swipe on touch screens, arrow buttons for mouse/keyboard users.
 * Uses browser scroll-snap (no carousel library). Items are passed as children.
 * `itemClassName` controls how wide each item is (e.g. 85% on phones, a third on desktop).
 */
export function ScrollRow({
  children,
  label,
  itemClassName,
}: {
  children: React.ReactNode;
  label: string;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        role="region"
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pt-1 pb-6 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className={cn("shrink-0 snap-start", itemClassName)}>{child}</div>
        ))}
      </div>

      <div className="mt-2 hidden justify-end gap-2 md:flex">
        <Button variant="outline" size="icon" aria-label="Scroll left" disabled={!canPrev} onClick={() => scroll(-1)}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" aria-label="Scroll right" disabled={!canNext} onClick={() => scroll(1)}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
