import { cn } from "@/lib/utils";

/** Standard page width + side padding. Use for every section so edges line up. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}
