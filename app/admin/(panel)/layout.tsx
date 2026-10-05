import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminNav } from "@/components/admin/admin-nav";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/auth";
import { getNewInquiryCount } from "@/lib/data/admin";

/*
 * The admin gate. Every page in app/admin/(panel)/ only renders for a logged-in admin.
 * The session is read inside <Suspense> (Cache Components rule), so the frame shows instantly.
 */

async function AdminGate({ children }: { children: React.ReactNode }) {
  // Run side by side (one round trip instead of two). If the visitor isn't an admin,
  // requireAdmin redirects and the count is simply discarded — the database only counts for admins anyway.
  const [admin, newInquiries] = await Promise.all([requireAdmin(), getNewInquiryCount()]);
  return (
    <>
      <AdminHeader email={admin.email} />
      <AdminNav newInquiries={newInquiries} />
      <Toaster position="bottom-right" richColors closeButton />
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
