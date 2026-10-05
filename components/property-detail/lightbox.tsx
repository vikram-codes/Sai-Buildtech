"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  title: string;
  index: number | null; // null = closed
  onIndexChange: (index: number | null) => void;
};

/**
 * Full-screen photo viewer. Arrows / ← → keys / swipe to move, Esc or ✕ to close.
 * Built on Dialog, so focus is trapped inside and returned to the photo you clicked.
 */
export function Lightbox({ images, title, index, onIndexChange }: Props) {
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const open = index !== null;
  const current = index ?? 0;

  const go = (step: number) => onIndexChange((current + step + count) % count);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent
        showCloseButton={false}
        className="flex h-svh max-h-none w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-black/95 p-0 text-white sm:max-w-none"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <DialogTitle className="truncate font-sans text-sm font-medium text-white/90">{title}</DialogTitle>
          <DialogDescription className="sr-only">Photo viewer. Use the arrow keys to move between photos.</DialogDescription>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70 tabular-nums" aria-live="polite">
              {current + 1} / {count}
            </span>
            <DialogClose className="rounded-full p-2 hover:bg-white/10" aria-label="Close photos">
              <X className="size-5" />
            </DialogClose>
          </div>
        </div>

        <div
          className="relative flex-1"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {open && (
            <Image
              key={images[current]}
              src={images[current]}
              alt={`${title} — photo ${current + 1} of ${count}`}
              fill
              sizes="100vw"
              className="object-contain animate-in fade-in duration-300"
            />
          )}
          {count > 1 &&
            [
              { label: "Previous photo", Icon: ChevronLeft, step: -1, side: "left-2 sm:left-4" },
              { label: "Next photo", Icon: ChevronRight, step: 1, side: "right-2 sm:right-4" },
            ].map(({ label, Icon, step, side }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => go(step)}
                className={cn(
                  "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20",
                  side,
                )}
              >
                <Icon className="size-6" />
              </button>
            ))}
        </div>

        {count > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-opacity",
                  i === current ? "opacity-100 ring-2 ring-gold-bright" : "opacity-50 hover:opacity-80",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
