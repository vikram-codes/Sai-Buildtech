-- =============================================================================
-- Sample listings for Sai Buildtech (dummy data — replace with real listings)
--
-- 15 listings: 8 Delhi · 4 Gurugram · 3 Noida, 3 for rent, 6 featured.
-- Photos: Unsplash (free licence, no attribution required), linked directly.
--
-- SAFE TO RE-RUN: it deletes and re-inserts only the sample listings below
-- (matched by slug). Listings added through the admin panel are never touched.
-- Note: re-running DOES undo any edits made to these sample listings.
--
-- To remove all sample listings once real ones are in, run:
--   delete from public.properties where slug in (<the slugs listed below>);
-- =============================================================================

begin;

delete from public.properties where slug in (
  '4-bhk-builder-floor-vasant-vihar',
  'contemporary-bungalow-golf-links',
  '3-bhk-builder-floor-greater-kailash-2',
  'penthouse-defence-colony',
  '3-bhk-apartment-dwarka-sector-6',
  '3-bhk-builder-floor-krishna-nagar',
  '4-bhk-floor-for-rent-defence-colony',
  'office-space-connaught-place',
  'penthouse-golf-course-road-gurugram',
  'modern-villa-sector-57-gurugram',
  'residential-plot-sector-57-gurugram',
  '4-bhk-apartment-for-rent-dlf-phase-5',
  '3-bhk-apartment-sector-150-noida',
  '5-bhk-villa-sector-44-noida',
  'retail-shop-for-rent-sector-18-noida'
);

insert into public.properties
  (slug, title, description, listing_type, price, location, city, property_type, status,
   bedrooms, bathrooms, area_sqft, featured, amenities, images, created_at)
values
  -- 4 BHK Builder Floor in Vasant Vihar · Delhi · Sale
  ('4-bhk-builder-floor-vasant-vihar', '4 BHK Builder Floor in Vasant Vihar',
   'An entire floor on one of Vasant Vihar''s quietest, tree-lined streets, newly built on a 500 sq. yd plot facing a landscaped park.

The layout is made for entertaining: a double-height living and dining area finished in Italian marble, a modular kitchen with a separate utility, and four en-suite bedrooms with walk-in wardrobes. A private lift opens directly into the foyer.

Includes a servant room with separate entry, two covered parking spaces in the stilt, and full power backup.',
   'Sale', 125000000, 'Vasant Vihar', 'Delhi', 'Builder Floor', 'Available',
   4, 5, 4500, true,
   array['Lift', 'Power backup', 'Italian marble flooring', 'Modular kitchen', 'Servant room', 'Covered parking', 'Park facing', '24×7 security']::text[],
   array[
      'https://images.unsplash.com/photo-1723110994499-df46435aa4b3?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1745301558339-44eb3217d5da?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1750420556288-d0e32a6f517b?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1671197244266-73129c97c096?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1742134131017-44d377a611b1?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '3 days'),

  -- Contemporary Bungalow in Golf Links · Delhi · Sale
  ('contemporary-bungalow-golf-links', 'Contemporary Bungalow in Golf Links',
   'A rare freehold bungalow in Golf Links, rebuilt in a clean contemporary style on a generous plot with a manicured front lawn and a private pool at the rear.

Six bedroom suites are spread across two levels, with formal and family living rooms, a chandelier-lit dining hall that seats twelve, and a study overlooking the garden. Floor-to-ceiling glazing, central air conditioning and home automation run throughout.

Staff quarters, parking for four cars and round-the-clock security complete one of the city''s most coveted addresses.',
   'Sale', 650000000, 'Golf Links', 'Delhi', 'Villa', 'Available',
   6, 7, 9000, true,
   array['Private garden', 'Private pool', 'Servant room', 'Covered parking', 'Home automation', 'Central air conditioning', '24×7 security', 'Freehold']::text[],
   array[
      'https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1635108197695-05184e426907?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1711114435495-76503f9f3181?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '5 days'),

  -- 3 BHK Builder Floor in Greater Kailash II · Delhi · Sale
  ('3-bhk-builder-floor-greater-kailash-2', '3 BHK Builder Floor in Greater Kailash II',
   'A contemporary second-floor residence in a boutique four-storey building, minutes from the M-Block market.

Three well-proportioned bedrooms, each with an attached bath, sit around a bright living and dining space with warm wooden flooring. The modular kitchen comes fully fitted with built-in appliances.

Lift, stilt parking and full power backup. Vastu-compliant layout.',
   'Sale', 65000000, 'Greater Kailash II', 'Delhi', 'Builder Floor', 'Under Offer',
   3, 3, 2100, false,
   array['Lift', 'Power backup', 'Modular kitchen', 'Wooden flooring', 'Covered parking', 'Vastu compliant']::text[],
   array[
      'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1642541070065-3912f347e7c6?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1759147960461-b74a7e9a75d4?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1667550109459-7251955bced4?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '9 days'),

  -- Designer Penthouse in Defence Colony · Delhi · Sale
  ('penthouse-defence-colony', 'Designer Penthouse in Defence Colony',
   'The top two floors of a newly completed building in Defence Colony, crowned by a 1,200 sq. ft. private terrace with an outdoor lounge and open views across South Delhi.

Inside, a light-filled living room with a statement chandelier flows into a formal dining area and a designer kitchen. Four bedrooms include a master suite with its own terrace access, dressing room and spa-style bath.

Private lift lobby, home automation and two reserved parking spaces.',
   'Sale', 140000000, 'Defence Colony', 'Delhi', 'Penthouse', 'Available',
   4, 5, 4200, true,
   array['Private terrace', 'Lift', 'Italian marble flooring', 'Modular kitchen', 'Home automation', 'Power backup', 'Covered parking']::text[],
   array[
      'https://images.unsplash.com/photo-1776363284806-873eeef565a7?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1758448755952-42b404bc6f39?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1776363116182-51694a04a1d5?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1644057501622-dfa7dd26dbfb?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1656402887556-e727ffe1f6d7?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1776525433347-13ffc965601a?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '2 days'),

  -- 3 BHK Apartment in Dwarka Sector 6 · Delhi · Sale
  ('3-bhk-apartment-dwarka-sector-6', '3 BHK Apartment in Dwarka Sector 6',
   'A well-maintained three-bedroom home in an established group housing society, a short walk from the Dwarka Sector 9 metro station.

The apartment offers a spacious living and dining room, three bedrooms with balconies, and a refurbished kitchen. The society has a club house, children''s play area and round-the-clock security.

Ideal for families looking for space, greenery and easy connectivity to the airport and Gurugram.',
   'Sale', 18000000, 'Dwarka Sector 6', 'Delhi', 'Apartment', 'Available',
   3, 3, 1650, false,
   array['Lift', 'Power backup', 'Gated community', 'Club house', 'Kids'' play area', 'Metro nearby', 'Covered parking']::text[],
   array[
      'https://images.unsplash.com/photo-1549499090-c9203d2b20ad?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1720247520881-672bc136da8a?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1654064550858-c62b971a378a?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1722605090433-41d1183a792d?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1667550177726-96da7c257853?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '12 days'),

  -- 3 BHK Builder Floor in Krishna Nagar · Delhi · Sale
  ('3-bhk-builder-floor-krishna-nagar', '3 BHK Builder Floor in Krishna Nagar',
   'A freshly built, park-facing floor in a prime block of Krishna Nagar, close to the market and our own office.

Three bedrooms with attached baths, a bright drawing-dining room, and a fully fitted modular kitchen. Quality fittings throughout, with a lift, stilt parking and power backup.

East Delhi convenience with schools, hospitals and the Pink Line metro all nearby.',
   'Sale', 16000000, 'Krishna Nagar', 'Delhi', 'Builder Floor', 'Available',
   3, 3, 1500, false,
   array['Lift', 'Power backup', 'Modular kitchen', 'Covered parking', 'Park facing', 'Vastu compliant']::text[],
   array[
      'https://images.unsplash.com/photo-1685514823717-7e1ff6ee0563?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1720247520862-7e4b14176fa8?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1559554704-0f74b35a8718?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1639751898256-e80ef909ea8d?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '7 days'),

  -- 4 BHK Floor for Rent in Defence Colony · Delhi · Rent
  ('4-bhk-floor-for-rent-defence-colony', '4 BHK Floor for Rent in Defence Colony',
   'A semi-furnished first floor available for long lease in Defence Colony, ideal for families and senior executives.

Four bedrooms with attached baths, a large living room opening onto a front balcony, and a modern kitchen. Fitted with air conditioning, wardrobes, lights and fans.

Servant room, lift, one covered parking and full power backup. Available for immediate move-in.',
   'Rent', 280000, 'Defence Colony', 'Delhi', 'Builder Floor', 'Available',
   4, 4, 3000, false,
   array['Lift', 'Power backup', 'Modular kitchen', 'Servant room', 'Covered parking', 'Central air conditioning']::text[],
   array[
      'https://images.unsplash.com/photo-1686164748261-33e13eef70b6?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1653204095671-3ed81a4bc561?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1649083048428-3d8ed23a3ce0?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1638799869566-b17fa794c4de?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '4 days'),

  -- Office Space in Connaught Place · Delhi · Sale
  ('office-space-connaught-place', 'Office Space in Connaught Place',
   'A fully fitted office floor in a well-kept building in the Outer Circle of Connaught Place, steps from Rajiv Chowk metro.

The space includes an open workstation area, a glass-walled conference room, two private cabins, a reception, pantry and washrooms. Central air conditioning and full power backup.

A ready-to-move address for a firm that wants to be at the heart of Delhi.',
   'Sale', 90000000, 'Connaught Place', 'Delhi', 'Commercial', 'Under Offer',
   null, null, 2800, false,
   array['Lift', 'Power backup', 'Central air conditioning', 'Fire safety', 'Washrooms', 'Pantry', 'Metro nearby']::text[],
   array[
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1706074740295-d7a79c079562?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1705909770198-7e83c24e1616?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1686100510085-041504fa9528?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '15 days'),

  -- Sky Penthouse on Golf Course Road · Gurugram · Sale
  ('penthouse-golf-course-road-gurugram', 'Sky Penthouse on Golf Course Road',
   'A duplex penthouse at the top of a premium tower on Golf Course Road, with a private infinity-edge pool on its terrace.

Floor-to-ceiling glass frames the city on every side. The home has a formal living room, a dining room with skyline views, a show kitchen, and five bedroom suites including a master wing with a lounge and dressing room.

Residents enjoy a full club house, concierge, gym and pool, with three reserved parking spaces.',
   'Sale', 180000000, 'Golf Course Road', 'Gurugram', 'Penthouse', 'Available',
   5, 6, 6500, true,
   array['Private terrace', 'Private pool', 'Club house', 'Gym', 'Swimming pool', 'Home automation', 'Gated community', 'Covered parking']::text[],
   array[
      'https://images.unsplash.com/photo-1776363497229-616cc7a541fe?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1684928365214-5392bfb8a57e?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1648881806148-e5c51179c826?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1663811397561-32239541a455?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1733426107854-ee00a25d72a7?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '1 days'),

  -- Modern Villa in Sector 57 · Gurugram · Sale
  ('modern-villa-sector-57-gurugram', 'Modern Villa in Sector 57',
   'A newly built, architect-designed villa in a gated pocket of Sector 57, close to Golf Course Extension Road.

Clean lines, a stone-clad facade and generous glazing give way to a double-height living room, a large island kitchen and five bedroom suites. The rear garden has a private pool and deck.

Home automation, staff quarters and parking for three cars.',
   'Sale', 110000000, 'Sector 57', 'Gurugram', 'Villa', 'Available',
   5, 5, 5200, false,
   array['Private garden', 'Private pool', 'Modular kitchen', 'Home automation', 'Servant room', 'Covered parking', 'Gated community']::text[],
   array[
      'https://images.unsplash.com/photo-1782720829237-ec146b0afe0a?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1646987916641-1f3c8992daa2?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1644395175647-7fc09bdae7c1?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1682888818696-906287d759f5?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '10 days'),

  -- 300 Sq. Yd Residential Plot in Sector 57 · Gurugram · Sale
  ('residential-plot-sector-57-gurugram', '300 Sq. Yd Residential Plot in Sector 57',
   'A freehold, corner residential plot of 300 sq. yd in a developed, gated sector of Gurugram.

Park-facing on one side with wide road access, it is ready for registry and immediate construction. Ideal for building a custom family home or a set of independent floors.

Close to schools, hospitals and the Golf Course Extension Road.',
   'Sale', 75000000, 'Sector 57', 'Gurugram', 'Plot', 'Available',
   null, null, 2700, false,
   array['Freehold', 'Corner property', 'Park facing', 'Wide road access', 'Gated community']::text[],
   array[
      'https://images.unsplash.com/photo-1681853108586-f29b4ef5c0fb?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1464295440335-ee082a75ccca?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1591274584606-e1f7fd5b1830?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '20 days'),

  -- 4 BHK Apartment for Rent in DLF Phase 5 · Gurugram · Rent
  ('4-bhk-apartment-for-rent-dlf-phase-5', '4 BHK Apartment for Rent in DLF Phase 5',
   'A spacious, fully furnished four-bedroom apartment for lease in a premium high-rise society in DLF Phase 5.

The home has a large living and dining room opening onto a wraparound balcony, a modern kitchen, four bedrooms with attached baths and a servant room.

The society offers a club house, pool, gym and tight security, with quick access to Golf Course Road and Cyber City.',
   'Rent', 150000, 'DLF Phase 5', 'Gurugram', 'Apartment', 'Available',
   4, 4, 3200, true,
   array['Club house', 'Swimming pool', 'Gym', 'Gated community', 'Power backup', 'Covered parking', 'Servant room']::text[],
   array[
      'https://images.unsplash.com/photo-1764120330256-389dc3da33ad?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1765279333918-949ddcb655ba?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1649155913488-c72449a40625?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '6 days'),

  -- 3 BHK Apartment in Sector 150 · Noida · Sale
  ('3-bhk-apartment-sector-150-noida', '3 BHK Apartment in Sector 150',
   'A bright three-bedroom home in one of Noida''s greenest sectors, in a low-density society surrounded by sports and green areas.

The apartment has a large living and dining room, a modular kitchen, three bedrooms and a balcony overlooking the central greens.

Residents enjoy a club house, pool, gym and jogging tracks, with quick access to the Noida–Greater Noida Expressway.',
   'Sale', 24000000, 'Sector 150', 'Noida', 'Apartment', 'Available',
   3, 3, 1900, false,
   array['Club house', 'Swimming pool', 'Gym', 'Jogging track', 'Kids'' play area', 'Gated community', 'Power backup', 'Covered parking']::text[],
   array[
      'https://images.unsplash.com/photo-1718491551394-ce3e61bf3167?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1653974123568-b5eff6d851e1?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1628745277862-bc0b2d68c50c?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '8 days'),

  -- 5 BHK Villa in Sector 44 · Noida · Sale
  ('5-bhk-villa-sector-44-noida', '5 BHK Villa in Sector 44',
   'A contemporary five-bedroom villa in Sector 44, one of Noida''s most established and leafy residential sectors.

The ground floor holds a formal living room, a family lounge and a dining room under a sculptural chandelier, opening onto a landscaped garden and private pool. Upstairs, five bedroom suites include a master with a terrace.

Italian marble, home automation, staff quarters and parking for four cars.',
   'Sale', 95000000, 'Sector 44', 'Noida', 'Villa', 'Available',
   5, 6, 6000, true,
   array['Private garden', 'Private pool', 'Home automation', 'Servant room', 'Covered parking', 'Italian marble flooring', '24×7 security']::text[],
   array[
      'https://images.unsplash.com/photo-1678575326996-a1bf09b86158?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1758957701419-2c6e266f7988?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1704040686533-694c5b9c52c4?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1598928334118-f86743750cd8?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1711114378532-bab7d55311f3?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '11 days'),

  -- Retail Shop for Rent in Sector 18 · Noida · Rent
  ('retail-shop-for-rent-sector-18-noida', 'Retail Shop for Rent in Sector 18',
   'A ground-floor retail shop with glass frontage in Sector 18, Noida''s busiest shopping district.

The unit is a clean, open space ready for fit-out, with a display window, power backup and shared washrooms.

Strong footfall throughout the week and a short walk from the Sector 18 metro station.',
   'Rent', 45000, 'Sector 18', 'Noida', 'Commercial', 'Available',
   null, null, 450, false,
   array['High footfall', 'Metro nearby', 'Power backup', 'Fire safety', 'Washrooms']::text[],
   array[
      'https://images.unsplash.com/photo-1571974448718-ac26a9af7d8b?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1790049687819-9dd37662276e?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1748731268804-061cffd76797?w=2000&q=80&fm=jpg&fit=crop',
      'https://images.unsplash.com/photo-1695721157873-0c87f59a8ea1?w=2000&q=80&fm=jpg&fit=crop'
   ]::text[],
   now() - interval '14 days');

commit;
