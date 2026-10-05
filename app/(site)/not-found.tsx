import { NotFoundContent } from "@/components/shared/not-found-content";

/*
 * 404 for pages inside the public site that call notFound() — e.g. a listing that was
 * deleted or hidden. The (site) layout already provides the header/footer, so this
 * only renders the message (adding SiteShell here caused a double header).
 */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
