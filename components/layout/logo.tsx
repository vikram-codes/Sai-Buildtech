import Link from "next/link";
import { cn } from "@/lib/utils";

/** Gold house mark — same drawing as app/icon.svg (the favicon), without the navy tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="4 5 24 22" aria-hidden className={cn("size-7 text-gold", className)}>
      <path
        d="M5.5 15.5 16 6.5l10.5 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.6V24.5A1.5 1.5 0 0 0 10.5 26H14v-6h4v6h3.5a1.5 1.5 0 0 0 1.5-1.5V13.6L16 7.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Logo mark + "Sai Buildtech" wordmark, linking home. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Sai Buildtech — home" className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-serif text-xl tracking-tight sm:text-2xl">
        Sai <span className="text-gold">Buildtech</span>
      </span>
    </Link>
  );
}
