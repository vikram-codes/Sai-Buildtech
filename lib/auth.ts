import { redirect } from "next/navigation";
import { ADMIN_LOGIN } from "@/lib/admin-paths";
import { createClient } from "@/lib/supabase/server";

/*
 * Who is logged in, and are they an admin? Every admin check goes through here.
 * These read the login cookie, so they must be called inside a <Suspense> boundary (Cache Components rule).
 */

export type SessionUser = { id: string; email: string };

/** The logged-in user (signature-verified via getClaims), or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: (claims.email as string | undefined) ?? "" };
}

/** True if this user has a row in public.admins (they can only ever read their own row). */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(`[isAdmin] ${error.code}: ${error.message}`);
  return data !== null;
}

/** The logged-in admin, or null (not logged in, or logged in but not an admin). */
export async function getAdmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) return null;
  return (await isAdmin(user.id)) ? user : null;
}

/** Gate for admin pages: returns the admin, or redirects to the login page. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(ADMIN_LOGIN);
  if (!(await isAdmin(user.id))) redirect(`${ADMIN_LOGIN}?reason=no-access`);
  return user;
}
