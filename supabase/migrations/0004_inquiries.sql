-- =============================================================================
-- 0004 · Inquiries (contact form + property inquiry form)
--
--   Anyone → can submit, but can never read inquiries back
--   Admin  → read, mark as handled, delete
-- =============================================================================

create type public.inquiry_source as enum ('contact', 'property');

create table public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 2 and 100),
  -- Digits, spaces, + ( ) - only; 7–20 characters, e.g. "+91 82878 29725"
  phone       text not null check (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  email       text check (
                email is null
                or (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
              ),
  message     text check (message is null or char_length(message) <= 2000),
  -- Empty for the contact page. Kept (set to empty) if the listing is deleted.
  property_id uuid references public.properties (id) on delete set null,
  source      public.inquiry_source not null default 'contact',
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.inquiries is 'Leads from the contact form and property pages.';

alter table public.inquiries enable row level security;

create index inquiries_created_at_idx  on public.inquiries (created_at desc);
create index inquiries_property_id_idx on public.inquiries (property_id);

-- Step 1: which roles can reach the table
revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon;
grant select, insert, update, delete on public.inquiries to authenticated;

-- Step 2: which rows
create policy "Anyone can submit an inquiry"
on public.inquiries
for insert
to anon, authenticated
with check (handled = false);  -- visitors can't pre-mark their own inquiry as handled

create policy "Admins can read inquiries"
on public.inquiries
for select
to authenticated
using ((select private.is_admin()));

create policy "Admins can update inquiries"
on public.inquiries
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete inquiries"
on public.inquiries
for delete
to authenticated
using ((select private.is_admin()));
