-- =============================================================================
-- 0005 · Photo storage: property-images bucket
--
--   Public bucket → photos load on the site without logging in
--   Images only (JPEG, PNG, WebP, AVIF), max 5 MB each
--   Only admins can upload, replace or delete
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No public "select" rule on purpose: public URLs work without one,
-- and leaving it out stops visitors from listing every file in the bucket.

create policy "Admins can list property images"
on storage.objects
for select
to authenticated
using (bucket_id = 'property-images' and (select private.is_admin()));

create policy "Admins can upload property images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'property-images' and (select private.is_admin()));

create policy "Admins can replace property images"
on storage.objects
for update
to authenticated
using (bucket_id = 'property-images' and (select private.is_admin()))
with check (bucket_id = 'property-images' and (select private.is_admin()));

create policy "Admins can delete property images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'property-images' and (select private.is_admin()));
