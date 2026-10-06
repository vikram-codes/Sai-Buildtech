import { redirect } from "next/navigation";

// The original brief named this URL; the form lives at /admin/listings/new
export default function AdminNewRedirect() {
  redirect("/admin/listings/new");
}
