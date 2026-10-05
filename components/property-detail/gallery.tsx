"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Images, ImageOff } from "lucide-react";
import { Lightbox } from "@/components/property-detail/lightbox";
import { cn } from "@/lib/utils";

/**
 * Listing photos. Desktop: cover + up to 4 thumbnails. Phone: swipeable strip with a counter.
 * Any photo opens the full-screen viewer.
 */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [stripIndex, setStripIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ImageOff className="size-10" />
      </div>
    );
  }

  const thumbs = images.slice(1, 5);
  const photoButton = (i: number, className: string, sizes: string, priority = false) => (
    <button
      key={images[i]}
      type="button"
      onClick={() => setOpen(i)}
      aria-label={`Open photo ${i + 1} of ${count}`}
      className={cn("group relative overflow-hidden bg-muted", className)}
    >
      <Image
        src={images[i]}
        alt={i === 0 ? title : ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
      />
    </button>
  );

  return (
    <>
      {/* Desktop mosaic */}
      <div
        className={cn(
          "relative hidden gap-2 overflow-hidden rounded-2xl md:grid",
          thumbs.length >= 4 ? "aspect-[2/1] grid-cols-4 grid-rows-2" : "aspect-[16/9] grid-cols-1",
        )}
      >
        {photoButton(0, thumbs.length >= 4 ? "col-span-2 row-span-2" : "", "(min-width: 1152px) 560px, 50vw", true)}
        {thumbs.length >= 4 && thumbs.map((_, i) => photoButton(i + 1, "", "(min-width: 1152px) 280px, 25vw"))}
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 text-sm font-medium text-foreground shadow-md backdrop-blur hover:bg-background"
        >
          <Images className="size-4" /> Show all {count} photos
        </button>
      </div>

      {/* Phone strip */}
      <div className="relative -mx-4 md:hidden">
        <div
          ref={stripRef}
          onScroll={() => {
            const el = stripRef.current;
            if (el) setStripIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((_, i) => (
            <div key={images[i]} className="relative size-full shrink-0 snap-start">
              {photoButton(i, "absolute inset-0", "100vw", i === 0)}
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white tabular-nums">
          {stripIndex + 1} / {count}
        </span>
      </div>

      <Lightbox images={images} title={title} index={open} onIndexChange={setOpen} />
    </>
  );
}
