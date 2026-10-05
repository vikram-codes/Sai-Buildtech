import { redirect } from "next/navigation";
import { ADMIN_HOME } from "@/lib/admin-paths";

export default function AdminIndex() {
  redirect(ADMIN_HOME);
}
