import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/*
 * Developer-only Supabase status page at /dev/supabase.
 * First place to look when data isn't showing up. Returns 404 in production.
 */

export const metadata: Metadata = {
  title: "Supabase status",
  robots: { index: false, follow: false },
};

type Check = { name: string; status: "ok" | "warn" | "fail"; detail: string; ms?: number };

async function timed<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const start = performance.now();
  const result = await fn();
  return [result, Math.round(performance.now() - start)];
}

async function checkAuthApi(): Promise<Check> {
  const name = "Auth API";
  try {
    const [res, ms] = await timed(() =>
      fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: supabasePublishableKey }, cache: "no-store" }),
    );
    if (!res.ok) return { name, status: "fail", detail: `HTTP ${res.status} — check the URL and publishable key`, ms };
    return { name, status: "ok", detail: "Reachable, key accepted", ms };
  } catch (error) {
    return { name, status: "fail", detail: `Network error: ${(error as Error).message}` };
  }
}

async function checkDatabase(): Promise<Check> {
  const name = "Database API (properties table)";
  const supabase = await createClient();
  // A GET with limit(1), not `head: true`: HEAD responses have no body, which hides errors like "table not found"
  const [{ count, error }, ms] = await timed(async () =>
    supabase.from("properties").select("id", { count: "exact" }).limit(1),
  );
  if (!error) return { name, status: "ok", detail: `${count ?? 0} visible properties`, ms };
  // PGRST205 = table not found: connection works, schema not created yet (Phase 2)
  if (error.code === "PGRST205") return { name, status: "warn", detail: "Connected — table not created yet", ms };
  return { name, status: "fail", detail: `${error.code}: ${error.message}`, ms };
}

async function checkSession(): Promise<Check> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  return email
    ? { name: "Session", status: "ok", detail: `Logged in as ${email}` }
    : { name: "Session", status: "ok", detail: "Not logged in (expected until Phase 10)" };
}

const icons = {
  ok: <CheckCircle2 className="size-5 shrink-0 text-emerald" />,
  warn: <CircleAlert className="size-5 shrink-0 text-gold" />,
  fail: <XCircle className="size-5 shrink-0 text-destructive" />,
};

export default async function SupabaseStatusPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const checks = await Promise.all([checkAuthApi(), checkDatabase(), checkSession()]);
  const connected = checks.every((c) => c.status !== "fail");

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Developer</p>
        <h1 className="mt-2 text-4xl">Supabase status</h1>
        <p className="mt-3 font-mono text-sm break-all text-muted-foreground">{supabaseUrl}</p>
      </header>

      <div
        className={`rounded-xl border p-4 font-medium ${connected ? "border-emerald/30 bg-emerald/10 text-emerald" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
      >
        {connected ? "✓ Connected to Supabase" : "✗ Connection problem — see the failing check below"}
      </div>

      <ul className="divide-y overflow-hidden rounded-xl border bg-card">
        {checks.map((c) => (
          <li key={c.name} className="flex items-start gap-3 p-4">
            {icons[c.status]}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm wrap-break-word text-muted-foreground">{c.detail}</p>
            </div>
            {c.ms !== undefined && <span className="font-mono text-xs text-muted-foreground">{c.ms} ms</span>}
          </li>
        ))}
      </ul>
    </main>
  );
}
