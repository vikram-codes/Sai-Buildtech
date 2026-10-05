import { SiteShell } from "@/components/layout/site-shell";

/** Every public page (home, listings, contact…) gets the header, footer and WhatsApp button. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
