export const ADMIN_HOME = "/admin/dashboard";
export const ADMIN_LOGIN = "/admin/login";

/**
 * Where to go after signing in. Only paths inside /admin are allowed, so the login page
 * can't be abused to send people to another website (e.g. ?next=https://evil.com or //evil.com).
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return ADMIN_HOME;
  const ok =
    next.startsWith("/admin") &&
    !next.startsWith("//") &&
    !next.includes("\\") &&
    !next.startsWith(ADMIN_LOGIN) &&
    /^\/admin(\/[\w\-/?=&%.]*)?$/.test(next);
  return ok ? next : ADMIN_HOME;
}
