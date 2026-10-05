-- =============================================================================
-- Security checks for the Sai Buildtech database
--
-- HOW TO RUN: paste this whole file into Supabase → SQL Editor → Run.
--
-- WHAT IT DOES:
--   1. Creates a temporary test admin, 2 test listings and a test inquiry.
--   2. Runs 32 checks as a visitor, a logged-in non-admin, and an admin.
--   3. Throws an error on purpose at the end. That error UNDOES EVERYTHING,
--      so nothing is left behind. The pass/fail report is the error message.
--
-- EXPECTED RESULT: a red "ERROR" box whose message starts with
--   "TEST REPORT (all changes rolled back)" and where every line starts with PASS.
-- =============================================================================

do $$
declare
  out      text[] := '{}';
  n        int;
  admin_id uuid := gen_random_uuid();
  pub_id   uuid;
  hid_id   uuid;
  pd       text;
  ua       timestamptz;
begin
  -- ---------- setup (as postgres; everything is rolled back at the end) ----------
  insert into auth.users (id, instance_id, aud, role, email)
  values (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'zz-test-admin@example.com');
  insert into public.admins (user_id) values (admin_id);
  insert into public.properties (title, slug, price, location, property_type, is_published, created_at, updated_at)
  values ('Test published', 'zz-test-published', 32000000, 'Test', 'Apartment', true, '2000-01-01', '2000-01-01')
  returning id into pub_id;
  insert into public.properties (title, slug, price, location, property_type, is_published)
  values ('Test hidden', 'zz-test-hidden', 8500000, 'Test', 'Villa', false)
  returning id into hid_id;

  -- =============================== VISITOR (anon) ===============================
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;

  select count(*) into n from public.properties where slug like 'zz-test-%';
  out := out || format('%s visitor sees %s of 2 test listings (expect 1: published only)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  begin
    insert into public.properties (title, slug, price, location, property_type) values ('Hack', 'zz-hack', 1, 'Test Area', 'Plot');
    out := out || 'FAIL visitor inserted a listing'::text;
  exception when others then out := out || ('PASS visitor insert listing blocked — ' || sqlerrm); end;

  begin
    update public.properties set price = 1 where id = pub_id; get diagnostics n = row_count;
    out := out || format('%s visitor update changed %s rows (expect 0)', case when n = 0 then 'PASS' else 'FAIL' end, n);
  exception when others then out := out || ('PASS visitor update blocked — ' || sqlerrm); end;

  begin
    delete from public.properties where id = pub_id; get diagnostics n = row_count;
    out := out || format('%s visitor delete removed %s rows (expect 0)', case when n = 0 then 'PASS' else 'FAIL' end, n);
  exception when others then out := out || ('PASS visitor delete blocked — ' || sqlerrm); end;

  begin
    insert into public.inquiries (name, phone, message, property_id, source) values ('Test Visitor', '+91 98765 43210', 'Interested', pub_id, 'property');
    out := out || 'PASS visitor can submit an inquiry'::text;
  exception when others then out := out || ('FAIL visitor inquiry rejected — ' || sqlerrm); end;

  begin
    insert into public.inquiries (name, phone, handled) values ('Sneaky', '9876543210', true);
    out := out || 'FAIL visitor pre-marked inquiry as handled'::text;
  exception when others then out := out || ('PASS visitor cannot pre-mark handled — ' || sqlerrm); end;

  begin
    select count(*) into n from public.inquiries;
    out := out || format('FAIL visitor read inquiries (%s rows)', n);
  exception when others then out := out || ('PASS visitor read inquiries blocked — ' || sqlerrm); end;

  begin
    select count(*) into n from public.admins;
    out := out || format('FAIL visitor read admins (%s rows)', n);
  exception when others then out := out || ('PASS visitor read admins blocked — ' || sqlerrm); end;

  begin
    insert into storage.objects (bucket_id, name) values ('property-images', 'zz-test/visitor.jpg');
    out := out || 'FAIL visitor uploaded a photo'::text;
  exception when others then out := out || ('PASS visitor upload blocked — ' || sqlerrm); end;

  begin
    perform private.format_price(1, 'Sale');
    out := out || 'FAIL visitor can call private helpers'::text;
  exception when others then out := out || ('PASS visitor cannot call private helpers — ' || sqlerrm); end;

  -- ========================= LOGGED-IN NON-ADMIN =========================
  reset role;
  perform set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', gen_random_uuid())::text, true);
  set local role authenticated;

  select count(*) into n from public.properties where slug like 'zz-test-%';
  out := out || format('%s non-admin sees %s of 2 test listings (expect 1)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  begin
    insert into public.properties (title, slug, price, location, property_type) values ('Hack', 'zz-hack', 1, 'Test Area', 'Plot');
    out := out || 'FAIL non-admin inserted a listing'::text;
  exception when others then out := out || ('PASS non-admin insert listing blocked — ' || sqlerrm); end;

  select count(*) into n from public.inquiries;
  out := out || format('%s non-admin sees %s inquiries (expect 0)', case when n = 0 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.admins;
  out := out || format('%s non-admin sees %s admin rows (expect 0)', case when n = 0 then 'PASS' else 'FAIL' end, n);

  begin
    insert into storage.objects (bucket_id, name) values ('property-images', 'zz-test/nonadmin.jpg');
    out := out || 'FAIL non-admin uploaded a photo'::text;
  exception when others then out := out || ('PASS non-admin upload blocked — ' || sqlerrm); end;

  -- =============================== ADMIN ===============================
  reset role;
  perform set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', admin_id)::text, true);
  set local role authenticated;

  select count(*) into n from public.properties where slug like 'zz-test-%';
  out := out || format('%s admin sees %s of 2 test listings (expect 2, incl. hidden)', case when n = 2 then 'PASS' else 'FAIL' end, n);

  select count(*) into n from public.admins;
  out := out || format('%s admin sees own admin row (%s)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  begin
    insert into public.properties (title, slug, price, location, property_type, city, listing_type)
    values ('Admin listing', 'zz-test-admin-new', 4500000, 'Sector 62', 'Apartment', 'Noida', 'Sale') returning price_display into pd;
    out := out || format('%s admin can add a listing (price label "%s", expect "₹45 L")', case when pd = '₹45 L' then 'PASS' else 'FAIL' end, pd);
  exception when others then out := out || ('FAIL admin insert rejected — ' || sqlerrm); end;

  update public.properties set price = 45000, listing_type = 'Rent' where id = pub_id returning price_display, updated_at into pd, ua;
  out := out || format('%s admin edit: price label "%s" (expect "₹45,000/month")', case when pd = '₹45,000/month' then 'PASS' else 'FAIL' end, pd);
  out := out || format('%s admin edit: updated_at moved from 2000-01-01 to %s', case when ua > '2001-01-01' then 'PASS' else 'FAIL' end, ua::date);

  select count(*) into n from public.inquiries;
  out := out || format('%s admin sees %s inquiries (expect 1)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  update public.inquiries set handled = true; get diagnostics n = row_count;
  out := out || format('%s admin marked %s inquiry as handled (expect 1)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  begin
    insert into storage.objects (bucket_id, name) values ('property-images', 'zz-test/admin.jpg');
    out := out || 'PASS admin can upload a photo'::text;
  exception when others then out := out || ('FAIL admin upload rejected — ' || sqlerrm); end;

  begin
    insert into storage.objects (bucket_id, name) values ('some-other-bucket', 'zz-test/admin.jpg');
    out := out || 'FAIL admin wrote to a different bucket'::text;
  exception when others then out := out || ('PASS admin limited to property-images bucket — ' || sqlerrm); end;

  delete from public.properties where id = hid_id; get diagnostics n = row_count;
  out := out || format('%s admin deleted %s listing (expect 1)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  -- ======================== DATA RULES (as admin) ========================
  -- Every row below is valid except for the ONE thing being tested, and each check
  -- confirms the expected rule did the rejecting (so a pass for the wrong reason shows FAIL).
  begin
    insert into public.properties (title, slug, price, location, property_type) values ('Bad slug', 'Bad Slug!', 100, 'Test Area', 'Plot');
    out := out || 'FAIL bad slug accepted'::text;
  exception when others then
    out := out || (case when sqlerrm like '%properties_slug_check%' then 'PASS' else 'FAIL' end || ' bad slug rejected — ' || sqlerrm);
  end;

  begin
    insert into public.properties (title, slug, price, location, property_type, city) values ('Bad city', 'zz-bad-city', 100, 'Test Area', 'Plot', 'Gurgaon');
    out := out || 'FAIL "Gurgaon" accepted as a city'::text;
  exception when others then
    out := out || (case when sqlerrm like '%enum city%' then 'PASS' else 'FAIL' end || ' "Gurgaon" rejected — ' || sqlerrm);
  end;

  begin
    insert into public.properties (title, slug, price, location, property_type) values ('Zero price', 'zz-zero', 0, 'Test Area', 'Plot');
    out := out || 'FAIL zero price accepted'::text;
  exception when others then
    out := out || (case when sqlerrm like '%properties_price_check%' then 'PASS' else 'FAIL' end || ' zero price rejected — ' || sqlerrm);
  end;

  begin
    insert into public.properties (title, slug, price, location, property_type) values ('Dupe', 'zz-test-published', 100, 'Test Area', 'Plot');
    out := out || 'FAIL duplicate slug accepted'::text;
  exception when others then
    out := out || (case when sqlerrm like '%properties_slug_key%' then 'PASS' else 'FAIL' end || ' duplicate slug rejected — ' || sqlerrm);
  end;

  begin
    insert into public.inquiries (name, phone) values ('Bad Phone', 'call me maybe');
    out := out || 'FAIL bad phone accepted'::text;
  exception when others then
    out := out || (case when sqlerrm like '%inquiries_phone_check%' then 'PASS' else 'FAIL' end || ' bad phone rejected — ' || sqlerrm);
  end;

  begin
    insert into public.inquiries (name, phone, message) values ('Long', '9876543210', repeat('x', 2001));
    out := out || 'FAIL 2001-char message accepted'::text;
  exception when others then
    out := out || (case when sqlerrm like '%inquiries_message_check%' then 'PASS' else 'FAIL' end || ' 2001-char message rejected — ' || sqlerrm);
  end;

  -- ---------- deleting a listing keeps its inquiries ----------
  reset role;
  delete from public.properties where id = pub_id;
  select count(*) into n from public.inquiries where name = 'Test Visitor' and property_id is null;
  out := out || format('%s inquiry kept after its listing was deleted (%s)', case when n = 1 then 'PASS' else 'FAIL' end, n);

  -- Roll back EVERYTHING (test user, listings, inquiries, photos) and print the report
  raise exception E'TEST REPORT (all changes rolled back)\n%', array_to_string(out, E'\n');
end;
$$;
