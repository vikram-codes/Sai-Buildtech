import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/auth";

/*
 * The admin gate. Every page in app/admin/(panel)/ only renders for a logged-in admin.
 * The session is read inside <Suspense> (Cache Components rule), so the frame shows instantly.
 */

async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin(); // redirects to /admin/login if not allowed
  return (
    <>
      <AdminHeader email={admin.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </>
  );
}

function GateLoading() {
  return (
    <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> Checking access…
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<GateLoading />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
