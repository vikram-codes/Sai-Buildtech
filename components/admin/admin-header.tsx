import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

/** Top bar for every admin page: logo, signed-in email, view site, log out. */
export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <LogoMark className="size-6" />
          <span className="font-serif text-lg">
            Sai <span className="text-gold">Buildtech</span>
          </span>
          <span className="rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground">Admin</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="mr-2 hidden truncate text-sm text-muted-foreground md:inline" title="Signed in as">
            {email}
          </span>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/" target="_blank">
              View site <ExternalLink />
            </Link>
          </Button>
          <ThemeToggle />
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut /> Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
