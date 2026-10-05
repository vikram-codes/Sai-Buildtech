import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co").hostname;

const nextConfig: NextConfig = {
  // Opt-in caching model: data is cached only where we say "use cache" (see lib/data/properties.ts),
  // and admin edits expire it with updateTag("properties").
  cacheComponents: true,
  images: {
    // Only these image sources can go through next/image; anything else gets a 400.
    remotePatterns: [
      // Photos uploaded through the admin panel
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/property-images/**",
        search: "",
      },
      // Sample-listing photos (supabase/seed.sql). They carry size params like ?w=2000,
      // so `search` is left out to allow query strings.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
