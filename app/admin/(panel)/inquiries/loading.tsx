/* Shown instantly when navigating to Inquiries while its data loads (see dashboard/loading.tsx). */
export default function InquiriesLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading inquiries">
      <div className="space-y-3">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border bg-card" />
        ))}
      </div>
    </div>
  );
}
