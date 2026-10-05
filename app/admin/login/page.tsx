import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { safeNextPath } from "@/lib/admin-paths";
import { getSessionUser, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Decides what the login page shows. Reads the session, so it lives inside <Suspense>.
 * - Admin already signed in → straight to the admin area
 * - Signed in but NOT an admin → explain + offer sign-out (no redirect, so no loop with the gate)
 * - Not signed in → the form
 */
async function LoginState({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  const user = await getSessionUser();
  if (user && (await isAdmin(user.id))) redirect(safeNextPath(next));

  if (user) {
    return (
      <div className="space-y-4 text-center">
        <ShieldAlert className="mx-auto size-10 text-destructive" />
        <p className="font-semibold">This account doesn&apos;t have admin access</p>
        <p className="text-sm text-muted-foreground">Signed in as {user.email}. Sign out to use a different account.</p>
        <form action={signOut}>
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <LogoMark />
        <span className="font-serif text-2xl">
          Sai <span className="text-gold">Buildtech</span>
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl">Sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Admin access to manage listings and inquiries.</p>
        <Suspense
          fallback={
            <div className="flex justify-center py-10 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          }
        >
          <LoginState searchParams={searchParams} />
        </Suspense>
      </div>

      <Link href="/" className="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to website
      </Link>
    </main>
  );
}
