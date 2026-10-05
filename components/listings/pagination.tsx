import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { catalogueUrl, type CatalogueState } from "@/lib/listings-url";
import { cn } from "@/lib/utils";

/** Page numbers to show: always first and last, plus neighbours of the current page. 0 = "…". */
function pageList(current: number, count: number): number[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, current - 1, current, current + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [0, p] : [p]));
}

const itemClass = "flex size-10 items-center justify-center rounded-lg text-sm transition-colors";

/** Real links (crawlable, work without JavaScript) that keep the current filters. */
export function Pagination({ state, pageCount }: { state: CatalogueState; pageCount: number }) {
  const page = state.page ?? 1;
  if (pageCount <= 1) return null;

  const href = (p: number) => catalogueUrl({ ...state, page: p });

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(itemClass, "hover:bg-muted")} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemClass, "text-muted-foreground/40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageList(page, pageCount).map((p, i) =>
        p === 0 ? (
          <span key={`gap-${i}`} className={cn(itemClass, "text-muted-foreground")} aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(itemClass, p === page ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-muted")}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={href(page + 1)} className={cn(itemClass, "hover:bg-muted")} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemClass, "text-muted-foreground/40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
