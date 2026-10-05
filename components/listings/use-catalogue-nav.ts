"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { catalogueUrl, type CatalogueState } from "@/lib/listings-url";

/**
 * Navigate the catalogue to new filters. Any filter change goes back to page 1.
 * `pending` is true while the new results load (the old ones stay on screen meanwhile).
 */
export function useCatalogueNav(current: CatalogueState) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const update = (changes: Partial<CatalogueState>) => {
    const url = catalogueUrl({ ...current, ...changes, page: 1 });
    startTransition(() => router.push(url, { scroll: false }));
  };

  return { update, pending };
}
