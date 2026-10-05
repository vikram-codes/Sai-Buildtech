-- =============================================================================
-- 0002 · Admins
-- Only users listed in public.admins can manage listings, inquiries and photos.
-- Rows are added by hand in the Supabase dashboard (see Phase 10).
-- =============================================================================

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Users allowed into /admin. Add rows by hand in the dashboard.';

alter table public.admins enable row level security;

-- Visitors get nothing. Logged-in users may only check their own row
-- (lets the app ask "am I an admin?"). Nobody can add/remove admins via the API.
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

create policy "Users can see their own admin row"
on public.admins
for select
to authenticated
using (user_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- is_admin(): used by every security rule that needs "admins only"
-- security definer → it can read public.admins regardless of the caller's access
-- -----------------------------------------------------------------------------
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- Security rules are evaluated as the caller, so they need to reach this one function.
-- The private schema itself is still not exposed through the website API.
grant usage on schema private to anon, authenticated;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;
