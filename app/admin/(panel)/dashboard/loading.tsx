/*
 * Shown instantly when navigating to Listings while its data loads. Without this, the click
 * would wait for the database before anything changed (Next 16 "instant navigation" check).
 */
export default function ListingsLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading listings">
      <div className="space-y-3">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex justify-between gap-4">
        <div className="h-10 w-80 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="space-y-px overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 bg-card p-4">
            <div className="h-12 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
