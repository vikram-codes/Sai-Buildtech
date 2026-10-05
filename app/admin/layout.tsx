import type { Metadata } from "next";

// Every /admin page: own title format, and kept out of search engines.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Sai Buildtech" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-full flex-1 flex-col bg-muted/30">{children}</div>;
}
