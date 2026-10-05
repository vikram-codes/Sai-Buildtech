"use server";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN, safeNextPath } from "@/lib/admin-paths";
import { isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";

export type SignInResult = { ok: false; error: string };

// One message for every failure, so nobody can find out which emails have accounts
const BAD_LOGIN = "Incorrect email or password.";

/** Sign in with email + password. Admins are redirected into /admin; everyone else gets an error. */
export async function signIn(input: unknown, next?: string): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: BAD_LOGIN };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    // Supabase rate-limits repeated attempts; tell the person rather than showing "wrong password"
    if (error?.status === 429) return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
    if (error && error.status !== 400) console.error(`[signIn] ${error.status} ${error.code}: ${error.message}`);
    return { ok: false, error: BAD_LOGIN };
  }

  if (!(await isAdmin(data.user.id))) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account doesn't have admin access." };
  }

  redirect(safeNextPath(next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN);
}
