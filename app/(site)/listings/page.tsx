import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ActiveFilters } from "@/components/listings/active-filters";
import { FilterBar } from "@/components/listings/filter-bar";
import { Pagination } from "@/components/listings/pagination";
import { Results, ResultsSkeleton } from "@/components/listings/results";
import { ViewToggle } from "@/components/listings/view-toggle";
import { parseListingFilters } from "@/lib/data/filters";
import { getProperties } from "@/lib/data/properties";
import { describeFilters, parseView, type CatalogueState } from "@/lib/listings-url";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** URL → validated filters (for the database) + full state incl. grid/list (for links and UI). */
async function readState(searchParams: SearchParams) {
  const params = await searchParams;
  const filters = parseListingFilters(params);
  const state: CatalogueState = { ...filters, view: parseView(params.view) };
  return { filters, state };
}

/** Browser tab / Google title follows the filters, e.g. "Villas in Noida | Sai Buildtech". */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { state } = await readState(searchParams);
  const title = describeFilters(state);
  return {
    title: title === "Properties" ? "Listings" : title,
    description: `Browse ${title.toLowerCase()} for sale and rent across Delhi, Noida and Gurugram with Sai Buildtech.`,
  };
}

/** Everything that depends on the URL. Rendered per request inside <Suspense>. */
async function Catalogue({ searchParams }: { searchParams: SearchParams }) {
  const { filters, state } = await readState(searchParams);
  const result = await getProperties(filters);
  const heading = describeFilters(state);

  return (
    <>
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Listings</p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{heading}</h1>
      </header>

      <div className="mt-8 space-y-5">
        <FilterBar state={state} total={result.total} />
        <ActiveFilters state={state} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-foreground">{result.total}</span>{" "}
          {result.total === 1 ? "property" : "properties"}
          {result.pageCount > 1 && ` · page ${result.page} of ${result.pageCount}`}
        </p>
        <ViewToggle state={state} />
      </div>

      <div className="mt-6">
        <Results result={result} state={state} />
      </div>

      <div className="mt-12">
        <Pagination state={state} pageCount={result.pageCount} />
      </div>
    </>
  );
}

function CatalogueSkeleton() {
  return (
    <>
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Listings</p>
        <div className="h-12 w-64 animate-pulse rounded bg-muted" />
      </header>
      <div className="mt-8 h-14 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 mb-6 h-5 w-32 animate-pulse rounded bg-muted" />
      <ResultsSkeleton />
    </>
  );
}

export default function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Container className="py-12 sm:py-16">
      <Suspense fallback={<CatalogueSkeleton />}>
        <Catalogue searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
