import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/property-card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BUDGETS, buildListingsUrl } from "@/lib/budgets";
import { parseListingFilters } from "@/lib/data/filters";
import {
  getCityCounts,
  getFeaturedProperties,
  getProperties,
  getPropertyBySlug,
  getSimilarProperties,
} from "@/lib/data/properties";

/*
 * Developer-only preview at /dev/listings: every sample listing as grid + list cards,
 * plus a self-check of the data functions against the counts in the database.
 * Returns 404 in production.
 */

export const metadata: Metadata = {
  title: "Listings preview",
  robots: { index: false, follow: false },
};

// URL-style filters → expected number of results (expected values taken from the database)
const FILTER_CHECKS: { params: Record<string, string>; expected: number }[] = [
  { params: {}, expected: 15 },
  { params: { city: "Noida" }, expected: 3 },
  { params: { type: "Villa" }, expected: 3 },
  { params: { beds: "4" }, expected: 8 },
  { params: { maxPrice: "20000000" }, expected: 5 },
  { params: { q: "defence" }, expected: 2 },
  { params: { city: "Delhi", type: "Builder Floor" }, expected: 4 },
  { params: { minPrice: "50000000", maxPrice: "150000000" }, expected: 7 },
  { params: { status: "Under Offer" }, expected: 2 },
  { params: { city: "Paris", page: "-5", beds: "lots" }, expected: 15 }, // junk is ignored
  { params: { q: "%' or 1=1 --" }, expected: 0 }, // symbols stripped → harmless search for "or 11"
];

// Homepage search: each budget → URL → filters → expected results (expected values from the database).
// Note "Under ₹1 Cr" only matches the 3 rentals (monthly rents are small numbers).
const BUDGET_CHECKS: Record<string, number> = {
  "under-1cr": 3,
  "1-3cr": 3,
  "3-5cr": 0,
  "5-10cr": 4,
  "10cr-plus": 5,
};

type Check = { label: string; ok: boolean; detail: string };

/** Follow a /listings URL through the real filter parsing, like the catalogue page will. */
function filtersFromUrl(url: string) {
  return parseListingFilters(Object.fromEntries(new URL(url, "http://x").searchParams));
}

async function runChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  for (const { params, expected } of FILTER_CHECKS) {
    const { total } = await getProperties(parseListingFilters(params));
    const label = Object.keys(params).length ? new URLSearchParams(params).toString() : "(no filters)";
    checks.push({ label: `getProperties ?${label}`, ok: total === expected, detail: `${total} (expected ${expected})` });
  }

  for (const budget of BUDGETS) {
    const url = buildListingsUrl({ budget: budget.id });
    const { total } = await getProperties(filtersFromUrl(url));
    const expected = BUDGET_CHECKS[budget.id];
    checks.push({ label: `search "${budget.label}" → ${url}`, ok: total === expected, detail: `${total} (expected ${expected})` });
  }

  const combo = buildListingsUrl({ city: "Noida", type: "Villa", budget: "5-10cr" });
  const comboTotal = (await getProperties(filtersFromUrl(combo))).total;
  checks.push({
    label: `search Noida + Villa + ₹5–10 Cr → ${combo}`,
    ok: comboTotal === 1 && combo === "/listings?city=Noida&type=Villa&minPrice=50000000&maxPrice=100000000",
    detail: `${comboTotal} (expected 1)`,
  });

  const anyUrl = buildListingsUrl({});
  checks.push({ label: "search with nothing chosen", ok: anyUrl === "/listings", detail: anyUrl });

  const cities = await getCityCounts();
  checks.push({
    label: "getCityCounts()",
    ok: cities.Delhi === 8 && cities.Noida === 3 && cities.Gurugram === 4,
    detail: JSON.stringify(cities),
  });

  const pastEnd = await getProperties(parseListingFilters({ page: "99" }));
  checks.push({
    label: "getProperties ?page=99 (past the end)",
    ok: pastEnd.items.length === 0 && pastEnd.total === 15,
    detail: `${pastEnd.items.length} items, total ${pastEnd.total}`,
  });

  const page2 = await getProperties(parseListingFilters({ page: "2" }));
  checks.push({
    label: "getProperties ?page=2 (12 per page)",
    ok: page2.items.length === 3 && page2.pageCount === 2,
    detail: `${page2.items.length} items, ${page2.pageCount} pages`,
  });

  const featured = await getFeaturedProperties();
  checks.push({
    label: "getFeaturedProperties()",
    ok: featured.length === 6 && featured.every((p) => p.featured),
    detail: `${featured.length} (expected 6)`,
  });

  const missing = await getPropertyBySlug("no-such-listing");
  checks.push({ label: 'getPropertyBySlug("no-such-listing")', ok: missing === null, detail: String(missing) });

  const bad = await getPropertyBySlug("../../etc");
  checks.push({ label: 'getPropertyBySlug("../../etc")', ok: bad === null, detail: String(bad) });

  const vv = await getPropertyBySlug("4-bhk-builder-floor-vasant-vihar");
  checks.push({
    label: 'getPropertyBySlug("4-bhk-builder-floor-vasant-vihar")',
    ok: vv?.title === "4 BHK Builder Floor in Vasant Vihar" && !!vv.description,
    detail: vv?.title ?? "null",
  });

  if (vv) {
    const similar = await getSimilarProperties(vv);
    checks.push({
      label: "getSimilarProperties(Vasant Vihar floor)",
      ok: similar.length === 3 && similar[0].property_type === "Builder Floor" && similar.every((p) => p.id !== vv.id),
      detail: similar.map((p) => `${p.property_type} · ${p.city}`).join(" | "),
    });
  }

  return checks;
}

export default async function DevListingsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [checks, page1, page2] = await Promise.all([
    runChecks(),
    getProperties(parseListingFilters({})),
    getProperties(parseListingFilters({ page: "2" })),
  ]);
  const all = [...page1.items, ...page2.items];
  const passed = checks.filter((c) => c.ok).length;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-14 px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Developer</p>
          <h1 className="mt-2 text-4xl">Listings preview</h1>
          <p className="mt-3 text-muted-foreground">{all.length} published listings from Supabase.</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl">
          Data checks{" "}
          <span className={passed === checks.length ? "text-emerald" : "text-destructive"}>
            {passed}/{checks.length} passed
          </span>
        </h2>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-2.5">
              {c.ok ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <span className="min-w-0 flex-1 font-mono break-words">{c.label}</span>
              <span className="w-full pl-7 text-muted-foreground sm:w-auto sm:pl-0 sm:text-right">{c.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl">Grid cards</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i < 3} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl">List cards</h2>
        <div className="grid gap-6">
          {all.slice(0, 4).map((p) => (
            <PropertyCard key={p.id} property={p} layout="list" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl">Loading placeholders</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
        <PropertyCardSkeleton layout="list" />
      </section>
    </main>
  );
}
