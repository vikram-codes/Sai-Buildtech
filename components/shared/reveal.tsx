import { cn } from "@/lib/utils";

/**
 * Fades its content up as it scrolls into view — pure CSS (see `.reveal` in globals.css).
 * Uses the browser's scroll-driven animations: no JavaScript, and in browsers without
 * support (or with reduced motion) content is simply shown. It can never get stuck hidden.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
