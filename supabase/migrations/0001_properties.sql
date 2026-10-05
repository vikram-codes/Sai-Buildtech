-- =============================================================================
-- 0001 · Properties table
-- Fixed choice lists, the properties table, automatic price label + timestamps.
-- Security rules for this table are in 0003_properties_security.sql.
-- =============================================================================

-- Internal helpers live in a schema the website API cannot reach.
create schema if not exists private;

-- -----------------------------------------------------------------------------
-- Fixed choice lists (the database rejects anything else)
-- -----------------------------------------------------------------------------
create type public.property_type as enum (
  'Apartment', 'Villa', 'Penthouse', 'Builder Floor', 'Plot', 'Commercial'
);
create type public.property_status as enum ('Available', 'Under Offer', 'Sold');
create type public.listing_type as enum ('Sale', 'Rent');
create type public.city as enum ('Delhi', 'Noida', 'Gurugram');

-- -----------------------------------------------------------------------------
-- Price formatting — mirrors lib/format.ts → formatPrice(). Keep the two in sync.
--   32000000 Sale → ₹3.2 Cr      8500000 Sale → ₹85 L      45000 Rent → ₹45,000/month
-- -----------------------------------------------------------------------------

-- 3200000 → '32,00,000' (Indian digit grouping)
create function private.format_inr_digits(n bigint)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  s    text := n::text;
  head text;
  body text := '';
begin
  if length(s) <= 3 then
    return s;
  end if;
  head := left(s, length(s) - 3);
  while length(head) > 2 loop
    body := ',' || right(head, 2) || body;
    head := left(head, length(head) - 2);
  end loop;
  return head || body || ',' || right(s, 3);
end;
$$;

-- 3.20 → '3.2',  85.00 → '85',  1234.5 → '1,234.5'
create function private.format_short_number(v numeric)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  whole    bigint := trunc(v)::bigint;
  fraction text   := trim(trailing '0' from to_char(v - trunc(v), 'FM0.00'));  -- '0.5' or '0.'
begin
  if fraction = '0.' then
    return private.format_inr_digits(whole);
  end if;
  return private.format_inr_digits(whole) || substr(fraction, 2);  -- drop the leading '0'
end;
$$;

create function private.format_price(price bigint, listing public.listing_type)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  suffix text := case when listing = 'Rent' then '/month' else '' end;
  amount numeric;
begin
  -- Round first, so 99.999 L becomes 1 Cr rather than "100 L"
  amount := round(price::numeric / 10000000, 2);
  if amount >= 1 then
    return '₹' || private.format_short_number(amount) || ' Cr' || suffix;
  end if;

  amount := round(price::numeric / 100000, 2);
  if amount >= 1 then
    return '₹' || private.format_short_number(amount) || ' L' || suffix;
  end if;

  return '₹' || private.format_inr_digits(price) || suffix;
end;
$$;

-- -----------------------------------------------------------------------------
-- properties
-- -----------------------------------------------------------------------------
create table public.properties (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(btrim(title)) between 3 and 200),
  -- URL part, e.g. "4-bhk-builder-floor-vasant-vihar"
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description   text,
  listing_type  public.listing_type not null default 'Sale',
  -- Whole rupees. For Rent this is the monthly rent.
  price         bigint not null check (price > 0),
  -- Filled automatically by the trigger below — never set it by hand.
  price_display text not null default '',
  location      text not null check (char_length(btrim(location)) between 2 and 200),
  city          public.city not null default 'Delhi',
  -- Optional: plots and commercial spaces have no bedrooms
  bedrooms      int check (bedrooms >= 0),
  bathrooms     int check (bathrooms >= 0),
  area_sqft     int check (area_sqft > 0),
  property_type public.property_type not null,
  status        public.property_status not null default 'Available',
  -- Public URLs from the property-images bucket. The first one is the cover photo.
  images        text[] not null default '{}',
  amenities     text[] not null default '{}',
  featured      boolean not null default false,
  -- false = hidden from the public site (admins still see it)
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.properties is 'Property listings shown on the website.';
comment on column public.properties.price_display is 'Auto-filled from price + listing_type, e.g. ₹3.2 Cr or ₹45,000/month.';
comment on column public.properties.is_published is 'false hides the listing from the public site; admins still see it.';

-- Lock the table down immediately. Rules that open it up are in 0003.
alter table public.properties enable row level security;

-- Lookup aids for the filters and the homepage
create index properties_city_idx          on public.properties (city);
create index properties_property_type_idx on public.properties (property_type);
create index properties_price_idx         on public.properties (price);
create index properties_created_at_idx    on public.properties (created_at desc);
create index properties_featured_idx      on public.properties (featured) where featured;

-- -----------------------------------------------------------------------------
-- Trigger: keep price_display and updated_at correct on every insert/update
-- -----------------------------------------------------------------------------
create function private.properties_before_write()
returns trigger
language plpgsql
security definer  -- runs as owner so callers don't need access to the private schema
set search_path = ''
as $$
begin
  new.price_display := private.format_price(new.price, new.listing_type);
  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

create trigger properties_before_write
before insert or update on public.properties
for each row execute function private.properties_before_write();

-- Nobody calls these helpers directly
revoke all on all functions in schema private from public;
