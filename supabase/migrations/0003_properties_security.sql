-- =============================================================================
-- 0003 · Who can read and change listings
--
--   Visitor / logged-in non-admin → read published listings only
--   Admin                         → read everything, add / edit / delete
-- =============================================================================

-- Step 1: which roles can reach the table at all
revoke all on public.properties from anon, authenticated;
grant select on public.properties to anon;
grant select, insert, update, delete on public.properties to authenticated;

-- Step 2: which rows they can touch
create policy "Anyone can read published listings; admins read all"
on public.properties
for select
to anon, authenticated
using (is_published or (select private.is_admin()));

create policy "Admins can add listings"
on public.properties
for insert
to authenticated
with check ((select private.is_admin()));

create policy "Admins can edit listings"
on public.properties
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete listings"
on public.properties
for delete
to authenticated
using ((select private.is_admin()));
